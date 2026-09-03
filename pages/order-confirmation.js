import {useEffect,useState} from 'react';
import Seo from '../components/Seo';
import SiteLink from '../components/SiteLink';
import StoreLayout from '../components/store/StoreLayout';
import {useLanguage} from '../context/LanguageContext';
import {money} from '../lib/catalogue';
export default function Confirmation(){
 const [receipt,setReceipt]=useState(null),[ready,setReady]=useState(false),{tr}=useLanguage();
 useEffect(()=>{try{const saved=JSON.parse(sessionStorage.getItem('outletx_receipt')||'null');if(saved?.reference)setReceipt(saved);}catch{}setReady(true);},[]);
 return <StoreLayout><Seo title={tr('Order received')+' | OutletX'} path="/order-confirmation" noindex/><section className="receipt-page">
 {!ready?<p>{tr('Loading…')}</p>:receipt?<><div className="receipt-check">✓</div><p className="store-eyebrow">{tr('Order received')}</p><h1 className="store-title">{tr('Thank you for your order.')}</h1><p>{tr('Your cash-on-delivery order has been saved. Keep this reference for any questions.')}</p><p className="receipt-reference">{tr('Reference')}: <strong>{receipt.reference}</strong></p>
 <div className="receipt-items">{receipt.items.map((i,index)=><article key={index}><b>{i.name}</b><span>{tr('Size')} {i.size} · {tr('Qty')} {i.quantity}</span><strong>{money(i.price*i.quantity)}</strong></article>)}</div>
 <p className="receipt-total">{tr('Total including delivery')}: <b>{money(receipt.total)}</b></p>
 <p>{receipt.emailNotification==='sent'?tr('An order email has been sent. Please check your spam folder too.'):tr('Keep this confirmation or save a copy. If an email does not arrive, contact the store with your reference.')}</p>
 <div className="receipt-actions"><button className="store-button" onClick={()=>window.print()}>{tr('Print / save confirmation')}</button><SiteLink className="store-button light" href="/products">{tr('Continue shopping')}</SiteLink></div></>:<><h1>{tr('Your order confirmation')}</h1><p>{tr('This browser has no saved confirmation. Contact us if you need help checking an order; do not place it again just because this page is empty.')}</p><SiteLink className="store-button" href="/contact">{tr('Contact OutletX')}</SiteLink></>}
 </section></StoreLayout>;
}
