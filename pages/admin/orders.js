import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminOrders() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data || []);
  };

  const updateStatus = async (orderId, status) => {
    await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status }) });
    fetchOrders();
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };
  if (!authorized) return null;

  let filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  if (search) {
    const q = search.toLowerCase();
    filteredOrders = filteredOrders.filter(o => 
      (o.customer_name || o.customerInfo?.fullName || '').toLowerCase().includes(q) ||
      (o.customer_phone || o.customerInfo?.phone || '').toLowerCase().includes(q) ||
      (o.product_name || o.product?.name || '').toLowerCase().includes(q) ||
      String(o.id).includes(q)
    );
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const shippedCount = orders.filter(o => o.status === 'shipped').length;
  const todayCount = orders.filter(o => new Date(o.createdAt || o.created_at).toDateString() === new Date().toDateString()).length;
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const exportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Email', 'City', 'Address', 'Product', 'SKU', 'Size', 'Qty', 'Total', 'Card', 'Status'];
    const rows = filteredOrders.map(o => [
      o.id, new Date(o.createdAt || o.created_at).toLocaleDateString(),
      o.customer_name || o.customerInfo?.fullName || '',
      o.customer_phone || o.customerInfo?.phone || '',
      o.customer_email || o.customerInfo?.email || '',
      o.customer_city || o.customerInfo?.city || '',
      o.customer_address || o.customerInfo?.address || '',
      o.product_name || o.product?.name || '',
      o.product_sku || o.product?.sku || '',
      o.size || '', o.quantity || 1, o.total || 0,
      o.card_last4 || o.cardLast4 || '', o.status || 'pending'
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `outletx_orders_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  return (
    <>
      <Head><title>Orders | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, margin: 0}}>OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888', fontSize: 12, fontWeight: 400}}>Orders</span></h1>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap'}}>
            <a href="/admin" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Dashboard</a>
            <a href="/admin/products" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Products</a>
            <a href="/admin/order-form" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Order Form</a>
            <a href="/admin/settings" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Settings</a>
            <button onClick={handleLogout} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, padding: '7px 14px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: 1500, margin: '0 auto', padding: '24px'}}>
          {/* Stats */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24}}>
            {[
              { label: 'Total Orders', value: orders.length, color: '#000' },
              { label: 'Pending', value: pendingCount, color: '#EA580C' },
              { label: 'Shipped', value: shippedCount, color: '#16A34A' },
              { label: 'Today', value: todayCount, color: '#2563EB' },
              { label: 'Revenue', value: totalRevenue.toLocaleString() + ' MKD', color: '#16A34A' },
            ].map(s => (
              <div key={s.label} style={{background: '#FFF', padding: 16, borderLeft: `4px solid ${s.color}`, border: '1px solid #F0F0F0'}}>
                <p style={{fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 900, margin: '0 0 4px'}}>{s.value}</p>
                <p style={{color: '#999', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', margin: 0}}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter, Search & Export */}
          <div style={{display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: 0}}>
              {['all', 'pending', 'shipped', 'delivered'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
                  background: filter === f ? '#000' : '#FFF', color: filter === f ? '#FFF' : '#999',
                  border: '1px solid #E5E5E5', fontFamily: 'Inter, sans-serif',
                }}>{f}</button>
              ))}
            </div>
            <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} style={{
              flex: 1, minWidth: 200, padding: '8px 14px', border: '1px solid #E5E5E5', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
            }} />
            <button onClick={exportCSV} style={{
              background: '#16A34A', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
            }}>Export CSV</button>
            <span style={{color: '#999', fontSize: 12, whiteSpace: 'nowrap'}}>{filteredOrders.length} orders</span>
          </div>

          {/* Orders Table */}
          <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0', overflowX: 'auto'}}>
            {filteredOrders.length === 0 ? (
              <p style={{color: '#999', fontSize: 13, textAlign: 'center', padding: 40}}>No orders found</p>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 900}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #000'}}>
                    <th style={th}>Order ID</th>
                    <th style={th}>Date</th>
                    <th style={th}>Customer</th>
                    <th style={th}>Phone</th>
                    <th style={th}>Email</th>
                    <th style={th}>City</th>
                    <th style={th}>Address</th>
                    <th style={th}>Product</th>
                    <th style={th}>SKU</th>
                    <th style={th}>Size</th>
                    <th style={th}>Qty</th>
                    <th style={th}>Total</th>
                    <th style={th}>Card</th>
                    <th style={th}>Status</th>
                    <th style={th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id} style={{borderBottom: '1px solid #F0F0F0'}}>
                      <td style={td}>#{String(o.id).slice(-6)}</td>
                      <td style={{...td, color: '#999', fontSize: 10}}>{new Date(o.createdAt || o.created_at).toLocaleDateString()}</td>
                      <td style={{...td, fontWeight: 600}}>{o.customer_name || o.customerInfo?.fullName || '-'}</td>
                      <td style={td}>{o.customer_phone || o.customerInfo?.phone || '-'}</td>
                      <td style={{...td, fontSize: 10}}>{o.customer_email || o.customerInfo?.email || '-'}</td>
                      <td style={td}>{o.customer_city || o.customerInfo?.city || '-'}</td>
                      <td style={{...td, fontSize: 10}}>{o.customer_address || o.customerInfo?.address || '-'}</td>
                      <td style={{...td, fontWeight: 600}}>{o.product_name || o.product?.name || '-'}</td>
                      <td style={{...td, color: '#999', fontSize: 10}}>{o.product_sku || o.product?.sku || '-'}</td>
                      <td style={td}>{o.size || '-'}</td>
                      <td style={td}>{o.quantity || 1}</td>
                      <td style={{...td, fontWeight: 700}}>{o.total} MKD</td>
                      <td style={{...td, color: '#999', fontSize: 10}}>{o.card_last4 || o.cardLast4 ? '****' + (o.card_last4 || o.cardLast4) : '-'}</td>
                      <td style={td}><span style={{background: o.status === 'shipped' ? '#F0FDF4' : o.status === 'delivered' ? '#EFF6FF' : '#FFF7ED', color: o.status === 'shipped' ? '#16A34A' : o.status === 'delivered' ? '#2563EB' : '#EA580C', padding: '3px 8px', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap'}}>{o.status || 'Pending'}</span></td>
                      <td style={td}>
                        {o.status === 'pending' && <button onClick={() => updateStatus(o.id, 'shipped')} style={{background: '#000', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'}}>Ship</button>}
                        {o.status === 'shipped' && <button onClick={() => updateStatus(o.id, 'delivered')} style={{background: '#2563EB', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'}}>Deliver</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const th = { textAlign: 'left', padding: '8px 6px', fontWeight: 700, textTransform: 'uppercase', fontSize: 9, letterSpacing: 1, whiteSpace: 'nowrap' };
const td = { padding: '8px 6px', whiteSpace: 'nowrap' };