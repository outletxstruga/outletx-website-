import SiteLink from '../SiteLink';
import Icon from '../Icon';
import StoreImage from '../StoreImage';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { money } from '../../lib/catalogue';
import { useLanguage } from '../../context/LanguageContext';

const nav = [['All shoes','/products'],['Men','/products?gender=men'],['Women','/products?gender=women'],['Kids','/products?gender=kids'],['Sale','/products?sort=discount']];
export default function StoreLayout({children}) {
 const { products, content, loading, error } = useStore();
 const {lang,setLang,tr}=useLanguage();
 const router=useRouter();
 const {cartCount,setCartOpen}=useCart();
 const [menu,setMenu]=useState(false), [searchOpen,setSearchOpen]=useState(false), [query,setQuery]=useState('');
 const searchButton=useRef(null), menuButton=useRef(null), headerRef=useRef(null);
 const results=query.trim().length>1?products.filter(p=>`${p.brand} ${p.name} ${p.sku}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0,5):[];
 useEffect(()=>{setMenu(false);setSearchOpen(false);setQuery('');},[router.asPath]);
 useEffect(()=>{
   function close(e) {
     if(e.key==='Escape'){if(searchOpen)searchButton.current?.focus();else if(menu)menuButton.current?.focus();setMenu(false);setSearchOpen(false);}
   }
   function outside(e){if(!headerRef.current?.contains(e.target)){setMenu(false);setSearchOpen(false);}}
   document.addEventListener('keydown',close);document.addEventListener('pointerdown',outside);
   return ()=>{document.removeEventListener('keydown',close);document.removeEventListener('pointerdown',outside);};
 },[searchOpen,menu]);
 function submit(e){e.preventDefault();if(query.trim())router.push('/products?search='+encodeURIComponent(query.trim()));}
 return <div className="store-shell">
  <a className="skip-link" href="#main-content">{tr('Skip to content')}</a>
  <div className="store-announcement"><span>{content.settings.address}</span><b>{tr('Free delivery from')} {money(content.settings.freeDeliveryOver)}</b><SiteLink href="/contact#hours">{tr('Open every day')}</SiteLink></div>
  <header className="store-header" ref={headerRef}><div className="store-header-main">
   <SiteLink className="store-logo" href="/" aria-label="OutletX home">OUTLET<span>X</span></SiteLink>
   <nav className="store-nav" aria-label={tr('Main navigation')}>{nav.map(([label,href])=><SiteLink key={label} href={href} aria-current={router.asPath===href?'page':undefined}>{tr(label)}</SiteLink>)}</nav>
   <div className="store-actions"><div className="language-switcher" aria-label={tr('Language')}>{['en','mk','sq'].map(code=><button key={code} aria-pressed={lang===code} onClick={()=>setLang(code)}>{code.toUpperCase()}</button>)}</div><SiteLink className="header-help" href="/help">{tr('Help & FAQ')}</SiteLink>
    <button ref={searchButton} aria-label={tr(searchOpen?'Close search':'Search products')} aria-expanded={searchOpen} aria-controls="header-search" onClick={()=>{setSearchOpen(!searchOpen);setMenu(false);}}><Icon name="search"/></button>
    <button aria-label={tr('Open shopping bag, {count} items',{count:cartCount})} className="store-cart-button" onClick={()=>setCartOpen(true)}><Icon name="bag"/><span className="bag-label">{tr('Bag')}</span>{cartCount>0&&<b>{cartCount}</b>}</button>
    <button ref={menuButton} className="store-menu-button" aria-label={tr(menu?'Close menu':'Open menu')} aria-expanded={menu} aria-controls="mobile-navigation" onClick={()=>{setMenu(!menu);setSearchOpen(false);}}><Icon name={menu?'close':'menu'}/></button>
   </div></div>
   {(searchOpen||menu)&&<div className="store-header-drawer">
    {searchOpen&&<div className="store-search" id="header-search"><form onSubmit={submit}><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={tr('Search brand, style or product code')} aria-label={tr('Search products')} autoComplete="off"/><button type="submit">{tr('Search')}</button></form>
     {query.trim().length>1&&<div className="store-search-results" aria-label={tr('Product suggestions')}>{results.length?results.map(p=><SiteLink key={p.id} href={'/product/'+p.id}><div className="search-image"><StoreImage src={p.images?.[0]} sizes="56px"/></div><span><b>{p.brand} {p.name}</b><small>{money(p.newPrice)}</small></span><Icon name="arrow" size={18}/></SiteLink>):<p>{tr('No matching products. Try another name or brand.')}</p>}
     {results.length>0&&<SiteLink className="search-all" href={'/products?search='+encodeURIComponent(query.trim())}>{tr('See all results')} <Icon name="arrow" size={18}/></SiteLink>}</div>}
    </div>}
    {menu&&<><nav id="mobile-navigation" className="store-mobile-nav" aria-label={tr('Main navigation')}>{[...nav,['Size guide','/size-guide'],['Help & FAQ','/help'],['About OutletX','/about'],['Contact us','/contact']].map(([label,href])=><SiteLink key={label} href={href}>{tr(label)}<Icon name="arrow" size={18}/></SiteLink>)}</nav><div className="mobile-language" aria-label={tr('Language')}>{['en','mk','sq'].map(code=><button key={code} aria-pressed={lang===code} onClick={()=>setLang(code)}>{code==='en'?'English':code==='mk'?'Македонски':'Shqip'}</button>)}</div></>}
   </div>}
  </header>
  <main id="main-content" tabIndex="-1">
   {error&&<div role="alert" className="store-status">{tr('We couldn’t refresh the shop. The information below may be out of date.')} <button onClick={()=>window.dispatchEvent(new Event('outletx:store-updated'))}>{tr('Try again')}</button> {tr('or')} <SiteLink href="/contact">{tr('contact us')}</SiteLink>.</div>}
   {loading&&<p className="store-status" role="status">{tr('Checking the latest prices and availability…')}</p>}
   {children}
  </main><TrustStrip/><StoreFooter/>
 </div>;
}
export function TrustStrip() {
 const {tr}=useLanguage();
 return <section className="store-trust" aria-label="Shopping with OutletX">
  <SiteLink href="/about"><b>{tr('Know your store')}</b><span>OutletX · Dua Mall, Struga</span></SiteLink>
  <SiteLink href="/shipping"><b>{tr('Cash on delivery')}</b><span>{tr('No card details required')}</span></SiteLink>
  <SiteLink href="/size-guide"><b>{tr('Size guide')}</b><span>{tr('Size help before you order')}</span></SiteLink>
  <SiteLink href="/contact"><b>{tr('Contact us')}</b><span>{tr('Help from your local store')}</span></SiteLink>
 </section>;
}
export function StoreFooter() {
 const {content}=useStore(), s=content.settings;
 const {tr}=useLanguage();
 return <footer className="store-footer"><div className="store-footer-main">
  <div className="store-footer-about"><SiteLink className="store-logo light" href="/">OUTLET<span>X</span></SiteLink><p>{tr('Branded footwear. Outlet prices.')}<br/>{tr('Your next pair is waiting in Struga.')}</p><SiteLink className="store-instagram" href={'https://instagram.com/'+encodeURIComponent(s.instagram.replace(/^@/,''))} target="_blank" rel="noopener noreferrer">{s.instagram} ↗</SiteLink></div>
  <div><h3>{tr('Find your pair')}</h3>{nav.map(([label,href])=><SiteLink key={label} href={href}>{tr(label)}</SiteLink>)}</div>
  <div><h3>{tr('Here to help')}</h3><SiteLink href="/help">{tr('Help & FAQ')}</SiteLink><SiteLink href="/size-guide">{tr('Size guide')}</SiteLink><SiteLink href="/shipping">{tr('Shipping & payment')}</SiteLink><SiteLink href="/returns">{tr('Returns & exchanges')}</SiteLink><SiteLink href="/contact">{tr('Contact us')}</SiteLink></div>
  <div><h3>{tr('Visit OutletX')}</h3><p>{s.address}<br/>{tr(s.country)}</p><p>{tr('Mon–Sat')} {s.openingHours.weekdays}<br/>{tr('Sunday')} {s.openingHours.sunday}</p><SiteLink href="/about">{tr('Our store')} →</SiteLink><SiteLink href="/contact#location">{tr('Get directions')} ↗</SiteLink></div>
  </div><div className="store-footer-bottom"><span>© {new Date().getFullYear()} OutletX</span><nav aria-label={tr('Legal information')}><SiteLink href="/privacy">{tr('Privacy notice')}</SiteLink><SiteLink href="/terms">{tr('Terms of sale')}</SiteLink><button onClick={()=>window.dispatchEvent(new Event('outletx:privacy-settings'))}>{tr('Cookie settings')}</button></nav><span>{tr('Prices in MKD')}</span></div></footer>;
}
