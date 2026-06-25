import { useState, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

export default function ProductsPage() {
  const router = useRouter();
  const { gender, brand, category, age } = router.query;
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allBrands = [...new Set(products.map(p => p.brand))].sort();
  const allCategories = [...new Set(products.map(p => p.category))].sort();
  const allGenders = ['Men', 'Women', 'Kids', 'Unisex'];
  const priceRanges = [
    { label: 'All Prices', min: 0, max: 99999 },
    { label: 'Under 1000 MKD', min: 0, max: 1000 },
    { label: '1000 - 2000 MKD', min: 1000, max: 2000 },
    { label: '2000 - 4000 MKD', min: 2000, max: 4000 },
    { label: 'Over 4000 MKD', min: 4000, max: 99999 },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (gender) result = result.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
    if (brand) result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    if (category) result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (age) result = result.filter(p => p.ageGroup === age);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
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
    if (age) parts.push('Ages ' + age);
    if (parts.length === 0) parts.push('All Products');
    return parts.join(' ') + ' | OUTLETX';
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const hasActiveFilters = gender || brand || category || age;

  return (
    <>
      <Head>
        <title>{pageTitle()}</title>
        <meta name="description" content={`Browse ${filteredProducts.length} products at OUTLETX. Branded sportswear at outlet prices.`} />
      </Head>

      {/* ========== HEADER ========== */}
      <header style={{background: '#FFFFFF', borderBottom: '1px solid #E5E5E5', position: 'sticky', top: 0, zIndex: 100}}>
        <div style={{background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', padding: '8px 20px', textTransform: 'uppercase'}}>
          Dua Mall, Struga &mdash; Open Every Day &mdash; Free Delivery Over 3000 MKD
        </div>
        <div style={{maxWidth: '1400px', margin: '0 auto', padding: '0 40px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '900', color: '#000000', textDecoration: 'none', letterSpacing: '-0.5px'}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span>
          </a>
          <nav style={{display: 'flex', gap: '36px', alignItems: 'center'}}>
            {['Men', 'Women', 'Kids', 'Brands', 'Sale'].map((item) => (
              <a key={item} href={item === 'Sale' ? '/products?sort=discount' : item === 'Brands' ? '/products' : `/products?gender=${item.toLowerCase()}`} style={{color: item === 'Brands' && !gender && !category ? '#DC2626' : '#000000', textDecoration: 'none', fontSize: '14px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase'}}>{item}</a>
            ))}
          </nav>
          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 20px'}}>Message Us</a>
            <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              <svg width="24" height="24" fill="none" stroke="#000000" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{background: '#FFFFFF', borderTop: '1px solid #E5E5E5', padding: '16px 40px'}}>
            {['Men', 'Women', 'Kids', 'Brands', 'Sale'].map((item) => (
              <a key={item} href="/products" style={{display: 'block', padding: '12px 0', color: '#000000', textDecoration: 'none', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid #F0F0F0'}}>{item}</a>
            ))}
          </div>
        )}
      </header>

      {/* ========== MAIN ========== */}
      <section style={{padding: '40px', background: '#F5F5F5', minHeight: '60vh'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto'}}>
          {/* Page Header */}
          <div style={{marginBottom: '24px'}}>
            <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '4px'}}>{pageTitle()}</h1>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'}}>
              <p style={{color: '#777777', fontSize: '14px'}}>{filteredProducts.length} products found</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} style={{
                  background: 'transparent', color: '#DC2626', border: '1px solid #DC2626',
                  fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                  padding: '6px 14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Search and Sort Bar */}
          <div style={{display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center'}}>
            <input type="text" placeholder="Search products, brands, SKU..." value={search} onChange={(e) => setSearch(e.target.value)} 
              style={{flex: '1', minWidth: '220px', padding: '13px 16px', border: '1px solid #E5E5E5', background: '#FFFFFF', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none'}} />
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} 
              style={{padding: '13px 16px', border: '1px solid #E5E5E5', background: '#FFFFFF', fontSize: '14px', fontFamily: 'Inter, sans-serif', cursor: 'pointer', outline: 'none', minWidth: '180px'}}>
              <option value="discount">Sort: Biggest Discount</option>
              <option value="price-low">Sort: Price Low to High</option>
              <option value="price-high">Sort: Price High to Low</option>
              <option value="newest">Sort: Newest First</option>
            </select>

            <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} style={{
              background: '#000000', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700',
              letterSpacing: '1px', textTransform: 'uppercase', padding: '13px 20px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', display: 'none',
            }}>
              Filters {hasActiveFilters ? '(Active)' : ''}
            </button>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px', alignItems: 'start'}}>
            {/* Sidebar Filters */}
            <div style={{background: '#FFFFFF', padding: '24px'}}>
              <h3 style={{fontWeight: '700', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px'}}>Filters</h3>
              
              {/* Gender Filter */}
              <div style={{marginBottom: '24px'}}>
                <h4 style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999999', marginBottom: '12px'}}>Gender</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <FilterLink href="/products" active={!gender} label="All" />
                  {allGenders.map(g => (
                    <FilterLink key={g} href={`/products?gender=${g.toLowerCase()}`} active={gender === g.toLowerCase()} label={g} />
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div style={{marginBottom: '24px'}}>
                <h4 style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999999', marginBottom: '12px'}}>Category</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <FilterLink href={gender ? `/products?gender=${gender}` : '/products'} active={!category} label="All Categories" />
                  {allCategories.map(c => (
                    <FilterLink key={c} href={`/products?category=${c.toLowerCase()}${gender ? '&gender=' + gender : ''}`} active={category === c.toLowerCase()} label={c} />
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div style={{marginBottom: '24px'}}>
                <h4 style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999999', marginBottom: '12px'}}>Brand</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <FilterLink href={gender ? `/products?gender=${gender}` : category ? `/products?category=${category}` : '/products'} active={!brand} label="All Brands" />
                  {allBrands.map(b => (
                    <FilterLink key={b} href={`/products?brand=${b.toLowerCase()}${gender ? '&gender=' + gender : ''}${category ? '&category=' + category : ''}`} active={brand === b.toLowerCase()} label={b} />
                  ))}
                </div>
              </div>

              {/* Age Filter (only for Kids) */}
              {gender === 'kids' && (
                <div style={{marginBottom: '24px'}}>
                  <h4 style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999999', marginBottom: '12px'}}>Age Group</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <FilterLink href="/products?gender=kids" active={!age} label="All Ages" />
                    <FilterLink href="/products?gender=kids&age=0-3" active={age === '0-3'} label="Babies/Toddlers (0-3)" />
                    <FilterLink href="/products?gender=kids&age=4-8" active={age === '4-8'} label="Young Kids (4-8)" />
                    <FilterLink href="/products?gender=kids&age=9-14" active={age === '9-14'} label="Juniors (9-14)" />
                  </div>
                </div>
              )}

              {/* In Stock Only */}
              <div>
                <h4 style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999999', marginBottom: '12px'}}>Availability</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <span style={{fontSize: '13px', color: '#16A34A', fontWeight: '600'}}>
                    {products.filter(p => p.inStock).length} products in stock
                  </span>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div>
              {filteredProducts.length > 0 ? (
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '80px 20px', background: '#FFFFFF'}}>
                  <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '8px', textTransform: 'uppercase'}}>No Products Found</h3>
                  <p style={{color: '#777777', fontSize: '14px', marginBottom: '20px'}}>Try adjusting your filters or search terms.</p>
                  <button onClick={clearFilters} style={{
                    background: '#000000', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700',
                    letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px 28px', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}>Clear All Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{background: '#000000', color: '#FFFFFF', padding: '50px 40px 30px'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '40px'}}>
          <div>
            <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '900', marginBottom: '12px', letterSpacing: '-0.5px'}}>OUTLET<span style={{color: '#DC2626'}}>X</span></h3>
            <p style={{color: '#777777', fontSize: '13px', lineHeight: '1.7'}}>Branded sportswear at outlet prices. Dua Mall, Struga, North Macedonia.</p>
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase'}}>Shop</p>
            {['Men', 'Women', 'Kids', 'Shoes', 'Clothing', 'Accessories'].map((item) => (
              <a key={item} href="/products" style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '3px 0'}}>{item}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase'}}>Brands</p>
            {['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa', 'Skechers'].map((b) => (
              <a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '3px 0'}}>{b}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase'}}>Info</p>
            <a href="/about" style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '3px 0'}}>About</a>
            <a href="/contact" style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '3px 0'}}>Contact</a>
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '3px 0'}}>Instagram</a>
          </div>
        </div>
        <div style={{borderTop: '1px solid #222222', paddingTop: '24px', textAlign: 'center', color: '#555555', fontSize: '12px'}}>
          &copy; 2024 OUTLETX. All rights reserved. Dua Mall, Struga, North Macedonia.
        </div>
      </footer>
    </>
  );
}

function FilterLink({ href, active, label }) {
  return (
    <a href={href} style={{
      color: active ? '#DC2626' : '#555555',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: active ? '700' : '400',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}>
      {active && <span style={{fontSize: '10px'}}>&#9632;</span>}
      {label}
    </a>
  );
}
