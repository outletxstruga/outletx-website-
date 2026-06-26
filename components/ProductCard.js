import Link from 'next/link';

export default function ProductCard({ product }) {
  const discount = Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  const sizes = product.sizes || [];
  const totalStock = sizes.reduce((sum, s) => sum + (s.stock || 0), 0);

  return (
    <div style={{background: '#FFFFFF', border: '1px solid #E5E5E5', transition: 'all 0.2s'}}>
      <Link href={`/product/${product.id}`}>
        <div style={{position: 'relative', aspectRatio: '1', background: '#F5F5F5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src={product.images[0]} alt={`${product.brand} ${product.name}`} style={{width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s'}}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          {discount > 0 && (
            <span style={{position: 'absolute', top: 10, left: 10, background: '#DC2626', color: '#FFFFFF', fontWeight: 700, fontSize: 11, padding: '4px 10px', letterSpacing: 0.5}}>-{discount}%</span>
          )}
          {totalStock === 0 && (
            <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{background: '#000000', color: '#FFFFFF', fontWeight: 700, fontSize: 11, padding: '6px 14px', letterSpacing: 1, textTransform: 'uppercase'}}>Sold Out</span>
            </div>
          )}
        </div>
      </Link>
      <div style={{padding: 16}}>
        <p style={{fontSize: 10, fontWeight: 700, color: '#999999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4}}>{product.brand}</p>
        <Link href={`/product/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
          <h3 style={{fontWeight: 700, fontSize: 14, marginBottom: 8, lineHeight: 1.3, color: '#000000', textTransform: 'uppercase'}}>{product.name}</h3>
        </Link>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4}}>
          <span style={{fontSize: 16, fontWeight: 900, color: '#000000'}}>{product.newPrice} MKD</span>
          <span style={{fontSize: 12, color: '#AAAAAA', textDecoration: 'line-through'}}>{product.oldPrice} MKD</span>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12, marginTop: 8}}>
          {sizes.slice(0, 4).map((s, i) => (
            <span key={i} style={{background: (s.stock || 0) <= 2 ? '#FEF2F2' : '#F5F5F5', color: (s.stock || 0) <= 2 ? '#DC2626' : '#666666', fontSize: 11, fontWeight: 500, padding: '3px 8px'}}>
              {s.size}
            </span>
          ))}
          {sizes.length > 4 && <span style={{fontSize: 11, color: '#999999', padding: '3px 0'}}>+{sizes.length - 4}</span>}
        </div>
        <Link href={`/checkout?id=${product.id}`} style={{display: 'block', width: '100%', background: '#000000', color: '#FFFFFF', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', padding: 12, textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'}}
        onMouseEnter={(e) => e.target.style.background = '#DC2626'}
        onMouseLeave={(e) => e.target.style.background = '#000000'}
        >Buy Now</Link>
      </div>
    </div>
  );
}