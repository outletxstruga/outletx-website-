import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import RecentlyViewedHome from '../components/RecentlyViewedHome';
import { useLanguage } from '../context/LanguageContext';
import products from '../data/products';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { lang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', handleResize); };
  }, []);

  const bestSellers = products.filter(p => p.featured && p.inStock).slice(0, 6);
  const saleProducts = products.filter(p => p.discount >= 40 && p.inStock).sort((a, b) => b.discount - a.discount).slice(0, 6);
  const newArrivals = products.filter(p => p.inStock).slice(-6).reverse();

  const GAP = isMobile ? 8 : 16;
  const PAD = isMobile ? '48px 14px' : '72px 36px';

  return (
    <>
      <Head>
        <title>OUTLETX | Branded Sportswear. Outlet Prices. | Dua Mall Struga</title>
        <meta name="description" content={t.hero.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      {/* TOP BAR */}
      <div style={{background: '#000', color: '#FFF', textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: 3, padding: '8px 14px', textTransform: 'uppercase'}}>
        {isMobile ? 'FREE DELIVERY 3000+ MKD' : 'Dua Mall, Struga — Open Every Day — Free Delivery Over 3000 MKD'}
      </div>

      {/* HEADER */}
      <header style={{background: '#FFF', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #EEE'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', padding: isMobile ? '0 14px' : '0 36px', height: isMobile ? 56 : 68, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#000', textDecoration: 'none', letterSpacing: -1.5}}>OUTLET<span style={{color: '#DC2626'}}>X</span></a>
          {!isMobile && <nav style={{display: 'flex', gap: 44}}>{['MEN', 'WOMEN', 'KIDS', 'SALE'].map(item => <a key={item} href={item === 'SALE' ? '/products?sort=discount' : `/products?gender=${item.toLowerCase()}`} style={{color: '#000', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase'}}>{item}</a>)}</nav>}
          <div style={{display: 'flex', gap: isMobile ? 6 : 14, alignItems: 'center'}}>
            <button onClick={toggleLang} style={{background: '#000', color: '#FFF', border: 'none', padding: '6px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif'}}>{lang === 'mk' ? 'MK' : lang === 'sq' ? 'SQ' : 'EN'}</button>
            <button onClick={() => setCartOpen(!cartOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 6}}>
              <svg width={20} height={20} fill="none" stroke="#000" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              {cartCount > 0 && <span style={{position: 'absolute', top: -3, right: -5, background: '#DC2626', color: '#FFF', fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cartCount}</span>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 6}}>
              <svg width={20} height={20} fill="none" stroke="#000" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && <div style={{background: '#FFF', borderTop: '1px solid #EEE', padding: '10px 14px'}}>{['MEN','WOMEN','KIDS','SALE','CONTACT'].map(item => <a key={item} href={item==='SALE'?'/products?sort=discount':item==='CONTACT'?'/contact':`/products?gender=${item.toLowerCase()}`} style={{display:'block',padding:'13px 0',color:'#000',textDecoration:'none',fontSize:14,fontWeight:600,borderBottom:'1px solid #F5F5F5'}}>{item}</a>)}</div>}
      </header>

      {/* HERO */}
      <HeroSlider />

      {/* CATEGORY STRIP */}
      <section style={{background:'#FFF',borderBottom:'1px solid #EEE'}}>
        <div style={{maxWidth:1600,margin:'0 auto',display:'grid',gridTemplateColumns:isMobile?'repeat(3,1fr)':'repeat(6,1fr)'}}>
          {['SHOES','CLOTHING','ACCESSORIES','MEN','WOMEN','KIDS'].map((c,i)=>(
            <a key={c} href={`/products?${c==='SHOES'?'category=shoes':c==='CLOTHING'?'category=clothing':c==='ACCESSORIES'?'category=accessories':`gender=${c.toLowerCase()}`}`} style={{textAlign:'center',padding:isMobile?'14px 4px':'20px 12px',textDecoration:'none',color:'#000',fontSize:isMobile?9:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',borderRight:i<(isMobile?2:5)?'1px solid #EEE':'none',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.target.style.background='#000';e.target.style.color='#FFF'}} onMouseLeave={e=>{e.target.style.background='#FFF';e.target.style.color='#000'}}>{c}</a>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section style={{padding:PAD,background:'#FFF'}}>
        <div style={{maxWidth:1600,margin:'0 auto'}}>
          <div style={{marginBottom:isMobile?28:44,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:isMobile?24:36,fontWeight:900,letterSpacing:-1.5,textTransform:'uppercase',margin:0}}>BEST SELLERS</h2>
            <a href="/products" style={{color:'#000',textDecoration:'none',fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',borderBottom:'2px solid #000',paddingBottom:4}}>VIEW ALL</a>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(auto-fill, minmax(240px, 1fr))',gap:GAP}}>
            {bestSellers.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* SALE BANNER */}
      <section style={{background:'#DC2626',padding:isMobile?'40px 14px':'56px 36px',textAlign:'center'}}>
        <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:isMobile?28:42,fontWeight:900,letterSpacing:-2,textTransform:'uppercase',color:'#FFF',margin:'0 0 12px',lineHeight:0.95}}>UP TO 70% OFF</h2>
        <a href="/products?sort=discount" style={{display:'inline-block',background:'#000',color:'#FFF',textDecoration:'none',fontSize:12,fontWeight:700,letterSpacing:3,textTransform:'uppercase',padding:'14px 36px',transition:'all 0.2s'}}
        onMouseEnter={e=>{e.target.style.background='#1A1A1A';e.target.style.transform='translateY(-1px)'}} onMouseLeave={e=>{e.target.style.background='#000';e.target.style.transform='translateY(0)'}}>SHOP SALE</a>
      </section>

      {/* SALE PRODUCTS */}
      <section style={{padding:PAD,background:'#F5F5F5'}}>
        <div style={{maxWidth:1600,margin:'0 auto'}}>
          <div style={{marginBottom:isMobile?28:44,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:isMobile?24:36,fontWeight:900,letterSpacing:-1.5,textTransform:'uppercase',margin:0}}>BIGGEST DISCOUNTS</h2>
            <a href="/products?sort=discount" style={{color:'#000',textDecoration:'none',fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',borderBottom:'2px solid #000',paddingBottom:4}}>VIEW ALL</a>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(auto-fill, minmax(240px, 1fr))',gap:GAP}}>
            {saleProducts.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* GENDER — SNIPES STYLE BIG BLOCKS */}
      <section style={{padding:0,background:'#000'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:2}}>
          {['MEN','WOMEN','KIDS'].map(g=>(
            <a key={g} href={`/products?gender=${g.toLowerCase()}`} style={{background:'#0A0A0A',color:'#FFF',textDecoration:'none',padding:isMobile?'56px 24px':'90px 36px',textAlign:'center',display:'block',transition:'all 0.3s'}}
            onMouseEnter={e=>e.target.style.background='#DC2626'} onMouseLeave={e=>e.target.style.background='#0A0A0A'}>
              <span style={{fontFamily:'Montserrat, sans-serif',fontSize:isMobile?28:40,fontWeight:900,letterSpacing:-1.5,display:'block',marginBottom:8}}>{g}</span>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',borderBottom:'2px solid rgba(255,255,255,0.4)',paddingBottom:8}}>SHOP NOW</span>
            </a>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section style={{padding:PAD,background:'#FFF'}}>
        <div style={{maxWidth:1600,margin:'0 auto'}}>
          <div style={{marginBottom:isMobile?28:44,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:isMobile?24:36,fontWeight:900,letterSpacing:-1.5,textTransform:'uppercase',margin:0}}>NEW ARRIVALS</h2>
            <a href="/products" style={{color:'#000',textDecoration:'none',fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',borderBottom:'2px solid #000',paddingBottom:4}}>VIEW ALL</a>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(auto-fill, minmax(240px, 1fr))',gap:GAP}}>
            {newArrivals.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* STORE + MAP */}
      <section style={{padding:PAD,background:'#0A0A0A',color:'#FFF'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?28:48,alignItems:'center'}}>
          <div>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'#DC2626',margin:'0 0 8px'}}>VISIT US</p>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:isMobile?24:34,fontWeight:900,letterSpacing:-1.5,margin:'0 0 16px',textTransform:'uppercase'}}>DUA MALL, STRUGA</h2>
            <p style={{color:'#999',fontSize:13,margin:'0 0 4px'}}>North Macedonia</p>
            <p style={{fontWeight:700,fontSize:15,margin:'0 0 12px'}}>+389 70 123 456</p>
            <p style={{color:'#999',fontSize:12,margin:'0 0 3px'}}>Mon—Fri: 09:00—21:00</p>
            <p style={{color:'#999',fontSize:12,margin:'0 0 3px'}}>Saturday: 09:00—22:00</p>
            <p style={{color:'#999',fontSize:12,margin:'0 0 16px'}}>Sunday: 10:00—20:00</p>
            <div style={{display:'flex',gap:10}}>
              <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background:'#DC2626',color:'#FFF',textDecoration:'none',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'10px 20px',display:'inline-block'}}>INSTAGRAM</a>
              <a href="/contact" style={{background:'transparent',color:'#FFF',textDecoration:'none',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'10px 20px',border:'1px solid #444',display:'inline-block'}}>DIRECTIONS</a>
            </div>
          </div>
          <div style={{height:isMobile?200:280,overflow:'hidden'}}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.6620743480383!2d20.675127836415925!3d41.187039407592515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350e749a513feff%3A0xc0d3f98c173d96b8!2sOutlet%20X!5e0!3m2!1sen!2smk!4v1782426661903!5m2!1sen!2smk" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
          </div>
        </div>
      </section>

      <RecentlyViewedHome />

      {/* FOOTER */}
      <footer style={{background:'#000',color:'#FFF',padding:isMobile?'40px 14px 20px':'60px 36px 24px'}}>
        <div style={{maxWidth:1600,margin:'0 auto',display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'2fr 1fr 1fr 1fr',gap:isMobile?20:36,marginBottom:isMobile?24:40}}>
          <div style={isMobile?{gridColumn:'span 2'}:{}}><h3 style={{fontFamily:'Montserrat, sans-serif',fontSize:20,fontWeight:900,marginBottom:8}}>OUTLET<span style={{color:'#DC2626'}}>X</span></h3><p style={{color:'#666',fontSize:12}}>Branded sportswear at outlet prices. Dua Mall, Struga.</p></div>
          <div><p style={{color:'#DC2626',fontSize:9,fontWeight:700,letterSpacing:2,marginBottom:12,textTransform:'uppercase'}}>SHOP</p>{['MEN','WOMEN','KIDS','SHOES','CLOTHING','SALE'].map(i=><a key={i} href="/products" style={{display:'block',color:'#888',fontSize:11,textDecoration:'none',padding:'2px 0'}}>{i}</a>)}</div>
          <div><p style={{color:'#DC2626',fontSize:9,fontWeight:700,letterSpacing:2,marginBottom:12,textTransform:'uppercase'}}>BRANDS</p>{['NIKE','ADIDAS','PUMA','JORDAN','KAPPA','SKECHERS'].map(b=><a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display:'block',color:'#888',fontSize:11,textDecoration:'none',padding:'2px 0'}}>{b}</a>)}</div>
          <div><p style={{color:'#DC2626',fontSize:9,fontWeight:700,letterSpacing:2,marginBottom:12,textTransform:'uppercase'}}>INFO</p><a href="/about" style={{display:'block',color:'#888',fontSize:11,textDecoration:'none',padding:'2px 0'}}>ABOUT</a><a href="/contact" style={{display:'block',color:'#888',fontSize:11,textDecoration:'none',padding:'2px 0'}}>CONTACT</a></div>
        </div>
        <div style={{borderTop:'1px solid #1A1A1A',paddingTop:16,textAlign:'center',color:'#555',fontSize:10}}>&copy; 2024 OUTLETX. ALL RIGHTS RESERVED.</div>
      </footer>
    </>
  );
}