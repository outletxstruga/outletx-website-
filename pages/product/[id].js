import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import SiteLink from '../../components/SiteLink';
import Seo,{SITE_URL} from '../../components/Seo';
import StoreLayout from '../../components/store/StoreLayout';
import StoreImage from '../../components/StoreImage';
import ProductCard from '../../components/ProductCard';
import Breadcrumbs from '../../components/Breadcrumbs';
import SizeGuide from '../../components/SizeGuide';
import Dialog from '../../components/Dialog';
import {useStore} from '../../context/StoreContext';
import {useCart} from '../../context/CartContext';
import {useLanguage} from '../../context/LanguageContext';
import {discountOf,stockOf,money} from '../../lib/catalogue';
import {track} from '../../lib/analytics';
export async function getStaticPaths(){return {paths:[],fallback:'blocking'};}
export async function getStaticProps({params}){
 const {getStorePageProps}=await import('../../lib/storePage');
 const result=await getStorePageProps();
 if(result.props.initialStore&&!result.props.initialStore.products.some(p=>p.id===Number(params.id)))return {notFound:true,revalidate:60};
 return result;
}
export default function ProductPage(){
 const {products,content,loading}=useStore(),{tr}=useLanguage(),router=useRouter();
 const {cart,addToCart,setCartOpen}=useCart();
 const [size,setSize]=useState(''),[quantity,setQuantity]=useState(1),[notice,setNotice]=useState(''),[selectedImage,setSelectedImage]=useState(0),[guide,setGuide]=useState(false),[zoom,setZoom]=useState(false);
 const product=products.find(p=>p.id===Number(router.query.id));
 useEffect(()=>{if(product)track('view_item',{currency:'MKD',value:product.newPrice,items:[{item_id:String(product.id),item_name:product.name,item_brand:product.brand,price:product.newPrice}]});},[product?.id]);
 if(!product)return <StoreLayout><Seo title={tr('Product unavailable')+' | OutletX'} noindex/><section className="store-section catalogue-empty"><h1>{loading?tr('Loading product…'):tr('Product unavailable')}</h1><p>{tr('Browse the current collection or ask us about a specific style.')}</p><SiteLink className="store-button" href="/products">{tr('Browse products')}</SiteLink></section></StoreLayout>;
 const stock=stockOf(product),discount=discountOf(product),images=product.images||[],selectedStock=stockOf(product,size);
 const productName=`${product.brand.trim()} ${product.name.trim()}`;
 const inBag=cart.find(p=>p.id===product.id&&p.size===size)?.quantity||0,remaining=Math.max(0,Math.min(50,selectedStock)-inBag);
 const related=products.filter(p=>p.id!==product.id&&stockOf(p)>0&&(p.brand.toLowerCase()===product.brand.toLowerCase()||p.gender===product.gender)).slice(0,4);
 function add(){
  if(!size){setNotice(tr('Choose your size first.'));return;}
  if(!remaining){setNotice(tr('All available units of this size are already in your bag.'));return;}
  addToCart(product,size,Math.min(quantity,remaining));setNotice('');setCartOpen(true);
  track('add_to_cart',{currency:'MKD',value:product.newPrice*Math.min(quantity,remaining),items:[{item_id:String(product.id),item_name:product.name,item_brand:product.brand,item_variant:size,price:product.newPrice,quantity:Math.min(quantity,remaining)}]});
 }
 const schema={'@context':'https://schema.org','@type':'Product',name:productName,description:product.description||productName,sku:product.sku.trim(),brand:{'@type':'Brand',name:product.brand.trim()},image:images.map(src=>src.startsWith('/')?SITE_URL+src:src),offers:{'@type':'Offer',url:SITE_URL+'/product/'+product.id,priceCurrency:'MKD',price:product.newPrice,availability:'https://schema.org/'+(stock?'InStock':'OutOfStock')}};
 return <StoreLayout><Seo title={productName+' | OutletX'} path={'/product/'+product.id} description={product.description||tr('Shop {name} at OutletX Struga for {price}.',{name:productName,price:money(product.newPrice)})} schema={schema}/>
 <div className="store-container product-breadcrumb"><Breadcrumbs items={[{label:tr('Shop'),href:'/products'},{label:product.name}]}/></div>
 <section className="product-detail"><div className="product-gallery"><button className="product-main-image" aria-label={tr('Enlarge product image')} onClick={()=>setZoom(true)}><StoreImage src={images[selectedImage]||images[0]} alt={product.brand+' '+product.name+' — '+(selectedImage+1)} sizes="(max-width: 720px) 100vw, 55vw" priority/>{discount>0&&<span className="product-badge">−{discount}%</span>}<span className="image-zoom-label">{tr('Tap to enlarge')} +</span></button>
 {images.length>1&&<div className="product-thumbnails" aria-label={tr('Product images')}>{images.map((src,i)=><button key={src+i} aria-label={tr('View image {number}',{number:i+1})} aria-pressed={i===selectedImage} onClick={()=>setSelectedImage(i)}><StoreImage src={src} sizes="80px"/></button>)}</div>}</div>
 <div className="product-info"><p className="store-eyebrow">{product.brand} · {tr('Code')}: {product.sku}</p><h1>{product.name}</h1><div className="product-price"><strong>{money(product.newPrice)}</strong>{discount>0&&<><del>{money(product.oldPrice)}</del><span>{tr('Save')} {money(product.oldPrice-product.newPrice)}</span></>}</div>
 <p className="product-description">{product.description||tr('Part of the OutletX footwear collection. Check the available sizes below or ask us for product and fit details.')}</p>
 <div className="product-selector"><div className="product-selector-head"><b>{tr('Select size')}{size?': '+size:''}</b><button className="text-link" onClick={()=>setGuide(true)}>{tr('Size guide')} ↗</button></div><div className="product-sizes">{product.sizes.map(s=><button key={s.size} type="button" disabled={!s.stock||!stock} aria-pressed={size===s.size} aria-label={tr('Size')+' '+s.size+(!s.stock?' — '+tr('Sold out'):'')} onClick={()=>{setSize(s.size);setQuantity(1);setNotice('');}}><b>{s.size}</b>{!s.stock&&<small>{tr('Sold out')}</small>}</button>)}</div>
 <p className="size-hint">{!stock?tr('This product is currently sold out.'):size?tr('{count} available in this size',{count:selectedStock}):tr('Choose your size to check availability.')}</p></div>
 {notice&&<p className="product-warning" role="alert">{notice}</p>}
 <div className="product-buy-row"><div className="product-qty"><button aria-label={tr('Decrease quantity')} disabled={quantity<=1} onClick={()=>setQuantity(q=>Math.max(1,q-1))}>−</button><span aria-live="polite">{quantity}</span><button aria-label={tr('Increase quantity')} disabled={!size||quantity>=remaining} onClick={()=>setQuantity(q=>Math.min(remaining,q+1))}>+</button></div><button className="store-button red" onClick={add} disabled={!stock||!size||!remaining}>{!stock?tr('Sold out'):!size?tr('Select size'):tr('Add to bag')+' · '+money(product.newPrice*quantity)}</button></div>
 <p className="stock-note">{tr('Adding to your bag does not reserve stock.')}</p>
 <div className="product-service-info"><div><b>{tr('Delivery & payment')}</b><p>{tr('Delivery')} {money(content.settings.deliveryFee)} · {tr('Free from')} {money(content.settings.freeDeliveryOver)}<br/>{tr('Cash on delivery. No card details required.')}</p><SiteLink href="/shipping">{tr('Delivery details')} →</SiteLink></div><div><b>{tr('Need help before ordering?')}</b><p>{tr('Ask us about fit, delivery or returns before choosing your pair.')}</p><SiteLink href="/contact">{tr('Contact OutletX')} →</SiteLink></div></div>
 <details className="product-specs"><summary>{tr('Product details')}</summary><dl>{[['Brand',product.brand],['Product code',product.sku],['Category',product.subcategory||product.category],['Colour',product.color]].filter(([,v])=>v).map(([k,v])=><div key={k}><dt>{tr(k)}</dt><dd>{v}</dd></div>)}</dl></details>
 </div></section>
 {related.length>0&&<section className="store-section related-section"><div className="store-container"><div className="home-section-head"><h2 className="store-title">{tr('Also worth a look.')}</h2><SiteLink className="text-link" href="/products">{tr('Shop all products')} →</SiteLink></div><div className="product-grid">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></div></section>}
 <SizeGuide isOpen={guide} onClose={()=>setGuide(false)}/><Dialog open={zoom} onClose={()=>setZoom(false)} title={product.name} className="image-dialog"><div className="zoom-image"><StoreImage src={images[selectedImage]||images[0]} alt={product.brand+' '+product.name} sizes="90vw"/></div>{images.length>1&&<div className="zoom-controls"><button onClick={()=>setSelectedImage((selectedImage-1+images.length)%images.length)}>{tr('Previous')}</button><span>{selectedImage+1} / {images.length}</span><button onClick={()=>setSelectedImage((selectedImage+1)%images.length)}>{tr('Next')}</button></div>}</Dialog>
 </StoreLayout>;
}
