import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminSlider() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slides, setSlides] = useState([
    {
      image: '/images/products/7cb29c20-38f9-4025-9e04-4d1c1b3ac7e4.png',
      title: 'BRANDED SPORTSWEAR.',
      subtitle: 'OUTLET PRICES.',
      tag: 'Dua Mall, Struga — Outlet Store',
      description: 'Nike. Adidas. Puma. Jordan. Kappa. Skechers. 4F. 100% authentic. Up to 70% off.',
      link: '/products', linkText: 'Shop All Deals',
      link2: '/products?gender=men', linkText2: 'Men',
      link3: '/products?gender=women', linkText3: 'Women',
    },
    {
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&h=700&fit=crop',
      title: 'NEW COLLECTION.',
      subtitle: 'JUST LANDED.',
      tag: 'Fresh Stock — Limited Quantities',
      description: 'Latest arrivals from Nike, Adidas, and Jordan.',
      link: '/products', linkText: 'Shop New',
      link2: '/products?brand=nike', linkText2: 'Nike',
      link3: '/products?brand=jordan', linkText3: 'Jordan',
    },
    {
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1400&h=700&fit=crop',
      title: 'UP TO 70% OFF.',
      subtitle: 'BIGGEST SALE.',
      tag: 'Limited Time',
      description: 'Massive discounts on top brands.',
      link: '/products?sort=discount', linkText: 'Shop Sale',
      link2: '/products?gender=kids', linkText2: 'Kids',
      link3: '/products?category=shoes', linkText3: 'Shoes',
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    const savedSlides = localStorage.getItem('outletx_slides');
    if (savedSlides) setSlides(JSON.parse(savedSlides));
  }, []);

  const handleSave = () => {
    localStorage.setItem('outletx_slides', JSON.stringify(slides));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSlide = (index, field, value) => {
    const updated = [...slides];
    updated[index][field] = value;
    setSlides(updated);
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };
  if (!authorized) return null;

  const IS = { width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const LS = { display: 'block', fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', marginBottom: 4 };

  return (
    <>
      <Head><title>Slider | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, margin: 0}}>OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888', fontSize: 12, fontWeight: 400}}>Slider</span></h1>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap'}}>
            <a href="/admin" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Dashboard</a>
            <button onClick={handleLogout} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, padding: '7px 14px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: 1200, margin: '0 auto', padding: '24px'}}>
          <p style={{color: '#999', fontSize: 12, marginBottom: 20}}>Manage the 3 hero slides on your homepage. Update images, text, and links.</p>

          {slides.map((slide, i) => (
            <div key={i} style={{background: '#FFF', padding: 24, marginBottom: 20, border: '1px solid #F0F0F0'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 16}}>Slide {i + 1}</h2>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12}}>
                <div><label style={LS}>Image URL</label><input value={slide.image} onChange={(e) => updateSlide(i, 'image', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Tag (top badge)</label><input value={slide.tag} onChange={(e) => updateSlide(i, 'tag', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Title</label><input value={slide.title} onChange={(e) => updateSlide(i, 'title', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Subtitle (red)</label><input value={slide.subtitle} onChange={(e) => updateSlide(i, 'subtitle', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Description</label><input value={slide.description} onChange={(e) => updateSlide(i, 'description', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Button 1 Text</label><input value={slide.linkText} onChange={(e) => updateSlide(i, 'linkText', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Button 1 Link</label><input value={slide.link} onChange={(e) => updateSlide(i, 'link', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Button 2 Text</label><input value={slide.linkText2} onChange={(e) => updateSlide(i, 'linkText2', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Button 2 Link</label><input value={slide.link2} onChange={(e) => updateSlide(i, 'link2', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Button 3 Text</label><input value={slide.linkText3} onChange={(e) => updateSlide(i, 'linkText3', e.target.value)} style={IS} /></div>
                <div><label style={LS}>Button 3 Link</label><input value={slide.link3} onChange={(e) => updateSlide(i, 'link3', e.target.value)} style={IS} /></div>
              </div>
              {slide.image && (
                <div style={{marginTop: 12, background: '#F5F5F5', padding: 8, borderRadius: 2}}>
                  <p style={{fontSize: 10, color: '#999', marginBottom: 4}}>Preview:</p>
                  <img src={slide.image} alt="" style={{maxWidth: '100%', maxHeight: 200, objectFit: 'cover'}} />
                </div>
              )}
            </div>
          ))}

          <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <button onClick={handleSave} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 36px', cursor: 'pointer'}}>Save All Slides</button>
            {saved && <span style={{color: '#16A34A', fontSize: 13, fontWeight: 700}}>Saved!</span>}
          </div>
        </div>
      </div>
    </>
  );
}