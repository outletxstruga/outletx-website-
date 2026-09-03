import SiteLink from './SiteLink';
import StoreImage from './StoreImage';
import {useCart} from '../context/CartContext';
import {useLanguage} from '../context/LanguageContext';
import {money} from '../lib/catalogue';
export default function CartItems({onNavigate=()=>{}}){
 const {cart,updateQuantity,removeFromCart}=useCart(),{tr}=useLanguage();
 return <div className="cart-items">{cart.map(item=><article className="cart-item" key={item.id+'-'+item.size}>
 <SiteLink className="cart-item-image" href={'/product/'+item.id} onClick={onNavigate}><StoreImage src={item.images?.[0]} alt={item.name} sizes="100px"/></SiteLink><div><small>{item.brand}</small><SiteLink href={'/product/'+item.id} onClick={onNavigate}><h3>{item.name}</h3></SiteLink><p>{tr('Size')} {item.size}</p>
 {(item.unavailable||item.overStock)&&<p className="cart-warning" role="status">{item.unavailable?tr('This size is no longer available. Please remove it.'):tr('Only {count} available. Please reduce the quantity.',{count:item.maxQuantity})}</p>}
 <div className="cart-item-bottom"><div className="cart-quantity"><button aria-label={tr('Decrease quantity')+' — '+item.name} onClick={()=>updateQuantity(item.id,item.size,item.quantity-1)}>−</button><span>{item.quantity}</span><button aria-label={tr('Increase quantity')+' — '+item.name} disabled={item.maxQuantity!==null&&item.quantity>=item.maxQuantity} onClick={()=>updateQuantity(item.id,item.size,item.quantity+1)}>+</button></div><strong>{money(item.newPrice*item.quantity)}</strong></div>
 <button className="cart-remove" onClick={()=>removeFromCart(item.id,item.size)}>{tr('Remove')}</button></div></article>)}</div>;
}
