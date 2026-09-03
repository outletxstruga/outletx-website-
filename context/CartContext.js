import {createContext,useContext,useState,useEffect} from 'react';
import {useStore} from './StoreContext';
import {stockOf} from '../lib/catalogue';
const CartContext=createContext();
export function CartProvider({children}){
 const [savedCart,setCart]=useState([]),[hydrated,setHydrated]=useState(false),[cartOpen,setCartOpen]=useState(false);
 const {products,loading=true}=useStore();
 const cart=savedCart.map(item=>{
  const current=products.find(p=>p.id===item.id);
  const maximum=loading?null:Math.min(50,stockOf(current,item.size));
  return {...item,...(current||{}),size:item.size,quantity:item.quantity,maxQuantity:maximum,unavailable:maximum===0,overStock:maximum!==null&&item.quantity>maximum};
 });
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('outletx_cart')||'[]');if(Array.isArray(saved))setCart(saved.filter(i=>i&&Number.isSafeInteger(i.id)&&typeof i.size==='string'&&Number.isInteger(i.quantity)&&i.quantity>0&&Number.isFinite(i.newPrice)).slice(0,30));}catch{}finally{setHydrated(true);}},[]);
 useEffect(()=>{if(hydrated)try{localStorage.setItem('outletx_cart',JSON.stringify(savedCart));}catch{}},[savedCart,hydrated]);
 const addToCart=(product,size,quantity=1)=>{
  const max=Math.min(50,stockOf(product,size));if(!max)return;
  setCart(prev=>{const existing=prev.find(i=>i.id===product.id&&i.size===size);
   if(existing)return prev.map(i=>i===existing?{...i,quantity:Math.min(max,i.quantity+quantity)}:i);
   if(prev.length>=30)return prev;return [...prev,{...product,size,quantity:Math.min(max,Math.max(1,quantity))}];});
 };
 const removeFromCart=(id,size)=>setCart(prev=>prev.filter(i=>!(i.id===id&&i.size===size)));
 const updateQuantity=(id,size,quantity)=>{
  if(quantity<1){removeFromCart(id,size);return;}
  const product=products.find(p=>p.id===id),max=loading?50:Math.min(50,stockOf(product,size));
  if(!max)return;
  setCart(prev=>prev.map(i=>i.id===id&&i.size===size?{...i,quantity:Math.min(max,Math.floor(quantity))}:i));
 };
 const clearCart=()=>setCart([]);
 const cartCount=cart.reduce((sum,i)=>sum+i.quantity,0),cartTotal=cart.reduce((sum,i)=>sum+(Number(i.newPrice)||0)*i.quantity,0);
 return <CartContext.Provider value={{cart,hydrated,addToCart,removeFromCart,updateQuantity,clearCart,cartCount,cartTotal,cartOpen,setCartOpen,hasIssues:cart.some(i=>i.unavailable||i.overStock)}}>{children}</CartContext.Provider>;
}
export function useCart(){return useContext(CartContext);}
