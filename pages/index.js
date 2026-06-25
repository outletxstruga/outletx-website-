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

  const brands = [
    { name: 'Nike', file: 'nike-4-logo-png-transparent.png' },
    { name: 'Adidas', file: 'adidas-logo-symbol-clothes-design-icon-abstract-football-illustration-free-vector.jpg' },
    { name: 'Puma', file: 'Puma-logo-PNG-Transparent-Background.png' },
    { name: 'Jordan', file: 'Jordan_Air.png' },
    { name: 'Kappa', file: 'kappa-logo-silhouette-robe-di-kappa-t-shirt-monochrome-sportswear-design-black-and-white-brand-icon-minimalist-fashion-graphic-sport-lifestyle-emblem-human-figure-logo-art.png' },
    { name: 'Skechers', file: '583613.png' },
    { name: '4F', file: '4F_logo1_1.jpg' },
  ];

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
    { id: 26, brand: 'Puma', name: 'Essential Track Pants', sku: '67448-01', oldPrice: 2490, newPrice: 1390, discount: 44, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 9 },
    { id: 30, brand: 'Puma', name: 'Logo Leggings', sku: '52346-01', oldPrice: 1990, newPrice: 1090, discount: 45, images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop'], sizes: ['XS', 'S', 'M', 'L'], inStock: true, stock: 8 },
  ];

  const newArrivals = [
    { id: 21, brand: 'Nike', name: 'Dri-FIT Training T-Shirt', sku: 'DM7145-010', oldPrice: 1490, newPrice: 890, discount: 40, images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, stock: 15 },
    { id: 18, brand: 'Puma', name: 'Logo Leggings', sku: '52346-01', oldPrice: 1990, newPrice: 1090, discount: 45, images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop'], sizes: ['XS', 'S', 'M', 'L'], inStock: true, stock: 8 },
    { id: 24, brand: 'Nike', name: 'Club Fleece Shorts', sku: 'DM6831-010', oldPrice: 1690, newPrice: 990, discount: 41, images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 12 },
    { id: 25, brand: 'Adidas', name: 'Tiro 23 Training Shorts', sku: 'HT3395', oldPrice: 1390, newPrice: 790, discount: 43, images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, stock: 14 },
    { id: 16, brand: 'Adidas', name: 'Tiro 23 Shorts', sku: 'HT3395', oldPrice: 1390, newPrice: 790, discount: 43, images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true, stock: 14 },
    { id: 22, brand: 'Adidas', name: 'Essentials Hoodie', sku: 'IC9440', oldPrice: 3290, newPrice: 1990, discount: 40, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop'], sizes: ['S', 'M', 'L', 'XL'], inStock: true, stock: 10 },
  ];

  return (
    <>
      <Head>
        <title>OUTLETX | Branded Sportswear. Outlet Prices. | Dua Mall Struga</title>
        <meta name="description" content="Authentic Nike, Adidas, Puma, Jordan, Kappa, Skechers, 4F at outlet prices. Dua Mall, Struga, North Macedonia." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* ========== TOP BAR ========== */}
      <div style={{background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: 4, padding: '10px 20px', textTransform: 'uppercase'}}>
        Dua Mall, Struga &nbsp;&bull;&nbsp; Free Delivery Over 3000 MKD
      </div>

      {/* ========== HEADER ========== */}
      <header style={{
        background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100,
        borderBottom: scrolled ? '1px solid #E5E5E5' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 40px rgba(0,0,0,0.04)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{maxWidth: 1600, margin: '0 auto', padding: '0 40px', height: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 900, color: '#000000', textDecoration: 'none', letterSpacing: -1.5, flexShrink: 0}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span>
          </a>
          <nav style={{display: 'flex', gap: 48, alignItems: 'center'}}>
            {['Men', 'Women', 'Kids', 'Sale'].map((item) => (
              <a key={item} href={item === 'Sale' ? '/products?sort=discount' : `/products?gender=${item.toLowerCase()}`} style={{
                color: '#000000', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = '#DC2626'}
              onMouseLeave={(e) => e.target.style.color = '#000000'}
              >{item}</a>
            ))}
          </nav>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0}}>
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{
              background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 24px', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#B91C1C'; }}
            onMouseLeave={(e) => { e.target.style.background = '#DC2626'; }}
            >Message Us</a>
            <button onClick={() => setCartOpen(!cartOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 8}}>
              <svg width="22" height="22" fill="none" stroke="#000000" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              {cartCount > 0 && (
                <span style={{position: 'absolute', top: -2, right: -4, background: '#DC2626', color: '#FFFFFF', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'none'}}>
              <svg width="22" height="22" fill="none" stroke="#000000" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{background: '#FFFFFF', borderTop: '1px solid #F0F0F0', padding: '12px 40px', display: 'none'}}>
            {['Men', 'Women', 'Kids', 'Sale', 'Contact'].map((item) => (
              <a key={item} href={item === 'Sale' ? '/products?sort=discount' : item === 'Contact' ? '/contact' : `/products?gender=${item.toLowerCase()}`} style={{display: 'block', padding: '16px 0', color: '#000000', textDecoration: 'none', fontSize: 16, fontWeight: 600, borderBottom: '1px solid #F5F5F5'}}>{item}</a>
            ))}
          </div>
        )}
      </header>

      {/* ========== HERO ========== */}
      <HeroSlider />

     {/* ========== BRANDS ========== */}
<section style={{padding: '50px 40px', background: '#FFFFFF', borderBottom: '1px solid #F0F0F0'}}>
  <div style={{maxWidth: 1600, margin: '0 auto'}}>
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 64, flexWrap: 'nowrap',
      overflowX: 'auto', padding: '8px 0',
    }}>
      <a href="/products?brand=nike" style={{flexShrink: 0, textDecoration: 'none', transition: 'all 0.3s', opacity: 0.5}}
        onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.5'; }}>
        <svg viewBox="0 0 200 60" width="120" height="36"><text x="100" y="42" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="28" fill="#000000" letterSpacing="4">NIKE</text></svg>
      </a>
      <a href="/products?brand=adidas" style={{flexShrink: 0, textDecoration: 'none', transition: 'all 0.3s', opacity: 0.5}}
        onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.5'; }}>
        <svg viewBox="0 0 220 60" width="130" height="36"><text x="110" y="42" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="26" fill="#000000" letterSpacing="3">ADIDAS</text></svg>
      </a>
      <a href="/products?brand=puma" style={{flexShrink: 0, textDecoration: 'none', transition: 'all 0.3s', opacity: 0.5}}
        onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.5'; }}>
        <svg viewBox="0 0 200 60" width="110" height="36"><text x="100" y="42" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="26" fill="#000000" letterSpacing="4">PUMA</text></svg>
      </a>
      <a href="/products?brand=jordan" style={{flexShrink: 0, textDecoration: 'none', transition: 'all 0.3s', opacity: 0.5}}
        onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.5'; }}>
        <svg viewBox="0 0 240 60" width="140" height="36"><text x="120" y="42" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="26" fill="#000000" letterSpacing="3">JORDAN</text></svg>
      </a>
      <a href="/products?brand=kappa" style={{flexShrink: 0, textDecoration: 'none', transition: 'all 0.3s', opacity: 0.5}}
        onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.5'; }}>
        <svg viewBox="0 0 200 60" width="120" height="36"><text x="100" y="42" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="26" fill="#000000" letterSpacing="4">KAPPA</text></svg>
      </a>
      <a href="/products?brand=skechers" style={{flexShrink: 0, textDecoration: 'none', transition: 'all 0.3s', opacity: 0.5}}
        onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.5'; }}>
        <svg viewBox="0 0 260" height="60" width="150" height="36"><text x="130" y="42" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="22" fill="#000000" letterSpacing="3">SKECHERS</text></svg>
      </a>
      <a href="/products?brand=4f" style={{flexShrink: 0, textDecoration: 'none', transition: 'all 0.3s', opacity: 0.5}}
        onMouseEnter={(e) => { e.target.style.opacity = '1'; }}
        onMouseLeave={(e) => { e.target.style.opacity = '0.5'; }}>
        <svg viewBox="0 0 120 60" width="70" height="36"><text x="60" y="42" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="32" fill="#000000" letterSpacing="2">4F</text></svg>
      </a>
    </div>
  </div>
</section>

      {/* ========== CATEGORIES ========== */}
      <section style={{background: '#FFFFFF', borderBottom: '1px solid #F0F0F0'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)'}}>
          {[
            { name: 'Shoes', link: '/products?category=shoes' },
            { name: 'Clothing', link: '/products?category=clothing' },
            { name: 'Accessories', link: '/products?category=accessories' },
            { name: 'Men', link: '/products?gender=men' },
            { name: 'Women', link: '/products?gender=women' },
            { name: 'Kids', link: '/products?gender=kids' },
          ].map((cat, i) => (
            <a key={cat.name} href={cat.link} style={{textAlign: 'center', padding: '26px 16px', textDecoration: 'none', color: '#000000', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderRight: i < 5 ? '1px solid #F0F0F0' : 'none', transition: 'all 0.2s'}}
            onMouseEnter={(e) => { e.target.style.background = '#000000'; e.target.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.target.style.background = '#FFFFFF'; e.target.style.color = '#000000'; }}
            >{cat.name}</a>
          ))}
        </div>
      </section>

      {/* ========== BEST SELLERS ========== */}
      <section style={{padding: '90px 40px', background: '#FFFFFF'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 8}}>Most Popular</p>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 40, fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase', margin: 0, lineHeight: 0.9}}>Best Sellers</h2>
            </div>
            <a href="/products" style={{color: '#000000', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: 8, transition: 'all 0.2s', flexShrink: 0}}
            onMouseEnter={(e) => { e.target.style.color = '#DC2626'; e.target.style.borderColor = '#DC2626'; }}
            onMouseLeave={(e) => { e.target.style.color = '#000000'; e.target.style.borderColor = '#000000'; }}
            >View All</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24}}>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== SALE BANNER ========== */}
      <section style={{background: '#DC2626', padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: '-50%', right: '-15%', width: 600, height: 600, background: 'rgba(0,0,0,0.06)', borderRadius: '50%'}} />
        <div style={{position: 'absolute', bottom: '-40%', left: '-10%', width: 400, height: 400, background: 'rgba(0,0,0,0.04)', borderRadius: '50%'}} />
        <div style={{position: 'relative', zIndex: 1}}>
          <p style={{fontSize: 11, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 8}}>Limited Time</p>
          <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 48, fontWeight: 900, letterSpacing: -3, textTransform: 'uppercase', color: '#FFFFFF', marginBottom: 20, lineHeight: 0.9}}>UP TO 70% OFF</h2>
          <a href="/products?sort=discount" style={{background: '#000000', color: '#FFFFFF', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', padding: '16px 40px', display: 'inline-block', transition: 'all 0.2s'}}
          onMouseEnter={(e) => { e.target.style.background = '#1A1A1A'; e.target.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.target.style.background = '#000000'; e.target.style.transform = 'translateY(0)'; }}
          >Shop Sale</a>
        </div>
      </section>

      {/* ========== SALE PRODUCTS ========== */}
      <section style={{padding: '90px 40px', background: '#F9F9F9'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 8}}>Deals</p>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 40, fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase', margin: 0, lineHeight: 0.9}}>Biggest Discounts</h2>
            </div>
            <a href="/products?sort=discount" style={{color: '#000000', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: 8, flexShrink: 0}}>View All</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24}}>
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== GENDER ========== */}
      <section style={{padding: '90px 40px', background: '#FFFFFF'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: 48}}>
            <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 8}}>Shop By</p>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 40, fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase', margin: 0, lineHeight: 0.9}}>Gender</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20}}>
            {[
              { name: 'Men', link: '/products?gender=men', bg: '#0A0A0A' },
              { name: 'Women', link: '/products?gender=women', bg: '#111111' },
              { name: 'Kids', link: '/products?gender=kids', bg: '#0D0D0D' },
            ].map((item) => (
              <a key={item.name} href={item.link} style={{background: item.bg, color: '#FFFFFF', textDecoration: 'none', padding: '100px 40px', textAlign: 'center', display: 'block', transition: 'all 0.4s', borderRadius: 2}}
              onMouseEnter={(e) => { e.target.style.background = '#DC2626'; e.target.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.target.style.background = item.bg; e.target.style.transform = 'scale(1)'; }}
              >
                <span style={{fontFamily: 'Montserrat, sans-serif', fontSize: 36, fontWeight: 900, letterSpacing: -2, display: 'block', marginBottom: 12}}>{item.name}</span>
                <span style={{fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: 8}}>Shop Now</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEW ARRIVALS ========== */}
      <section style={{padding: '90px 40px', background: '#F9F9F9'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <div style={{marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 8}}>Fresh In</p>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 40, fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase', margin: 0, lineHeight: 0.9}}>New Arrivals</h2>
            </div>
            <a href="/products" style={{color: '#000000', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', borderBottom: '2px solid #000000', paddingBottom: 8, flexShrink: 0}}>View All</a>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24}}>
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section style={{padding: '80px 40px', background: '#0A0A0A', color: '#FFFFFF', textAlign: 'center'}}>
        <div style={{maxWidth: 550, margin: '0 auto'}}>
          <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 12}}>Stay Updated</p>
          <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 36, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase', marginBottom: 12}}>Get Exclusive Deals</h2>
          <p style={{color: '#888888', fontSize: 14, marginBottom: 28}}>Be the first to know about new arrivals and special offers.</p>
          {subscribed ? (
            <p style={{color: '#16A34A', fontWeight: 700, fontSize: 15}}>Thank you for subscribing.</p>
          ) : (
            <form onSubmit={handleSubscribe} style={{display: 'flex', gap: 8, maxWidth: 450, margin: '0 auto'}}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" style={{flex: 1, padding: '16px 20px', border: '1px solid #333', background: '#111', color: '#FFF', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'}} />
              <button type="submit" style={{background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '16px 28px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap'}}>Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* ========== STORE ========== */}
      <section style={{padding: '90px 40px', background: '#FFFFFF'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 60, alignItems: 'center'}}>
          <div>
            <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#DC2626', marginBottom: 10}}>Visit Us</p>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 28, textTransform: 'uppercase', lineHeight: 0.9}}>Dua Mall, Struga</h2>
            <div style={{fontSize: 15, color: '#555555', lineHeight: 2.4}}>
              <p style={{margin: 0}}>North Macedonia</p>
              <p style={{fontWeight: 700, color: '#000000', margin: '2px 0', fontSize: 17}}>+389 70 123 456</p>
              <p style={{margin: 0}}>Mon &mdash; Fri: 09:00 &mdash; 21:00</p>
              <p style={{margin: 0}}>Saturday: 09:00 &mdash; 22:00</p>
              <p style={{margin: 0}}>Sunday: 10:00 &mdash; 20:00</p>
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 28}}>
              <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 28px', display: 'inline-block', transition: 'all 0.2s'}}>Instagram</a>
              <a href="/contact" style={{background: 'transparent', color: '#000000', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 28px', border: '1px solid #CCCCCC', display: 'inline-block', transition: 'all 0.2s'}}>Directions</a>
            </div>
          </div>
          <div style={{height: 320, borderRadius: 4, overflow: 'hidden'}}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.6620743480383!2d20.675127836415925!3d41.187039407592515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350e749a513feff%3A0xc0d3f98c173d96b8!2sOutlet%20X!5e0!3m2!1sen!2smk!4v1782426661903!5m2!1sen!2smk" width="100%" height="100%" style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
          </div>
        </div>
      </section>

      {/* ========== RECENTLY VIEWED ========== */}
      <RecentlyViewedHome />

      {/* ========== FOOTER ========== */}
      <footer style={{background: '#0A0A0A', color: '#FFFFFF', padding: '70px 40px 28px'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 48}}>
          <div>
            <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, marginBottom: 14, letterSpacing: -1}}>OUTLET<span style={{color: '#DC2626'}}>X</span></h3>
            <p style={{color: '#666666', fontSize: 13, lineHeight: 1.8, maxWidth: 260}}>Branded sportswear at outlet prices. Dua Mall, Struga, North Macedonia. 100% authentic.</p>
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 10, fontWeight: 700, letterSpacing: 3, marginBottom: 18, textTransform: 'uppercase'}}>Shop</p>
            {['Men', 'Women', 'Kids', 'Shoes', 'Clothing', 'Sale'].map((item) => (
              <a key={item} href="/products" style={{display: 'block', color: '#888888', fontSize: 13, textDecoration: 'none', padding: '4px 0', transition: 'color 0.2s'}}
              onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.target.style.color = '#888888'}
              >{item}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 10, fontWeight: 700, letterSpacing: 3, marginBottom: 18, textTransform: 'uppercase'}}>Brands</p>
            {['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa', 'Skechers'].map((b) => (
              <a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display: 'block', color: '#888888', fontSize: 13, textDecoration: 'none', padding: '4px 0'}}>{b}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 10, fontWeight: 700, letterSpacing: 3, marginBottom: 18, textTransform: 'uppercase'}}>Help</p>
            {['About', 'Contact', 'Shipping', 'Returns'].map((item) => (
              <a key={item} href={item === 'About' ? '/about' : '/contact'} style={{display: 'block', color: '#888888', fontSize: 13, textDecoration: 'none', padding: '4px 0'}}>{item}</a>
            ))}
          </div>
          <div>
            <p style={{color: '#DC2626', fontSize: 10, fontWeight: 700, letterSpacing: 3, marginBottom: 18, textTransform: 'uppercase'}}>Contact</p>
            <p style={{color: '#888', fontSize: 13, margin: '0 0 6px'}}>Dua Mall, Struga</p>
            <p style={{color: '#888', fontSize: 13, margin: '0 0 6px'}}>North Macedonia</p>
            <p style={{color: '#FFF', fontSize: 13, fontWeight: 700, margin: '0 0 6px'}}>+389 70 123 456</p>
            <p style={{color: '#888', fontSize: 13, margin: 0}}>@outletxstruga</p>
          </div>
        </div>
        <div style={{borderTop: '1px solid #1A1A1A', paddingTop: 24, textAlign: 'center', color: '#555555', fontSize: 11, letterSpacing: 1}}>
          &copy; 2024 OUTLETX. All rights reserved. Dua Mall, Struga, North Macedonia.
        </div>
      </footer>
    </>
  );
}