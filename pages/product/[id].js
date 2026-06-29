import SizeGuide from '../../components/SizeGuide';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductCard from '../../components/ProductCard';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useCart } from '../../context/CartContext';
import products from '../../data/products';

export default function ProductDetail() {
const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem('outletx_recent');
      let ids = stored ? JSON.parse(stored) : [];
      ids = [product.id, ...ids.filter(i => i !== product.id)].slice(0, 10);
      localStorage.setItem('outletx_recent', JSON.stringify(ids));
    }
  }, [id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const q = value.trim().toLowerCase();
    if (q.length >= 2) {
      const results = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      ).slice(0, 6);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const M = isMobile;
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{textAlign:'center',padding:'120px 20px',background:'#FFF',minHeight:'60vh',fontFamily:'Inter, sans-serif'}}>
        <h1 style={{fontFamily:'Montserrat, sans-serif',fontWeight:900,fontSize:28,textTransform:'uppercase',marginBottom:16}}>Product Not Found</h1>
        <a href="/products" style={{color:'#DC2626',textDecoration:'none',fontWeight:800,fontSize:13}}>Back to Products</a>
      </div>
    );
  }

  const sizes = product.sizes || [];
  const totalStock = sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
  const relatedProducts = products.filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);

  const navItems = [
    { label: 'MEN', href: '/products?gender=men' },
    { label: 'WOMEN', href: '/products?gender=women' },
    { label: 'KIDS', href: '/products?gender=kids' },
    { label: 'SHOES', href: '/products?category=shoes' },
    { label: 'CLOTHING', href: '/products?category=clothing' },
    { label: 'SALE', href: '/products?sort=discount' },
  ];

  return (
    <>
      <Head>
        <title>{product.brand} {product.name} | OUTLETX</title>
        <meta name="description" content={product.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{background:'#000',color:'#FFF',textAlign:'center',fontFamily:'Inter, sans-serif',fontSize:M?8:9,fontWeight:800,letterSpacing:M?2:4,padding:M?'9px 10px':'10px 14px',textTransform:'uppercase',borderBottom:'1px solid #111'}}>
        Dua Mall, Struga &nbsp; | &nbsp; Original Brands &nbsp; | &nbsp; Outlet Prices 10-70% Off
      </div>

      <header style={{background:'#FFF',position:'sticky',top:0,zIndex:100,borderBottom:scrolled?'1px solid #DDD':'1px solid #EEE',boxShadow:scrolled?'0 18px 45px rgba(0,0,0,0.10)':'0 0 0 rgba(0,0,0,0)',transition:'all 0.25s ease'}}>
        <div style={{maxWidth:1480,margin:'0 auto',padding:M?'0 14px':'0 38px',height:M?58:74,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <a href="/" style={{fontFamily:'Montserrat, sans-serif',fontSize:M?22:28,fontWeight:900,color:'#000',textDecoration:'none',letterSpacing:-1}}>OUTLET<span style={{color:'#DC2626'}}>X</span></a>
          {!M && (
            <nav style={{display:'flex',gap:28,alignItems:'center'}}>
              {navItems.map(i=><a key={i.label} href={i.href} style={{color:i.href.indexOf('discount')>-1?'#DC2626':'#111',textDecoration:'none',fontFamily:'Inter, sans-serif',fontSize:11,fontWeight:800,letterSpacing:2,textTransform:'uppercase',padding:'28px 0',borderBottom:'2px solid transparent',transition:'all 0.22s ease'}} onMouseEnter={e=>{e.currentTarget.style.borderBottom='2px solid #DC2626';e.currentTarget.style.color='#DC2626'}} onMouseLeave={e=>{e.currentTarget.style.borderBottom='2px solid transparent';e.currentTarget.style.color=i.href.indexOf('discount')>-1?'#DC2626':'#111'}}>{i.label}</a>)}
              <div style={{position:'relative',marginLeft:8}} ref={searchRef}>
                <form onSubmit={handleSearch} style={{display:'flex',alignItems:'center',gap:0}}>
                  <input type="text" value={searchQuery} onChange={e=>handleSearchChange(e.target.value)} onFocus={()=>{if(searchResults.length>0)setShowResults(true)}} placeholder="Search..." style={{width:150,padding:'8px 12px',border:'1px solid #DDD',borderRight:'none',fontSize:11,fontFamily:'Inter, sans-serif',outline:'none',background:'#FAFAFA'}} />
                  <button type="submit" style={{background:'#000',color:'#FFF',border:'1px solid #000',padding:'8px 10px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <svg width={13} height={13} fill="none" stroke="#FFF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  </button>
                </form>
                {showResults&&searchResults.length>0&&(
                  <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#FFF',border:'1px solid #DDD',borderTop:'none',zIndex:200,maxHeight:400,overflow:'auto',boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
                    {searchResults.map(p=>(
                      <a key={p.id} href={`/product/${p.id}`} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',textDecoration:'none',color:'#000',borderBottom:'1px solid #F0F0F0',transition:'background 0.2s'}} onMouseEnter={e=>e.currentTarget.style.background='#FAFAFA'} onMouseLeave={e=>e.currentTarget.style.background='#FFF'} onClick={()=>{setShowResults(false);setSearchQuery('')}}>
                        <img src={p.images[0]} alt={p.name} style={{width:36,height:36,objectFit:'contain',background:'#FAFAFA'}} />
                        <div style={{flex:1}}><p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',margin:0}}>{p.name}</p><p style={{fontSize:10,color:'#999',margin:'2px 0 0'}}>{p.brand} — {p.newPrice} MKD</p></div>
                      </a>
                    ))}
                    <a href={`/products?search=${encodeURIComponent(searchQuery.trim())}`} style={{display:'block',textAlign:'center',padding:'10px',background:'#000',color:'#FFF',textDecoration:'none',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase'}} onClick={()=>{setShowResults(false);setSearchQuery('')}}>View All Results</a>
                  </div>
                )}
                {showResults&&searchQuery.length>=2&&searchResults.length===0&&(
                  <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#FFF',border:'1px solid #DDD',borderTop:'none',zIndex:200,padding:'16px',textAlign:'center',color:'#999',fontSize:12,boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>No products found</div>
                )}
              </div>
            </nav>
          )}
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <button onClick={()=>setCartOpen(!cartOpen)} style={{background:'#FFF',border:'1px solid #DDD',cursor:'pointer',position:'relative',padding:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width={18} height={18} fill="none" stroke="#000" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              {cartCount>0&&<span style={{position:'absolute',top:-6,right:-6,background:'#DC2626',color:'#FFF',fontSize:8,fontWeight:900,width:16,height:16,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter, sans-serif'}}>{cartCount}</span>}
            </button>
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:'#000',border:'1px solid #000',cursor:'pointer',padding:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width={18} height={18} fill="none" stroke="#FFF" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen&&<div style={{background:'#0A0A0A',borderTop:'1px solid #222',padding:M?'14px 18px 20px':'18px 38px 26px',boxShadow:'0 25px 55px rgba(0,0,0,0.22)'}}>{[...navItems,{label:'CONTACT',href:'/contact'}].map(i=><a key={i.label} href={i.href} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'15px 0',color:'#FFF',textDecoration:'none',fontSize:13,fontWeight:800,letterSpacing:2,textTransform:'uppercase',borderBottom:'1px solid #1A1A1A',fontFamily:'Inter, sans-serif'}}>{i.label}<span style={{color:'#DC2626'}}>→</span></a>)}</div>}
      </header>

      <section style={{padding:M?'24px 16px':'50px 40px',background:'#FFF'}}>
        <div style={{maxWidth:1600,margin:'0 auto'}}>
          <Breadcrumbs items={[{label:'Products',link:'/products'},{label:product.category,link:`/products?category=${product.category.toLowerCase()}`},{label:product.brand,link:`/products?brand=${product.brand.toLowerCase()}`},{label:product.name,link:null}]} />

          <div style={{display:'grid',gridTemplateColumns:M?'1fr':'1fr 1fr',gap:M?24:60,alignItems:'start'}}>
            <div>
              <div style={{aspectRatio:'1',background:'#FFF',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid #F0F0F0'}}>
                <img src={product.images[selectedImage]} alt={product.name} style={{width:'85%',height:'85%',objectFit:'contain'}} />
              </div>
              {product.images.length>1&&(
                <div style={{display:'flex',gap:8}}>
                  {product.images.map((img,i)=>(
                    <div key={i} onClick={()=>setSelectedImage(i)} style={{width:56,height:56,background:'#FFF',cursor:'pointer',border:i===selectedImage?'2px solid #000':'1px solid #E5E5E5',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#DC2626',marginBottom:6}}>{product.brand}</p>
              <h1 style={{fontFamily:'Montserrat, sans-serif',fontSize:M?24:32,fontWeight:900,letterSpacing:-1,marginBottom:6,textTransform:'uppercase'}}>{product.name}</h1>
              {product.sku&&<p style={{fontSize:11,color:'#999',marginBottom:16}}>{product.sku}</p>}

              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}>
                <span style={{fontSize:M?24:28,fontWeight:900}}>{product.newPrice} MKD</span>
                <span style={{fontSize:14,color:'#999',textDecoration:'line-through'}}>{product.oldPrice} MKD</span>
                <span style={{background:'#DC2626',color:'#FFF',fontSize:11,fontWeight:700,padding:'3px 8px'}}>-{product.discount}%</span>
              </div>
              <p style={{color:'#16A34A',fontWeight:700,fontSize:12,marginBottom:20}}>Save {product.oldPrice - product.newPrice} MKD</p>

              {totalStock===0&&(
                <div style={{background:'#FEF2F2',border:'1px solid #FECACA',padding:'10px 14px',marginBottom:20,color:'#DC2626',fontWeight:600,fontSize:13}}>Out of stock.</div>
              )}

              <div style={{marginBottom:20}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <p style={{fontWeight:700,fontSize:10,letterSpacing:1.5,textTransform:'uppercase',color:'#999',margin:0}}>Available Sizes</p>
                 <button onClick={() => setSizeGuideOpen(true)} style={{
  background: '#000', color: '#FFF', border: 'none',
  fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
  padding: '6px 14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
  borderRadius: 2,
}}>Size Guide</button>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {sizes.map((s,i)=>(
                    <button key={i} onClick={()=>setSelectedSize(s.size)} style={{
                      background:selectedSize===s.size?'#000':'#FFF',
                      color:selectedSize===s.size?'#FFF':(s.stock||0)<=2?'#DC2626':'#000',
                      border:selectedSize===s.size?'1px solid #000':'1px solid #E5E5E5',
                      fontSize:12,fontWeight:600,padding:'7px 14px',cursor:(s.stock||0)>0?'pointer':'not-allowed',
                      opacity:(s.stock||0)>0?1:0.4,fontFamily:'Inter, sans-serif',
                    }}>{s.size}</button>
                  ))}
                </div>
                {selectedSize&&(<p style={{fontSize:11,color:'#999',marginTop:6}}>Stock: {sizes.find(s=>s.size===selectedSize)?.stock||0} available</p>)}
              </div>

              <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:24}}>
                <a href={`/checkout?id=${product.id}&size=${selectedSize}`} style={{
                  background:selectedSize?'#DC2626':'#CCC',color:'#FFF',textDecoration:'none',
                  fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',
                  padding:'14px 28px',display:'inline-block',pointerEvents:selectedSize?'auto':'none',
                }}>Buy Now</a>
                <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background:'transparent',color:'#000',textDecoration:'none',fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',padding:'14px 28px',border:'1px solid #E5E5E5',display:'inline-block'}}>Ask Question</a>
              </div>

              <div style={{background:'#F9F9F9',padding:18}}>
                <p style={{fontWeight:700,fontSize:10,letterSpacing:1.5,textTransform:'uppercase',color:'#999',marginBottom:6}}>Description</p>
                <p style={{fontSize:13,color:'#555',lineHeight:1.7}}>{product.description}</p>
              </div>
              <p style={{fontSize:11,color:'#999',marginTop:10}}>Color: <strong style={{color:'#000'}}>{product.color}</strong></p>
            </div>
          </div>

          {relatedProducts.length>0&&(
            <div style={{marginTop:60}}>
              <h2 style={{fontFamily:'Montserrat, sans-serif',fontSize:M?20:26,fontWeight:900,letterSpacing:-1,textTransform:'uppercase',marginBottom:20}}>You May Also Like</h2>
              <div style={{display:'grid',gridTemplateColumns:M?'repeat(2,1fr)':'repeat(auto-fill,minmax(240px,1fr))',gap:M?10:20}}>
                {relatedProducts.map(p=><ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer style={{background:'#050505',color:'#FFF',borderTop:'1px solid #111',padding:M?'50px 14px 28px':'78px 36px 34px'}}>
        <div style={{maxWidth:1480,margin:'0 auto',display:'grid',gridTemplateColumns:M?'repeat(2,1fr)':'2.2fr 1fr 1fr 1fr',gap:M?28:48,marginBottom:M?34:52}}>
          <div style={M?{gridColumn:'span 2'}:{}}><h3 style={{fontFamily:'Montserrat, sans-serif',fontSize:M?27:34,fontWeight:900,margin:'0 0 14px',letterSpacing:-2}}>OUTLET<span style={{color:'#DC2626'}}>X</span></h3><p style={{color:'#999',fontSize:13,lineHeight:1.9,margin:'0 0 22px',maxWidth:420,fontFamily:'Inter, sans-serif'}}>Luxury outlet feel. Branded sportswear prices. Dua Mall, Struga.</p></div>
          <div><p style={{fontSize:9,fontWeight:900,letterSpacing:3,textTransform:'uppercase',margin:'0 0 16px',color:'#DC2626',fontFamily:'Inter, sans-serif'}}>Shop</p>{[{label:'Men',link:'/products?gender=men'},{label:'Women',link:'/products?gender=women'},{label:'Kids',link:'/products?gender=kids'},{label:'Shoes',link:'/products?category=shoes'},{label:'Clothing',link:'/products?category=clothing'},{label:'Sale',link:'/products?sort=discount'}].map(i=><a key={i.label} href={i.link} style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'5px 0',fontFamily:'Inter, sans-serif',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.color='#FFF'}} onMouseLeave={e=>{e.currentTarget.style.color='#888'}}>{i.label}</a>)}</div>
          <div><p style={{fontSize:9,fontWeight:900,letterSpacing:3,textTransform:'uppercase',margin:'0 0 16px',color:'#FFF',fontFamily:'Inter, sans-serif'}}>Brands</p>{['Nike','Adidas','Puma','Jordan','Kappa','Skechers'].map(b=><a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'5px 0',fontFamily:'Inter, sans-serif',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.color='#FFF'}} onMouseLeave={e=>{e.currentTarget.style.color='#888'}}>{b}</a>)}</div>
          <div><p style={{fontSize:9,fontWeight:900,letterSpacing:3,textTransform:'uppercase',margin:'0 0 16px',color:'#FFF',fontFamily:'Inter, sans-serif'}}>Info</p><a href="/about" style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'5px 0',fontFamily:'Inter, sans-serif',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.color='#FFF'}} onMouseLeave={e=>{e.currentTarget.style.color='#888'}}>About</a><a href="/contact" style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'5px 0',fontFamily:'Inter, sans-serif',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.color='#FFF'}} onMouseLeave={e=>{e.currentTarget.style.color='#888'}}>Contact</a><a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'5px 0',fontFamily:'Inter, sans-serif',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.color='#FFF'}} onMouseLeave={e=>{e.currentTarget.style.color='#888'}}>Instagram</a></div>
        </div>
        <div style={{maxWidth:1480,margin:'0 auto',borderTop:'1px solid #151515',paddingTop:24,display:'flex',justifyContent:'space-between',alignItems:M?'flex-start':'center',flexDirection:M?'column':'row',gap:12,color:'#555',fontSize:10,fontFamily:'Inter, sans-serif',letterSpacing:1}}><span>&copy; 2024 OUTLETX. All rights reserved.</span><span>Dua Mall, Struga · Premium Outlet Store</span></div>
      </footer>	
<SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}