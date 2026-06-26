import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import RecentlyViewedHome from '../components/RecentlyViewedHome';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { lang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  const bestSellers = [
    { id: 1, brand: 'Nike', name: 'Air Max 90', sku: 'DM0029-101', oldPrice: 5990, newPrice: 3990, discount: 33, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '42.5', '43', '44', '44.5', '45'], inStock: true, stock: 8 },
    { id: 8, brand: 'Adidas', name: 'Ultraboost 22', sku: 'GX5459', oldPrice: 8990, newPrice: 5990, discount: 33, images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '42.5', '43', '44', '45'], inStock: true, stock: 7 },
    { id: 15, brand: 'Jordan', name: 'Air Jordan 1 Low', sku: '553558-140', oldPrice: 6990, newPrice: 4990, discount: 29, images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '42.5', '43', '44', '45'], inStock: true, stock: 2 },
    { id: 4, brand: 'Nike', name: 'Dunk Low Retro', sku: 'DD1391-100', oldPrice: 5490, newPrice: 3990, discount: 27, images: ['https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '43', '44'], inStock: true, stock: 3 },
    { id: 2, brand: 'Nike', name: 'Air Force 1 Low', sku: 'DD8959-100', oldPrice: 4990, newPrice: 3490, discount: 30, images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '43', '44', '45'], inStock: true, stock: 12 },
    { id: 12, brand: 'Puma', name: 'Caven 2.0', sku: '39324-01', oldPrice: 2990, newPrice: 1890, discount: 37, images: ['https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '43', '44'], inStock: true, stock: 6 },
  ];

  const saleProducts = [
    { id: 20, brand: '4F', name: 'Performance Jacket', sku: '4F-PERF-01', oldPrice: 4490, newPrice: 2490, discount: 45, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 8 },
    { id: 23, brand: 'Puma', name: 'Essential Hoodie', sku: '586700-01', oldPrice: 3390, newPrice: 1790, discount: 47, images: ['/images/products/R.jpg'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 4 },
    { id: 17, brand: 'Kappa', name: 'Banda Astoria Jacket', sku: 'KAPPA-BA-01', oldPrice: 4490, newPrice: 2490, discount: 45, images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop'], sizes: ['M', 'L', 'XL'], inStock: true, stock: 5 },
    { id: 39, brand: 'Adidas', name: 'Crew Socks 3-Pack', sku: 'ADSOCK-CREW', oldPrice: 590, newPrice: 290, discount: 51, images: ['https://images.unsplash.com/photo-1584370846552-c7bcfe22d2a1?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L'], inStock: true, stock: 20 },
    { id: 26, brand: 'Puma', name: 'Track Pants', sku: '67448-01', oldPrice: 2490, newPrice: 1390, discount: 44, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 9 },
    { id: 30, brand: 'Puma', name: 'Logo Leggings', sku: '52346-01', oldPrice: 1990, newPrice: 1090, discount: 45, images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop'], sizes: ['XS', 'S', 'M', 'L'], inStock: true, stock: 8 },
  ];

  const newArrivals = [
    { id: 21, brand: 'Nike', name: 'Dri-FIT T-Shirt', sku: 'DM7145-010', oldPrice: 1490, newPrice: 890, discount: 40, images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, stock: 15 },
    { id: 24, brand: 'Nike', name: 'Club Fleece Shorts', sku: 'DM6831-010', oldPrice: 1690, newPrice: 990, discount: 41, images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 12 },
    { id: 25, brand: 'Adidas', name: 'Tiro 23 Shorts', sku: 'HT3395', oldPrice: 1390, newPrice: 790, discount: 43, images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, stock: 14 },
    { id: 22, brand: 'Adidas', name: 'Essentials Hoodie', sku: 'IC9440', oldPrice: 3290, newPrice: 1990, discount: 40, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 10 },
    { id: 27, brand: 'Nike', name: 'Tech Fleece Joggers', sku: 'CU4489-010', oldPrice: 4990, newPrice: 3490, discount: 30, images: ['https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 5 },
    { id: 19, brand: 'Skechers', name: 'Uno Stand On Air', sku: '73690-WHT', oldPrice: 3990, newPrice: 2490, discount: 38, images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop'], sizes: ['40', '41', '42', '43', '44', '45'], inStock: true, stock: 7 },
  ];

  const gap = isMobile ? 12 : 24;
  const padding = isMobile ? '60px 16px' : '90px 40px';
  const bannerPadding = isMobile ? '50px 16px' : '60px 40px';
  const sectionTitle = isMobile ? 28 : 40;
  const saleTitle = isMobile ? 32 : 48;
  const genderPadding = isMobile ? '60px 20px' : '100px 40px';
  const genderTitle = isMobile ? 24 : 36;

  return (
    <>
      <Head>
        <title>OUTLETX | {t.hero.title} {t.hero.subtitle} | Dua Mall Struga</title>
        <meta name="description" content={t.hero.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: isMobile ? 9 : 10, fontWeight: 700, letterSpacing: isMobile ? 2 : 4, padding: '10px 16px', textTransform: 'uppercase'}}>
        {isMobile ? t.topBar.split('•')[1]?.trim() : t.topBar}
      </div>

      <header style={{
        background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100,
        borderBottom: scrolled ? '1px solid #E5E5E5' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 40px rgba(0,0,0,0.04)' : 'none', transition: 'all 0.3s',
      }}>
        <div style={{maxWidth: 1600, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px', height: isMobile ? 60 : 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#000000', textDecoration: 'none', letterSpacing: -1.5, flexShrink: 0}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span>
          </a>
          {!isMobile && (
            <nav style={{display: 'flex', gap: 48, alignItems: 'center'}}>
              {[t.nav.men, t.nav.women, t.nav.kids, t.nav.sale].map((item) => (
                <a key={item} href={item === t.nav.sale ? '/products?sort=discount' : `/products?gender=${item.toLowerCase()}`} style={{
                  color: '#000000', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.color = '#DC2626'}
                onMouseLeave={(e) => e.target.style.color = '#000000'}
                >{item}</a>
              ))}
            </nav>
          )}
          <div style={{display: 'flex', gap: isMobile ? 8 : 16, alignItems: 'center', flexShrink: 0}}>
            {!isMobile && (
              <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{
                background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 24px', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#B91C1C'; }}
              onMouseLeave={(e) => { e.target.style.background = '#DC2626'; }}
              >{t.messageUs}</a>
            )}
          <button onClick={toggleLang} style={{background: '#000', color: '#FFF', border: 'none', cursor: 'pointer', padding: '8px 14px', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif', borderRadius: 2, letterSpacing: 1}}>
  {lang === 'mk' ? 'EN' : 'МК'}
</button>
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
            {[t.nav.men, t.nav.women, t.nav.kids, t.nav.sale, t.nav.contact].map((item) => (
              <a key={item} href={item === t.nav.sale ? '/products?sort=discount' : item === t.nav.contact ? '/contact' : `/products?gender=${item.toLowerCase()}`} style={{display: 'block', padding: '14px 0', color: '#000000', textDecoration: 'none', fontSize: 15, fontWeight: 600, borderBottom: '1px solid #F5F5F5'}}>{item}</a>
            ))}
          </div>
        )}
      </header>

      <HeroSlider />

      {/* Brands */}
      <section style={{padding: isMobile ? '32px 16px' : '50px 40px', background: '#FFFFFF', borderBottom: '1px solid #F0F0F0'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? 28 : 64, flexWrap: 'wrap', padding: '8px 0'}}>
            {[{ name: 'NIKE', w: 100, fs: 24 }, { name: 'ADIDAS', w: 110, fs: 22 }, { name: 'PUMA', w: 90, fs: 22 }, { name: 'JORDAN', w: 115, fs: 22 }, { name: 'KAPPA', w: 100, fs: 22 }, { name: 'SKECHERS', w: 125, fs: 18 }, { name: '4F', w: 55, fs: 28 }].map((b) => (
              <a key={b.name} href={`/products?brand=${b.name.toLowerCase()}`} style={{flexShrink: 0, textDecoration: 'none', transition: 'all 0.3s', opacity: 0.5}}
              onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.target.style.opacity = '0.5'; }}>
                <svg viewBox={`0 0 ${b.w * 2} 60`} width={b.w} height="30"><text x="50%" y="42" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize={b.fs} fill="#000000" letterSpacing={b.name === '4F' ? 0 : 4}>{b.name}</text></svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{background: '#FFFFFF', borderBottom: '1px solid #F0F0F0'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)'}}>
          {[
            { name: t.categories.shoes, link: '/products?category=shoes' },
            { name: t.categories.clothing, link: '/products?category=clothing' },
            { name: t.categories.accessories, link: '/products?category=accessories' },
            { name: t.categories.men, link: '/products?gender=men' },
            { name: t.categories.women, link: '/products?gender=women' },
            { name: t.categories.kids, link: '/products?gender=kids' },
          ].map((cat, i) => (
            <a key={cat.name} href={cat.link} style={{textAlign: 'center', padding: isMobile ? '18px 8px' : '26px 16px', textDecoration: 'none', color: '#000000', fontSize: isMobile ? 10 : 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderRight: i < (isMobile ? 2 : 5) ? '1px solid #F0F0F0' : 'none', borderBottom: isMobile && i < 3 ? '1px solid #F0F0F0' : 'none', transition: 'all 0.2s'}}
            onMouseEnter={(e) => { e.target.style.background = '#000000'; e.target.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.target.style.background = '#FFFFFF'; e.target.style.color = '#000000'; }}
            >{cat.name}</a>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section style={{padding, background: '#FFFFFF'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: isMobile ? 28 : 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 6}}>{t.sections.mostPopular}</p>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: sectionTitle, fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase', margin: 0, lineHeight: 0.9}}>{t.sections.bestSellers}</h2>
            </div>
            <a href="/products" style={{color: '#000000', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: 6, transition: 'all 0.2s', flexShrink: 0}}>{t.sections.viewAll}</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(270px, 1fr))', gap}}>
            {bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section style={{background: '#DC2626', padding: bannerPadding, textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: '-50%', right: '-15%', width: isMobile ? 300 : 600, height: isMobile ? 300 : 600, background: 'rgba(0,0,0,0.06)', borderRadius: '50%'}} />
        <div style={{position: 'absolute', bottom: '-40%', left: '-10%', width: isMobile ? 200 : 400, height: isMobile ? 200 : 400, background: 'rgba(0,0,0,0.04)', borderRadius: '50%'}} />
        <div style={{position: 'relative', zIndex: 1}}>
          <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 6}}>{t.sections.limitedTime}</p>
          <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: saleTitle, fontWeight: 900, letterSpacing: -3, textTransform: 'uppercase', color: '#FFFFFF', marginBottom: 16, lineHeight: 0.9}}>{t.sections.upTo70}</h2>
          <a href="/products?sort=discount" style={{background: '#000000', color: '#FFFFFF', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', padding: isMobile ? '14px 28px' : '16px 40px', display: 'inline-block', transition: 'all 0.2s'}}>{t.sections.shopSale}</a>
        </div>
      </section>

      {/* Sale Products */}
      <section style={{padding, background: '#F9F9F9'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: isMobile ? 28 : 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 6}}>{t.sections.deals}</p>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: sectionTitle, fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase', margin: 0, lineHeight: 0.9}}>{t.sections.biggestDiscounts}</h2>
            </div>
            <a href="/products?sort=discount" style={{color: '#000000', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: 6, flexShrink: 0}}>{t.sections.viewAll}</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(270px, 1fr))', gap}}>
            {saleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Gender */}
      <section style={{padding, background: '#FFFFFF'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: isMobile ? 28 : 48}}>
            <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 6}}>{t.sections.shopBy}</p>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: sectionTitle, fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase', margin: 0, lineHeight: 0.9}}>{t.sections.gender}</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? 10 : 20}}>
            {[
              { name: t.categories.men, link: '/products?gender=men', bg: '#0A0A0A' },
              { name: t.categories.women, link: '/products?gender=women', bg: '#111111' },
              { name: t.categories.kids, link: '/products?gender=kids', bg: '#0D0D0D' },
            ].map((item) => (
              <a key={item.name} href={item.link} style={{background: item.bg, color: '#FFFFFF', textDecoration: 'none', padding: genderPadding, textAlign: 'center', display: 'block', transition: 'all 0.4s', borderRadius: 2}}
              onMouseEnter={(e) => { e.target.style.background = '#DC2626'; }}
              onMouseLeave={(e) => { e.target.style.background = item.bg; }}>
                <span style={{fontFamily: 'Montserrat, sans-serif', fontSize: genderTitle, fontWeight: 900, letterSpacing: -2, display: 'block', marginBottom: 10}}>{item.name}</span>
                <span style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: 8}}>{t.sections.viewAll}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section style={{padding, background: '#F9F9F9'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: isMobile ? 28 : 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 6}}>{t.sections.freshIn}</p>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: sectionTitle, fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase', margin: 0, lineHeight: 0.9}}>{t.sections.newArrivals}</h2>
            </div>
            <a href="/products" style={{color: '#000000', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: 6, flexShrink: 0}}>{t.sections.viewAll}</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(270px, 1fr))', gap}}>
            {newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{padding: isMobile ? '50px 16px' : '80px 40px', background: '#0A0A0A', color: '#FFFFFF', textAlign: 'center'}}>
        <div style={{maxWidth: 550, margin: '0 auto'}}>
          <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 10}}>{t.sections.stayUpdated}</p>
          <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? 26 : 36, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase', marginBottom: 10}}>{t.sections.exclusiveDeals}</h2>
          <p style={{color: '#888888', fontSize: 13, marginBottom: 24}}>Be the first to know about new arrivals and special offers.</p>
          {subscribed ? (
            <p style={{color: '#16A34A', fontWeight: 700, fontSize: 15}}>{t.sections.thankYou}</p>
          ) : (
            <form onSubmit={handleSubscribe} style={{display: 'flex', gap: 8, maxWidth: 450, margin: '0 auto', flexDirection: isMobile ? 'column' : 'row'}}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.sections.emailPlaceholder} style={{flex: 1, padding: '14px 16px', border: '1px solid #333', background: '#111', color: '#FFF', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'}} />
              <button type="submit" style={{background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 24px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap'}}>{t.sections.subscribe}</button>
            </form>
          )}
        </div>
      </section>

      {/* Store */}
      <section style={{padding, background: '#FFFFFF'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))', gap: isMobile ? 32 : 60, alignItems: 'center'}}>
          <div>
            <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 8}}>{t.sections.visitUs}</p>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: sectionTitle, fontWeight: 900, letterSpacing: -2, marginBottom: isMobile ? 20 : 28, textTransform: 'uppercase', lineHeight: 0.9}}>{t.sections.storeInfo}</h2>
            <div style={{fontSize: 14, color: '#555555', lineHeight: 2.4}}>
              <p style={{margin: 0}}>{t.sections.northMacedonia}</p>
              <p style={{fontWeight: 700, color: '#000000', margin: '2px 0', fontSize: 16}}>+389 70 123 456</p>
              <p style={{margin: 0}}>{t.sections.hours.monFri}</p>
              <p style={{margin: 0}}>{t.sections.hours.sat}</p>
              <p style={{margin: 0}}>{t.sections.hours.sun}</p>
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap'}}>
              <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 24px', display: 'inline-block', transition: 'all 0.2s'}}>{t.sections.instagram}</a>
              <a href="/contact" style={{background: 'transparent', color: '#000000', textDecoration: 'none', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 24px', border: '1px solid #CCCCCC', display: 'inline-block', transition: 'all 0.2s'}}>{t.sections.directions}</a>
            </div>
          </div>
          <div style={{height: isMobile ? 220 : 320, borderRadius: 4, overflow: 'hidden'}}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.6620743480383!2d20.675127836415925!3d41.187039407592515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350e749a513feff%3A0xc0d3f98c173d96b8!2sOutlet%20X!5e0!3m2!1sen!2smk!4v1782426661903!5m2!1sen!2smk" width="100%" height="100%" style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
          </div>
        </div>
      </section>

      <RecentlyViewedHome />

      {/* Footer */}
      <footer style={{background: '#0A0A0A', color: '#FFFFFF', padding: isMobile ? '50px 16px 24px' : '70px 40px 28px'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : '2fr 1fr 1fr 1fr 1fr', gap: isMobile ? 24 : 40, marginBottom: isMobile ? 32 : 48}}>
          <div style={isMobile ? {gridColumn: 'span 2'} : {}}>
            <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 22, fontWeight: 900, marginBottom: 12, letterSpacing: -1}}>OUTLET<span style={{color: '#DC2626'}}>X</span></h3>
            <p style={{color: '#666666', fontSize: 12, lineHeight: 1.7, maxWidth: 260}}>Branded sportswear at outlet prices. Dua Mall, Struga, North Macedonia.</p>
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>{t.footer.shop}</p>
            {[t.nav.men, t.nav.women, t.nav.kids, t.categories.shoes, t.categories.clothing, t.nav.sale].map((item) => (
              <a key={item} href="/products" style={{display: 'block', color: '#888888', fontSize: 12, textDecoration: 'none', padding: '3px 0', transition: 'color 0.2s'}}
              onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.target.style.color = '#888888'}>{item}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>{t.footer.brands}</p>
            {['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa', 'Skechers'].map((b) => (
              <a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display: 'block', color: '#888888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>{b}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>{t.footer.help}</p>
            {[t.footer.about, t.footer.contact, t.footer.shipping, t.footer.returns].map((item) => (
              <a key={item} href={item === t.footer.about ? '/about' : '/contact'} style={{display: 'block', color: '#888888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>{item}</a>
            ))}
          </div>
          {!isMobile && (
            <div>
              <p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>{t.footer.contact}</p>
              <p style={{color: '#888', fontSize: 12, margin: '0 0 6px'}}>Dua Mall, Struga</p>
              <p style={{color: '#888', fontSize: 12, margin: '0 0 6px'}}>North Macedonia</p>
              <p style={{color: '#FFF', fontSize: 12, fontWeight: 700, margin: '0 0 6px'}}>+389 70 123 456</p>
              <p style={{color: '#888', fontSize: 12, margin: 0}}>@outletxstruga</p>
            </div>
          )}
        </div>
        <div style={{borderTop: '1px solid #1A1A1A', paddingTop: 20, textAlign: 'center', color: '#555555', fontSize: 10, letterSpacing: 1}}>
          &copy; 2024 OUTLETX. {t.footer.rights} Dua Mall, Struga, North Macedonia.
        </div>
      </footer>
    </>
  );
}