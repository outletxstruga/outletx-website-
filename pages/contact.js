import { useState } from 'react';
import Head from 'next/head';

const S = {
  header: { background: '#FFFFFF', borderBottom: '1px solid #E5E5E5', position: 'sticky', top: 0, zIndex: 100 },
  topBar: { background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '8px 20px', textTransform: 'uppercase' },
  headerInner: { maxWidth: 1400, margin: '0 auto', padding: '0 40px', height: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, color: '#000000', textDecoration: 'none', letterSpacing: '-0.5px' },
  nav: { display: 'flex', gap: 36 },
  navLink: { color: '#000000', textDecoration: 'none', fontSize: 14, fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' },
  navLinkActive: { color: '#DC2626', textDecoration: 'none', fontSize: 14, fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase' },
  cta: { background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '10px 20px' },
  mobileBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  mobileMenu: { background: '#FFFFFF', borderTop: '1px solid #E5E5E5', padding: '16px 40px' },
  mobileLink: { display: 'block', padding: '12px 0', color: '#000000', textDecoration: 'none', fontSize: 16, fontWeight: 600, borderBottom: '1px solid #F0F0F0' },
  map: { height: 400, width: '100%' },
  section: { padding: '60px 40px', background: '#FFFFFF' },
  container: { maxWidth: 1200, margin: '0 auto' },
  title: { fontFamily: 'Montserrat, sans-serif', fontSize: 36, fontWeight: 900, letterSpacing: '-1px', textTransform: 'uppercase', marginBottom: 40 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#DC2626', marginBottom: 8 },
  heading: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  subtext: { color: '#777777', fontSize: 14 },
  formBox: { background: '#F9F9F9', padding: 32 },
  formTitle: { fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: 24 },
  input: { width: '100%', padding: 12, border: '1px solid #E5E5E5', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' },
  inputLabel: { display: 'block', fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#999999', marginBottom: 6 },
  submitBtn: { width: '100%', background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  btnRed: { background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px 24px', display: 'inline-block' },
  btnBlack: { background: '#000000', color: '#FFFFFF', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px 24px', display: 'inline-block' },
  footer: { background: '#000000', color: '#FFFFFF', padding: '50px 40px 30px' },
  footerGrid: { maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, marginBottom: 40 },
  footerLogo: { fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' },
  footerHeading: { color: '#DC2626', fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' },
  footerLink: { display: 'block', color: '#888888', fontSize: 13, textDecoration: 'none', padding: '3px 0' },
  footerBottom: { borderTop: '1px solid #222222', paddingTop: 24, textAlign: 'center', color: '#555555', fontSize: 12 },
  iframe: { border: 'none' },
};

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
        <meta name="description" content="Contact OUTLETX at Dua Mall, Struga." />
      </Head>

      <header style={S.header}>
        <div style={S.topBar}>Dua Mall, Struga &mdash; Open Every Day</div>
        <div style={S.headerInner}>
          <a href="/" style={S.logo}>OUTLET<span style={{color: '#DC2626'}}>X</span></a>
          <nav style={S.nav}>
            <a href="/" style={S.navLink}>Home</a>
            <a href="/products" style={S.navLink}>Products</a>
            <a href="/about" style={S.navLink}>About</a>
            <a href="/contact" style={S.navLinkActive}>Contact</a>
          </nav>
          <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={S.cta}>Message Us</a>
            <button onClick={() => setMenuOpen(!menuOpen)} style={S.mobileBtn}>
              <svg width="24" height="24" fill="none" stroke="#000000" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={S.mobileMenu}>
            <a href="/" style={S.mobileLink}>Home</a>
            <a href="/products" style={S.mobileLink}>Products</a>
            <a href="/about" style={S.mobileLink}>About</a>
            <a href="/contact" style={{...S.mobileLink, color: '#DC2626'}}>Contact</a>
          </div>
        )}
      </header>

      <div style={S.map}>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.6620743480383!2d20.675127836415925!3d41.187039407592515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350e749a513feff%3A0xc0d3f98c173d96b8!2sOutlet%20X!5e0!3m2!1sen!2smk!4v1782426661903!5m2!1sen!2smk" width="100%" height="100%" style={S.iframe} allowFullScreen="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
      </div>

      <section style={S.section}>
        <div style={S.container}>
          <h1 style={S.title}>Contact</h1>
          <div style={S.grid}>
            <div>
              <div style={{marginBottom: 32}}>
                <p style={S.label}>Visit Our Store</p>
                <p style={S.heading}>Dua Mall, Struga</p>
                <p style={S.subtext}>North Macedonia</p>
              </div>
              <div style={{marginBottom: 32}}>
                <p style={S.label}>Opening Hours</p>
                <p style={{fontSize: 14, color: '#555', lineHeight: 2}}><strong>Monday - Friday:</strong> 09:00 - 21:00</p>
                <p style={{fontSize: 14, color: '#555', lineHeight: 2}}><strong>Saturday:</strong> 09:00 - 22:00</p>
                <p style={{fontSize: 14, color: '#555', lineHeight: 2}}><strong>Sunday:</strong> 10:00 - 20:00</p>
              </div>
              <div style={{marginBottom: 32}}>
                <p style={S.label}>Phone</p>
                <p style={S.heading}>+389 70 123 456</p>
              </div>
              <div style={{marginBottom: 32}}>
                <p style={S.label}>Social Media</p>
                <p style={{fontSize: 14, marginBottom: 6}}>Instagram: <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{color: '#DC2626', fontWeight: 700, textDecoration: 'none'}}>@outletxstruga</a></p>
              </div>
              <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={S.btnRed}>Message on Instagram</a>
                <a href="tel:+38970123456" style={S.btnBlack}>Call Store</a>
              </div>
            </div>
            <div style={S.formBox}>
              <h2 style={S.formTitle}>Send a Message</h2>
              {submitted ? (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                  <p style={{fontSize: 18, fontWeight: 700, marginBottom: 8}}>Message Sent</p>
                  <p style={{color: '#777', fontSize: 14}}>Thank you. For faster responses, message us on Instagram.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{marginBottom: 16}}><label style={S.inputLabel}>Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={S.input} placeholder="Your name" /></div>
                  <div style={{marginBottom: 16}}><label style={S.inputLabel}>Email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={S.input} placeholder="your@email.com" /></div>
                  <div style={{marginBottom: 20}}><label style={S.inputLabel}>Message</label><textarea required rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{...S.input, resize: 'vertical'}} placeholder="How can we help you?" /></div>
                  <button type="submit" style={S.submitBtn}>Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={S.footer}>
        <div style={S.footerGrid}>
          <div>
            <h3 style={S.footerLogo}>OUTLET<span style={{color: '#DC2626'}}>X</span></h3>
            <p style={{color: '#777', fontSize: 13, lineHeight: 1.7}}>Branded sportswear at outlet prices. Dua Mall, Struga.</p>
          </div>
          <div>
            <p style={S.footerHeading}>Shop</p>
            {['Men', 'Women', 'Kids', 'Shoes', 'Clothing', 'Accessories'].map((item) => (
              <a key={item} href="/products" style={S.footerLink}>{item}</a>
            ))}
          </div>
          <div>
            <p style={S.footerHeading}>Brands</p>
            {['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa', 'Skechers'].map((b) => (
              <a key={b} href={`/products?brand=${b.toLowerCase()}`} style={S.footerLink}>{b}</a>
            ))}
          </div>
          <div>
            <p style={S.footerHeading}>Info</p>
            <a href="/about" style={S.footerLink}>About</a>
            <a href="/contact" style={S.footerLink}>Contact</a>
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={S.footerLink}>Instagram</a>
          </div>
        </div>
        <div style={S.footerBottom}>&copy; 2024 OUTLETX. All rights reserved. Dua Mall, Struga, North Macedonia.</div>
      </footer>
    </>
  );
}