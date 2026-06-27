import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import products from '../data/products';

export default function ProductsPage() {
  const router = useRouter();
  const { gender, brand, category, age } = router.query;
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [isMobile, setIsMobile] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrolled(window.scrollY > 50);

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const M = isMobile;
  const P = M ? '34px 14px 60px' : '54px 38px 90px';

  const allBrands = [...new Set(products.map(p => p.brand))].sort();
  const allCategories = [...new Set(products.map(p => p.category))].sort();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (gender) result = result.filter(p => p.gender && p.gender.toLowerCase() === gender.toLowerCase());
    if (brand) result = result.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
    if (category) result = result.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    if (age) result = result.filter(p => p.ageGroup === age);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'discount') result.sort((a, b) => b.discount - a.discount);
    if (sortBy === 'price-low') result.sort((a, b) => a.newPrice - b.newPrice);
    if (sortBy === 'price-high') result.sort((a, b) => b.newPrice - a.newPrice);
    if (sortBy === 'newest') result.reverse();

    return result;
  }, [gender, brand, category, age, search, sortBy]);

  const pageTitle = () => {
    const parts = [];
    if (brand) parts.push(brand);
    if (category) parts.push(category);
    if (gender) parts.push(gender);
    if (parts.length === 0) parts.push('All Products');
    return parts.join(' ') + ' | OUTLETX';
  };

  const displayTitle = () => {
    if (brand) return brand;
    if (category) return category;
    if (gender) return gender;
    return 'All Products';
  };

  const clearFilters = () => router.push('/products');
  const hasActiveFilters = gender || brand || category || age;

  const navItems = [
    { label: 'MEN', href: '/products?gender=men' },
    { label: 'WOMEN', href: '/products?gender=women' },
    { label: 'KIDS', href: '/products?gender=kids' },
    { label: 'SALE', href: '/products?sort=discount' }
  ];

  const quickChips = [
    { label: 'Shoes', href: '/products?category=shoes' },
    { label: 'Clothing', href: '/products?category=clothing' },
    { label: 'Accessories', href: '/products?category=accessories' },
    { label: 'Men', href: '/products?gender=men' },
    { label: 'Women', href: '/products?gender=women' },
    { label: 'Kids', href: '/products?gender=kids' },
    { label: 'Sale', href: '/products?sort=discount' }
  ];

  const filterLink = (params) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) query.set(key, params[key]);
    });
    const q = query.toString();
    return q ? `/products?${q}` : '/products';
  };

  return (
    <>
      <Head>
        <title>{pageTitle()}</title>
        <meta name="description" content={`Browse ${filteredProducts.length} products at OUTLETX. Branded sportswear at outlet prices.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div style={{
        background: '#000',
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        fontSize: M ? 8 : 9,
        fontWeight: 900,
        letterSpacing: M ? 2 : 4,
        padding: M ? '9px 10px' : '10px 14px',
        textTransform: 'uppercase',
        borderBottom: '1px solid #111'
      }}>
        Dua Mall, Struga &nbsp; | &nbsp; Original Brands &nbsp; | &nbsp; Outlet Prices 10-70% Off
      </div>

      <header style={{
        background: '#FFF',
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
                    fontWeight: 900,
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
                fontWeight: 900,
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

      <main style={{ background: '#FAFAFA', minHeight: '70vh' }}>
        <section style={{
          background: '#000',
          color: '#FFF',
          padding: M ? '34px 14px 38px' : '64px 38px 70px',
          borderBottom: '1px solid #111',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            right: M ? -80 : -160,
            top: M ? -80 : -180,
            width: M ? 200 : 420,
            height: M ? 200 : 420,
            borderRadius: '50%',
            border: '1px solid #222'
          }} />
          <div style={{
            position: 'absolute',
            left: M ? -100 : -120,
            bottom: M ? -120 : -180,
            width: M ? 220 : 380,
            height: M ? 220 : 380,
            borderRadius: '50%',
            border: '1px solid #1A1A1A'
          }} />

          <div style={{ maxWidth: 1480, margin: '0 auto', position: 'relative' }}>
            <Breadcrumbs items={[
              { label: 'Products', link: '/products' },
              ...(gender ? [{ label: gender, link: `/products?gender=${gender}` }] : []),
              ...(category ? [{ label: category, link: `/products?category=${category}` }] : []),
              ...(brand ? [{ label: brand, link: `/products?brand=${brand}` }] : [])
            ]} />

            <div style={{
              display: 'grid',
              gridTemplateColumns: M ? '1fr' : '1fr 420px',
              gap: M ? 26 : 54,
              alignItems: 'end',
              marginTop: M ? 22 : 36
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
                  Premium Outlet Selection
                </p>

                <h1 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: M ? 42 : 82,
                  fontWeight: 900,
                  letterSpacing: M ? -2 : -5,
                  textTransform: 'uppercase',
                  lineHeight: 0.86,
                  margin: '0 0 20px',
                  color: '#FFF'
                }}>
                  {displayTitle()}
                </h1>

                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: M ? 13 : 15,
                  color: '#999',
                  lineHeight: 1.9,
                  maxWidth: 620,
                  margin: 0
                }}>
                  Browse original branded sportswear with outlet pricing. Filter by brand, category and gender to move fast.
                </p>
              </div>

              <div style={{
                border: '1px solid #222',
                background: '#0A0A0A',
                padding: M ? '18px 18px' : '26px 26px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12
                }}>
                  <Metric label="Products" value={filteredProducts.length} />
                  <Metric label="Discounts" value="10-70%" />
                  <Metric label="Location" value="Struga" />
                  <Metric label="Brands" value={allBrands.length} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: P }}>
          <div style={{ maxWidth: 1480, margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              margin: M ? '0 0 20px' : '0 0 26px'
            }}>
              {quickChips.map(chip => (
                <a
                  key={chip.label}
                  href={chip.href}
                  style={{
                    background: '#FFF',
                    color: chip.label === 'Sale' ? '#DC2626' : '#111',
                    border: '1px solid #E5E5E5',
                    textDecoration: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    padding: M ? '10px 12px' : '11px 15px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#000';
                    e.currentTarget.style.color = '#FFF';
                    e.currentTarget.style.border = '1px solid #000';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#FFF';
                    e.currentTarget.style.color = chip.label === 'Sale' ? '#DC2626' : '#111';
                    e.currentTarget.style.border = '1px solid #E5E5E5';
                  }}
                >
                  {chip.label}
                </a>
              ))}
            </div>

            <div style={{
              background: '#FFF',
              border: '1px solid #E8E8E8',
              padding: M ? '14px' : '18px',
              marginBottom: M ? 18 : 26,
              display: 'grid',
              gridTemplateColumns: M ? '1fr' : '1fr auto auto',
              gap: M ? 10 : 12,
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search by product, brand or SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: M ? '13px 13px' : '15px 16px',
                  border: '1px solid #DDD',
                  background: '#FAFAFA',
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#000'
                }}
              />

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: M ? '13px 13px' : '15px 16px',
                  border: '1px solid #DDD',
                  background: '#FAFAFA',
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: M ? '100%' : 210,
                  color: '#000'
                }}
              >
                <option value="discount">Biggest Discount</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="newest">Newest First</option>
              </select>

              {M && (
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  style={{
                    background: '#000',
                    color: '#FFF',
                    border: '1px solid #000',
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    padding: '13px 16px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Filters {hasActiveFilters ? '(ON)' : ''}
                </button>
              )}

              {!M && hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    background: '#FFF',
                    color: '#DC2626',
                    border: '1px solid #DC2626',
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    padding: '15px 18px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: M ? '1fr' : '280px 1fr',
              gap: M ? 18 : 30,
              alignItems: 'start'
            }}>
              {(filterOpen || !M) && (
                <aside style={{
                  background: '#FFF',
                  border: '1px solid #E5E5E5',
                  position: M ? 'static' : 'sticky',
                  top: 96
                }}>
                  <div style={{
                    background: '#000',
                    color: '#FFF',
                    padding: '18px 20px',
                    borderBottom: '1px solid #111'
                  }}>
                    <h3 style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: 18,
                      fontWeight: 900,
                      letterSpacing: -1,
                      textTransform: 'uppercase',
                      margin: '0 0 5px'
                    }}>
                      Filters
                    </h3>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 11,
                      color: '#999',
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      Refine the outlet selection.
                    </p>
                  </div>

                  <FilterGroup title="Gender">
                    <FilterLink href="/products" active={!gender} label="All" />
                    {['Men', 'Women', 'Kids', 'Unisex'].map(g => (
                      <FilterLink
                        key={g}
                        href={filterLink({ gender: g.toLowerCase(), category, brand })}
                        active={gender === g.toLowerCase()}
                        label={g}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Category">
                    <FilterLink href={filterLink({ gender, brand })} active={!category} label="All" />
                    {allCategories.map(c => (
                      <FilterLink
                        key={c}
                        href={filterLink({ category: c.toLowerCase(), gender, brand })}
                        active={category === c.toLowerCase()}
                        label={c}
                      />
                    ))}
                  </FilterGroup>

                  <FilterGroup title="Brand">
                    <FilterLink href={filterLink({ gender, category })} active={!brand} label="All" />
                    {allBrands.map(b => (
                      <FilterLink
                        key={b}
                        href={filterLink({ brand: b.toLowerCase(), gender, category })}
                        active={brand === b.toLowerCase()}
                        label={b}
                      />
                    ))}
                  </FilterGroup>

                  {hasActiveFilters && (
                    <div style={{ padding: '0 20px 22px' }}>
                      <button
                        onClick={clearFilters}
                        style={{
                          width: '100%',
                          background: '#FFF',
                          color: '#DC2626',
                          border: '1px solid #DC2626',
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: 2,
                          textTransform: 'uppercase',
                          padding: '13px 16px',
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </aside>
              )}

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: M ? 'flex-start' : 'center',
                  flexDirection: M ? 'column' : 'row',
                  gap: 10,
                  marginBottom: M ? 18 : 22
                }}>
                  <div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: 3,
                      color: '#DC2626',
                      textTransform: 'uppercase',
                      margin: '0 0 6px'
                    }}>
                      Current Selection
                    </p>
                    <h2 style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: M ? 24 : 32,
                      fontWeight: 900,
                      letterSpacing: -2,
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      margin: 0,
                      color: '#000'
                    }}>
                      {displayTitle()}
                    </h2>
                  </div>

                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: '#666',
                    margin: 0,
                    fontWeight: 700
                  }}>
                    {filteredProducts.length} products found
                  </p>
                </div>

                {filteredProducts.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: M ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(250px,1fr))',
                    gap: M ? 12 : 22
                  }}>
                    {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: M ? '70px 20px' : '110px 30px',
                    background: '#FFF',
                    border: '1px solid #E5E5E5'
                  }}>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: 4,
                      color: '#DC2626',
                      textTransform: 'uppercase',
                      margin: '0 0 12px'
                    }}>
                      No Match
                    </p>
                    <h3 style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: M ? 24 : 34,
                      fontWeight: 900,
                      letterSpacing: -2,
                      margin: '0 0 10px',
                      textTransform: 'uppercase'
                    }}>
                      No Products Found
                    </h3>
                    <p style={{
                      color: '#777',
                      fontSize: 13,
                      margin: '0 0 24px',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Try removing filters or searching another brand.
                    </p>
                    <button
                      onClick={clearFilters}
                      style={{
                        background: '#000',
                        color: '#FFF',
                        border: '1px solid #000',
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        padding: '14px 30px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

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
              Luxury outlet feel. Branded sportswear prices. Dua Mall, Struga.
            </p>
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
              <a
                key={i.label}
                href={i.link}
                style={{
                  display: 'block',
                  color: '#888',
                  fontSize: 12,
                  textDecoration: 'none',
                  padding: '5px 0',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}
              >
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
              <a
                key={b}
                href={`/products?brand=${b.toLowerCase()}`}
                style={{
                  display: 'block',
                  color: '#888',
                  fontSize: 12,
                  textDecoration: 'none',
                  padding: '5px 0',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}
              >
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

function Metric({ label, value }) {
  return (
    <div style={{
      border: '1px solid #222',
      background: '#111',
      padding: '16px 14px'
    }}>
      <p style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 24,
        fontWeight: 900,
        letterSpacing: -1,
        color: '#FFF',
        margin: '0 0 6px',
        lineHeight: 1
      }}>
        {value}
      </p>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 9,
        fontWeight: 900,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#777',
        margin: 0
      }}>
        {label}
      </p>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div style={{
      padding: '22px 20px',
      borderBottom: '1px solid #EEE'
    }}>
      <h4 style={{
        fontWeight: 900,
        fontSize: 9,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: '#999',
        margin: '0 0 14px',
        fontFamily: 'Inter, sans-serif'
      }}>
        {title}
      </h4>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }}>
        {children}
      </div>
    </div>
  );
}

function FilterLink({ href, active, label }) {
  return (
    <a
      href={href}
      style={{
        color: active ? '#DC2626' : '#555',
        background: active ? '#FFF5F5' : 'transparent',
        border: active ? '1px solid #F3B8B8' : '1px solid transparent',
        textDecoration: 'none',
        fontSize: 12,
        fontWeight: active ? 900 : 600,
        fontFamily: 'Inter, sans-serif',
        padding: '8px 10px',
        textTransform: 'capitalize',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#DC2626';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = active ? '#DC2626' : '#555';
      }}
    >
      {label}
    </a>
  );
}