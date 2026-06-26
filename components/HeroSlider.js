import { useState, useEffect, useCallback } from 'react';

const defaultSlides = [
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
];

export default function HeroSlider() {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('outletx_slides');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length === 3) setSlides(parsed);
      } catch {}
    }
  }, []);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section style={{background: '#000000', color: '#FFFFFF', position: 'relative', overflow: 'hidden', minHeight: 600, display: 'flex', alignItems: 'center'}}>
      <div style={{position: 'absolute', inset: 0, transition: 'opacity 0.6s ease', opacity: isTransitioning ? 0.5 : 1}}>
        <img src={slide.image} alt="" style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'}} />
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.15) 100%)', zIndex: 1}} />
      <div style={{maxWidth: 1400, margin: '0 auto', padding: '100px 40px', position: 'relative', zIndex: 2, width: '100%'}}>
        <div style={{maxWidth: 560}}>
          <div style={{display: 'inline-block', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', padding: '6px 14px', marginBottom: 28}}>
            <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#DC2626', margin: 0}}>{slide.tag}</p>
          </div>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 64, fontWeight: 900, lineHeight: 0.98, marginBottom: 24, letterSpacing: -2.5}}>
            {slide.title}<br/><span style={{color: '#DC2626'}}>{slide.subtitle}</span>
          </h1>
          <p style={{fontSize: 17, color: '#AAAAAA', marginBottom: 40, lineHeight: 1.7}}>{slide.description}</p>
          <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
            <a href={slide.link} style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '18px 36px', display: 'inline-block', transition: 'all 0.2s'}}
            onMouseEnter={(e) => { e.target.style.background = '#B91C1C'; e.target.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.target.style.background = '#DC2626'; e.target.style.transform = 'translateY(0)'; }}
            >{slide.linkText}</a>
            {slide.link2 && <a href={slide.link2} style={{background: 'transparent', color: '#FFFFFF', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '18px 36px', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-block', transition: 'all 0.2s'}}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.6)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            >{slide.linkText2}</a>}
            {slide.link3 && <a href={slide.link3} style={{background: 'transparent', color: '#FFFFFF', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '18px 36px', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-block', transition: 'all 0.2s'}}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.6)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
            >{slide.linkText3}</a>}
          </div>
        </div>
      </div>
      <button onClick={prev} style={{position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'}}
      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
      onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
      >&#8249;</button>
      <button onClick={next} style={{position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'}}
      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
      onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
      >&#8250;</button>
      <div style={{position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 10}}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{width: i === current ? 28 : 10, height: 10, borderRadius: 5, background: i === current ? '#DC2626' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s'}} />
        ))}
      </div>
    </section>
  );
}