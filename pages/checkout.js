import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/router';
import Seo from '../components/Seo';
import SiteLink from '../components/SiteLink';
import StoreImage from '../components/StoreImage';
import StoreLayout from '../components/store/StoreLayout';
import {useCart} from '../context/CartContext';
import {useStore} from '../context/StoreContext';
import {useLanguage} from '../context/LanguageContext';
import {money,stockOf} from '../lib/catalogue';
import {track,analyticsItems} from '../lib/analytics';
const emptyCustomer={fullName:'',email:'',phone:'',city:'',address:'',notes:''};
export default function Checkout(){
 const {products,content,checkoutReady,loading}=useStore(),{cart,clearCart,hydrated}=useCart(),{tr,lang}=useLanguage(),router=useRouter();
 const [customer,setCustomer]=useState(emptyCustomer),[placing,setPlacing]=useState(false),[error,setError]=useState(''),[pending,setPending]=useState(null);
 const lock=useRef(false),tracked=useRef(false),errorRef=useRef(null);
 const direct=products.find(p=>p.id===Number(router.query.id));
 const items=direct?[{...direct,size:String(router.query.size||''),quantity:1}]:cart;
 const subtotal=items.reduce((sum,i)=>sum+i.newPrice*i.quantity,0),delivery=subtotal>=content.settings.freeDeliveryOver?0:content.settings.deliveryFee,total=subtotal+delivery;
 const invalidItems=items.some(i=>!i.size||i.unavailable||i.overStock||i.quantity>stockOf(i,i.size));
 useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem('outletx_checkout_attempt')||'null');if(saved?.id&&saved.signature){const body=JSON.parse(saved.signature);if(body.customerInfo&&body.items){setPending(saved);setCustomer({...emptyCustomer,...body.customerInfo});}}}catch{}},[]);
 useEffect(()=>{if(error)errorRef.current?.focus();},[error]);
 useEffect(()=>{if(hydrated&&items.length&&!tracked.current){tracked.current=true;track('begin_checkout',{currency:'MKD',value:subtotal,items:analyticsItems(items)});}},[hydrated,items.length]);
 async function place(e){
  e.preventDefault();if(lock.current)return;
  if(!pending&&(!checkoutReady||invalidItems||!items.length)){setError(tr('Review your bag and availability before ordering.'));return;}
  lock.current=true;setPlacing(true);setError('');
  try{
   const payload=pending?JSON.parse(pending.signature):{items:items.map(i=>({id:i.id,size:i.size,quantity:i.quantity,price:i.newPrice})),total,customerInfo:{...customer,language:lang}};
   const attempt=pending||{id:crypto.randomUUID(),signature:JSON.stringify(payload)};
   // Keep the exact payload for retries. A lost response must not create another order.
   setPending(attempt);try{sessionStorage.setItem('outletx_checkout_attempt',JSON.stringify(attempt));}catch{}
   const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,checkoutId:attempt.id})});
   const data=await response.json();
   if(!response.ok||!data.success){
    if(response.status===400){setPending(null);try{sessionStorage.removeItem('outletx_checkout_attempt');}catch{}window.dispatchEvent(new Event('outletx:store-updated'));}
    throw new Error(data.error||tr('We couldn’t confirm your order. Please retry with the same details.'));
   }
   const receipt={reference:attempt.id,orderIds:data.orderIds,total:payload.total,createdAt:new Date().toISOString(),emailNotification:data.emailNotification||'unknown',items:payload.items.map(i=>({name:products.find(p=>p.id===i.id)?.name||tr('Product'),size:i.size,quantity:i.quantity,price:i.price}))};
   try{sessionStorage.setItem('outletx_receipt',JSON.stringify(receipt));sessionStorage.removeItem('outletx_checkout_attempt');}catch{}
   track('purchase',{transaction_id:attempt.id,currency:'MKD',value:payload.items.reduce((s,i)=>s+i.price*i.quantity,0),shipping:payload.total-payload.items.reduce((s,i)=>s+i.price*i.quantity,0),items:payload.items.map(i=>({item_id:String(i.id),item_variant:i.size,price:i.price,quantity:i.quantity}))});
   if(!direct)clearCart();setPending(null);router.push('/order-confirmation');
  }catch(err){setError(err.message||tr('We couldn’t confirm your order. Please retry with the same details.'));}
  finally{lock.current=false;setPlacing(false);}
 }
 return <StoreLayout><Seo title={tr('Checkout')+' | OutletX'} path="/checkout" noindex/><section className="checkout-page"><div className="checkout-heading"><SiteLink className="text-link" href="/cart">← {tr('Back to bag')}</SiteLink><p className="store-eyebrow">{tr('One last step')}</p><h1 className="store-title">{tr('Checkout')}</h1><p>{tr('Cash on delivery. No card details required.')}</p></div>
 {pending&&<div className="notice-box" role="status"><b>{tr('An order attempt is awaiting confirmation.')}</b><p>{tr('Retry below with the same saved details. This checks the existing attempt without creating a duplicate. Contact the store if you need to change it.')}</p><p>{tr('Reference')}: {pending.id}</p></div>}
 {!hydrated&&!direct?<p role="status">{tr('Loading your bag…')}</p>:(items.length||pending)?<form onSubmit={place} className="checkout-grid">
 <div className="checkout-form"><section><h2>{tr('Delivery details')}</h2><p className="form-intro">{tr('All fields marked * are required. We use these details to arrange your delivery.')}</p><fieldset disabled={placing||!!pending} className="checkout-form-grid">
 {[['Full name','fullName','text','name',150],['Email','email','email','email',254],['Delivery phone','phone','tel','tel',50],['City','city','text','address-level2',150],['Street and number','address','text','street-address',400]].map(([label,key,type,auto,max])=><label key={key} className={key==='address'?'wide':''}><span>{tr(label)} *</span><input name={key} type={type} autoComplete={auto} maxLength={max} required value={customer[key]} onChange={e=>setCustomer({...customer,[key]:e.target.value})}/></label>)}
 <label className="wide"><span>{tr('Order notes')} ({tr('optional')})</span><textarea name="notes" maxLength={2000} rows="3" value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})} placeholder={tr('Delivery instructions, if needed')}/></label></fieldset></section>
 <section className="checkout-payment"><h2>{tr('Payment')}</h2><b>{tr('Cash on delivery')}</b><p>{tr('Pay the courier when your order arrives. We never ask for card details.')}</p></section>
 {!checkoutReady&&!pending&&<p className="checkout-error" role="status">{loading?tr('Checking availability…'):tr('Online ordering is temporarily unavailable. Contact us for help.')}</p>}
 {invalidItems&&!pending&&<p className="checkout-error"><SiteLink href="/cart">{tr('Update unavailable items before checkout.')} →</SiteLink></p>}
 {error&&<div ref={errorRef} tabIndex="-1" className="checkout-error" role="alert">{error}<p><SiteLink href="/contact">{tr('Contact OutletX')} →</SiteLink></p></div>}
 <p className="checkout-terms">{tr('Please review the total and your delivery details before submitting. Read our')} <SiteLink href="/shipping">{tr('delivery information')}</SiteLink>, <SiteLink href="/returns">{tr('returns information')}</SiteLink> {tr('and')} <SiteLink href="/privacy">{tr('privacy notice')}</SiteLink>.</p>
 <button className="store-button red checkout-submit" disabled={placing||(!pending&&(!checkoutReady||invalidItems))}>{placing?tr('Confirming your order…'):pending?tr('Retry and confirm saved order'):tr('Place order')+' · '+money(total)}</button>
 </div><aside className="checkout-summary"><h2>{tr('Your order')}</h2>{(pending?JSON.parse(pending.signature).items.map(i=>({...i,...products.find(p=>p.id===i.id),size:i.size,quantity:i.quantity,newPrice:i.price})):items).map(i=><article key={i.id+'-'+i.size}><div className="summary-image"><StoreImage src={i.images?.[0]} sizes="72px"/></div><div><small>{i.brand}</small><b>{i.name}</b><span>{tr('Size')} {i.size} · {tr('Qty')} {i.quantity}</span></div><strong>{money(i.newPrice*i.quantity)}</strong></article>)}
 {pending?<dl><div><dt>{tr('Saved order total')}</dt><dd>{money(JSON.parse(pending.signature).total)}</dd></div></dl>:<dl><div><dt>{tr('Subtotal')}</dt><dd>{money(subtotal)}</dd></div><div><dt>{tr('Delivery')}</dt><dd>{delivery?money(delivery):tr('Free')}</dd></div><div><dt>{tr('Total')}</dt><dd>{money(total)}</dd></div></dl>}
 {!pending&&<SiteLink className="text-link" href="/cart">{tr('Edit bag')}</SiteLink>}<p className="summary-note">{tr('Have a question about delivery or fit? Ask us before ordering.')} <SiteLink href="/contact">{tr('Contact us')}</SiteLink></p>
 </aside></form>:<div className="catalogue-empty"><h2>{tr('Your bag is empty')}</h2><SiteLink className="store-button" href="/products">{tr('Browse products')}</SiteLink></div>}</section></StoreLayout>;
}
