import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductCard from '../../components/ProductCard';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useCart } from '../../context/CartContext';
import products from '../../data/products';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem('outletx_recent');
      let ids = stored ? JSON.parse(stored) : [];
      ids = [product.id, ...ids.filter(i => i !== product.id)].slice(0, 10);
      localStorage.setItem('outletx_recent', JSON.stringify(ids));
    }
  }, [id]);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{textAlign: 'center', padding: '100px 20px', fontFamily: 'Inter, sans-serif'}}>
        <h1 style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 24, marginBottom: 16}}>Product Not Found</h1>
        <a href="/products" style={{color: '#DC2626', textDecoration: 'none', fontWeight: 700, fontSize: 14}}>Back to Products</a>
      </div>
    );
  }

  const sizes = product.sizes || [];
  const totalStock = sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
  const relatedProducts = products.filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);
  const M = isMobile;

  return (
    <>
      <Head>
        <title>{product.brand} {product.name} | OUTLETX</title>
        <meta name="description" content={product.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <header style={{background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #F0F0F0'}}>
        <div style={{background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: M ? 9 : 10, fontWeight: 700, letterSpacing: 2, padding: '10px 16px', textTransform: 'uppercase'}}>
          {M ? 'FREE DELIVERY OVER 3000 MKD' : 'Dua Mall, Struga \u00a0\u2022\u00a0 Free Delivery Over 3000 MKD'}
        </div>
        <div style={{maxWidth: 1600, margin: '0 auto', padding: M ? '0 16px' : '0 40px', height: M ? 60 : 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: M ? 22 : 28, fontWeight: 900, color: '#000000', textDecoration: 'none', letterSpacing: -1.5}}>OUTLET<span style={{color: '#DC2626'}}>X</span></a>
          {!M && (
            <nav style={{display: 'flex', gap: 48}}>
              <a href="/" style={{color: '#000000', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase'}}>Home</a>
              <a href="/products" style={{color: '#000000', textDecoration: 'none', fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase'}}>Products</a>
            </nav>
          )}
          <div style={{display: 'flex', gap: M ? 8 : 16, alignItems: 'center'}}>
            <button onClick={() => setCartOpen(!cartOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 8}}>
              <svg width={M ? 20 : 22} height={M ? 20 : 22} fill="none" stroke="#000000" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
              {cartCount > 0 && <span style={{position: 'absolute', top: -2, right: -4, background: '#DC2626', color: '#FFFFFF', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cartCount}</span>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 8}}>
              <svg width={M ? 20 : 22} height={M ? 20 : 22} fill="none" stroke="#000000" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          </div>
        </div>
      </header>

      <section style={{padding: M ? '24px 16px' : '50px 40px', background: '#FFFFFF'}}>
        <div style={{maxWidth: 1600, margin: '0 auto'}}>
          <Breadcrumbs items={[
            { label: 'Products', link: '/products' },
            { label: product.category, link: `/products?category=${product.category.toLowerCase()}` },
            { label: product.brand, link: `/products?brand=${product.brand.toLowerCase()}` },
            { label: product.name, link: null },
          ]} />

          <div style={{display: 'grid', gridTemplateColumns: M ? '1fr' : '1fr 1fr', gap: M ? 24 : 60, alignItems: 'start'}}>
            <div>
              <div style={{aspectRatio: '1', background: '#FFF', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F0F0F0'}}>
                <img src={product.images[selectedImage]} alt={product.name} style={{width: '85%', height: '85%', objectFit: 'contain'}} />
              </div>
              {product.images.length > 1 && (
                <div style={{display: 'flex', gap: 8}}>
                  {product.images.map((img, i) => (
                    <div key={i} onClick={() => setSelectedImage(i)} style={{width: 56, height: 56, background: '#FFF', cursor: 'pointer', border: i === selectedImage ? '2px solid #000' : '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <img src={img} alt="" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p style={{fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#DC2626', marginBottom: 6}}>{product.brand}</p>
              <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: M ? 24 : 32, fontWeight: 900, letterSpacing: -1, marginBottom: 6, textTransform: 'uppercase'}}>{product.name}</h1>
              {product.sku && <p style={{fontSize: 11, color: '#999', marginBottom: 16}}>{product.sku}</p>}

              <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6}}>
                <span style={{fontSize: M ? 24 : 28, fontWeight: 900}}>{product.newPrice} MKD</span>
                <span style={{fontSize: 14, color: '#999', textDecoration: 'line-through'}}>{product.oldPrice} MKD</span>
                <span style={{background: '#DC2626', color: '#FFF', fontSize: 11, fontWeight: 700, padding: '3px 8px'}}>-{product.discount}%</span>
              </div>
              <p style={{color: '#16A34A', fontWeight: 700, fontSize: 12, marginBottom: 20}}>Save {product.oldPrice - product.newPrice} MKD</p>

              {totalStock === 0 && (
                <div style={{background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px 14px', marginBottom: 20, color: '#DC2626', fontWeight: 600, fontSize: 13}}>Out of stock.</div>
              )}

              <div style={{marginBottom: 20}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                  <p style={{fontWeight: 700, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#999', margin: 0}}>Available Sizes</p>
                  <span style={{fontSize: 10, color: '#999', cursor: 'pointer', textDecoration: 'underline'}}>Size Guide</span>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
                  {sizes.map((s, i) => (
                    <button key={i} onClick={() => setSelectedSize(s.size)} style={{
                      background: selectedSize === s.size ? '#000' : '#FFF',
                      color: selectedSize === s.size ? '#FFF' : (s.stock || 0) <= 2 ? '#DC2626' : '#000',
                      border: selectedSize === s.size ? '1px solid #000' : '1px solid #E5E5E5',
                      fontSize: 12, fontWeight: 600, padding: '7px 14px', cursor: (s.stock || 0) > 0 ? 'pointer' : 'not-allowed',
                      opacity: (s.stock || 0) > 0 ? 1 : 0.4, fontFamily: 'Inter, sans-serif',
                    }}>{s.size}</button>
                  ))}
                </div>
                {selectedSize && (
                  <p style={{fontSize: 11, color: '#999', marginTop: 6}}>Stock: {sizes.find(s => s.size === selectedSize)?.stock || 0} available</p>
                )}
              </div>

              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24}}>
                <a href={`/checkout?id=${product.id}&size=${selectedSize}`} style={{
                  background: selectedSize ? '#DC2626' : '#CCC', color: '#FFF', textDecoration: 'none',
                  fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                  padding: '14px 28px', display: 'inline-block', pointerEvents: selectedSize ? 'auto' : 'none',
                }}>Buy Now</a>
                <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background: 'transparent', color: '#000', textDecoration: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 28px', border: '1px solid #E5E5E5', display: 'inline-block'}}>Ask Question</a>
              </div>

              <div style={{background: '#F9F9F9', padding: 18}}>
                <p style={{fontWeight: 700, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#999', marginBottom: 6}}>Description</p>
                <p style={{fontSize: 13, color: '#555', lineHeight: 1.7}}>{product.description}</p>
              </div>
              <p style={{fontSize: 11, color: '#999', marginTop: 10}}>Color: <strong style={{color: '#000'}}>{product.color}</strong></p>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div style={{marginTop: 60}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: M ? 20 : 26, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase', marginBottom: 20}}>You May Also Like</h2>
              <div style={{display: 'grid', gridTemplateColumns: M ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: M ? 10 : 20}}>
                {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer style={{background: '#0A0A0A', color: '#FFFFFF', padding: M ? '40px 16px 20px' : '60px 40px 24px'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: M ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: M ? 20 : 40, marginBottom: M ? 28 : 40}}>
          <div style={M ? {gridColumn: 'span 2'} : {}}>
            <h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 900, marginBottom: 10}}>OUTLET<span style={{color: '#DC2626'}}>X</span></h3>
            <p style={{color: '#666', fontSize: 12, lineHeight: 1.7}}>Branded sportswear at outlet prices. Dua Mall, Struga.</p>
          </div>
          <div><p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>Shop</p>{[{label:'Men',link:'/products?gender=men'},{label:'Women',link:'/products?gender=women'},{label:'Kids',link:'/products?gender=kids'},{label:'Shoes',link:'/products?category=shoes'},{label:'Clothing',link:'/products?category=clothing'}].map(i=><a key={i.label} href={i.link} style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'3px 0'}}>{i.label}</a>)}</div>
          <div><p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>Brands</p>{['Nike','Adidas','Puma','Jordan','Kappa'].map(b=><a key={b} href={`/products?brand=${b.toLowerCase()}`} style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'3px 0'}}>{b}</a>)}</div>
          <div><p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>Info</p><a href="/about" style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'3px 0'}}>About</a><a href="/contact" style={{display:'block',color:'#888',fontSize:12,textDecoration:'none',padding:'3px 0'}}>Contact</a></div>
        </div>
        <div style={{borderTop: '1px solid #1A1A1A', paddingTop: 16, textAlign: 'center', color: '#555', fontSize: 10}}>&copy; 2024 OUTLETX. All rights reserved.</div>
      </footer>
    </>
  );
}