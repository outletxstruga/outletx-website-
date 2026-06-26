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

  const bestSellers = products.filter(p => p.featured && p.inStock).slice(0, 8);
  const saleProducts = products.filter(p => p.discount >= 40 && p.inStock).sort((a, b) => b.discount - a.discount).slice(0, 8);
  const newArrivals = products.filter(p => p.inStock).slice(-8).reverse();

  const M = isMobile;
  const P = M ? '48px 14px' : '80px 36px';
  const T = M ? 22 : 28;

  return (
    <>
      <Head>
        <title>OUTLETX | Branded Sportswear. Outlet Prices. | Dua Mall Struga</title>
        <meta name="description" content={t.hero.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{background: '#000', color: '#FFF', textAlign: 'center', fontSize: 9, fontWeight: 600, letterSpacing: 4, padding: '8px 14px', textTransform: 'uppercase'}}>
        Dua Mall, Struga &nbsp;—&nbsp; Open Every Day &nbsp;—&nbsp; Free Delivery Over 3000 MKD
      </div>

      <header style={{background: '#FFF', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #E5E5E5'}}>
        <div style={{maxWidth: 1400, margin: '0 auto', padding: M ? '0 16px' : '0 36px', height: M ? 54 : 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: M ? 20 : 24, fontWeight: 900, color: '#000', textDecoration: 'none', letterSpacing: -1}}>OUTLET<span style={{color: '#DC2626'}}>X</span></a>
          {!M && <nav style={{display: 'flex', gap: 40}}>{['MEN', 'WOMEN', 'KIDS', 'SALE'].map(i => <a key={i} href={i==='SALE'?'/products?sort=discount':`/products?gender=${i.toLowerCase()}`} style={{color:'#000',textDecoration:'none',fontSize:12,fontWeight:600,letterSpacing:2,textTransform:'uppercase'}}>{i}</a>)}</nav>}
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <button onClick={toggleLang} style={{background:'none',border:'1px solid #E5E5E5',color:'#000',padding:'5px 10px',fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:'Inter, sans-serif'}}>{lang==='mk'?'MK':lang==='sq'?'SQ':'EN'}</button>
            <button onClick={()=>setCartOpen(!cartOpen)} style={{background:'none',border:'none',cursor:'pointer',position:'relative',padding:4}}>
              <svg width={18} height={18} fill="none" stroke="#000" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              {cartCount>0&&<span style={{position:'absolute',top:-4,right:-6,background:'#DC2626',color:'#FFF',fontSize:8,fontWeight:700,width:14,height:14,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>{cartCount}</span>}
            </button>
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:'none',border:'none',cursor:'pointer',padding:4}}>
              <svg width={18} height={18} fill="none" stroke="#000" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen&&<div style={{background:'#FFF',borderTop:'1px solid #EEE',padding:'10px 16px'}}>{['MEN','WOMEN','KIDS','SALE','CONTACT'].map(i=><a key={i} href={i==='SALE'?'/products?sort=discount':i==='CONTACT'?'/contact':`/products?gender=${i.toLowerCase()}`} style={{display:'block',padding:'12px 0',color:'#000',textDecoration:'none',fontSize:13,fontWeight:600,borderBottom:'1px solid #F5F5F5'}}>{i}</a>)}</div>}
      </header>

      <HeroSlider />

      <section style={{borderBottom:'1px solid #E5E5E5'}}>
        <div style={{maxWidth:1400,margin:'0 auto',display:'grid',gridTemplateColumns:M?'repeat(3,1fr)':'repeat(6,1fr)'}}>
          {['SHOES','CLOTHING','ACCESSORIES','MEN','WOMEN','KIDS'].map((c,i)=>(
            <a key={c} href={`/products?${c==='SHOES'?'category=shoes':c==='CLOTHING'?'category=clothing':c==='ACCESSORIES'?'category=accessories':`gender=${c.toLowerCase()}`}`} style={{textAlign:'center',padding:M?'14px 4px':'18px 12px',textDecoration:'none',color:'#555',fontSize:M?9:11,fontWeight:600,letterSpacing:2,textTransform:'uppercase',borderRight:i<(M?2:5)?'1px solid #F0F0F0':'none',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.target.style.color='#000';e.target.style.background='#FAFAFA'}} onMouseLeave={e=>{e.target.style.color='#555';e.target.style.background='#FFF'}}>{c}</a>
          ))}
        </div>
      </section>

      <section style={{padding:P}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{marginBottom:M?32:48}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:'#999',margin:'0 0 8px'}}>Most Popular</p>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:T,fontWeight:900,letterSpacing:-1,textTransform:'uppercase',margin:0}}>Best Sellers</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:M?'repeat(2,1fr)':'repeat(4,1fr)',gap:M?10:16}}>
            {bestSellers.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
          <div style={{textAlign:'center',marginTop:M?28:40}}>
            <a href="/products" style={{display:'inline-block',background:'transparent',color:'#000',textDecoration:'none',fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'12px 32px',border:'1px solid #000',transition:'all 0.2s'}}
            onMouseEnter={e=>{e.target.style.background='#000';e.target.style.color='#FFF'}} onMouseLeave={e=>{e.target.style.background='transparent';e.target.style.color='#000'}}>View All Products</a>
          </div>
        </div>
      </section>

      <section style={{background:'#DC2626',padding:M?'48px 14px':'64px 36px',textAlign:'center'}}>
        <p style={{fontSize:9,fontWeight:700,letterSpacing:5,textTransform:'uppercase',color:'rgba(255,255,255,0.7)',margin:'0 0 8px'}}>Limited Time</p>
        <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:M?30:42,fontWeight:900,letterSpacing:-2,textTransform:'uppercase',color:'#FFF',margin:'0 0 20px',lineHeight:0.95}}>Up To 70% Off</h2>
        <a href="/products?sort=discount" style={{display:'inline-block',background:'#FFF',color:'#DC2626',textDecoration:'none',fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',padding:'14px 36px',transition:'all 0.2s'}}
        onMouseEnter={e=>{e.target.style.background='#000';e.target.style.color='#FFF'}} onMouseLeave={e=>{e.target.style.background='#FFF';e.target.style.color='#DC2626'}}>Shop Sale</a>
      </section>

      <section style={{padding:P,background:'#FAFAFA'}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{marginBottom:M?32:48}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:'#999',margin:'0 0 8px'}}>Deals</p>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:T,fontWeight:900,letterSpacing:-1,textTransform:'uppercase',margin:0}}>Biggest Discounts</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:M?'repeat(2,1fr)':'repeat(4,1fr)',gap:M?10:16}}>
            {saleProducts.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      <section style={{background:'#0A0A0A',padding:P}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{marginBottom:M?32:48}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:'#666',margin:'0 0 8px'}}>Shop By</p>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:T,fontWeight:900,letterSpacing:-1,textTransform:'uppercase',color:'#FFF',margin:0}}>Gender</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:M?'1fr':'repeat(3,1fr)',gap:M?8:2}}>
            {['MEN','WOMEN','KIDS'].map(g=>(
              <a key={g} href={`/products?gender=${g.toLowerCase()}`} style={{background:'#111',color:'#FFF',textDecoration:'none',padding:M?'48px 24px':'72px 36px',textAlign:'center',display:'block',transition:'all 0.4s'}}
              onMouseEnter={e=>e.target.style.background='#1A1A1A'} onMouseLeave={e=>e.target.style.background='#111'}>
                <span style={{fontFamily:'Montserrat, sans-serif',fontSize:M?24:32,fontWeight:900,letterSpacing:-1,display:'block',marginBottom:12}}>{g}</span>
                <span style={{fontSize:10,fontWeight:600,letterSpacing:3,textTransform:'uppercase',color:'#888'}}>Shop Now →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:P}}>
        <div style={{maxWidth:1400,margin:'0 auto'}}>
          <div style={{marginBottom:M?32:48}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:'#999',margin:'0 0 8px'}}>Fresh In</p>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:T,fontWeight:900,letterSpacing:-1,textTransform:'uppercase',margin:0}}>New Arrivals</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:M?'repeat(2,1fr)':'repeat(4,1fr)',gap:M?10:16}}>
            {newArrivals.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      <section style={{padding:P,background:'#FAFAFA'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:M?'1fr':'1fr 1fr',gap:M?28:48,alignItems:'center'}}>
          <div>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color:'#999',margin:'0 0 8px'}}>Visit Us</p>
            <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:T,fontWeight:900,letterSpacing:-1,textTransform:'uppercase',margin:'0 0 16px'}}>Dua Mall, Struga</h2>
            <p style={{color:'#666',fontSize:13,margin:'0 0 4px'}}>North Macedonia</p>
            <p style={{fontWeight:700,fontSize:14,margin:'0 0 16px'}}>+389 70 123 456</p>
            <p style={{color:'#888',fontSize:12,margin:'0 0 4px'}}>Mon—Fri: 09:00—21:00</p>
            <p style={{color:'#888',fontSize:12,margin:'0 0 4px'}}>Sat: 09:00—22:00</p>
            <p style={{color:'#888',fontSize:12,margin:'0 0 20px'}}>Sun: 10:00—20:00</p>
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{display:'inline-block',background:'#000',color:'#FFF',textDecoration:'none',fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'10px 24px'}}>Instagram</a>
          </div>
          <div style={{height:M?200:300,overflow:'hidden'}}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.6620743480383!2d20.675127836415925!3d41.187039407592515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350e749a513feff%3A0xc0d3f98c173d96b8!2sOutlet%20X!5e0!3m2!1sen!2smk!4v1782426661903!5m2!1sen!2smk" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
          </div>
        </div>
      </section>

      <RecentlyViewedHome />

      <footer style={{background:'#0A0A0A',color:'#FFF',borderTop:'1px solid #1A1A1A',padding:M?'40px 14px':'56px 36px 28px'}}>
        <div style={{maxWidth:1400,margin:'0 auto',display:'grid',gridTemplateColumns:M?'repeat(2,1fr)':'2fr 1fr 1fr 1fr',gap:M?20:36,marginBottom:M?24:36}}>
          <div style={M?{gridColumn:'span 2'}:{}}><h3 style={{fontFamily:'Montserrat, sans-serif',fontSize:18,fontWeight:900,marginBottom:8,letterSpacing:-1}}>OUTLET<span style={{color:'#DC2626'}}>X</span></h3><p style={{color:'#999',fontSize:11,lineHeight:1.7}}>Branded sportswear at outlet prices.<br/>Dua Mall, Struga, North Macedonia.</p></div>
          <div>
            <p style={{fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:12,color:'#DC2626'}}>Shop</p>
            {[{label:'Men',link:'/products?gender=men'},{label:'Women',link:'/products?gender=women'},{label:'Kids',link:'/products?gender=kids'},{label:'Shoes',link:'/products?category=shoes'},{label:'Clothing',link:'/products?category=clothing'},{label:'Sale',link:'/products?sort=discount'}].map(i=><a key={i.label} href={i.link} style={{display:'block',color:'#888',fontSize:11,textDecoration:'none',padding:'2px 0'}}>{i.label}</a>)}
          </div>
          <div><p style={{fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:12,color:'#000'}}>Brands</p>{['Nike','Adidas','Puma','Jordan','Kappa','Skechers'].map(b=><a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display:'block',color:'#888',fontSize:11,textDecoration:'none',padding:'2px 0'}}>{b}</a>)}</div>
          <div><p style={{fontSize:9,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:12,color:'#000'}}>Info</p><a href="/about" style={{display:'block',color:'#888',fontSize:11,textDecoration:'none',padding:'2px 0'}}>About</a><a href="/contact" style={{display:'block',color:'#888',fontSize:11,textDecoration:'none',padding:'2px 0'}}>Contact</a></div>
        </div>
        <div style={{textAlign:'center',color:'#555',fontSize:10}}>&copy; 2024 OUTLETX. All rights reserved.</div>
      </footer>
    </>
  );
}