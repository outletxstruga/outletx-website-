import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import products from '../data/products';

export default function ProductsPage() {
  const router = useRouter();
  const { gender, brand, category, age } = router.query;
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [isMobile, setIsMobile] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allBrands = [...new Set(products.map(p => p.brand))].sort();
  const allCategories = [...new Set(products.map(p => p.category))].sort();

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (gender) result = result.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
    if (brand) result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    if (category) result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (age) result = result.filter(p => p.ageGroup === age);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)));
    }
    if (sortBy === 'discount') result.sort((a, b) => b.discount - a.discount);
    if (sortBy === 'price-low') result.sort((a, b) => a.newPrice - b.newPrice);
    if (sortBy === 'price-high') result.sort((a, b) => b.newPrice - a.newPrice);
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

  const inputStyle = { width: '100%', padding: isMobile ? 10 : 13, border: '1px solid #E5E5E5', background: '#FFFFFF', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const selectStyle = { padding: isMobile ? 10 : 13, border: '1px solid #E5E5E5', background: '#FFFFFF', fontSize: 13, fontFamily: 'Inter, sans-serif', cursor: 'pointer', outline: 'none', minWidth: isMobile ? 140 : 180 };

  return (
    <>
      <Head>
        <title>{pageTitle()}</title>
        <meta name="description" content={`Browse ${filteredProducts.length} products at OUTLETX. Branded sportswear at outlet prices.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <header style={{background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #F0F0F0'}}>
        <div style={{background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: isMobile ? 9 : 10, fontWeight: 700, letterSpacing: 2, padding: '10px 16px', textTransform: 'uppercase'}}>
          {isMobile ? 'FREE DELIVERY OVER 3000 MKD' : 'Dua Mall, Struga \u00a0\u2022\u00a0 Free Delivery Over 3000 MKD'}
        </div>
        <div style={{maxWidth: 1600, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px', height: isMobile ? 60 : 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#000000', textDecoration: 'none', letterSpacing: -1.5}}>OUTLET<span style={{color: '#DC2626'}}>X</span></a>
          {!isMobile && (
            <nav style={{display: 'flex', gap: 48}}>
              <a href="/" style={{color: '#000000', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase'}}>Home</a>
              <a href="/products" style={{color: '#DC2626', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase'}}>Products</a>
              <a href="/about" style={{color: '#000000', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase'}}>About</a>
              <a href="/contact" style={{color: '#000000', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase'}}>Contact</a>
            </nav>
          )}
          <div style={{display: 'flex', gap: isMobile ? 8 : 16, alignItems: 'center'}}>
            <button onClick={() => setCartOpen(!cartOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 8}}>
              <svg width={isMobile ? 20 : 22} height={isMobile ? 20 : 22} fill="none" stroke="#000000" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              {cartCount > 0 && <span style={{position: 'absolute', top: -2, right: -4, background: '#DC2626', color: '#FFFFFF', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cartCount}</span>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 8}}>
              <svg width={isMobile ? 20 : 22} height={isMobile ? 20 : 22} fill="none" stroke="#000000" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{background: '#FFFFFF', borderTop: '1px solid #F0F0F0', padding: isMobile ? '8px 16px' : '12px 40px'}}>
            <a href="/" style={{display: 'block', padding: '14px 0', color: '#000000', textDecoration: 'none', fontSize: 15, fontWeight: 600, borderBottom: '1px solid #F5F5F5'}}>Home</a>
            <a href="/products" style={{display: 'block', padding: '14px 0', color: '#DC2626', textDecoration: 'none', fontSize: 15, fontWeight: 600, borderBottom: '1px solid #F5F5F5'}}>Products</a>
            <a href="/about" style={{display: 'block', padding: '14px 0', color: '#000000', textDecoration: 'none', fontSize: 15, fontWeight: 600, borderBottom: '1px solid #F5F5F5'}}>About</a>
            <a href="/contact" style={{display: 'block', padding: '14px 0', color: '#000000', textDecoration: 'none', fontSize: 15, fontWeight: 600, borderBottom: '1px solid #F5F5F5'}}>Contact</a>
          </div>
        )}
      </header>

      <section style={{padding: isMobile ? '20px 16px' : '30px 40px', background: '#F9F9F9', minHeight: '60vh'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: 20}}>
            <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? 22 : 32, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase', marginBottom: 4}}>{pageTitle()}</h1>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8}}>
              <p style={{color: '#777', fontSize: 13}}>{filteredProducts.length} products</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{background: 'transparent', color: '#DC2626', border: '1px solid #DC2626', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'}}>Clear Filters</button>
              )}
            </div>
          </div>

          <div style={{display: 'flex', gap: isMobile ? 8 : 12, marginBottom: 16, flexWrap: 'wrap'}}>
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{...inputStyle, flex: 1, minWidth: isMobile ? 140 : 220}} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
              <option value="discount">Biggest Discount</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
            </select>
            {isMobile && (
              <button onClick={() => setFilterOpen(!filterOpen)} style={{background: '#000000', color: '#FFFFFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'}}>
                Filters {hasActiveFilters ? '(ON)' : ''}
              </button>
            )}
          </div>

          <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: isMobile ? 16 : 24, alignItems: 'start'}}>
            {(filterOpen || !isMobile) && (
              <div style={{background: '#FFFFFF', padding: 20}}>
                <h3 style={{fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20}}>Filters</h3>
                <div style={{marginBottom: 20}}>
                  <h4 style={{fontWeight: 700, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#999', marginBottom: 10}}>Gender</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                    <FilterLink href="/products" active={!gender} label="All" />
                    {['Men', 'Women', 'Kids', 'Unisex'].map(g => <FilterLink key={g} href={`/products?gender=${g.toLowerCase()}`} active={gender === g.toLowerCase()} label={g} />)}
                  </div>
                </div>
                <div style={{marginBottom: 20}}>
                  <h4 style={{fontWeight: 700, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#999', marginBottom: 10}}>Category</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                    <FilterLink href={gender ? `/products?gender=${gender}` : '/products'} active={!category} label="All" />
                    {allCategories.map(c => <FilterLink key={c} href={`/products?category=${c.toLowerCase()}${gender ? '&gender=' + gender : ''}`} active={category === c.toLowerCase()} label={c} />)}
                  </div>
                </div>
                <div>
                  <h4 style={{fontWeight: 700, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#999', marginBottom: 10}}>Brand</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                    <FilterLink href={gender ? `/products?gender=${gender}` : '/products'} active={!brand} label="All" />
                    {allBrands.map(b => <FilterLink key={b} href={`/products?brand=${b.toLowerCase()}${gender ? '&gender=' + gender : ''}`} active={brand === b.toLowerCase()} label={b} />)}
                  </div>
                </div>
              </div>
            )}
            <div>
              {filteredProducts.length > 0 ? (
                <div style={{display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))', gap: isMobile ? 10 : 20}}>
                  {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '60px 20px', background: '#FFFFFF'}}>
                  <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, marginBottom: 8}}>No Products Found</h3>
                  <p style={{color: '#777', fontSize: 13, marginBottom: 16}}>Try adjusting filters.</p>
                  <button onClick={clearFilters} style={{background: '#000', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 24px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'}}>Clear All Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={{background: '#0A0A0A', color: '#FFFFFF', padding: isMobile ? '40px 16px 20px' : '60px 40px 24px'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 40, marginBottom: isMobile ? 28 : 40}}>
          <div style={isMobile ? {gridColumn: 'span 2'} : {}}>
            <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 900, marginBottom: 10}}>OUTLET<span style={{color: '#DC2626'}}>X</span></h3>
            <p style={{color: '#666', fontSize: 12, lineHeight: 1.7}}>Branded sportswear at outlet prices. Dua Mall, Struga.</p>
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>Shop</p>
            {['Men', 'Women', 'Kids', 'Shoes', 'Clothing'].map(i => <a key={i} href="/products" style={{display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>{i}</a>)}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>Brands</p>
            {['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa'].map(b => <a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>{b}</a>)}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>Info</p>
            <a href="/about" style={{display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>About</a>
            <a href="/contact" style={{display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>Contact</a>
          </div>
        </div>
        <div style={{borderTop: '1px solid #1A1A1A', paddingTop: 16, textAlign: 'center', color: '#555', fontSize: 10}}>
          &copy; 2024 OUTLETX. All rights reserved. Dua Mall, Struga, North Macedonia.
        </div>
      </footer>
    </>
  );
}

function FilterLink({ href, active, label }) {
  return (
    <a href={href} style={{color: active ? '#DC2626' : '#555', textDecoration: 'none', fontSize: 12, fontWeight: active ? 700 : 400}}>{label}</a>
  );
}