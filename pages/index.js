import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import RecentlyViewedHome from '../components/RecentlyViewedHome';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <>
      <Head>
        <title>OUTLETX | Branded Sportswear. Outlet Prices. | Dua Mall Struga</title>
        <meta name="description" content="Authentic Nike, Adidas, Puma, Jordan, Kappa, Skechers, 4F at outlet prices. Dua Mall, Struga, North Macedonia." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>

      {/* ========== TOP BAR ========== */}
      <div style={{background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', padding: '12px 20px', textTransform: 'uppercase'}}>
        <span className="hide-mobile">Dua Mall, Struga &nbsp;&bull;&nbsp; Open Every Day &nbsp;&bull;&nbsp; Free Delivery Over 3000 MKD &nbsp;&bull;&nbsp; Authentic Brands</span>
        <span className="show-mobile" style={{display: 'none'}}>FREE DELIVERY OVER 3000 MKD</span>
      </div>

      {/* ========== HEADER ========== */}
      <header style={{
        background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100,
        borderBottom: scrolled ? '1px solid #E5E5E5' : '1px solid #F0F0F0',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.3s',
      }}>
        <div style={{maxWidth: '1500px', margin: '0 auto', padding: '0 32px', height: '72px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: '26px', fontWeight: '900', color: '#000000', textDecoration: 'none', letterSpacing: '-1px', flexShrink: 0}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span>
          </a>
          <nav className="hide-mobile" style={{display: 'flex', gap: '40px', alignItems: 'center'}}>
            {['Men', 'Women', 'Kids', 'Sale'].map((item) => (
              <a key={item} href={item === 'Sale' ? '/products?sort=discount' : `/products?gender=${item.toLowerCase()}`} style={{
                color: '#000000', textDecoration: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = '#DC2626'}
              onMouseLeave={(e) => e.target.style.color = '#000000'}
              >{item}</a>
            ))}
          </nav>
          <div style={{display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0}}>
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" className="hide-mobile" style={{
              background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '12px 22px', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#B91C1C'; }}
            onMouseLeave={(e) => { e.target.style.background = '#DC2626'; }}
            >Message Us</a>
            <button onClick={() => setCartOpen(!cartOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '8px'}}>
              <svg width="22" height="22" fill="none" stroke="#000000" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span style={{position: 'absolute', top: '-2px', right: '-4px', background: '#DC2626', color: '#FFFFFF', fontSize: '10px', fontWeight: '700', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite'}}>{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="show-mobile" style={{background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none'}}>
              <svg width="22" height="22" fill="none" stroke="#000000" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="show-mobile" style={{background: '#FFFFFF', borderTop: '1px solid #F0F0F0', padding: '12px 32px', display: 'none', animation: 'fadeIn 0.2s ease'}}>
            {['Men', 'Women', 'Kids', 'Sale', 'Brands', 'Contact'].map((item) => (
              <a key={item} href={item === 'Sale' ? '/products?sort=discount' : item === 'Brands' ? '/products' : item === 'Contact' ? '/contact' : `/products?gender=${item.toLowerCase()}`} style={{display: 'block', padding: '14px 0', color: '#000000', textDecoration: 'none', fontSize: '15px', fontWeight: '600', borderBottom: '1px solid #F5F5F5'}}>{item}</a>
            ))}
          </div>
        )}
      </header>

      {/* ========== HERO SLIDER ========== */}
      <HeroSlider />


      {/* ========== CATEGORY STRIP ========== */}
      <section style={{background: '#FFFFFF', borderBottom: '1px solid #EEEEEE', overflow: 'auto'}}>
        <div style={{maxWidth: '1500px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', minWidth: '600px'}}>
          {[
            { name: 'Shoes', link: '/products?category=shoes' },
            { name: 'Clothing', link: '/products?category=clothing' },
            { name: 'Accessories', link: '/products?category=accessories' },
            { name: 'Men', link: '/products?gender=men' },
            { name: 'Women', link: '/products?gender=women' },
            { name: 'Kids', link: '/products?gender=kids' },
          ].map((cat, i) => (
            <a key={cat.name} href={cat.link} style={{textAlign: 'center', padding: '26px 12px', textDecoration: 'none', color: '#000000', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderRight: i < 5 ? '1px solid #EEEEEE' : 'none', transition: 'all 0.2s'}}
            onMouseEnter={(e) => { e.target.style.background = '#000000'; e.target.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.target.style.background = '#FFFFFF'; e.target.style.color = '#000000'; }}
            >{cat.name}</a>
          ))}
        </div>
      </section>

      {/* ========== BEST SELLERS ========== */}
      <section style={{padding: '100px 32px', background: '#FFFFFF'}}>
        <div style={{maxWidth: '1500px', margin: '0 auto'}}>
          <div style={{marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px'}}>
            <div>
              <p style={{fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>Top Picks</p>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase', margin: 0}}>Best Sellers</h2>
            </div>
            <a href="/products" style={{color: '#000000', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: '8px', transition: 'all 0.2s', flexShrink: 0}}
            onMouseEnter={(e) => { e.target.style.color = '#DC2626'; e.target.style.borderColor = '#DC2626'; }}
            onMouseLeave={(e) => { e.target.style.color = '#000000'; e.target.style.borderColor = '#000000'; }}
            >View All &rarr;</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px'}}>
            {[
              { id: 1, brand: 'Nike', name: 'Air Max 90', sku: 'DM0029-101', oldPrice: 5990, newPrice: 3990, discount: 33, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '42.5', '43', '44', '44.5', '45'], inStock: true, stock: 8 },
              { id: 8, brand: 'Adidas', name: 'Ultraboost 22', sku: 'GX5459', oldPrice: 8990, newPrice: 5990, discount: 33, images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '42.5', '43', '44', '45'], inStock: true, stock: 7 },
              { id: 15, brand: 'Jordan', name: 'Air Jordan 1 Low', sku: '553558-140', oldPrice: 6990, newPrice: 4990, discount: 29, images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '42.5', '43', '44', '45'], inStock: true, stock: 2 },
              { id: 4, brand: 'Nike', name: 'Dunk Low Retro', sku: 'DD1391-100', oldPrice: 5490, newPrice: 3990, discount: 27, images: ['https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '43', '44'], inStock: true, stock: 3 },
              { id: 2, brand: 'Nike', name: 'Air Force 1 Low', sku: 'DD8959-100', oldPrice: 4990, newPrice: 3490, discount: 30, images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '43', '44', '45'], inStock: true, stock: 12 },
              { id: 12, brand: 'Puma', name: 'Caven 2.0', sku: '39324-01', oldPrice: 2990, newPrice: 1890, discount: 37, images: ['https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '43', '44'], inStock: true, stock: 6 },
            ].map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== SALE BANNER ========== */}
      <section style={{background: '#DC2626', padding: '60px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: '-30%', right: '-5%', width: '400px', height: '400px', background: 'rgba(0,0,0,0.08)', borderRadius: '50%'}} />
        <div style={{position: 'absolute', bottom: '-20%', left: '-5%', width: '300px', height: '300px', background: 'rgba(0,0,0,0.06)', borderRadius: '50%'}} />
        <div style={{position: 'relative', zIndex: 1}}>
          <p style={{fontSize: '11px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: '8px'}}>Limited Time Offer</p>
          <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '20px'}}>Up to 70% Off</h2>
          <a href="/products?sort=discount" style={{background: '#000000', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', padding: '18px 40px', display: 'inline-block', transition: 'all 0.2s'}}
          onMouseEnter={(e) => { e.target.style.background = '#1A1A1A'; e.target.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.target.style.background = '#000000'; e.target.style.transform = 'translateY(0)'; }}
          >Shop All Sale</a>
        </div>
      </section>

      {/* ========== SALE PRODUCTS ========== */}
      <section style={{padding: '100px 32px', background: '#F8F8F8'}}>
        <div style={{maxWidth: '1500px', margin: '0 auto'}}>
          <div style={{marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px'}}>
            <div>
              <p style={{fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>Deals</p>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase', margin: 0}}>Biggest Discounts</h2>
            </div>
            <a href="/products?sort=discount" style={{color: '#000000', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: '8px', flexShrink: 0}}>View All &rarr;</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px'}}>
            {[
              { id: 20, brand: '4F', name: 'Performance Jacket', sku: '4F-PERF-01', oldPrice: 4490, newPrice: 2490, discount: 45, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 8 },
              { id: 23, brand: 'Puma', name: 'Essential Hoodie', sku: '586700-01', oldPrice: 3390, newPrice: 1790, discount: 47, images: ['/images/products/R.jpg'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 4 },
              { id: 17, brand: 'Kappa', name: 'Banda Astoria Jacket', sku: 'KAPPA-BA-01', oldPrice: 4490, newPrice: 2490, discount: 45, images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop'], sizes: ['M', 'L', 'XL'], inStock: true, stock: 5 },
              { id: 39, brand: 'Adidas', name: 'Performance Crew Socks (3-Pack)', sku: 'ADSOCK-CREW', oldPrice: 590, newPrice: 290, discount: 51, images: ['https://images.unsplash.com/photo-1584370846552-c7bcfe22d2a1?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L'], inStock: true, stock: 20 },
              { id: 26, brand: 'Puma', name: 'Essential Track Pants', sku: '67448-01', oldPrice: 2490, newPrice: 1390, discount: 44, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 9 },
              { id: 30, brand: 'Puma', name: 'Logo Leggings', sku: '52346-01', oldPrice: 1990, newPrice: 1090, discount: 45, images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop'], sizes: ['XS', 'S', 'M', 'L'], inStock: true, stock: 8 },
            ].map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== SHOP BY GENDER ========== */}
      <section style={{padding: '100px 32px', background: '#FFFFFF'}}>
        <div style={{maxWidth: '1500px', margin: '0 auto'}}>
          <div style={{marginBottom: '48px'}}>
            <p style={{fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>Explore</p>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900', letterSpacing: '-2px', textTransform: 'uppercase', margin: 0}}>Shop by Gender</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
            {[
              { name: 'Men', link: '/products?gender=men', bg: '#0D0D0D' },
              { name: 'Women', link: '/products?gender=women', bg: '#141414' },
              { name: 'Kids', link: '/products?gender=kids', bg: '#111111' },
            ].map((item) => (
              <a key={item.name} href={item.link} style={{background: item.bg, color: '#FFFFFF', textDecoration: 'none', padding: '100px 40px', textAlign: 'center', display: 'block', transition: 'all 0.35s', borderRadius: '2px'}}
              onMouseEnter={(e) => { e.target.style.background = '#DC2626'; e.target.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.target.style.background = item.bg; e.target.style.transform = 'scale(1)'; }}
              >
                <span style={{fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: '900', letterSpacing: '-2px', display: 'block', marginBottom: '12px'}}>{item.name}</span>
                <span style={{fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', borderBottom: '2px solid rgba(255,255,255,0.5)', paddingBottom: '10px'}}>Shop Now</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section style={{padding: '80px 32px', background: '#0A0A0A', color: '#FFFFFF', textAlign: 'center'}}>
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          <p style={{fontSize: '11px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '12px'}}>Stay Updated</p>
          <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: '900', letterSpacing: '-1px', textTransform: 'uppercase', marginBottom: '12px'}}>Get Exclusive Deals</h2>
          <p style={{color: '#888888', fontSize: '14px', marginBottom: '28px'}}>Be the first to know about new arrivals and special offers.</p>
          {subscribed ? (
            <p style={{color: '#16A34A', fontWeight: '700', fontSize: '15px'}}>Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} style={{display: 'flex', gap: '8px', maxWidth: '450px', margin: '0 auto'}}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" style={{flex: 1, padding: '16px', border: '1px solid #333', background: '#111', color: '#FFF', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'}} />
              <button type="submit" style={{background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 28px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap'}}>Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* ========== BRAND STRIP ========== */}
      <section style={{background: '#000000', padding: '60px 32px'}}>
        <div style={{maxWidth: '1500px', margin: '0 auto'}}>
          <p style={{color: '#666666', fontSize: '11px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '32px'}}>Premium Brands</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 64px)', flexWrap: 'wrap', alignItems: 'center'}}>
            {['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa', 'Skechers', '4F'].map((brand) => (
              <a key={brand} href={`/products?brand=${brand.toLowerCase()}`} style={{color: '#444444', textDecoration: 'none', fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: '800', letterSpacing: '6px', textTransform: 'uppercase', transition: 'all 0.2s'}}
              onMouseEnter={(e) => { e.target.style.color = '#FFFFFF'; e.target.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.target.style.color = '#444444'; e.target.style.transform = 'scale(1)'; }}
              >{brand}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STORE LOCATION ========== */}
      <section style={{padding: '100px 32px', background: '#FFFFFF'}}>
        <div style={{maxWidth: '1500px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center'}}>
          <div>
            <p style={{fontSize: '11px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '12px'}}>Visit Us</p>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900', letterSpacing: '-2px', marginBottom: '28px', textTransform: 'uppercase'}}>Dua Mall, Struga</h2>
            <div style={{fontSize: '15px', color: '#555555', lineHeight: '2.4'}}>
              <p style={{margin: 0}}>North Macedonia</p>
              <p style={{fontWeight: '700', color: '#000000', margin: '4px 0', fontSize: '17px'}}>+389 70 123 456</p>
              <p style={{margin: 0}}>Mon &mdash; Fri: 09:00 &mdash; 21:00</p>
              <p style={{margin: 0}}>Saturday: 09:00 &mdash; 22:00</p>
              <p style={{margin: 0}}>Sunday: 10:00 &mdash; 20:00</p>
            </div>
            <div style={{display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap'}}>
              <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 28px', display: 'inline-block', transition: 'all 0.2s'}}>Instagram</a>
              <a href="/contact" style={{background: 'transparent', color: '#000000', textDecoration: 'none', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid #CCCCCC', display: 'inline-block', transition: 'all 0.2s'}}>Directions</a>
            </div>
          </div>
          <div style={{background: '#F5F5F5', height: '320px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#CCCCCC', letterSpacing: '3px', textTransform: 'uppercase'}}>
            Google Maps
          </div>
        </div>
      </section>

      {/* ========== RECENTLY VIEWED ========== */}
      <RecentlyViewedHome />

      {/* ========== FOOTER ========== */}
      <footer style={{background: '#0A0A0A', color: '#FFFFFF', padding: '80px 32px 30px'}}>
        <div style={{maxWidth: '1500px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px'}}>
          <div>
            <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px'}}>OUTLET<span style={{color: '#DC2626'}}>X</span></h3>
            <p style={{color: '#666666', fontSize: '13px', lineHeight: '1.8', maxWidth: '280px'}}>Branded sportswear at outlet prices. Dua Mall, Struga, North Macedonia. Authentic products from the world's best brands.</p>
            <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
              <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{color: '#666', textDecoration: 'none', fontSize: '12px', fontWeight: '600'}}>Instagram</a>
              <a href="https://tiktok.com/@outletx.mk" target="_blank" rel="noopener noreferrer" style={{color: '#666', textDecoration: 'none', fontSize: '12px', fontWeight: '600'}}>TikTok</a>
            </div>
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: '10px', fontWeight: '700', letterSpacing: '3px', marginBottom: '20px', textTransform: 'uppercase'}}>Shop</p>
            {['Men', 'Women', 'Kids', 'Shoes', 'Clothing', 'Accessories', 'Sale'].map((item) => (
              <a key={item} href="/products" style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s'}}
              onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.target.style.color = '#888888'}
              >{item}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: '10px', fontWeight: '700', letterSpacing: '3px', marginBottom: '20px', textTransform: 'uppercase'}}>Brands</p>
            {['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa', 'Skechers', '4F'].map((b) => (
              <a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s'}}>{b}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: '10px', fontWeight: '700', letterSpacing: '3px', marginBottom: '20px', textTransform: 'uppercase'}}>Help</p>
            {['About Us', 'Contact', 'Size Guide', 'Shipping', 'Returns'].map((item) => (
              <a key={item} href={item === 'About Us' ? '/about' : '/contact'} style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s'}}>{item}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: '10px', fontWeight: '700', letterSpacing: '3px', marginBottom: '20px', textTransform: 'uppercase'}}>Contact</p>
            <p style={{color: '#888', fontSize: '13px', margin: '0 0 8px'}}>Dua Mall, Struga</p>
            <p style={{color: '#888', fontSize: '13px', margin: '0 0 8px'}}>North Macedonia</p>
            <p style={{color: '#FFF', fontSize: '13px', fontWeight: '700', margin: '0 0 8px'}}>+389 70 123 456</p>
            <p style={{color: '#888', fontSize: '13px', margin: '0'}}>@outletxstruga</p>
          </div>
        </div>
        <div style={{borderTop: '1px solid #1A1A1A', paddingTop: '28px', textAlign: 'center', color: '#555555', fontSize: '12px', letterSpacing: '0.5px'}}>
          &copy; 2024 OUTLETX. All rights reserved. Dua Mall, Struga, North Macedonia.
        </div>
      </footer>
    </>
  );
}