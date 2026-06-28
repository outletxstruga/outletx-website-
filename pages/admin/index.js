import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import HeroSlider from '../components/HeroSlider';
import RecentlyViewedHome from '../components/RecentlyViewedHome';
import { useLanguage } from '../context/LanguageContext';
import products from '../data/products';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { lang, toggleLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', handleResize); };
  }, []);

  const bestSellers = products.filter(p => p.featured && p.inStock).slice(0, 8);
  const saleProducts = products.filter(p => p.discount >= 40 && p.inStock).sort((a, b) => b.discount - a.discount).slice(0, 8);
  const newArrivals = products.filter(p => p.inStock).slice(-8).reverse();

  const M = isMobile;
  const P = M ? '56px 14px' : '96px 36px';
  const T = M ? 25 : 38;

  const navItems = [
    { label: t && t.nav && t.nav.men ? t.nav.men : 'MEN', href: '/products?gender=men' },
    { label: t && t.nav && t.nav.women ? t.nav.women : 'WOMEN', href: '/products?gender=women' },
    { label: t && t.nav && t.nav.kids ? t.nav.kids : 'KIDS', href: '/products?gender=kids' },
    { label: t && t.nav && t.nav.sale ? t.nav.sale : 'SALE', href: '/products?sort=discount' }
  ];

  const categories = [
    { label: 'SHOES', href: '/products?category=shoes', note: 'Premium pairs' },
    { label: 'CLOTHING', href: '/products?category=clothing', note: 'Sport style' },
    { label: 'ACCESSORIES', href: '/products?category=accessories', note: 'Daily details' },
    { label: 'MEN', href: '/products?gender=men', note: 'Sharp fits' },
    { label: 'WOMEN', href: '/products?gender=women', note: 'Clean selection' },
    { label: 'KIDS', href: '/products?gender=kids', note: 'Outlet picks' }
  ];

  const brandList = ['NIKE', 'ADIDAS', 'PUMA', 'JORDAN', 'KAPPA', 'SKECHERS', '4F'];

  const sectionHeader = (eyebrow, title, subtitle, dark) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: M ? 'flex-start' : 'flex-end',
      flexDirection: M ? 'column' : 'row',
      gap: M ? 16 : 36,
      margin: M ? '0 0 34px' : '0 0 54px'
    }}>
      <div>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: dark ? '#888' : '#DC2626',
          margin: '0 0 12px'
        }}>
          {eyebrow}
        </p>
        <h2 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: T,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: M ? -1 : -2,
          textTransform: 'uppercase',
          color: dark ? '#FFF' : '#000',
          margin: '0'
        }}>
          {title}
        </h2>
      </div>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: M ? 12 : 14,
        lineHeight: 1.8,
        color: dark ? '#888' : '#666',
        maxWidth: 470,
        margin: '0'
      }}>
        {subtitle}
      </p>
    </div>
  );

  const premiumButton = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    color: '#FFF',
    textDecoration: 'none',
    fontFamily: 'Inter, sans-serif',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: 'uppercase',
    padding: M ? '13px 28px' : '15px 38px',
    border: '1px solid #000',
    transition: 'all 0.25s ease'
  };

  return (
    <>
      <Head>
        <title>OUTLETX | Branded Sportswear. Outlet Prices. | Dua Mall Struga</title>
        <meta name="description" content={t && t.hero && t.hero.desc ? t.hero.desc : 'OUTLETX Struga - premium branded sportswear at outlet prices.'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{
        background: '#000',
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        fontSize: M ? 8 : 9,
        fontWeight: 800,
        letterSpacing: M ? 2 : 4,
        padding: M ? '9px 10px' : '10px 14px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #111'
      }}>
        Dua Mall, Struga &nbsp; | &nbsp; Original Brands &nbsp; | &nbsp; Outlet Prices 10-70% Off
      </div>

      <header style={{
        background: scrolled ? '#FFF' : 'rgba(255,255,255,0.96)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: scrolled ? '1px solid #DDD' : '1px solid #EEE',
        boxShadow: scrolled ? '0 18px 45px rgba(0,0,0,0.10)' : '0 0 0 rgba(0,0,0,0)',
        transition: 'all 0.25s ease'
      }}>
        <div style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: M ? '0 14px' : '0 38px',
          height: M ? 58 : 74,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="/" style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: M ? 22 : 28,
            fontWeight: 900,
            color: '#000',
            textDecoration: 'none',
            letterSpacing: -1
          }}>
            OUTLET<span style={{ color: '#DC2626' }}>X</span>
          </a>

          {!M && (
            <nav style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
              {navItems.map(i => (
                <a
                  key={i.label}
                  href={i.href}
                  style={{
                    color: i.href.indexOf('discount') > -1 ? '#DC2626' : '#111',
                    textDecoration: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    padding: '28px 0',
                    borderBottom: '2px solid transparent',
                    transition: 'all 0.22s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderBottom = '2px solid #DC2626';
                    e.currentTarget.style.color = '#DC2626';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderBottom = '2px solid transparent';
                    e.currentTarget.style.color = i.href.indexOf('discount') > -1 ? '#DC2626' : '#111';
                  }}
                >
                  {i.label}
                </a>
              ))}
            </nav>
          )}

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {!M && (
              <a href="/products?sort=discount" style={{
                background: '#111',
                color: '#FFF',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                padding: '9px 14px',
                border: '1px solid #111',
                transition: 'all 0.22s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#DC2626';
                e.currentTarget.style.border = '1px solid #DC2626';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#111';
                e.currentTarget.style.border = '1px solid #111';
              }}>
                Sale
              </a>
            )}

            <button onClick={toggleLang} style={{
              background: '#FFF',
              border: '1px solid #DDD',
              color: '#000',
              padding: '7px 10px',
              fontSize: 10,
              fontWeight: 900,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: 1
            }}>
              {lang === 'mk' ? 'MK' : lang === 'sq' ? 'SQ' : 'EN'}
            </button>

            <button onClick={() => setCartOpen(!cartOpen)} style={{
              background: '#FFF',
              border: '1px solid #DDD',
              cursor: 'pointer',
              position: 'relative',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width={18} height={18} fill="none" stroke="#000" strokeWidth="1.6" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: '#DC2626',
                  color: '#FFF',
                  fontSize: 8,
                  fontWeight: 900,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: '#000',
              border: '1px solid #000',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width={18} height={18} fill="none" stroke="#FFF" strokeWidth="1.7" viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{
            background: '#0A0A0A',
            borderTop: '1px solid #222',
            padding: M ? '14px 18px 20px' : '18px 38px 26px',
            boxShadow: '0 25px 55px rgba(0,0,0,0.22)'
          }}>
            {[...navItems, { label: 'CONTACT', href: '/contact' }].map(i => (
              <a key={i.label} href={i.href} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 0',
                color: '#FFF',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                borderBottom: '1px solid #1A1A1A',
                fontFamily: 'Inter, sans-serif'
              }}>
                {i.label}
                <span style={{ color: '#DC2626' }}>→</span>
              </a>
            ))}
          </div>
        )}
      </header>

      <div style={{ background: '#000' }}>
        <HeroSlider />
      </div>

      <section style={{
        background: '#0A0A0A',
        borderTop: '1px solid #111',
        borderBottom: '1px solid #1A1A1A'
      }}>
        <div style={{
          maxWidth: 1480,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(6,1fr)'
        }}>
          {categories.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              style={{
                minHeight: M ? 96 : 124,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: M ? '18px 16px' : '24px 22px',
                textDecoration: 'none',
                color: '#FFF',
                borderRight: !M && i < 5 ? '1px solid #1A1A1A' : 'none',
                borderBottom: M ? '1px solid #1A1A1A' : 'none',
                background: '#0A0A0A',
                transition: 'all 0.28s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#151515';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#0A0A0A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: M ? 18 : 22,
                fontWeight: 900,
                letterSpacing: -1,
                textTransform: 'uppercase'
              }}>
                {c.label}
              </span>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#777'
              }}>
                {c.note} →
              </span>
            </a>
          ))}
        </div>

        <div style={{
          maxWidth: 1480,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: M ? '1fr' : '1fr 2fr 1fr',
          borderTop: '1px solid #1A1A1A'
        }}>
          <div style={{
            padding: M ? '18px 18px' : '22px 28px',
            borderRight: M ? 'none' : '1px solid #1A1A1A',
            borderBottom: M ? '1px solid #1A1A1A' : 'none'
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 3,
              color: '#DC2626',
              textTransform: 'uppercase',
              margin: '0 0 6px'
            }}>
              Trusted Outlet
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: '#999',
              lineHeight: 1.7,
              margin: '0'
            }}>
              Original sports and fashion brands in Dua Mall, Struga.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: M ? 18 : 30,
            flexWrap: 'wrap',
            padding: M ? '18px 14px' : '22px 28px',
            borderRight: M ? 'none' : '1px solid #1A1A1A',
            borderBottom: M ? '1px solid #1A1A1A' : 'none'
          }}>
            {brandList.map(b => (
              <span key={b} style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: M ? 11 : 13,
                fontWeight: 900,
                letterSpacing: 2,
                color: '#FFF'
              }}>
                {b}
              </span>
            ))}
          </div>

          <div style={{
            padding: M ? '18px 18px' : '22px 28px',
            textAlign: M ? 'left' : 'right'
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 3,
              color: '#DC2626',
              textTransform: 'uppercase',
              margin: '0 0 6px'
            }}>
              Price Advantage
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: '#999',
              lineHeight: 1.7,
              margin: '0'
            }}>
              Discounts from 10% to 70% while stock lasts.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: P, background: '#FFF' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          {sectionHeader(
            'Customer Favorites',
            t && t.sections && t.sections.bestSellers ? t.sections.bestSellers : 'Best Sellers',
            'Fast-moving branded pieces selected for stronger everyday sell-through: shoes, clothing and accessories with outlet pricing.',
            false
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
            gap: M ? 12 : 22
          }}>
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          <div style={{ textAlign: 'center', margin: M ? '34px 0 0' : '50px 0 0' }}>
            <a
              href="/products"
              style={premiumButton}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#DC2626';
                e.currentTarget.style.border = '1px solid #DC2626';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#000';
                e.currentTarget.style.border = '1px solid #000';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      <section style={{
        background: '#000',
        padding: M ? '64px 14px' : '104px 36px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: M ? -40 : -80,
          right: M ? -100 : -140,
          width: M ? 220 : 420,
          height: M ? 220 : 420,
          border: '1px solid #222',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: M ? -70 : -120,
          left: M ? -90 : -130,
          width: M ? 180 : 340,
          height: M ? 180 : 340,
          border: '1px solid #1A1A1A',
          borderRadius: '50%'
        }} />

        <div style={{
          maxWidth: 1180,
          margin: '0 auto',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: M ? '1fr' : '0.9fr 1.1fr',
          gap: M ? 32 : 54,
          alignItems: 'center'
        }}>
          <div style={{
            border: '1px solid #222',
            padding: M ? '26px 20px' : '42px 38px',
            background: '#0A0A0A'
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#DC2626',
              margin: '0 0 18px'
            }}>
              Premium Outlet Event
            </p>
            <h2 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: M ? 44 : 76,
              fontWeight: 900,
              lineHeight: 0.82,
              letterSpacing: M ? -2 : -4,
              textTransform: 'uppercase',
              color: '#FFF',
              margin: '0'
            }}>
              Up To<br />
              <span style={{ color: '#DC2626' }}>70%</span> Off
            </h2>
          </div>

          <div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: M ? 13 : 15,
              lineHeight: 1.9,
              color: '#999',
              margin: '0 0 26px',
              maxWidth: 560
            }}>
              This should feel like a smart buy, not a cheap discount. Original brands, limited outlet stock, sharper prices, and sizes that move fast.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: M ? '1fr' : 'repeat(3,1fr)',
              gap: 10,
              margin: '0 0 30px'
            }}>
              {['Limited Sizes', 'Original Brands', 'Outlet Pricing'].map(i => (
                <div key={i} style={{
                  border: '1px solid #222',
                  padding: '14px 12px',
                  color: '#FFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  background: '#0A0A0A'
                }}>
                  {i}
                </div>
              ))}
            </div>

            <a
              href="/products?sort=discount"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#DC2626',
                color: '#FFF',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: 'uppercase',
                padding: M ? '15px 34px' : '17px 44px',
                border: '1px solid #DC2626',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#FFF';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.border = '1px solid #FFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#DC2626';
                e.currentTarget.style.color = '#FFF';
                e.currentTarget.style.border = '1px solid #DC2626';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Shop Sale Now
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: P, background: '#FAFAFA' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          {sectionHeader(
            'Highest Markdown',
            t && t.sections && t.sections.biggestDiscounts ? t.sections.biggestDiscounts : 'Biggest Discounts',
            'The strongest price drops in stock right now. Clean selection, no noise, only the deals with serious value.',
            false
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
            gap: M ? 12 : 22
          }}>
            {saleProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section style={{ background: '#0A0A0A', padding: P }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          {sectionHeader(
            'Shop The Edit',
            'Gender',
            'Move customers faster into the right collection. Clean navigation, premium dark layout, direct buying flow.',
            true
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: M ? '1fr' : 'repeat(3,1fr)',
            gap: M ? 12 : 16
          }}>
            {['MEN', 'WOMEN', 'KIDS'].map((g, index) => (
              <a
                key={g}
                href={`/products?gender=${g.toLowerCase()}`}
                style={{
                  background: index === 1 ? '#151515' : '#111',
                  color: '#FFF',
                  textDecoration: 'none',
                  padding: M ? '48px 24px' : '86px 38px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: M ? 160 : 280,
                  border: '1px solid #222',
                  transition: 'all 0.32s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#1A1A1A';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.border = '1px solid #333';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = index === 1 ? '#151515' : '#111';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = '1px solid #222';
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 22,
                  right: 22,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: '#DC2626'
                }}>
                  0{index + 1}
                </span>

                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: M ? 34 : 52,
                  fontWeight: 900,
                  letterSpacing: M ? -1 : -3,
                  lineHeight: 0.9,
                  display: 'block'
                }}>
                  {g}
                </span>

                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: '#888'
                }}>
                  Shop Collection →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: P, background: '#FFF' }}>
        <div style={{ maxWidth: 1480, margin: '0 auto' }}>
          {sectionHeader(
            'Fresh Stock',
            t && t.sections && t.sections.newArrivals ? t.sections.newArrivals : 'New Arrivals',
            'Recently added products for customers who want the newest outlet pieces before sizes disappear.',
            false
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
            gap: M ? 12 : 22
          }}>
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section style={{
        padding: P,
        background: '#FAFAFA',
        borderTop: '1px solid #EEE'
      }}>
        <div style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: M ? '1fr' : '0.82fr 1.18fr',
          gap: M ? 28 : 52,
          alignItems: 'stretch'
        }}>
          <div style={{
            background: '#000',
            color: '#FFF',
            padding: M ? '34px 24px' : '48px 42px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid #000'
          }}>
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: '#DC2626',
                margin: '0 0 14px'
              }}>
                Visit The Store
              </p>
              <h2 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: M ? 31 : 44,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 0.95,
                textTransform: 'uppercase',
                margin: '0 0 24px',
                color: '#FFF'
              }}>
                Dua Mall,<br />Struga
              </h2>

              <p style={{
                color: '#999',
                fontSize: 13,
                lineHeight: 1.8,
                margin: '0 0 20px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Premium branded sportswear outlet in North Macedonia.
              </p>

              <p style={{ color: '#FFF', fontWeight: 900, fontSize: 14, margin: '0 0 18px', fontFamily: 'Inter, sans-serif' }}>
                +389 70 123 456
              </p>

              <div style={{ borderTop: '1px solid #222', padding: '18px 0 0', margin: '0 0 26px' }}>
                <p style={{ color: '#999', fontSize: 12, margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>Mon—Fri: 09:00—21:00</p>
                <p style={{ color: '#999', fontSize: 12, margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>Sat: 09:00—22:00</p>
                <p style={{ color: '#999', fontSize: 12, margin: '0', fontFamily: 'Inter, sans-serif' }}>Sun: 10:00—20:00</p>
              </div>
            </div>

            <a
              href="https://instagram.com/outletxstruga"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                width: M ? '100%' : 'fit-content',
                justifyContent: 'center',
                background: '#DC2626',
                color: '#FFF',
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 2,
                textTransform: 'uppercase',
                padding: '13px 26px',
                border: '1px solid #DC2626',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#FFF';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.border = '1px solid #FFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#DC2626';
                e.currentTarget.style.color = '#FFF';
                e.currentTarget.style.border = '1px solid #DC2626';
              }}
            >
              @outletxstruga
            </a>
          </div>

          <div style={{
            minHeight: M ? 260 : 430,
            overflow: 'hidden',
            border: '1px solid #DDD',
            background: '#FFF'
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.6620743480383!2d20.675127836415925!3d41.187039407592515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350e749a513feff%3A0xc0d3f98c173d96b8!2sOutlet%20X!5e0!3m2!1sen!2smk!4v1782426661903!5m2!1sen!2smk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>

      <RecentlyViewedHome />

      <footer style={{
        background: '#050505',
        color: '#FFF',
        borderTop: '1px solid #111',
        padding: M ? '50px 14px 28px' : '78px 36px 34px'
      }}>
        <div style={{
          maxWidth: 1480,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: M ? 'repeat(2,1fr)' : '2.2fr 1fr 1fr 1fr',
          gap: M ? 28 : 48,
          marginBottom: M ? 34 : 52
        }}>
          <div style={M ? { gridColumn: 'span 2' } : {}}>
            <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: M ? 27 : 34,
              fontWeight: 900,
              margin: '0 0 14px',
              letterSpacing: -2
            }}>
              OUTLET<span style={{ color: '#DC2626' }}>X</span>
            </h3>
            <p style={{
              color: '#999',
              fontSize: 13,
              lineHeight: 1.9,
              margin: '0 0 22px',
              maxWidth: 420,
              fontFamily: 'Inter, sans-serif'
            }}>
              Luxury outlet feel. Branded sportswear prices. Shoes, clothing and accessories for men, women and kids in Dua Mall, Struga.
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}>
              {brandList.map(b => (
                <span key={b} style={{
                  border: '1px solid #222',
                  color: '#888',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 2,
                  padding: '7px 9px'
                }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 3,
              textTransform: 'uppercase',
              margin: '0 0 16px',
              color: '#DC2626',
              fontFamily: 'Inter, sans-serif'
            }}>
              Shop
            </p>
            {[
              { label: 'Men', link: '/products?gender=men' },
              { label: 'Women', link: '/products?gender=women' },
              { label: 'Kids', link: '/products?gender=kids' },
              { label: 'Shoes', link: '/products?category=shoes' },
              { label: 'Clothing', link: '/products?category=clothing' },
              { label: 'Sale', link: '/products?sort=discount' }
            ].map(i => (
              <a key={i.label} href={i.link} style={{
                display: 'block',
                color: '#888',
                fontSize: 12,
                textDecoration: 'none',
                padding: '5px 0',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
                {i.label}
              </a>
            ))}
          </div>

          <div>
            <p style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 3,
              textTransform: 'uppercase',
              margin: '0 0 16px',
              color: '#FFF',
              fontFamily: 'Inter, sans-serif'
            }}>
              Brands
            </p>
            {['Nike', 'Adidas', 'Puma', 'Jordan', 'Kappa', 'Skechers'].map(b => (
              <a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{
                display: 'block',
                color: '#888',
                fontSize: 12,
                textDecoration: 'none',
                padding: '5px 0',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
                {b}
              </a>
            ))}
          </div>

          <div>
            <p style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 3,
              textTransform: 'uppercase',
              margin: '0 0 16px',
              color: '#FFF',
              fontFamily: 'Inter, sans-serif'
            }}>
              Info
            </p>
            <a href="/about" style={{
              display: 'block',
              color: '#888',
              fontSize: 12,
              textDecoration: 'none',
              padding: '5px 0',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
              About
            </a>
            <a href="/contact" style={{
              display: 'block',
              color: '#888',
              fontSize: 12,
              textDecoration: 'none',
              padding: '5px 0',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
              Contact
            </a>
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{
              display: 'block',
              color: '#888',
              fontSize: 12,
              textDecoration: 'none',
              padding: '5px 0',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}>
              Instagram
            </a>
          </div>
        </div>

        <div style={{
          maxWidth: 1480,
          margin: '0 auto',
          borderTop: '1px solid #151515',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: M ? 'flex-start' : 'center',
          flexDirection: M ? 'column' : 'row',
          gap: 12,
          color: '#555',
          fontSize: 10,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: 1
        }}>
          <span>&copy; 2024 OUTLETX. All rights reserved.</span>
          <span>Dua Mall, Struga · Premium Outlet Store</span>
        </div>
      </footer>
    </>
  );
}