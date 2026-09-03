import SiteLink from './SiteLink';
import StoreImage from './StoreImage';
import Icon from './Icon';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { discountOf, stockOf, money } from '../lib/catalogue';
import { useLanguage } from '../context/LanguageContext';
export default function HeroSlider() {
 const {content,products}=useStore(), [current,setCurrent]=useState(0);
 const {tr}=useLanguage();
 const available=products.filter(p=>stockOf(p)>0);
 const slides=content.slides?.length?content.slides:[{title:'GOOD SHOES.',subtitle:'BETTER PRICES.',link:'/products',linkText:'Find your pair'}];
 const slide=slides[current%slides.length], product=available[current%Math.max(available.length,1)];
 const maxDiscount=Math.max(0,...available.map(discountOf));
 // Replace only the old starter campaigns; custom campaigns remain editable in the admin.
 const starter=['BRANDED SPORTSWEAR.','NEW COLLECTION.','UP TO 70% OFF.'].includes(slide.title);
 const title=starter?tr(['GOOD SHOES.','FIND YOUR','OUTLET PRICES.'][current%3]):slide.title;
 const subtitle=starter?tr(['BETTER PRICES.','EVERYDAY PAIR.','REAL SAVINGS.'][current%3]):slide.subtitle;
 const description=starter?(current%3===2&&maxDiscount>0?tr('Save up to {count}% on the styles currently in stock.',{count:maxDiscount}):tr('Discover branded footwear at OutletX. Choose your pair online or try it on at Dua Mall, Struga.')):slide.description;
 const src=starter&&product?product.images?.[0]:slide.image;
 return <section className="home-hero" aria-label="Featured collection" aria-roledescription={slides.length>1?'carousel':undefined}>
   <div className="home-hero-content"><p className="store-eyebrow">{starter?'OUTLETX · STRUGA':slide.tag}</p><h1>{title}<span>{subtitle}</span></h1><p className="hero-description">{description}</p>
   <nav aria-label={tr('Featured collection links')}><SiteLink className="store-button red" href={slide.link||'/products'}>{starter?tr('Find your pair'):slide.linkText}<Icon name="arrow"/></SiteLink><SiteLink className="hero-secondary" href="/contact">{tr('Visit the store')} ↗</SiteLink></nav>
   <div className="hero-caption">{tr('Limited sizes. Clear prices. Cash on delivery.')}</div></div>
   <div className="hero-visual"><div className="hero-image"><StoreImage src={src} alt={starter&&product?`${product.brand} ${product.name}`:''} sizes="(max-width: 720px) 100vw, 55vw" priority/></div>
   {starter&&product&&<SiteLink className="hero-product-label" href={'/product/'+product.id}><span><small>{product.brand}</small><b>{product.name}</b></span><span>{money(product.newPrice)}<Icon name="arrow" size={20}/></span></SiteLink>}
   </div>
   {slides.length>1&&<div className="home-hero-controls"><button aria-label="Previous featured slide" onClick={()=>setCurrent((current-1+slides.length)%slides.length)}>←</button><span aria-live="polite">{current+1} / {slides.length}</span><button aria-label="Next featured slide" onClick={()=>setCurrent((current+1)%slides.length)}>→</button></div>}
 </section>;
}
