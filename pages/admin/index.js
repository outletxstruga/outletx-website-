import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [orderFilter, setOrderFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    fetchProducts();
    fetchOrders();
    const interval = setInterval(() => { fetchProducts(); fetchOrders(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
  };

  const updateOrderStatus = async (orderId, status) => {
    await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status }) });
    fetchOrders();
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };
  if (!authorized) return null;

  const totalProducts = products.length;
  const inStock = products.filter(p => p.inStock).length;
  const lowStock = products.filter(p => p.stock && p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter(p => !p.inStock || p.stock === 0);
  const totalValue = products.reduce((sum, p) => sum + (p.newPrice * (p.stock || 0)), 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt || o.created_at).toDateString() === new Date().toDateString());
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const shippedOrders = orders.filter(o => o.status === 'shipped');
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

  const displayOrders = activeTab === 'overview' ? orders.slice(0, 10) : filteredOrders;

  const S = {
    card: { background: '#FFFFFF', padding: 20, borderRadius: 2, border: '1px solid #F0F0F0' },
    statNum: { fontFamily: 'Montserrat, sans-serif', fontSize: 32, fontWeight: 900, margin: '0 0 4px' },
    statLabel: { color: '#999', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', margin: 0 },
    tab: (active) => ({ padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', borderBottom: active ? '2px solid #DC2626' : '2px solid transparent', color: active ? '#DC2626' : '#999', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontFamily: 'Inter, sans-serif' }),
    btn: (bg) => ({ background: bg, color: '#FFF', border: 'none', padding: '5px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', borderRadius: 2 }),
  };

  return (
    <>
      <Head><title>Dashboard | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, margin: 0}}>OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888', fontSize: 12, fontWeight: 400}}>Admin</span></h1>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap'}}>
            <a href="/admin/products" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Products</a>
            <a href="/admin/orders" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Orders</a>
<a href="/admin/settings" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Settings</a>
            <a href="/admin/order-form" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Order Form</a>
<a href="/admin/customers" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Customers</a>
            <a href="/" target="_blank" style={{color: '#888', textDecoration: 'none', fontSize: 12}}>View Site</a>
            <button onClick={handleLogout} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, padding: '7px 14px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: 1500, margin: '0 auto', padding: '24px 24px'}}>
          {/* Stats Row */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28}}>
            {[
              { label: 'Total Products', value: totalProducts, color: '#000' },
              { label: 'In Stock', value: inStock, color: '#16A34A' },
              { label: 'Low Stock', value: lowStock.length, color: '#EA580C', alert: lowStock.length > 0 },
              { label: 'Out of Stock', value: outOfStock.length, color: '#DC2626', alert: outOfStock.length > 0 },
              { label: 'Total Orders', value: totalOrders, color: '#2563EB' },
              { label: 'Pending', value: pendingOrders.length, color: '#EA580C', alert: pendingOrders.length > 0 },
              { label: 'Today Revenue', value: todayRevenue.toLocaleString() + ' MKD', color: '#16A34A' },
              { label: 'Inventory Value', value: totalValue.toLocaleString() + ' MKD', color: '#000' },
            ].map((s) => (
              <div key={s.label} style={{...S.card, borderLeft: `4px solid ${s.color}`, background: s.alert ? '#FFF7ED' : '#FFF'}}>
                <p style={S.statNum}>{s.value}</p>
                <p style={S.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Low Stock Alert */}
          {lowStock.length > 0 && (
            <div style={{background: '#FFF7ED', border: '2px solid #EA580C', padding: 20, marginBottom: 24}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8}}>
                <div>
                  <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, margin: 0, color: '#EA580C'}}>Low Stock Alert ({lowStock.length})</h2>
                  <p style={{color: '#9A3412', fontSize: 12, margin: '2px 0 0'}}>Restock needed</p>
                </div>
                <a href="/admin/products" style={{color: '#EA580C', textDecoration: 'none', fontSize: 12, fontWeight: 700}}>Manage &rarr;</a>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10}}>
                {lowStock.map(p => (
                  <div key={p.id} style={{background: '#FFF', padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <p style={{fontWeight: 700, fontSize: 12, margin: '0 0 2px', textTransform: 'uppercase'}}>{p.name}</p>
                      <p style={{color: '#DC2626', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', margin: 0}}>{p.brand}</p>
                      <p style={{color: '#999', fontSize: 10, margin: '2px 0 0'}}>SKU: {p.sku}</p>
                    </div>
                    <span style={{background: '#FEF2F2', color: '#DC2626', fontWeight: 900, fontSize: 22, padding: '6px 14px'}}>{p.stock}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Out of Stock */}
          {outOfStock.length > 0 && (
            <div style={{background: '#FEF2F2', border: '2px solid #DC2626', padding: 20, marginBottom: 24}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, margin: '0 0 10px', color: '#DC2626'}}>Out of Stock ({outOfStock.length})</h2>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
                {outOfStock.map(p => <span key={p.id} style={{background: '#FFF', color: '#DC2626', fontWeight: 600, fontSize: 11, padding: '4px 10px'}}>{p.brand} {p.name}</span>)}
              </div>
            </div>
          )}

          {/* Tabs & Orders */}
          <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20}}>
              <div style={{display: 'flex', gap: 0}}>
                {['overview', 'pending', 'shipped', 'delivered'].map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setOrderFilter(tab === 'overview' ? 'all' : tab); }} style={S.tab(activeTab === tab)}>{tab}</button>
                ))}
              </div>
              <span style={{color: '#999', fontSize: 12}}>{displayOrders.length} orders</span>
            </div>

            {displayOrders.length === 0 ? (
              <p style={{color: '#999', fontSize: 13, textAlign: 'center', padding: 40}}>No orders</p>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 800}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid #000'}}>
                      <th style={th}>Order</th><th style={th}>Date</th><th style={th}>Customer</th><th style={th}>Phone</th><th style={th}>Product</th><th style={th}>Size</th><th style={th}>Total</th><th style={th}>Status</th><th style={th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayOrders.map(o => (
                      <tr key={o.id} style={{borderBottom: '1px solid #F0F0F0'}}>
                        <td style={td}>#{String(o.id).slice(-6)}</td>
                        <td style={{...td, color: '#999', fontSize: 10}}>{new Date(o.createdAt || o.created_at).toLocaleDateString()}</td>
                        <td style={{...td, fontWeight: 600}}>{o.customer_name || o.customerInfo?.fullName || '-'}</td>
                        <td style={td}>{o.customer_phone || o.customerInfo?.phone || '-'}</td>
                        <td style={{...td, fontWeight: 600}}>{o.product_name || o.product?.name || '-'}</td>
                        <td style={td}>{o.size || '-'}</td>
                        <td style={{...td, fontWeight: 700}}>{o.total} MKD</td>
                        <td style={td}><span style={{background: o.status === 'shipped' ? '#F0FDF4' : o.status === 'delivered' ? '#EFF6FF' : '#FFF7ED', color: o.status === 'shipped' ? '#16A34A' : o.status === 'delivered' ? '#2563EB' : '#EA580C', padding: '3px 8px', fontSize: 10, fontWeight: 700}}>{o.status || 'Pending'}</span></td>
                        <td style={td}>
                          {o.status === 'pending' && <button onClick={() => updateOrderStatus(o.id, 'shipped')} style={S.btn('#000')}>Ship</button>}
                          {o.status === 'shipped' && <button onClick={() => updateOrderStatus(o.id, 'delivered')} style={S.btn('#2563EB')}>Deliver</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24}}>
            {[
              { label: 'Add Product', link: '/admin/products', desc: 'Add new inventory' },
              { label: 'Order Form', link: '/admin/order-form', desc: 'Create distributor Excel' },
              { label: 'View Site', link: '/', desc: 'See live website' },
            ].map(q => (
              <a key={q.label} href={q.link} style={{...S.card, textDecoration: 'none', color: '#000', transition: 'all 0.2s', display: 'block'}}
              onMouseEnter={(e) => e.target.style.borderColor = '#DC2626'}
              onMouseLeave={(e) => e.target.style.borderColor = '#F0F0F0'}>
                <p style={{fontWeight: 700, fontSize: 13, margin: '0 0 4px'}}>{q.label}</p>
                <p style={{color: '#999', fontSize: 11, margin: 0}}>{q.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const th = { textAlign: 'left', padding: '10px 8px', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: 1 };
const td = { padding: '10px 8px' };