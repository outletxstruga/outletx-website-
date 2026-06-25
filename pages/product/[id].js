import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductCard from '../../components/ProductCard';
import products from '../../data/products';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(p => p.id === parseInt(id));
useEffect(() => {
  if (product) {
    const stored = localStorage.getItem('outletx_recent');
    let ids = stored ? JSON.parse(stored) : [];
    ids = [product.id, ...ids.filter(id => id !== product.id)].slice(0, 10);
    localStorage.setItem('outletx_recent', JSON.stringify(ids));
  }
}, [product]);

  if (!product) {
    return (
      <div style={{textAlign: 'center', padding: '100px 20px', fontFamily: 'Inter, sans-serif'}}>
        <h1 style={{fontFamily: 'Montserrat, sans-serif', fontWeight: '900', fontSize: '24px', marginBottom: '16px'}}>Product Not Found</h1>
        <a href="/products" style={{color: '#DC2626', textDecoration: 'none', fontWeight: '700', fontSize: '14px'}}>Back to Products</a>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);

  return (
    <>
      <Head>
        <title>{product.brand} {product.name} | OUTLETX</title>
        <meta name="description" content={product.description} />
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
            <a href="https://instagram.com/outletx.mk" target="_blank" rel="noopener noreferrer" style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 20px'}}>Message Us</a>
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

      {/* ========== PRODUCT DETAIL ========== */}
      <section style={{padding: '60px 40px', background: '#FFFFFF'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto'}}>
          <a href="/products" style={{color: '#777777', textDecoration: 'none', fontSize: '13px', fontWeight: '600', display: 'inline-block', marginBottom: '32px'}}>&larr; Back to Products</a>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start'}}>
            {/* Images */}
            <div>
              <div style={{aspectRatio: '1', background: '#F5F5F5', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={product.images[selectedImage]} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
              </div>
              {product.images.length > 1 && (
                <div style={{display: 'flex', gap: '8px'}}>
                  {product.images.map((img, i) => (
                    <div key={i} onClick={() => setSelectedImage(i)} style={{
                      width: '72px', height: '72px', background: '#F5F5F5', cursor: 'pointer',
                      border: i === selectedImage ? '2px solid #000000' : '2px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src={img} alt="" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p style={{fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>{product.brand}</p>
              <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '32px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '8px', textTransform: 'uppercase'}}>{product.name}</h1>
              {product.sku && <p style={{fontSize: '12px', color: '#999999', marginBottom: '20px'}}>{product.sku}</p>}

              <div style={{display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px'}}>
                <span style={{fontSize: '28px', fontWeight: '900'}}>{product.newPrice} MKD</span>
                <span style={{fontSize: '16px', color: '#999999', textDecoration: 'line-through'}}>{product.oldPrice} MKD</span>
                <span style={{background: '#DC2626', color: '#FFFFFF', fontSize: '12px', fontWeight: '700', padding: '4px 10px'}}>-{product.discount}%</span>
              </div>
              <p style={{color: '#16A34A', fontWeight: '700', fontSize: '13px', marginBottom: '24px'}}>You save {product.oldPrice - product.newPrice} MKD</p>

              {!product.inStock && (
                <div style={{background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', marginBottom: '24px', color: '#DC2626', fontWeight: '600', fontSize: '14px'}}>
                  Temporarily out of stock. Contact us for availability.
                </div>
              )}

              <div style={{marginBottom: '24px'}}>
                <p style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999999', marginBottom: '10px'}}>Available Sizes</p>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                  {product.sizes.map((size, i) => (
                    <span key={i} style={{background: '#F5F5F5', color: '#000000', fontSize: '13px', fontWeight: '600', padding: '8px 16px'}}>{size}</span>
                  ))}
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px'}}>
                <a href={`/checkout?id=${product.id}`} style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px 32px', display: 'inline-block'}}>
                  Buy Now
                </a>
                <a href="https://instagram.com/outletx.mk" target="_blank" rel="noopener noreferrer" style={{background: 'transparent', color: '#000000', textDecoration: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px 32px', border: '1px solid #E5E5E5', display: 'inline-block'}}>
                  Ask a Question
                </a>
              </div>

              <div style={{background: '#F9F9F9', padding: '20px', marginBottom: '12px'}}>
                <p style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999999', marginBottom: '8px'}}>Description</p>
                <p style={{fontSize: '14px', color: '#555555', lineHeight: '1.7'}}>{product.description}</p>
              </div>

              <p style={{fontSize: '12px', color: '#999999'}}>Color: <strong style={{color: '#000000'}}>{product.color}</strong></p>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div style={{marginTop: '60px'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '24px'}}>Related Products</h2>
              <div className="product-grid">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
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
            <a href="https://instagram.com/outletx.mk" target="_blank" rel="noopener noreferrer" style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '3px 0'}}>Instagram</a>
          </div>
        </div>
        <div style={{borderTop: '1px solid #222222', paddingTop: '24px', textAlign: 'center', color: '#555555', fontSize: '12px'}}>
          &copy; 2024 OUTLETX. All rights reserved. Dua Mall, Struga, North Macedonia.
        </div>
      </footer>
    </>
  );
}