import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import RecentlyViewedHome from '../components/RecentlyViewedHome';
import { useLanguage } from '../context/LanguageContext';
import products from '../data/products';

const CONTACT_PHONE = '+389 70 123 456';
const INSTAGRAM_URL = 'https://instagram.com/outletxstruga';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { lang, toggleLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClick);
    setMounted(true);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
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

  const bestSellers = products.filter(p => p.featured && p.inStock).slice(0, 8);
  const saleProducts = products.filter(p => p.discount >= 40 && p.inStock).sort((a, b) => b.discount - a.discount).slice(0, 8);
  const newArrivals = products.filter(p => p.inStock).slice(-8).reverse();

  const M = isMobile;
  const P = M ? '56px 14px' : '96px 36px';
  const T = M ? 25 : 38;

  const navItems = [
    { label: t?.nav?.men || 'MEN', href: '/products?gender=men' },
    { label: t?.nav?.women || 'WOMEN', href: '/products?gender=women' },
    { label: t?.nav?.kids || 'KIDS', href: '/products?gender=kids' },
    { label: 'SHOES', href: '/products?category=shoes' },
    { label: 'CLOTHING', href: '/products?category=clothing' },
    { label: t?.nav?.sale || 'SALE', href: '/products?sort=discount' },
  ];

  const categories = [
    { label: 'SHOES', href: '/products?category=shoes' },
    { label: 'CLOTHING', href: '/products?category=clothing' },
    { label: 'ACCESSORIES', href: '/products?category=accessories' },
    { label: 'MEN', href: '/products?gender=men' },
    { label: 'WOMEN', href: '/products?gender=women' },
    { label: 'KIDS', href: '/products?gender=kids' },
  ];

  const brandList = [
    { name: 'NIKE', logo: '/images/logos/png-clipart-nike-logo-swoosh-angle-font-nike-white-rectangle-removebg-preview.png' },
    { name: 'ADIDAS', logo: '/images/logos/R__1_-removebg-preview.png' },
    { name: 'PUMA', logo: '/images/logos/79498-middle-removebg-preview.png' },
    { name: 'JORDAN', logo: '/images/logos/JMXYPn-removebg-preview.png' },
    { name: 'KAPPA', logo: '/images/logos/Kappa-Symbol-removebg-preview.png' },
    { name: 'SKECHERS', logo: '/images/logos/Skechers-Logo-500x281-removebg-preview.png' },
    { name: '4F', logo: '/images/logos/90da3709-7019-49ba-8835-08b806ccfe8d-removebg-preview.png' },
  ];

  const sectionHeader = (eyebrow, title, dark) => (
    <div style={{ margin: M ? '0 0 28px' : '0 0 44px' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', color: dark ? '#888' : '#DC2626', margin: '0 0 10px' }}>{eyebrow}</p>
      <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: T, fontWeight: 900, lineHeight: 0.95, letterSpacing: M ? -1 : -2, textTransform: 'uppercase', color: dark ? '#FFF' : '#000', margin: '0' }}>{title}</h2>
    </div>
  );

  const premiumButton = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#FFF', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', padding: M ? '13px 28px' : '15px 38px', border: '1px solid #000', transition: 'all 0.25s ease' };
  const langLabel = lang === 'mk' ? 'MK' : lang === 'sq' ? 'SQ' : 'EN';

  return (
    <>
      <Head>
        <title>OUTLETX | Branded Sportswear. Outlet Prices. | Dua Mall Struga</title>
        <meta name="description" content={t?.hero?.desc || 'OUTLETX Struga - premium branded sportswear at outlet prices.'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{ background: '#000', color: '#FFF', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: M ? 8 : 9, fontWeight: 800, letterSpacing: M ? 2 : 4, padding: M ? '9px 10px' : '10px 14px', textTransform: 'uppercase', borderBottom: '1px solid #111' }}>
        Dua Mall, Struga &nbsp; | &nbsp; Original Brands &nbsp; | &nbsp; Outlet Prices 10-70% Off
      </div>

      <header style={{ background: scrolled ? '#FFF' : 'rgba(255,255,255,0.96)', position: 'sticky', top: 0, zIndex: 100, borderBottom: scrolled ? '1px solid #DDD' : '1px solid #EEE', boxShadow: scrolled ? '0 18px 45px rgba(0,0,0,0.10)' : '0 0 0 rgba(0,0,0,0)', transition: 'all 0.25s ease' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto', padding: M ? '0 14px' : '0 38px', height: M ? 58 : 74, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: M ? 22 : 28, fontWeight: 900, color: '#000', textDecoration: 'none', letterSpacing: -1 }}>OUTLET<span style={{ color: '#DC2626' }}>X</span></a>
          {!M && (
            <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {navItems.map(i => (
                <a key={i.label} href={i.href} style={{ color: i.href.indexOf('discount') > -1 ? '#DC2626' : '#111', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', padding: '28px 0', borderBottom: '2px solid transparent', transition: 'all 0.22s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderBottom = '2px solid #DC2626'; e.currentTarget.style.color = '#DC2626'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderBottom = '2px solid transparent'; e.currentTarget.style.color = i.href.indexOf('discount') > -1 ? '#DC2626' : '#111'; }}>{i.label}</a>
              ))}
              <div style={{ position: 'relative', marginLeft: 8 }} ref={searchRef}>
                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <input type="text" value={searchQuery} onChange={e => handleSearchChange(e.target.value)} onFocus={() => { if (searchResults.length > 0) setShowResults(true); }} placeholder="Search..." style={{ width: 170, padding: '8px 12px', border: '1px solid #DDD', borderRight: 'none', fontSize: 11, fontFamily: 'Inter, sans-serif', outline: 'none', background: '#FAFAFA' }} />
                  <button type="submit" style={{ background: '#000', color: '#FFF', border: '1px solid #000', padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={13} height={13} fill="none" stroke="#FFF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  </button>
                </form>
                {showResults && searchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFF', border: '1px solid #DDD', borderTop: 'none', zIndex: 200, maxHeight: 400, overflow: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    {searchResults.map(p => (
                      <a key={p.id} href={`/product/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', textDecoration: 'none', color: '#000', borderBottom: '1px solid #F0F0F0', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'} onMouseLeave={e => e.currentTarget.style.background = '#FFF'} onClick={() => { setShowResults(false); setSearchQuery(''); }}>
                        <img src={p.images[0]} alt={p.name} style={{width: 36, height: 36, objectFit: 'contain', background: '#FAFAFA'}} />
                        <div style={{flex: 1}}><p style={{fontSize: 11, fontWeight: 700, textTransform: 'uppercase', margin: 0}}>{p.name}</p><p style={{fontSize: 10, color: '#999', margin: '2px 0 0'}}>{p.brand} — {p.newPrice} MKD</p></div>
                      </a>
                    ))}
                    <a href={`/products?search=${encodeURIComponent(searchQuery.trim())}`} style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#000', color: '#FFF', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }} onClick={() => { setShowResults(false); setSearchQuery(''); }}>View All Results</a>
                  </div>
                )}
                {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFF', border: '1px solid #DDD', borderTop: 'none', zIndex: 200, padding: '16px', textAlign: 'center', color: '#999', fontSize: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>No products found</div>
                )}
              </div>
            </nav>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {M && (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." style={{ width: 100, padding: '6px 10px', border: '1px solid #DDD', fontSize: 10, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
              </form>
            )}
            <button onClick={toggleLang} style={{ background: '#FFF', border: '1px solid #DDD', color: '#000', padding: '7px 10px', fontSize: 10, fontWeight: 900, cursor: 'pointer', fontFamily: 'Inter, sans-serif', letterSpacing: 1 }}>{langLabel}</button>
            <button onClick={() => setCartOpen(!cartOpen)} style={{ background: '#FFF', border: '1px solid #DDD', cursor: 'pointer', position: 'relative', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={18} height={18} fill="none" stroke="#000" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /></svg>
              {cartCount > 0 && (<span style={{ position: 'absolute', top: -6, right: -6, background: '#DC2626', color: '#FFF', fontSize: 8, fontWeight: 900, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>{cartCount}</span>)}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: '#000', border: '1px solid #000', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={18} height={18} fill="none" stroke="#FFF" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background: '#0A0A0A', borderTop: '1px solid #222', padding: M ? '14px 18px 20px' : '18px 38px 26px', boxShadow: '0 25px 55px rgba(0,0,0,0.22)' }}>
            {[...navItems, { label: 'CONTACT', href: '/contact' }].map(i => (
              <a key={i.label} href={i.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', color: '#FFF', textDecoration: 'none', fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid #1A1A1A', fontFamily: 'Inter, sans-serif' }}>{i.label}<span style={{ color: '#DC2626' }}>→</span></a>
            ))}
          </div>
        )}
      </header>

      <div style={{ background: '#000' }}><HeroSlider /></div>

      <section style={{ background: '#0A0A0A', borderTop: '1px solid #111', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto', display: 'grid', gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(6,1fr)' }}>
          {categories.map((c, i) => (
            <a key={c.label} href={c.href} style={{ minHeight: M ? 96 : 124, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: M ? '18px 16px' : '24px 22px', textDecoration: 'none', color: '#FFF', borderRight: !M && i < 5 ? '1px solid #1A1A1A' : 'none', borderBottom: M ? '1px solid #1A1A1A' : 'none', background: '#0A0A0A', transition: 'all 0.28s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#151515'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0A0A0A'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: M ? 18 : 22, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase' }}>{c.label}</span>
            </a>
          ))}
        </div>
        {mounted && (
          <div style={{ maxWidth: 1480, margin: '0 auto', display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 3fr 1fr', borderTop: '1px solid #1A1A1A' }}>
            <div style={{ padding: M ? '18px 18px' : '28px 32px', borderRight: M ? 'none' : '1px solid #1A1A1A', borderBottom: M ? '1px solid #1A1A1A' : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: 4, color: '#DC2626', textTransform: 'uppercase', margin: '0 0 8px' }}>Premium Brands</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: M ? 28 : 56, flexWrap: 'wrap', padding: M ? '24px 14px' : '36px 28px', borderRight: M ? 'none' : '1px solid #1A1A1A', borderBottom: M ? '1px solid #1A1A1A' : 'none' }}>
              {brandList.map(b => (
                b.logo ? (
                  <a key={b.name} href={`/products?brand=${b.name.toLowerCase()}`} style={{ transition: 'all 0.3s', opacity: 0.85, display: 'flex', alignItems: 'center' }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <img src={b.logo} alt={b.name} style={{ height: M ? 45 : 70, width: 'auto' }} />
                  </a>
                ) : (
                  <a key={b.name} href={`/products?brand=${b.name.toLowerCase()}`} style={{ textDecoration: 'none', transition: 'all 0.3s', opacity: 0.85 }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: M ? 18 : 28, fontWeight: 900, letterSpacing: 4, color: '#FFF' }}>{b.name}</span>
                  </a>
                )
              ))}
            </div>
            <div style={{ padding: M ? '18px 18px' : '28px 32px', textAlign: M ? 'left' : 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: 4, color: '#DC2626', textTransform: 'uppercase', margin: '0 0 8px' }}>Outlet Prices</p>
            </div>
          </div>
        )}
      </section>

      <section style={{ padding: P, background: '#FFF' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          {sectionHeader('Customer Favorites', t?.sections?.bestSellers || 'Best Sellers', false)}
          <div style={{ display: 'grid', gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: M ? 12 : 22 }}>{bestSellers.map(p => <ProductCard key={p.id} product={p} />)}</div>
          <div style={{ textAlign: 'center', margin: M ? '34px 0 0' : '50px 0 0' }}><a href="/products" style={premiumButton} onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.border = '1px solid #DC2626'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.border = '1px solid #000'; e.currentTarget.style.transform = 'translateY(0)'; }}>View All Products</a></div>
        </div>
      </section>

      <section style={{ background: '#000', padding: M ? '64px 14px' : '104px 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: M ? -40 : -80, right: M ? -100 : -140, width: M ? 220 : 420, height: M ? 220 : 420, border: '1px solid #222', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: M ? -70 : -120, left: M ? -90 : -130, width: M ? 180 : 340, height: M ? 180 : 340, border: '1px solid #1A1A1A', borderRadius: '50%' }} />
        <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: M ? '1fr' : '0.9fr 1.1fr', gap: M ? 32 : 54, alignItems: 'center' }}>
          <div style={{ border: '1px solid #222', padding: M ? '26px 20px' : '42px 38px', background: '#0A0A0A' }}><p style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 900, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', margin: '0 0 18px' }}>Premium Outlet Event</p><h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: M ? 44 : 76, fontWeight: 900, lineHeight: 0.82, letterSpacing: M ? -2 : -4, textTransform: 'uppercase', color: '#FFF', margin: '0' }}>Up To<br /><span style={{ color: '#DC2626' }}>70%</span> Off</h2></div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,1fr)', gap: 10, margin: '0 0 30px' }}>{['Limited Sizes', 'Original Brands', 'Outlet Pricing'].map(i => (<div key={i} style={{ border: '1px solid #222', padding: '14px 12px', color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', background: '#0A0A0A' }}>{i}</div>))}</div>
            <a href="/products?sort=discount" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#DC2626', color: '#FFF', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', padding: M ? '15px 34px' : '17px 44px', border: '1px solid #DC2626', transition: 'all 0.25s ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.color = '#000'; e.currentTarget.style.border = '1px solid #FFF'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.border = '1px solid #DC2626'; e.currentTarget.style.transform = 'translateY(0)'; }}>Shop Sale Now</a>
          </div>
        </div>
      </section>

      <section style={{ padding: P, background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          {sectionHeader('Highest Markdown', t?.sections?.biggestDiscounts || 'Biggest Discounts', false)}
          <div style={{ display: 'grid', gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: M ? 12 : 22 }}>{saleProducts.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </section>

      <section style={{ background: '#0A0A0A', padding: P }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          {sectionHeader('Shop The Edit', 'Gender', true)}
          <div style={{ display: 'grid', gridTemplateColumns: M ? '1fr' : 'repeat(3,1fr)', gap: M ? 12 : 16 }}>
            {['MEN', 'WOMEN', 'KIDS'].map((g, index) => (
              <a key={g} href={`/products?gender=${g.toLowerCase()}`} style={{ background: index === 1 ? '#151515' : '#111', color: '#FFF', textDecoration: 'none', padding: M ? '48px 24px' : '86px 38px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: M ? 160 : 280, border: '1px solid #222', transition: 'all 0.32s ease', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.border = '1px solid #333'; }}
                onMouseLeave={e => { e.currentTarget.style.background = index === 1 ? '#151515' : '#111'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.border = '1px solid #222'; }}>
                <span style={{ position: 'absolute', top: 22, right: 22, fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: 2, color: '#DC2626' }}>0{index + 1}</span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: M ? 34 : 52, fontWeight: 900, letterSpacing: M ? -1 : -3, lineHeight: 0.9, display: 'block' }}>{g}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', color: '#888' }}>Shop Collection →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: P, background: '#FFF' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          {sectionHeader('Fresh Stock', t?.sections?.newArrivals || 'New Arrivals', false)}
          <div style={{ display: 'grid', gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: M ? 12 : 22 }}>{newArrivals.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </section>

      <section style={{ padding: P, background: '#FAFAFA', borderTop: '1px solid #EEE' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: M ? '1fr' : '0.82fr 1.18fr', gap: M ? 28 : 52, alignItems: 'stretch' }}>
          <div style={{ background: '#000', color: '#FFF', padding: M ? '34px 24px' : '48px 42px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #000' }}>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', margin: '0 0 14px' }}>Visit The Store</p>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: M ? 31 : 44, fontWeight: 900, letterSpacing: -2, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 24px', color: '#FFF' }}>Dua Mall,<br />Struga</h2>
              <p style={{ color: '#FFF', fontWeight: 900, fontSize: 14, margin: '0 0 18px', fontFamily: 'Inter, sans-serif' }}>{CONTACT_PHONE}</p>
              <div style={{ borderTop: '1px solid #222', padding: '18px 0 0', margin: '0 0 26px' }}><p style={{ color: '#999', fontSize: 12, margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>Mon—Fri: 09:00—21:00</p><p style={{ color: '#999', fontSize: 12, margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>Sat: 09:00—22:00</p><p style={{ color: '#999', fontSize: 12, margin: '0', fontFamily: 'Inter, sans-serif' }}>Sun: 10:00—20:00</p></div>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', width: M ? '100%' : 'fit-content', justifyContent: 'center', background: '#DC2626', color: '#FFF', textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', padding: '13px 26px', border: '1px solid #DC2626', transition: 'all 0.25s ease' }} onMouseEnter={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.color = '#000'; e.currentTarget.style.border = '1px solid #FFF'; }} onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.border = '1px solid #DC2626'; }}>@outletxstruga</a>
          </div>
          <div style={{ minHeight: M ? 260 : 430, overflow: 'hidden', border: '1px solid #DDD', background: '#FFF' }}><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.6620743480383!2d20.675127836415925!3d41.187039407592515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350e749a513feff%3A0xc0d3f98c173d96b8!2sOutlet%20X!5e0!3m2!1sen!2smk!4v1782426661903!5m2!1sen!2smk" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></div>
        </div>
      </section>

      <RecentlyViewedHome />

      <footer style={{ background: '#050505', color: '#FFF', borderTop: '1px solid #111', padding: M ? '50px 14px 28px' : '78px 36px 34px' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto', display: 'grid', gridTemplateColumns: M ? 'repeat(2,1fr)' : '2.2fr 1fr 1fr 1fr', gap: M ? 28 : 48, marginBottom: M ? 34 : 52 }}>
          <div style={M ? { gridColumn: 'span 2' } : {}}><h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: M ? 27 : 34, fontWeight: 900, margin: '0 0 14px', letterSpacing: -2 }}>OUTLET<span style={{ color: '#DC2626' }}>X</span></h3><p style={{ color: '#999', fontSize: 13, lineHeight: 1.9, margin: '0 0 22px', maxWidth: 420, fontFamily: 'Inter, sans-serif' }}>Branded sportswear at outlet prices. Dua Mall, Struga.</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{brandList.map(b => (<span key={b.name} style={{ border: '1px solid #222', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 900, letterSpacing: 2, padding: '7px 9px' }}>{b.name}</span>))}</div></div>
          <div><p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 16px', color: '#DC2626', fontFamily: 'Inter, sans-serif' }}>Shop</p>{[{ label: 'Men', link: '/products?gender=men' }, { label: 'Women', link: '/products?gender=women' }, { label: 'Kids', link: '/products?gender=kids' }, { label: 'Shoes', link: '/products?category=shoes' }, { label: 'Clothing', link: '/products?category=clothing' }, { label: 'Sale', link: '/products?sort=discount' }].map(i => (<a key={i.label} href={i.link} style={{ display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '5px 0', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }} onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>{i.label}</a>))}</div>
          <div><p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 16px', color: '#FFF', fontFamily: 'Inter, sans-serif' }}>Brands</p>{['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa', 'Skechers'].map(b => (<a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{ display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '5px 0', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }} onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>{b}</a>))}</div>
          <div><p style={{ fontSize: 9, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 16px', color: '#FFF', fontFamily: 'Inter, sans-serif' }}>Info</p><a href="/about" style={{ display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '5px 0', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }} onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>About</a><a href="/contact" style={{ display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '5px 0', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }} onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>Contact</a><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '5px 0', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }} onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>Instagram</a></div>
        </div>
        <div style={{ maxWidth: 1480, margin: '0 auto', borderTop: '1px solid #151515', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: M ? 'flex-start' : 'center', flexDirection: M ? 'column' : 'row', gap: 12, color: '#555', fontSize: 10, fontFamily: 'Inter, sans-serif', letterSpacing: 1 }}><span>&copy; 2024 OUTLETX. All rights reserved.</span><span>Dua Mall, Struga · Premium Outlet Store</span></div>
      </footer>
    </>
  );
}