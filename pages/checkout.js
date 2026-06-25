import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import products from '../data/products';

export default function Checkout() {
  const router = useRouter();
  const { id, size } = router.query;
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(size || '');
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (size) setSelectedSize(size);
  }, [size]);

  if (!product) {
    return (
      <div style={{textAlign: 'center', padding: '100px 20px', fontFamily: 'Inter, sans-serif'}}>
        <h1 style={{fontFamily: 'Montserrat, sans-serif', fontWeight: '900', fontSize: '24px', marginBottom: '16px'}}>Product Not Found</h1>
        <a href="/products" style={{color: '#DC2626', textDecoration: 'none', fontWeight: '700', fontSize: '14px'}}>Back to Products</a>
      </div>
    );
  }

  const total = product.newPrice * quantity;
  const deliveryFee = total >= 3000 ? 0 : 150;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    const orderData = {
      product: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        sku: product.sku,
        price: product.newPrice,
      },
      size: selectedSize,
      quantity,
      total: grandTotal,
      customerInfo,
      cardLast4: cardInfo.cardNumber.slice(-4),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        setOrderPlaced(true);
      } else {
        alert('Error placing order. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please check your connection.');
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4);
    return v;
  };

  return (
    <>
      <Head>
        <title>Checkout | OUTLETX</title>
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
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{background: '#DC2626', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 20px'}}>Message Us</a>
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

      {/* ========== CHECKOUT ========== */}
      <section style={{padding: '60px 40px', background: '#F5F5F5', minHeight: '60vh'}}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '32px'}}>Checkout</h1>

          {orderPlaced ? (
            <div style={{textAlign: 'center', padding: '60px 40px', background: '#FFFFFF'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>&#10003;</div>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '8px', textTransform: 'uppercase'}}>Order Confirmed</h2>
              <p style={{color: '#555555', fontSize: '15px', marginBottom: '4px'}}>Thank you, {customerInfo.fullName}.</p>
              <p style={{color: '#777777', fontSize: '14px', marginBottom: '8px'}}>Total charged: {grandTotal} MKD</p>
              <p style={{color: '#777777', fontSize: '14px', marginBottom: '24px'}}>We will contact you shortly to confirm delivery details.</p>
              <a href="/" style={{background: '#000000', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '14px 28px', display: 'inline-block'}}>
                Continue Shopping
              </a>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div style={{display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '40px'}}>
                {['Shipping', 'Payment'].map((s, i) => (
                  <div key={s} style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: step >= i + 1 ? '#000000' : '#E5E5E5',
                      color: step >= i + 1 ? '#FFFFFF' : '#999999',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '14px',
                    }}>{i + 1}</div>
                    <span style={{marginLeft: '8px', fontWeight: '700', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: step >= i + 1 ? '#000000' : '#CCCCCC'}}>{s}</span>
                    {i === 0 && <div style={{width: '80px', height: '2px', background: step >= 2 ? '#000000' : '#E5E5E5', margin: '0 16px'}} />}
                  </div>
                ))}
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start'}}>
                {/* Main Form */}
                <div style={{background: '#FFFFFF', padding: '32px'}}>
                  {step === 1 && (
                    <div>
                      <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '24px'}}>Shipping Information</h2>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'}}>
                        <div>
                          <label style={labelStyle}>Full Name *</label>
                          <input type="text" required value={customerInfo.fullName} onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})} style={inputStyle} placeholder="Your full name" />
                        </div>
                        <div>
                          <label style={labelStyle}>Email *</label>
                          <input type="email" required value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} style={inputStyle} placeholder="your@email.com" />
                        </div>
                        <div>
                          <label style={labelStyle}>Phone *</label>
                          <input type="tel" required value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} style={inputStyle} placeholder="+389 70 123 456" />
                        </div>
                        <div>
                          <label style={labelStyle}>City *</label>
                          <input type="text" required value={customerInfo.city} onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})} style={inputStyle} placeholder="Struga" />
                        </div>
                        <div style={{gridColumn: 'span 2'}}>
                          <label style={labelStyle}>Address *</label>
                          <input type="text" required value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} style={inputStyle} placeholder="Street and number" />
                        </div>
                        <div style={{gridColumn: 'span 2'}}>
                          <label style={labelStyle}>Notes (optional)</label>
                          <textarea rows="2" value={customerInfo.notes} onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})} style={{...inputStyle, resize: 'vertical'}} placeholder="Any special delivery instructions..." />
                        </div>
                      </div>
                      <button onClick={() => setStep(2)} disabled={!customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city} style={{
                        width: '100%', marginTop: '24px',
                        background: (customerInfo.fullName && customerInfo.email && customerInfo.phone && customerInfo.address && customerInfo.city) ? '#000000' : '#CCCCCC',
                        color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px',
                        cursor: (customerInfo.fullName && customerInfo.email && customerInfo.phone && customerInfo.address && customerInfo.city) ? 'pointer' : 'not-allowed',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        Continue to Payment
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '24px'}}>Card Payment</h2>
                      <p style={{fontSize: '12px', color: '#999999', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '16px'}}>&#128274;</span> Secured by Stripe &bull; Your payment is encrypted
                      </p>

                      <div style={{marginBottom: '14px'}}>
                        <label style={labelStyle}>Card Number *</label>
                        <input type="text" required maxLength="19" value={cardInfo.cardNumber} onChange={(e) => setCardInfo({...cardInfo, cardNumber: formatCardNumber(e.target.value)})} style={inputStyle} placeholder="1234 5678 9012 3456" />
                      </div>
                      <div style={{marginBottom: '14px'}}>
                        <label style={labelStyle}>Cardholder Name *</label>
                        <input type="text" required value={cardInfo.cardName} onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})} style={inputStyle} placeholder="Name on card" />
                      </div>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'}}>
                        <div>
                          <label style={labelStyle}>Expiry Date *</label>
                          <input type="text" required maxLength="5" value={cardInfo.expiry} onChange={(e) => setCardInfo({...cardInfo, expiry: formatExpiry(e.target.value)})} style={inputStyle} placeholder="MM/YY" />
                        </div>
                        <div>
                          <label style={labelStyle}>CVC *</label>
                          <input type="text" required maxLength="4" value={cardInfo.cvc} onChange={(e) => setCardInfo({...cardInfo, cvc: e.target.value.replace(/[^0-9]/g, '')})} style={inputStyle} placeholder="123" />
                        </div>
                      </div>

                      <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
                        <button onClick={() => setStep(1)} style={{
                          background: 'transparent', color: '#000000', border: '1px solid #E5E5E5', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px 24px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}>
                          Back
                        </button>
                        <button onClick={handlePlaceOrder} style={{
                          flex: '1',
                          background: (cardInfo.cardNumber && cardInfo.cardName && cardInfo.expiry && cardInfo.cvc) ? '#DC2626' : '#CCCCCC',
                          color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px',
                          cursor: (cardInfo.cardNumber && cardInfo.cardName && cardInfo.expiry && cardInfo.cvc) ? 'pointer' : 'not-allowed',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          Pay {grandTotal} MKD
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary Sidebar */}
                <div style={{background: '#FFFFFF', padding: '24px', position: 'sticky', top: '100px'}}>
                  <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '20px'}}>Order Summary</h2>

                  <div style={{display: 'flex', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #F0F0F0'}}>
                    <div style={{width: '64px', height: '64px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                      <img src={product.images[0]} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                    </div>
                    <div>
                      <p style={{fontWeight: '700', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#DC2626', marginBottom: '2px'}}>{product.brand}</p>
                      <p style={{fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', marginBottom: '4px'}}>{product.name}</p>
                      <p style={{fontSize: '12px', color: '#999999'}}>Size: <strong style={{color: '#000000'}}>{selectedSize || '-'}</strong> &times; {quantity}</p>
                    </div>
                  </div>

                  <div style={{marginBottom: '16px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                      <span style={{color: '#777777'}}>Subtotal</span>
                      <span style={{fontWeight: '600'}}>{total} MKD</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                      <span style={{color: '#777777'}}>Delivery</span>
                      <span style={{fontWeight: '600', color: deliveryFee === 0 ? '#16A34A' : '#000000'}}>
                        {deliveryFee === 0 ? 'FREE' : deliveryFee + ' MKD'}
                      </span>
                    </div>
                    {deliveryFee > 0 && (
                      <p style={{fontSize: '11px', color: '#999999', marginBottom: '8px'}}>Free delivery on orders over 3000 MKD</p>
                    )}
                  </div>

                  <div style={{borderTop: '1px solid #000000', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <span style={{fontWeight: '700', fontSize: '14px', textTransform: 'uppercase'}}>Total</span>
                    <span style={{fontSize: '22px', fontWeight: '900'}}>{grandTotal} MKD</span>
                  </div>
                </div>
              </div>
            </>
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
            <a href="https://instagram.com/outletxstruga" target="_blank" rel="noopener noreferrer" style={{display: 'block', color: '#888888', fontSize: '13px', textDecoration: 'none', padding: '3px 0'}}>Instagram</a>
          </div>
        </div>
        <div style={{borderTop: '1px solid #222222', paddingTop: '24px', textAlign: 'center', color: '#555555', fontSize: '12px'}}>
          &copy; 2024 OUTLETX. All rights reserved. Dua Mall, Struga, North Macedonia.
        </div>
      </footer>
    </>
  );
}

const labelStyle = {
  display: 'block',
  fontWeight: '700',
  fontSize: '10px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: '#999999',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #E5E5E5',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
};