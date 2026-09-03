import {useEffect} from 'react';
import Seo from '../components/Seo';
import SiteLink from '../components/SiteLink';
import StoreLayout from '../components/store/StoreLayout';
import CartItems from '../components/CartItems';
import {useCart} from '../context/CartContext';
import {useStore} from '../context/StoreContext';
import {useLanguage} from '../context/LanguageContext';
import {money} from '../lib/catalogue';
import {track,analyticsItems} from '../lib/analytics';
export default function Cart(){
 const {cart,cartTotal,hasIssues,hydrated}=useCart(),{content}=useStore(),{tr}=useLanguage();
 const delivery=cartTotal>=content.settings.freeDeliveryOver?0:content.settings.deliveryFee;
 useEffect(()=>{if(hydrated&&cart.length)track('view_cart',{currency:'MKD',value:cartTotal,items:analyticsItems(cart)});},[hydrated]);
 return <StoreLayout><Seo title={tr('Shopping bag')+' | OutletX'} path="/cart" noindex/><section className="checkout-page"><div className="checkout-heading"><p className="store-eyebrow">{tr('Your selection')}</p><h1 className="store-title">{tr('Shopping bag')}</h1></div>
 {!hydrated?<p role="status">{tr('Loading your bag…')}</p>:cart.length?<div className="checkout-grid"><div className="bag-page-items"><CartItems/></div><aside className="checkout-summary"><h2>{tr('Order summary')}</h2><dl><div><dt>{tr('Subtotal')}</dt><dd>{money(cartTotal)}</dd></div><div><dt>{tr('Delivery')}</dt><dd>{delivery?money(delivery):tr('Free')}</dd></div><div><dt>{tr('Total')}</dt><dd>{money(cartTotal+delivery)}</dd></div></dl><p className="summary-note">{tr('Cash on delivery. No card details required.')}</p>{hasIssues?<p className="cart-warning" role="alert">{tr('Update unavailable items before checkout.')}</p>:<SiteLink className="store-button red" href="/checkout">{tr('Go to checkout')} →</SiteLink>}<SiteLink className="text-link" href="/products">{tr('Continue shopping')}</SiteLink></aside></div>:<div className="catalogue-empty"><h2>{tr('Your bag is empty')}</h2><p>{tr('Find your next pair and choose a size to get started.')}</p><SiteLink className="store-button red" href="/products">{tr('Browse products')}</SiteLink></div>}</section></StoreLayout>;
}
