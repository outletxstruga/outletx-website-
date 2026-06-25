import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (!cartOpen) return null;

  return (
    <>
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, width: '420px', maxWidth: '100%', height: '100%',
        background: '#FFFFFF', zIndex: 201, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      }}>
        {/* Header */}
        <div style={{padding: '20px 24px', borderBottom: '1px solid #EEEEEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', margin: 0}}>
            Cart ({cartCount})
          </h2>
          <button onClick={() => setCartOpen(false)} style={{
            background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999999', padding: '4px',
          }}>&times;</button>
        </div>

        {/* Items */}
        <div style={{flex: 1, overflow: 'auto', padding: '20px 24px'}}>
          {cart.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px 20px'}}>
              <p style={{color: '#999999', fontSize: '14px', marginBottom: '20px'}}>Your cart is empty.</p>
              <a href="/products" onClick={() => setCartOpen(false)} style={{
                background: '#000000', color: '#FFFFFF', textDecoration: 'none', fontSize: '11px', fontWeight: '700',
                letterSpacing: '1.5px', textTransform: 'uppercase', padding: '12px 24px', display: 'inline-block',
              }}>Shop Now</a>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} style={{
                display: 'flex', gap: '14px', padding: '16px 0', borderBottom: '1px solid #F5F5F5',
              }}>
                <div style={{width: '72px', height: '72px', background: '#F5F5F5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img src={item.images[0]} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                </div>
                <div style={{flex: 1}}>
                  <p style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '2px'}}>{item.brand}</p>
                  <p style={{fontWeight: '700', fontSize: '13px', marginBottom: '4px', textTransform: 'uppercase'}}>{item.name}</p>
                  <p style={{fontSize: '11px', color: '#999999', marginBottom: '8px'}}>Size: {item.size}</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0'}}>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{background: '#F5F5F5', border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: '14px'}}>-</button>
                      <span style={{padding: '4px 14px', fontSize: '13px', fontWeight: '600'}}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={{background: '#F5F5F5', border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: '14px'}}>+</button>
                    </div>
                    <span style={{fontWeight: '900', fontSize: '15px'}}>{item.newPrice * item.quantity} MKD</span>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.size)} style={{
                    background: 'none', border: 'none', color: '#CCCCCC', fontSize: '11px', cursor: 'pointer', padding: '4px 0', marginTop: '4px',
                  }}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{padding: '20px 24px', borderTop: '1px solid #EEEEEE'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
              <span style={{fontWeight: '700', fontSize: '14px', textTransform: 'uppercase'}}>Total</span>
              <span style={{fontWeight: '900', fontSize: '20px'}}>{cartTotal} MKD</span>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)} style={{
              display: 'block', width: '100%', background: '#DC2626', color: '#FFFFFF', textDecoration: 'none',
              fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase',
              padding: '16px', textAlign: 'center', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
