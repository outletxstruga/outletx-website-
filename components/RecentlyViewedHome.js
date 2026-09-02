import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useStore } from '../context/StoreContext';

export default function RecentlyViewedHome() {const { products, content, loading, error } = useStore();
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('outletx_recent');
    if (stored) {
      const ids = JSON.parse(stored).slice(0, 4);
      const prods = ids.map(id => products.find(p => p.id === id)).filter(Boolean);
      setRecentProducts(prods);
    }
  }, [products]);

  if (recentProducts.length < 2) return null;

  return (
    <section style={{padding: '80px 40px', background: '#FFFFFF'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto'}}>
        <div style={{marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div>
            <p style={{fontSize: '10px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '8px'}}>Your History</p>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', textTransform: 'uppercase', margin: 0}}>Recently Viewed</h2>
          </div>
        </div>
        <div className="product-grid">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
