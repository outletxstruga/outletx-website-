import { useState } from 'react';
import Head from 'next/head';

export default function About() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>About Us | OUTLETX - Dua Mall Struga</title>
        <meta name="description" content="Learn about OUTLETX - your trusted branded sportswear outlet at Dua Mall, Struga, North Macedonia." />
      </Head>

      {/* ========== HEADER ========== */}
      <header style={{background: '#FFFFFF', borderBottom: '1px solid #E5E5E5', position: 'sticky', top: 0, zIndex: 100}}>
        <div style={{background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', padding: '8px 20px', textTransform: 'uppercase'}}>
          Dua Mall, Struga &mdash; Open Every Day
        </div>
        <div style={{maxWidth: '1400px', margin: '0 auto', padding: '0 40px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '900', color: '#000000', textDecoration: 'none', letterSpacing: '-0.5px'}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span>
          </a>
          <nav style={{display: 'flex', gap: '36px', alignItems: 'center'}}>
            {['Men', 'Women', 'Kids', 'Brands', 'Sale'].map((item) => (
              <a key={item} href={item === 'Sale' ? '/products?sort=discount' : item === 'Brands' ? '/products' : `/products?gender=${item.toLowerCase()}`} style={{color: '#000000', textDecoration: 'none', fontSize: '14px', fontWeight: '600', letterSpacing: '0.3px', textTransform: 'uppercase'}}>{item}</a>
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

      {/* ========== CONTENT ========== */}
      <section style={{padding: '60px 40px', background: '#FFFFFF', minHeight: '60vh'}}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '900', letterSpacing: '-1px', textTransform: 'uppercase', marginBottom: '8px'}}>About OUTLETX</h1>
          <p style={{color: '#DC2626', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '40px'}}>Dua Mall, Struga</p>

          <div style={{marginBottom: '40px'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '16px'}}>Your Trusted Sportswear Outlet</h2>
            <p style={{color: '#555555', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px'}}>
              OUTLETX is a premium sports and fashion outlet store located in Dua Mall, Struga, North Macedonia. We bring you authentic branded products at outlet prices that make a real difference.
            </p>
            <p style={{color: '#555555', fontSize: '15px', lineHeight: '1.8'}}>
              Our store features a curated selection from Nike, Adidas, Puma, Kappa, Skechers, 4F, and Jordan. Shoes, clothing, and accessories for men, women, and kids — all genuine, all discounted.
            </p>
          </div>

          <div style={{marginBottom: '40px'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '16px'}}>Why We Exist</h2>
            <p style={{color: '#555555', fontSize: '15px', lineHeight: '1.8', marginBottom: '16px'}}>
              Everyone deserves quality branded sportswear without paying full retail. By operating as an outlet, we pass savings directly to you — typically 30% to 70% off.
            </p>
            <p style={{color: '#555555', fontSize: '15px', lineHeight: '1.8'}}>
              Every product is 100% authentic, sourced directly from authorized distributors and brand clearances.
            </p>
          </div>

          <div style={{background: '#F9F9F9', padding: '28px', marginBottom: '40px'}}>
            <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '16px'}}>Store Information</h3>
            <p style={{color: '#555555', fontSize: '14px', lineHeight: '2'}}>
              <strong>Location:</strong> Dua Mall, Struga, North Macedonia<br/>
              <strong>Phone:</strong> +389 70 123 456<br/>
              <strong>Instagram:</strong> @outletxstruga<br/>
              <strong>Hours:</strong> Mon-Fri 09:00-21:00 | Sat 09:00-22:00 | Sun 10:00-20:00
            </p>
          </div>

          <div style={{display: 'flex', gap: '12px'}}>
            <a href="/products" style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px 28px', display: 'inline-block'}}>Browse Products</a>
            <a href="/contact" style={{background: '#000000', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px 28px', display: 'inline-block'}}>Contact Us</a>
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

