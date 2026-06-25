import { useState } from 'react';
import Head from 'next/head';

export default function Contact() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Contact Us | OUTLETX - Dua Mall Struga</title>
        <meta name="description" content="Contact OUTLETX at Dua Mall, Struga. Get directions, opening hours, and reach us on Instagram." />
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
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '36px', fontWeight: '900', letterSpacing: '-1px', textTransform: 'uppercase', marginBottom: '40px'}}>Contact</h1>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start'}}>
            {/* Info */}
            <div>
              <div style={{marginBottom: '32px'}}>
                <p style={{fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>Visit Our Store</p>
                <p style={{fontSize: '18px', fontWeight: '700', marginBottom: '4px'}}>Dua Mall, Struga</p>
                <p style={{color: '#777777', fontSize: '14px'}}>North Macedonia</p>
              </div>

              <div style={{marginBottom: '32px'}}>
                <p style={{fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>Opening Hours</p>
                <div style={{fontSize: '14px', color: '#555555', lineHeight: '2'}}>
                  <p><strong>Monday - Friday:</strong> 09:00 - 21:00</p>
                  <p><strong>Saturday:</strong> 09:00 - 22:00</p>
                  <p><strong>Sunday:</strong> 10:00 - 20:00</p>
                </div>
              </div>

              <div style={{marginBottom: '32px'}}>
                <p style={{fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>Phone</p>
                <p style={{fontSize: '18px', fontWeight: '700'}}>+389 70 123 456</p>
              </div>

              <div style={{marginBottom: '32px'}}>
                <p style={{fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>Social Media</p>
                <p style={{fontSize: '14px', marginBottom: '6px'}}>Instagram: <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{color: '#DC2626', fontWeight: '700', textDecoration: 'none'}}>@outletxstruga</a></p>
                <p style={{fontSize: '14px'}}>TikTok: <a href="https://tiktok.com/@outletxstruga" target="_blank" rel="noopener noreferrer" style={{color: '#DC2626', fontWeight: '700', textDecoration: 'none'}}>@outletxstruga</a></p>
              </div>

              <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px 24px', display: 'inline-block'}}>
                  Message on Instagram
                </a>
                <a href="tel:+38970123456" style={{background: '#000000', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px 24px', display: 'inline-block'}}>
                  Call Store
                </a>
              </div>
            </div>

            {/* Form */}
            <div style={{background: '#F9F9F9', padding: '32px'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '24px'}}>Send a Message</h2>
              
              {submitted ? (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                  <p style={{fontSize: '18px', fontWeight: '700', marginBottom: '8px'}}>Message Sent</p>
                  <p style={{color: '#777777', fontSize: '14px'}}>Thank you. We will get back to you shortly. For faster responses, message us on Instagram.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontWeight: '700', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', color: '#999999'}}>Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{width: '100%', padding: '12px', border: '1px solid #E5E5E5', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'}} placeholder="Your name" />
                  </div>
                  <div style={{marginBottom: '16px'}}>
                    <label style={{display: 'block', fontWeight: '700', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', color: '#999999'}}>Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{width: '100%', padding: '12px', border: '1px solid #E5E5E5', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'}} placeholder="your@email.com" />
                  </div>
                  <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', fontWeight: '700', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', color: '#999999'}}>Message</label>
                    <textarea required rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{width: '100%', padding: '12px', border: '1px solid #E5E5E5', fontSize: '14px', fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none', boxSizing: 'border-box'}} placeholder="How can we help you?" />
                  </div>
                  <button type="submit" style={{width: '100%', background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'}}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map */}
          <div style={{marginTop: '50px', background: '#F5F5F5', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{textAlign: 'center'}}>
              <p style={{fontSize: '16px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px'}}>Google Maps</p>
              <p style={{color: '#999999', fontSize: '14px'}}>Dua Mall, Struga, North Macedonia</p>
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
