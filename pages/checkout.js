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
  const [isMobile, setIsMobile] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', notes: '',
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '', cardName: '', expiry: '', cvc: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    if (size) setSelectedSize(size);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{textAlign: 'center', padding: '100px 20px', fontFamily: 'Inter, sans-serif'}}>
        <h1 style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 24, marginBottom: 16}}>Product Not Found</h1>
        <a href="/products" style={{color: '#DC2626', textDecoration: 'none', fontWeight: 700, fontSize: 14}}>Back to Products</a>
      </div>
    );
  }

  const total = product.newPrice * quantity;
  const deliveryFee = total >= 3000 ? 0 : 150;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      product: { id: product.id, name: product.name, brand: product.brand, sku: product.sku, price: product.newPrice },
      size: selectedSize, quantity, total: grandTotal, customerInfo, cardLast4: cardInfo.cardNumber.slice(-4),
    };
    try {
      const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
      if (res.ok) setOrderPlaced(true);
      else alert('Error. Try again.');
    } catch { alert('Network error.'); }
  };

  const formatCardNumber = (v) => {
    const n = v.replace(/\s/g, '').replace(/[^0-9]/gi, '').match(/\d{4,16}/g);
    const m = n && n[0] || '';
    const p = []; for (let i = 0; i < m.length; i += 4) p.push(m.substring(i, i + 4));
    return p.length ? p.join(' ') : v;
  };
  const formatExpiry = (v) => { const n = v.replace(/\s/g, '').replace(/[^0-9]/gi, ''); return n.length >= 2 ? n.substring(0, 2) + '/' + n.substring(2, 4) : v; };

  const S = { width: '100%', padding: isMobile ? 10 : 12, border: '1px solid #E5E5E5', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const L = { display: 'block', fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#999', marginBottom: 5 };

  return (
    <>
      <Head><title>Checkout | OUTLETX</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /></Head>

      <header style={{background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #F0F0F0'}}>
        <div style={{background: '#000000', color: '#FFFFFF', textAlign: 'center', fontSize: isMobile ? 9 : 10, fontWeight: 700, letterSpacing: 2, padding: '10px 16px', textTransform: 'uppercase'}}>
          {isMobile ? 'FREE DELIVERY OVER 3000 MKD' : 'Dua Mall, Struga \u00a0\u2022\u00a0 Free Delivery Over 3000 MKD'}
        </div>
        <div style={{maxWidth: 1600, margin: '0 auto', padding: isMobile ? '0 16px' : '0 40px', height: isMobile ? 60 : 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a href="/" style={{fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#000000', textDecoration: 'none', letterSpacing: -1.5}}>OUTLET<span style={{color: '#DC2626'}}>X</span></a>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 8}}>
            <svg width={isMobile ? 20 : 22} height={isMobile ? 20 : 22} fill="none" stroke="#000000" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
      </header>

      <section style={{padding: isMobile ? '20px 16px' : '50px 40px', background: '#F5F5F5', minHeight: '60vh'}}>
        <div style={{maxWidth: 900, margin: '0 auto'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: isMobile ? 22 : 28, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase', marginBottom: 24}}>Checkout</h1>

          {orderPlaced ? (
            <div style={{textAlign: 'center', padding: isMobile ? '30px 16px' : '60px 40px', background: '#FFFFFF'}}>
              <div style={{fontSize: 40, marginBottom: 12}}>&#10003;</div>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase', marginBottom: 8}}>Order Confirmed</h2>
              <p style={{color: '#555', fontSize: 14, marginBottom: 4}}>Thank you, {customerInfo.fullName}.</p>
              <p style={{color: '#777', fontSize: 13, marginBottom: 8}}>Total: {grandTotal} MKD</p>
              <a href="/" style={{background: '#000', color: '#FFF', textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 24px', display: 'inline-block'}}>Continue Shopping</a>
            </div>
          ) : (
            <>
              <div style={{display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 28}}>
                {['Shipping', 'Payment'].map((s, i) => (
                  <div key={s} style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{width: 32, height: 32, borderRadius: '50%', background: step >= i + 1 ? '#000' : '#E5E5E5', color: step >= i + 1 ? '#FFF' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13}}>{i + 1}</div>
                    <span style={{marginLeft: 8, fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: step >= i + 1 ? '#000' : '#CCC'}}>{s}</span>
                    {i === 0 && <div style={{width: isMobile ? 40 : 80, height: 2, background: step >= 2 ? '#000' : '#E5E5E5', margin: '0 12px'}} />}
                  </div>
                ))}
              </div>

              <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? 16 : 24, alignItems: 'start'}}>
                <div style={{background: '#FFFFFF', padding: isMobile ? 20 : 28}}>
                  {step === 1 && (
                    <div>
                      <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 20}}>Shipping</h2>
                      <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12}}>
                        <div><label style={L}>Full Name *</label><input required value={customerInfo.fullName} onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})} style={S} placeholder="Full name" /></div>
                        <div><label style={L}>Email *</label><input type="email" required value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} style={S} placeholder="Email" /></div>
                        <div><label style={L}>Phone *</label><input type="tel" required value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} style={S} placeholder="+389 70 123 456" /></div>
                        <div><label style={L}>City *</label><input required value={customerInfo.city} onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})} style={S} placeholder="Struga" /></div>
                        <div style={{gridColumn: isMobile ? 'span 1' : 'span 2'}}><label style={L}>Address *</label><input required value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} style={S} placeholder="Street and number" /></div>
                        <div style={{gridColumn: isMobile ? 'span 1' : 'span 2'}}><label style={L}>Notes</label><textarea rows={2} value={customerInfo.notes} onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})} style={{...S, resize: 'vertical'}} placeholder="Optional" /></div>
                      </div>
                      <button onClick={() => setStep(2)} disabled={!customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city} style={{
                        width: '100%', marginTop: 20, background: (customerInfo.fullName && customerInfo.email && customerInfo.phone && customerInfo.address && customerInfo.city) ? '#000' : '#CCC',
                        color: '#FFF', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: 14,
                        cursor: (customerInfo.fullName && customerInfo.email && customerInfo.phone && customerInfo.address && customerInfo.city) ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif',
                      }}>Continue to Payment</button>
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 16, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 20}}>Card Payment</h2>
                      <div style={{marginBottom: 12}}><label style={L}>Card Number *</label><input required maxLength={19} value={cardInfo.cardNumber} onChange={(e) => setCardInfo({...cardInfo, cardNumber: formatCardNumber(e.target.value)})} style={S} placeholder="1234 5678 9012 3456" /></div>
                      <div style={{marginBottom: 12}}><label style={L}>Cardholder Name *</label><input required value={cardInfo.cardName} onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})} style={S} placeholder="Name on card" /></div>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                        <div><label style={L}>Expiry *</label><input required maxLength={5} value={cardInfo.expiry} onChange={(e) => setCardInfo({...cardInfo, expiry: formatExpiry(e.target.value)})} style={S} placeholder="MM/YY" /></div>
                        <div><label style={L}>CVC *</label><input required maxLength={4} value={cardInfo.cvc} onChange={(e) => setCardInfo({...cardInfo, cvc: e.target.value.replace(/[^0-9]/g, '')})} style={S} placeholder="123" /></div>
                      </div>
                      <div style={{display: 'flex', gap: 10, marginTop: 20}}>
                        <button onClick={() => setStep(1)} style={{background: 'transparent', color: '#000', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 20px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'}}>Back</button>
                        <button onClick={handlePlaceOrder} style={{flex: 1, background: '#DC2626', color: '#FFF', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif'}}>Pay {grandTotal} MKD</button>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{background: '#FFFFFF', padding: isMobile ? 16 : 20, position: isMobile ? 'static' : 'sticky', top: 100}}>
                  <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 16}}>Order Summary</h2>
                  <div style={{display: 'flex', gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #F0F0F0'}}>
                    <div style={{width: 52, height: 52, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                      <img src={product.images[0]} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                    </div>
                    <div>
                      <p style={{fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#DC2626', marginBottom: 2}}>{product.brand}</p>
                      <p style={{fontWeight: 700, fontSize: 12, textTransform: 'uppercase', marginBottom: 2}}>{product.name}</p>
                      <p style={{fontSize: 11, color: '#999'}}>Size: <strong style={{color: '#000'}}>{selectedSize || '-'}</strong> &times; {quantity}</p>
                    </div>
                  </div>
                  <div style={{fontSize: 13}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}><span style={{color: '#777'}}>Subtotal</span><span style={{fontWeight: 600}}>{total} MKD</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}><span style={{color: '#777'}}>Delivery</span><span style={{fontWeight: 600, color: deliveryFee === 0 ? '#16A34A' : '#000'}}>{deliveryFee === 0 ? 'FREE' : deliveryFee + ' MKD'}</span></div>
                  </div>
                  <div style={{borderTop: '1px solid #000', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <span style={{fontWeight: 700, fontSize: 13, textTransform: 'uppercase'}}>Total</span>
                    <span style={{fontSize: 20, fontWeight: 900}}>{grandTotal} MKD</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <footer style={{background: '#0A0A0A', color: '#FFFFFF', padding: isMobile ? '40px 16px 20px' : '50px 40px 24px'}}>
        <div style={{maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 40, marginBottom: isMobile ? 28 : 40}}>
          <div style={isMobile ? {gridColumn: 'span 2'} : {}}><h3 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 20, fontWeight: 900, marginBottom: 10}}>OUTLET<span style={{color: '#DC2626'}}>X</span></h3><p style={{color: '#666', fontSize: 12}}>Branded sportswear at outlet prices.</p></div>
          <div><p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>Shop</p>{['Men', 'Women', 'Kids', 'Shoes'].map(i => <a key={i} href="/products" style={{display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>{i}</a>)}</div>
          <div><p style={{color: '#DC2626', fontSize: 9, fontWeight: 700, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase'}}>Info</p><a href="/about" style={{display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>About</a><a href="/contact" style={{display: 'block', color: '#888', fontSize: 12, textDecoration: 'none', padding: '3px 0'}}>Contact</a></div>
        </div>
        <div style={{borderTop: '1px solid #1A1A1A', paddingTop: 16, textAlign: 'center', color: '#555', fontSize: 10}}>&copy; 2024 OUTLETX. All rights reserved.</div>
      </footer>
    </>
  );
}
