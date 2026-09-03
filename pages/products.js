import {useState} from 'react';
import {useRouter} from 'next/router';
import Seo from '../components/Seo';
import StoreLayout from '../components/store/StoreLayout';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import {useStore} from '../context/StoreContext';
import {useLanguage} from '../context/LanguageContext';
import {filterProducts, groupLabel} from '../lib/catalogue';
export {getStorePageProps as getStaticProps} from '../lib/storePage';
export default function Products(){
 const {products,loading}=useStore(), router=useRouter(), {tr}=useLanguage();
 const filters=Object.fromEntries(Object.entries(router.query).filter(([,v])=>typeof v==='string'));
 const [query,setQuery]=useState(filters.search||''), [showFilters,setShowFilters]=useState(false);
 const visible=filterProducts(products,filters), count=24, page=Math.max(1,Number(filters.page)||1);
 const totalPages=Math.max(1,Math.ceil(visible.length/count)), safePage=Math.min(page,totalPages);
 const brands=[...new Set(products.map(p=>p.brand?.toLowerCase()))].filter(Boolean).sort();
 const sizes=[...new Set(products.flatMap(p=>(p.sizes||[]).map(s=>s.size)))].sort((a,b)=>parseFloat(a)-parseFloat(b)||a.localeCompare(b));
 const activeKeys=['gender','brand','category','size','min','max','search'];
 const active=activeKeys.filter(k=>filters[k]);
 function update(values){const next={...filters,...values};delete next.page;Object.keys(next).forEach(k=>{if(!next[k])delete next[k];});router.push({pathname:'/products',query:next},undefined,{shallow:true,scroll:false});}
 const title=filters.gender?tr(groupLabel(filters.gender)):filters.brand?filters.brand:tr('All shoes');
 return <StoreLayout><Seo title={title+' | OutletX Struga'} path="/products" description={tr('Browse branded footwear, filter by size and find your next pair at OutletX Struga.')} noindex={!!filters.search}/>
 <div className="catalogue-hero store-container"><Breadcrumbs items={[{label:tr('Shop')}]}/><p className="store-eyebrow">{tr('The OutletX collection')}</p><h1 className="store-title">{title}</h1><p>{tr('Find your size. Make it yours.')}</p></div>
 <section className="store-section catalogue-section"><div className="store-container">
 <div className="catalogue-toolbar"><form onSubmit={e=>{e.preventDefault();update({search:query.trim()});}}><label className="sr-only" htmlFor="catalogue-search">{tr('Search products')}</label><input id="catalogue-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={tr('Search brand, style or product code')}/><button type="submit">{tr('Search')}</button></form>
 <button className="filter-toggle" aria-expanded={showFilters} aria-controls="catalogue-filters" onClick={()=>setShowFilters(!showFilters)}>{tr('Filters')}{active.length?' ('+active.length+')':''}</button>
 <label className="sort-control"><span>{tr('Sort by')}</span><select value={filters.sort||'featured'} onChange={e=>update({sort:e.target.value})}>{[['featured','Featured'],['discount','Biggest discount'],['newest','Recently added'],['price-low','Price: low to high'],['price-high','Price: high to low']].map(([value,label])=><option key={value} value={value}>{tr(label)}</option>)}</select></label></div>
 <div className="catalogue-layout"><aside id="catalogue-filters" className={'catalogue-filters '+(showFilters?'is-open':'')} aria-label={tr('Product filters')}><div className="filter-heading"><h2>{tr('Filters')}</h2><button onClick={()=>router.push('/products',undefined,{shallow:true,scroll:false})}>{tr('Reset')}</button></div>
 <label><span>{tr('Shop for')}</span><select value={filters.gender||''} onChange={e=>update({gender:e.target.value})}><option value="">{tr('Everyone')}</option>{['men','women','kids','unisex'].map(g=><option key={g} value={g}>{tr(groupLabel(g))}</option>)}</select></label>
 <label><span>{tr('Brand')}</span><select value={filters.brand||''} onChange={e=>update({brand:e.target.value})}><option value="">{tr('All brands')}</option>{brands.map(b=><option key={b} value={b}>{b.toUpperCase()}</option>)}</select></label>
 <label><span>{tr('Size')}</span><select value={filters.size||''} onChange={e=>update({size:e.target.value})}><option value="">{tr('All available sizes')}</option>{sizes.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
 <fieldset><legend>{tr('Price (MKD)')}</legend><div className="price-inputs"><input aria-label={tr('Minimum price')} type="number" min="0" step="1" placeholder={tr('From')} defaultValue={filters.min||''} onBlur={e=>update({min:e.target.value})} onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}/><span>–</span><input aria-label={tr('Maximum price')} type="number" min="0" step="1" placeholder={tr('To')} defaultValue={filters.max||''} onBlur={e=>update({max:e.target.value})} onKeyDown={e=>{if(e.key==='Enter')e.target.blur();}}/></div></fieldset>
 <label className="stock-check"><input type="checkbox" checked={filters.stock!=='all'} onChange={e=>update({stock:e.target.checked?'':'all'})}/>{tr('In stock only')}</label>
 </aside><div className="catalogue-results"><div className="catalogue-result-meta"><p role="status">{loading?tr('Loading products…'):tr('{count} products',{count:visible.length})}</p>{active.length>0&&<div className="filter-chips">{active.map(k=><button key={k} aria-label={tr('Remove filter')+': '+filters[k]} onClick={()=>update({[k]:''})}>{tr(({gender:'Shop for',brand:'Brand',category:'Category',size:'Size',min:'From',max:'To',search:'Search'})[k])}: {filters[k]} ×</button>)}</div>}</div>
 {visible.length?<><div className="product-grid">{visible.slice((safePage-1)*count,safePage*count).map((p,index)=><ProductCard key={p.id} product={p} priority={index<4}/>)}</div>{totalPages>1&&<nav className="pagination" aria-label={tr('Product pages')}><button disabled={safePage===1} onClick={()=>router.push({pathname:'/products',query:{...filters,page:safePage-1}},undefined,{shallow:true})}>{tr('Previous')}</button><span>{safePage} / {totalPages}</span><button disabled={safePage===totalPages} onClick={()=>router.push({pathname:'/products',query:{...filters,page:safePage+1}},undefined,{shallow:true})}>{tr('Next')}</button></nav>}</>:<div className="catalogue-empty"><h2>{tr('No products found')}</h2><p>{tr('Try another size or remove a filter to see more styles.')}</p><button className="store-button" onClick={()=>router.push('/products')}>{tr('View all products')}</button></div>}
 </div></div></div></section></StoreLayout>;
}
