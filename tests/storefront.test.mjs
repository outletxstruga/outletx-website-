import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

async function source(path){return readFile(new URL('../'+path,import.meta.url),'utf8');}
async function moduleFrom(path){
 const text=await source(path);return import('data:text/javascript;base64,'+Buffer.from(text).toString('base64'));
}
test('catalogue filters by brand, size, price and stock without mutating source',async()=>{
 const {filterProducts}=await moduleFrom('lib/catalogue.js');
 const products=[
  {id:1,brand:'Adidas',name:'Runner',sku:'A',gender:'Men',category:'Shoes',newPrice:2500,oldPrice:5000,inStock:true,sizes:[{size:'42',stock:1}]},
  {id:2,brand:'Puma',name:'Street',sku:'P',gender:'Women',category:'Shoes',newPrice:3500,oldPrice:4000,inStock:true,sizes:[{size:'38',stock:2}]},
  {id:3,brand:'Adidas',name:'Old',sku:'O',gender:'Men',category:'Shoes',newPrice:1500,oldPrice:2000,inStock:false,sizes:[{size:'42',stock:3}]}
 ];
 const result=filterProducts(products,{brand:'adidas',size:'42',max:'3000',stock:'available',sort:'discount'});
 assert.deepEqual(result.map(p=>p.id),[1]);assert.equal(products[0].id,1);
});
test('cart and checkout enforce current size stock',async()=>{
 const cart=await source('context/CartContext.js'),validation=await source('lib/orderValidation.js');
 assert.match(cart,/Math\.min\(50,stockOf\(product,size\)\)/);
 assert.match(validation,/item\.quantity > size\.stock/);
 assert.match(validation,/item\.price !== product\.newPrice/);
});
test('customer email lifecycle includes received, shipped and delivered',async()=>{
 const email=await source('lib/orderEmailTemplate.js'),orders=await source('pages/api/orders.js');
 for(const word of ['pending','shipped','delivered'])assert.match(email,new RegExp(word));
 assert.match(orders,/status === 'shipped' \|\| status === 'delivered'/);
 assert.match(orders,/emailNotification/);
});
test('analytics is consent controlled and advertising pixel is absent',async()=>{
 const document=await source('pages/_document.js'),consent=await source('components/ConsentBanner.js');
 assert.doesNotMatch(document,/googletagmanager|gtag\(/);
 assert.match(consent,/choice==='accepted'/);assert.doesNotMatch(consent,/fbq\(|facebook\.net/);
});
test('search essentials exist',async()=>{
 const robots=await source('public/robots.txt'),seo=await source('components/Seo.js');
 assert.match(robots,/Sitemap:/);assert.match(robots,/Disallow: \/admin/);
 for(const token of ['canonical','og:title','twitter:card','application/ld\\+json'])assert.match(seo,new RegExp(token));
});

test('order emails include the complete bag, one delivery fee, and escaped customer text',async()=>{
 const {buildOrderEmail}=await moduleFrom('lib/orderEmailTemplate.js');
 const rows=[
  {id:'line-1',checkout_id:'test-checkout',status:'pending',product_brand:'Brand',product_name:'First pair',product_price:1000,size:'42',quantity:1,total:1150,customer_name:'<script>unsafe</script>'},
  {id:'line-2',checkout_id:'test-checkout',status:'pending',product_brand:'Brand',product_name:'Second pair',product_price:500,size:'40',quantity:2,total:1000,customer_name:'Customer'}
 ];
 const email=buildOrderEmail(rows);
 assert.match(email.subject,/received/);assert.match(email.text,/First pair/);assert.match(email.text,/Second pair/);
 assert.match(email.text,/Subtotal: 2,000 MKD/);assert.match(email.text,/Delivery: 150 MKD/);assert.match(email.text,/Total: 2,150 MKD/);
 assert.doesNotMatch(email.html,/<script>/);assert.match(email.html,/&lt;script&gt;/);
 assert.match(buildOrderEmail(rows.map(row=>({...row,status:'shipped'}))).subject,/shipped/);
 assert.match(buildOrderEmail(rows.map(row=>({...row,status:'delivered'}))).subject,/delivered/);
});

test('withdrawing analytics consent disables measurement immediately',async()=>{
 const {applyAnalyticsChoice,track,ANALYTICS_ID}=await moduleFrom('lib/analytics.js');
 const events=[];global.window={location:{hostname:'outletx.example'},gtag:(...args)=>events.push(args)};
 try{
  applyAnalyticsChoice('accepted');track('add_to_cart');assert.equal(events.length,1);assert.equal(window['ga-disable-'+ANALYTICS_ID],false);
  applyAnalyticsChoice('declined');track('purchase');assert.equal(events.length,1);assert.equal(window['ga-disable-'+ANALYTICS_ID],true);
  applyAnalyticsChoice('accepted',true);track('page_view');assert.equal(events.length,1);
 }finally{delete global.window;}
});

test('multi-line database rows are presented as one order in admin totals',async()=>{
 const {groupOrderRows,shortOrderReference}=await moduleFrom('lib/orderGroups.js');
 const rows=[
  {id:'a',checkout_id:'12345678-1234-4123-8123-123456789abc',created_at:'2026-01-01',total:1150,status:'pending'},
  {id:'b',checkout_id:'12345678-1234-4123-8123-123456789abc',created_at:'2026-01-01',total:1000,status:'pending'},
  {id:7,created_at:'2025-01-01',total:500,status:'delivered'}
 ];
 const groups=groupOrderRows(rows);
 assert.equal(groups.length,2);assert.equal(groups[0].items.length,2);assert.equal(groups[0].total,2150);
 assert.equal(shortOrderReference(groups[0]),'56789ABC');
});
