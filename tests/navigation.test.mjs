import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { transform, loadBindings } = require('next/dist/build/swc');
await loadBindings();
const navigationSource = await readFile(new URL('../lib/navigation.js', import.meta.url), 'utf8');
const { isLocalPageLink } = await import('data:text/javascript;base64,' + Buffer.from(navigationSource).toString('base64'));

test('internal page links use client navigation; external and new-tab links do not', () => {
  for (const href of ['/', '/products?gender=men', '/product/1', '/admin/orders', '/contact#hours']) assert.equal(isLocalPageLink(href), true);
  for (const href of ['https://instagram.com/outletxstruga', '//example.com', 'mailto:test@example.com', '#hours']) assert.equal(isLocalPageLink(href), false);
  assert.equal(isLocalPageLink('/products', '_blank'), false);
  assert.equal(isLocalPageLink('/download', undefined, true), false);
});

// Small deterministic hook harness: runs the actual provider source without a browser
// or network. The deployment still needs user verification in its protected preview.
async function harness(path, exportName, modules = {}, globals = {}) {
  let cursor = 0, dirty = false, output;
  const slots = [], effects = [];
  const same = (a,b) => a && b && a.length === b.length && a.every((v,i)=>Object.is(v,b[i]));
  const react = {
    createContext: () => ({ Provider: 'provider' }),
    useState(initial) {
      const index = cursor++;
      if (!slots[index]) slots[index] = { value: typeof initial === 'function' ? initial() : initial };
      return [slots[index].value, value => {
        const next = typeof value === 'function' ? value(slots[index].value) : value;
        if (!Object.is(next, slots[index].value)) { slots[index].value = next; dirty = true; }
      }];
    },
    useRef(initial) {
      const index=cursor++;
      if (!slots[index]) slots[index]={current:initial};
      return slots[index];
    },
    useCallback(fn,deps) {
      const index=cursor++;
      if (!slots[index] || !same(slots[index].deps,deps)) slots[index]={fn,deps};
      return slots[index].fn;
    },
    useEffect(fn,deps) {
      const index=cursor++;
      if (!slots[index] || !same(slots[index].deps,deps)) {
        const previous=slots[index];
        slots[index]={deps};
        effects.push(()=>{previous?.cleanup?.();slots[index].cleanup=fn();});
      }
    }
  };
  const listeners=new Map();
  const fakeWindow={
    addEventListener(name,fn){listeners.set(name,fn);},
    removeEventListener(name,fn){if(listeners.get(name)===fn)listeners.delete(name);},
    dispatchEvent(event){listeners.get(event.type)?.();}
  };
  const jsx=(type,props)=>({type,props});
  const dependencies={'react':react,'react/jsx-runtime':{jsx,jsxs:jsx},'../lib/catalogue':{stockOf:()=>0},...modules};
  const source=await readFile(new URL('../'+path,import.meta.url),'utf8');
  const {code}=await transform(source,{filename:path,jsc:{parser:{syntax:'ecmascript',jsx:true},transform:{react:{runtime:'automatic'}},target:'es2022'},module:{type:'commonjs'}});
  const mod={exports:{}};
  vm.runInNewContext(code,{module:mod,exports:mod.exports,require:(name)=>{
    if(!(name in dependencies))throw Error('Unmocked dependency '+name);
    return dependencies[name];
  },window:fakeWindow,AbortController,console,...globals},{filename:path});
  function render() {
    let loops=0;
    do {
      if(++loops>20)throw Error('Render loop');
      dirty=false;cursor=0;
      output=mod.exports[exportName]({children:null});
      while(effects.length)effects.shift()();
    } while(dirty);
    return output.props.value;
  }
  return {render,async settle(){await new Promise(setImmediate);return render();},event(name){listeners.get(name)?.();}};
}

test('store data survives page navigation without another blocking fetch',async()=>{
  let calls=0;
  const router={pathname:'/products'};
  const data={products:[{id:1}],content:{settings:{}},checkoutReady:true};
  const app=await harness('context/StoreContext.js','StoreProvider',{
    'next/router':{useRouter:()=>router},'../data/content.json':{settings:{}}
  },{fetch:async()=>{calls++;return {ok:true,json:async()=>data};}});
  assert.equal(app.render().loading,true);
  assert.equal((await app.settle()).loading,false);
  router.pathname='/about';
  assert.equal(app.render().products.length,1);
  assert.equal((await app.settle()).loading,false);
  assert.equal(calls,1);
  app.event('focus');await app.settle();
  assert.equal(calls,1);
  app.event('outletx:store-updated');await app.settle();
  assert.equal(calls,2);
});

test('admin pages do not fetch the public catalogue',async()=>{
  let calls=0;
  const router={pathname:'/admin/products'};
  const app=await harness('context/StoreContext.js','StoreProvider',{
    'next/router':{useRouter:()=>router},'../data/content.json':{settings:{}}
  },{fetch:async()=>{calls++;return {ok:true,json:async()=>({products:[],content:{settings:{}},checkoutReady:true})};}});
  app.render();await app.settle();assert.equal(calls,0);
  router.pathname='/products';app.render();await app.settle();assert.equal(calls,1);
});

test('admin navigation retains confirmed UI while rechecking; expired session redirects',async()=>{
  let finish, calls=0;
  const redirects=[];
  const router={pathname:'/admin/products',replace:path=>redirects.push(path)};
  const app=await harness('context/AdminSessionContext.js','AdminSessionProvider',{
    'next/router':{useRouter:()=>router}
  },{fetch:()=>{calls++;return calls===1?Promise.resolve({ok:true}):new Promise(resolve=>{finish=resolve;});}});
  assert.equal(app.render().ready,false);
  assert.equal((await app.settle()).ready,true);
  router.pathname='/admin/orders';
  assert.equal(app.render().ready,true);
  assert.equal(calls,2);
  finish({ok:false});assert.equal((await app.settle()).ready,false);
  assert.deepEqual(redirects,['/admin/login']);
});

test('cart restores stored items then persists further changes',async()=>{
  const saved=[{id:1,size:'42',quantity:2,newPrice:100}];
  let stored=JSON.stringify(saved);
  const app=await harness('context/CartContext.js','CartProvider',{
    './StoreContext':{useStore:()=>({products:[]})}
  },{localStorage:{getItem:()=>stored,setItem:(_key,value)=>{stored=value;}}});
  let cart=app.render();
  assert.equal(cart.cartCount,2);
  cart.updateQuantity(1,'42',3);cart=app.render();
  assert.equal(JSON.parse(stored)[0].quantity,3);
  cart.clearCart();app.render();assert.equal(stored,'[]');
});

test('invalid saved bag cannot crash the app',async()=>{
  let stored='{invalid';
  const app=await harness('context/CartContext.js','CartProvider',{
    './StoreContext':{useStore:()=>({products:[]})}
  },{localStorage:{getItem:()=>stored,setItem:(_key,value)=>{stored=value;}}});
  assert.equal(app.render().cartCount,0);
  assert.equal(stored,'[]');
});
