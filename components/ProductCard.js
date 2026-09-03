import SiteLink from './SiteLink';
import StoreImage from './StoreImage';
import {discountOf,stockOf,money,groupLabel} from '../lib/catalogue';
import {useLanguage} from '../context/LanguageContext';
export default function ProductCard({product,priority=false}){
 const discount=discountOf(product),stock=stockOf(product),{tr}=useLanguage();
 const sizes=(product.sizes||[]).filter(s=>s.stock>0).map(s=>s.size);
 return <article className="product-card"><SiteLink href={'/product/'+product.id} className="product-card-image"><StoreImage src={product.images?.[0]} alt={product.brand+' '+product.name} priority={priority}/>{!stock?<span className="product-badge sold-out">{tr('Sold out')}</span>:discount>0&&<span className="product-badge">−{discount}%</span>}<span className="card-view">{tr('Select size')} ↗</span></SiteLink><div className="product-card-body"><p className="product-card-brand">{product.brand}</p><SiteLink href={'/product/'+product.id}><h3>{product.name}</h3></SiteLink><div className="product-card-price"><strong>{money(product.newPrice)}</strong>{discount>0&&<del>{money(product.oldPrice)}</del>}</div><div className="product-card-meta"><span>{tr(groupLabel(product.gender))}</span><span>{stock?tr('In stock'):tr('Sold out')}</span></div>{stock>0&&<p className="card-sizes">{tr('Sizes')}: {sizes.slice(0,5).join(' · ')}{sizes.length>5?' +'+(sizes.length-5):''}</p>}</div></article>;
}
