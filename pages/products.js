import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import products from '../data/products';

export default function ProductsPage() {
  const router = useRouter();
  const { gender, brand, category, age, search: urlSearch } = router.query;
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState(urlSearch || '');
  const [sortBy, setSortBy] = useState('discount');
  const [isMobile, setIsMobile] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    if (urlSearch) setSearch(urlSearch);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [urlSearch]);

  const M = isMobile;
  const allBrands = [...new Set(products.map(p => p.brand))].sort();
  const allCategories = [...new Set(products.map(p => p.category))].sort();

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (gender) result = result.filter(p => p.gender && p.gender.toLowerCase() === gender.toLowerCase());
if (brand) result = result.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
if (category) result = result.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    if (age) result = result.filter(p => p.ageGroup === age);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'discount') result.sort((a, b) => b.discount - a.discount);
    if (sortBy === 'price-low') result.sort((a, b) => a.newPrice - b.newPrice);
    if (sortBy === 'price-high') result.sort((a, b) => b.newPrice - a.newPrice);
    if (sortBy === 'newest') result.reverse();
    return result;
  }, [gender, brand, category, age, search, sortBy]);

  const pageTitle = () => {
    const parts = [];
    if (brand) parts.push(brand);
    if (category) parts.push(category);
    if (gender) parts.push(gender);
    if (parts.length === 0) parts.push('All Products');
    return parts.join(' ') + ' | OUTLETX';
  };

  const clearFilters = () => router.push('/products');
  const hasActiveFilters = gender || brand || category || age;

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
        <title>{pageTitle()}</title>
        <meta name="description" content={`Browse ${filteredProducts.length} products at OUTLETX. Branded sportswear at outlet prices.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{background:'#000',color:'#FFF',textAlign:'center',fontFamily:'Inter, sans-serif',fontSize:M?8:9,fontWeight:800,letterSpacing:M?2:4,padding:M?'9px 10px':'10px 14px',textTransform:'uppercase',borderBottom:'1px solid #111'}}>
        Dua Mall, Struga &nbsp; | &nbsp; Original Brands &nbsp; | &nbsp; Outlet Prices 10-70% Off
      </div>

      <header style={{background:'#FFF',position:'sticky',top:0,zIndex:100,borderBottom:scrolled?'1px solid #DDD':'1px solid #EEE',boxShadow:scrolled?'0 18px 45px rgba(0,0,0,0.10)':'0 0 0 rgba(0,0,0,0)',transition:'all 0.25s ease'}}>
        <div style={{maxWidth:1480,margin:'0 auto',padding:M?'0 14px':'0 38px',height:M?58:74,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <a href="/" style={{fontFamily:'Montserrat, sans-serif',fontSize:M?22:28,fontWeight:900,color:'#000',textDecoration:'none',letterSpacing:-1}}>OUTLET<span style={{color:'#DC2626'}}>X</span></a>
          {!M && <nav style={{display:'flex',gap:36,alignItems:'center'}}>{navItems.map(i=><a key={i.label} href={i.href} style={{color:i.href.indexOf('discount')>-1?'#DC2626':'#111',textDecoration:'none',fontFamily:'Inter, sans-serif',fontSize:11,fontWeight:800,letterSpacing:2,textTransform:'uppercase',padding:'28px 0',borderBottom:'2px solid transparent',transition:'all 0.22s ease'}} onMouseEnter={e=>{e.currentTarget.style.borderBottom='2px solid #DC2626';e.currentTarget.style.color='#DC2626'}} onMouseLeave={e=>{e.currentTarget.style.borderBottom='2px solid transparent';e.currentTarget.style.color=i.href.indexOf('discount')>-1?'#DC2626':'#111'}}>{i.label}</a>)}</nav>}
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

      <section style={{padding:M?'24px 14px':'36px 38px',background:'#FFF',minHeight:'60vh'}}>
        <div style={{maxWidth:1480,margin:'0 auto'}}>
          <Breadcrumbs items={[{label:'Products',link:'/products'},...(gender?[{label:gender,link:`/products?gender=${gender}`}]:[]),...(category?[{label:category,link:`/products?category=${category}`}]:[]),...(brand?[{label:brand,link:`/products?brand=${brand}`}]:[])]} />

          <div style={{marginBottom:20}}>
            <h1 style={{fontFamily:'Montserrat, sans-serif',fontSize:M?24:36,fontWeight:900,letterSpacing:-2,textTransform:'uppercase',marginBottom:6}}>{pageTitle()}</h1>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
              <p style={{color:'#777',fontSize:13,fontFamily:'Inter, sans-serif'}}>{filteredProducts.length} products</p>
              {hasActiveFilters&&<button onClick={clearFilters} style={{background:'transparent',color:'#DC2626',border:'1px solid #DC2626',fontSize:10,fontWeight:800,letterSpacing:2,textTransform:'uppercase',padding:'6px 14px',cursor:'pointer',fontFamily:'Inter, sans-serif'}}>Clear Filters</button>}
            </div>
          </div>

          <div style={{display:'flex',gap:M?8:14,marginBottom:20,flexWrap:'wrap'}}>
            <input type="text" placeholder="Search products, brands, SKU..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:M?140:240,padding:M?10:13,border:'1px solid #DDD',background:'#FFF',fontSize:13,fontFamily:'Inter, sans-serif',outline:'none',boxSizing:'border-box'}} />
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:M?10:13,border:'1px solid #DDD',background:'#FFF',fontSize:13,fontFamily:'Inter, sans-serif',cursor:'pointer',outline:'none',minWidth:M?140:180}}>
              <option value="discount">Biggest Discount</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="newest">Newest First</option>
            </select>
            {M&&<button onClick={()=>setFilterOpen(!filterOpen)} style={{background:'#000',color:'#FFF',border:'none',fontSize:11,fontWeight:800,letterSpacing:2,textTransform:'uppercase',padding:'10px 16px',cursor:'pointer',fontFamily:'Inter, sans-serif'}}>Filters {hasActiveFilters?'(ON)':''}</button>}
          </div>

          <div style={{display:'grid',gridTemplateColumns:M?'1fr':'240px 1fr',gap:M?16:28,alignItems:'start'}}>
            {(filterOpen||!M)&&(
              <div style={{background:'#FAFAFA',padding:22,border:'1px solid #EEE'}}>
                <h3 style={{fontWeight:900,fontSize:11,letterSpacing:2,textTransform:'uppercase',marginBottom:22,fontFamily:'Inter, sans-serif'}}>Filters</h3>
                <div style={{marginBottom:22}}><h4 style={{fontWeight:900,fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'#999',marginBottom:12,fontFamily:'Inter, sans-serif'}}>Gender</h4><div style={{display:'flex',flexDirection:'column',gap:8}}><FilterLink href="/products" active={!gender} label="All" />{['Men','Women','Kids','Unisex'].map(g=><FilterLink key={g} href={`/products?gender=${g.toLowerCase()}`} active={gender===g.toLowerCase()} label={g} />)}</div></div>
                <div style={{marginBottom:22}}><h4 style={{fontWeight:900,fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'#999',marginBottom:12,fontFamily:'Inter, sans-serif'}}>Category</h4><div style={{display:'flex',flexDirection:'column',gap:8}}><FilterLink href={gender?`/products?gender=${gender}`:'/products'} active={!category} label="All" />{allCategories.map(c=><FilterLink key={c} href={`/products?category=${c.toLowerCase()}${gender?'&gender='+gender:''}`} active={category===c.toLowerCase()} label={c} />)}</div></div>
                <div><h4 style={{fontWeight:900,fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'#999',marginBottom:12,fontFamily:'Inter, sans-serif'}}>Brand</h4><div style={{display:'flex',flexDirection:'column',gap:8}}><FilterLink href={gender?`/products?gender=${gender}`:'/products'} active={!brand} label="All" />{allBrands.map(b=><FilterLink key={b} href={`/products?brand=${b.toLowerCase()}${gender?'&gender='+gender:''}`} active={brand===b.toLowerCase()} label={b} />)}</div></div>
              </div>
            )}
            <div>
              {filteredProducts.length>0?(
                <div style={{display:'grid',gridTemplateColumns:M?'repeat(2,1fr)':'repeat(auto-fill,minmax(250px,1fr))',gap:M?10:18}}>
                  {filteredProducts.map(p=><ProductCard key={p.id} product={p} />)}
                </div>
              ):(
                <div style={{textAlign:'center',padding:'80px 20px',background:'#FAFAFA',border:'1px solid #EEE'}}>
                  <h3 style={{fontFamily:'Montserrat, sans-serif',fontSize:20,fontWeight:900,letterSpacing:-1,marginBottom:8}}>No Products Found</h3>
                  <p style={{color:'#777',fontSize:13,marginBottom:20,fontFamily:'Inter, sans-serif'}}>Try adjusting filters or search terms.</p>
                  <button onClick={clearFilters} style={{background:'#000',color:'#FFF',border:'none',fontSize:11,fontWeight:800,letterSpacing:2,textTransform:'uppercase',padding:'12px 28px',cursor:'pointer',fontFamily:'Inter, sans-serif'}}>Clear All Filters</button>
                </div>
              )}
            </div>
          </div>
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
    </>
  );
}

function FilterLink({ href, active, label }) {
  return <a href={href} style={{color:active?'#DC2626':'#555',textDecoration:'none',fontSize:12,fontWeight:active?800:500,fontFamily:'Inter, sans-serif',padding:'8px 10px',border:active?'1px solid #F3B8B8':'1px solid transparent',background:active?'#FFF5F5':'transparent',transition:'all 0.2s ease'}} onMouseEnter={e=>{e.currentTarget.style.color='#DC2626'}} onMouseLeave={e=>{e.currentTarget.style.color=active?'#DC2626':'#555'}}>{label}</a>;
}