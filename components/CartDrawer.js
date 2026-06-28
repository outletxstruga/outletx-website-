import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (!cartOpen) return null;

  return (
    <>
      <div onClick={() => setCartOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200,
        backdropFilter: 'blur(2px)',
      }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, width: 420, maxWidth: '100%', height: '100%',
        background: '#FFF', zIndex: 201, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', fontFamily: 'Inter, sans-serif',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', margin: 0 }}>Your Cart</h2>
            <p style={{ color: '#999', fontSize: 11, margin: '2px 0 0' }}>{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={() => setCartOpen(false)} style={{
            background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#999', padding: '4px 8px', lineHeight: 1,
          }}>&times;</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🛒</div>
              <p style={{ color: '#999', fontSize: 14, marginBottom: 24, fontWeight: 500 }}>Your cart is empty</p>
              <a href="/products" onClick={() => setCartOpen(false)} style={{
                display: 'inline-block', background: '#000', color: '#FFF', textDecoration: 'none',
                fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                padding: '12px 28px',
              }}>Shop Now</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} style={{
                  display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #F5F5F5',
                }}>
                  {/* Product Image */}
                  <Link href={`/product/${item.id}`} onClick={() => setCartOpen(false)} style={{
                    width: 80, height: 80, background: '#FAFAFA', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid #EEE', textDecoration: 'none',
                  }}>
                    <img src={item.images?.[0]} alt={item.name} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                  </Link>

                  {/* Item Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 2px' }}>{item.brand}</p>
                      <Link href={`/product/${item.id}`} onClick={() => setCartOpen(false)} style={{ textDecoration: 'none', color: '#000' }}>
                        <p style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', margin: '0 0 4px', lineHeight: 1.2 }}>{item.name}</p>
                      </Link>
                      <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Size: <strong style={{ color: '#000' }}>{item.size}</strong></p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Quantity */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E5E5' }}>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{
                          background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer',
                          fontSize: 13, color: '#000', fontFamily: 'Inter, sans-serif',
                        }}>−</button>
                        <span style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, borderLeft: '1px solid #E5E5E5', borderRight: '1px solid #E5E5E5' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={{
                          background: 'none', border: 'none', padding: '5px 10px', cursor: 'pointer',
                          fontSize: 13, color: '#000', fontFamily: 'Inter, sans-serif',
                        }}>+</button>
                      </div>

                      {/* Price & Remove */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 900, fontSize: 14, margin: '0 0 2px' }}>{item.newPrice * item.quantity} MKD</p>
                        <button onClick={() => removeFromCart(item.id, item.size)} style={{
                          background: 'none', border: 'none', color: '#CCC', fontSize: 10,
                          cursor: 'pointer', padding: 0, fontFamily: 'Inter, sans-serif',
                          textDecoration: 'underline',
                        }}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '18px 24px', borderTop: '1px solid #EEE', background: '#FAFAFA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#666' }}>Total</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 22 }}>{cartTotal} MKD</span>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)} style={{
              display: 'block', width: '100%', background: '#DC2626', color: '#FFF', textDecoration: 'none',
              fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
              padding: '15px', textAlign: 'center', fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#B91C1C'}
            onMouseLeave={e => e.currentTarget.style.background = '#DC2626'}
            >Checkout</Link>
            <button onClick={() => setCartOpen(false)} style={{
              display: 'block', width: '100%', background: 'transparent', color: '#000', border: '1px solid #DDD',
              fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
              padding: '11px', textAlign: 'center', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              marginTop: 8,
            }}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
}