import SiteLink from './SiteLink';
import Dialog from './Dialog';
import CartItems from './CartItems';
import {useCart} from '../context/CartContext';
import {useStore} from '../context/StoreContext';
import {useLanguage} from '../context/LanguageContext';
import {money} from '../lib/catalogue';
export default function CartDrawer(){
 const {cart,cartOpen,setCartOpen,cartTotal,hasIssues}=useCart(),{content}=useStore(),{tr}=useLanguage();
 const remaining=Math.max(0,content.settings.freeDeliveryOver-cartTotal),close=()=>setCartOpen(false);
 return <Dialog open={cartOpen} onClose={close} title={tr('Shopping bag')} className="cart-drawer">
 {cart.length?<><p className="delivery-progress">{remaining?tr('Add {amount} for free delivery.',{amount:money(remaining)}):tr('Your bag qualifies for free delivery.')}</p><CartItems onNavigate={close}/><footer><div><span>{tr('Subtotal')}</span><strong>{money(cartTotal)}</strong></div><p>{tr('Delivery is shown before you place your order.')}</p>
 {hasIssues?<p className="cart-warning">{tr('Update unavailable items before checkout.')}</p>:<SiteLink className="store-button red" href="/checkout" onClick={close}>{tr('Go to checkout')} →</SiteLink>}
 <SiteLink className="text-link" href="/cart" onClick={close}>{tr('View shopping bag')}</SiteLink><button className="text-link" onClick={close}>{tr('Continue shopping')}</button></footer></>:<div className="cart-empty"><h3>{tr('Your bag is empty')}</h3><p>{tr('Find your next pair and choose a size to get started.')}</p><SiteLink className="store-button red" href="/products" onClick={close}>{tr('Browse products')}</SiteLink></div>}
 </Dialog>;
}
