import SiteLink from '../components/SiteLink';
import Seo from '../components/Seo';
import StoreLayout from '../components/store/StoreLayout';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import StoreImage from '../components/StoreImage';
import { useStore } from '../context/StoreContext';
import { stockOf, groupLabel } from '../lib/catalogue';
import { useLanguage } from '../context/LanguageContext';
export { getStorePageProps as getStaticProps } from '../lib/storePage';
export default function Home() {
 const {products,content,loading}=useStore();
 const {tr}=useLanguage();
 const available=products.filter(p=>stockOf(p)>0);
 const featured=[...available].sort((a,b)=>Number(b.featured)-Number(a.featured)||b.id-a.id).slice(0,8);
 const groups=['men','women','kids'].map(g=>({name:g,product:available.find(p=>p.gender===g)})).filter(g=>g.product);
 const brands=[...new Map(available.map(p=>[p.brand.toLowerCase(),p.brand])).values()];
 const s=content.settings;
 return <StoreLayout><Seo title="OutletX Struga | Branded Footwear. Outlet Prices." description="Find your next pair at OutletX. Browse branded shoes, available sizes and outlet prices. Visit Dua Mall, Struga or order with cash on delivery."/>
 <HeroSlider/>
 <section className="store-section home-selection"><div className="store-container"><div className="home-section-head"><div><p className="store-eyebrow">{tr('In stock now')}</p><h2 className="store-title">{tr('Find your next pair.')}</h2></div><SiteLink className="text-link" href="/products">{tr('Shop all products')} →</SiteLink></div>
 <div className="home-quick-links"><SiteLink href="/products" className="active">{tr('All styles')}</SiteLink>{groups.map(g=><SiteLink key={g.name} href={'/products?gender='+g.name}>{tr(groupLabel(g.name))}</SiteLink>)}<SiteLink href="/products?sort=discount">{tr('Best savings')} ↗</SiteLink></div>
 {featured.length?<div className="product-grid">{featured.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="catalogue-empty"><h3>{loading?tr('Loading the collection…'):tr('New stock is on the way')}</h3><p>{tr('Message us to ask about your size or visit the store.')}</p><SiteLink className="text-link" href="/contact">{tr('Contact OutletX')} →</SiteLink></div>}
 </div></section>
 {groups.length>0&&<section className="store-section home-category-section"><div className="store-container"><div className="home-section-head"><div><p className="store-eyebrow">{tr('Your style. Your size.')}</p><h2 className="store-title">{tr('Make them yours.')}</h2></div><SiteLink className="text-link" href="/size-guide">{tr('Need help with fit?')} →</SiteLink></div><div className="home-categories">{groups.map(g=><SiteLink key={g.name} className="home-category" href={'/products?gender='+g.name}><div className="category-image"><StoreImage src={g.product.images?.[0]} alt={tr(groupLabel(g.name))+' footwear'} sizes="(max-width: 720px) 100vw, 50vw"/></div><div className="category-caption"><h3>{tr('Shop')} {tr(groupLabel(g.name)).toLowerCase()}</h3><span>{tr('Explore the collection')} ↗</span></div></SiteLink>)}</div></div></section>}
 <section className="home-visit"><div className="home-visit-wordmark" aria-hidden="true">OUTLET<span>X</span><small>STRUGA</small></div><div><p className="store-eyebrow">{tr('Online, with a real store behind it')}</p><h2>{tr('Come for a look.')}<br/>{tr('Leave with your pair.')}</h2><p>{tr('Try on your favourites and get help choosing the right fit. Find us at {address}.',{address:s.address})}</p><p className="visit-hours">{tr('Mon–Sat')} {s.openingHours.weekdays}<br/>{tr('Sunday')} {s.openingHours.sunday}</p><SiteLink className="store-button light" href="/contact">{tr('Plan your visit')} ↗</SiteLink></div></section>
 {brands.length>0&&<section className="home-brand-list"><p className="store-eyebrow">{tr('Brands currently in stock')}</p><div>{brands.map(brand=><SiteLink key={brand} href={'/products?brand='+encodeURIComponent(brand.toLowerCase())}>{brand} <span>↗</span></SiteLink>)}</div></section>}
 </StoreLayout>;
}
