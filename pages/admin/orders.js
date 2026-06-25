import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminOrders() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data || []));
  }, []);

  const updateStatus = async (orderId, status) => {
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    });
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data || []);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  if (!authorized) return null;

  return (
    <>
      <Head><title>Orders | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '900', margin: 0}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888888', fontSize: '14px', fontWeight: '400'}}>Orders</span>
          </h1>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <a href="/admin" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Dashboard</a>
            <a href="/admin/products" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Products</a>
            <button onClick={handleLogout} style={{background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700', padding: '8px 16px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: '1400px', margin: '40px auto', padding: '0 40px'}}>
          <div style={{background: '#FFFFFF', padding: '24px'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '20px'}}>All Orders ({orders.length})</h2>

            {orders.length === 0 ? (
              <p style={{color: '#999', textAlign: 'center', padding: '40px'}}>No orders yet.</p>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid #000000'}}>
                      <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>ID</th>
                      <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Date</th>
                      <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Customer</th>
                      <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Phone</th>
                      <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Product</th>
                      <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Total</th>
                      <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Status</th>
                      <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{borderBottom: '1px solid #F0F0F0'}}>
                        <td style={{padding: '10px 8px'}}>#{String(order.id).slice(-6)}</td>
                        <td style={{padding: '10px 8px', color: '#999', fontSize: '11px'}}>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                        <td style={{padding: '10px 8px', fontWeight: '600'}}>{order.customer_name || '-'}</td>
                        <td style={{padding: '10px 8px'}}>{order.customer_phone || '-'}</td>
                        <td style={{padding: '10px 8px', fontWeight: '600'}}>{order.product_name || '-'}</td>
                        <td style={{padding: '10px 8px', fontWeight: '700'}}>{order.total} MKD</td>
                        <td style={{padding: '10px 8px'}}>
                          <span style={{
                            background: order.status === 'shipped' ? '#F0FDF4' : order.status === 'delivered' ? '#EFF6FF' : '#FFF7ED',
                            color: order.status === 'shipped' ? '#16A34A' : order.status === 'delivered' ? '#2563EB' : '#EA580C',
                            padding: '4px 10px', fontSize: '10px', fontWeight: '700',
                          }}>{order.status || 'Pending'}</span>
                        </td>
                        <td style={{padding: '10px 8px'}}>
                          {order.status === 'pending' && (
                            <button onClick={() => updateStatus(order.id, 'shipped')} style={{background: '#000', color: '#FFF', border: 'none', padding: '5px 10px', fontSize: '10px', fontWeight: '700', cursor: 'pointer'}}>Ship</button>
                          )}
                          {order.status === 'shipped' && (
                            <button onClick={() => updateStatus(order.id, 'delivered')} style={{background: '#2563EB', color: '#FFF', border: 'none', padding: '5px 10px', fontSize: '10px', fontWeight: '700', cursor: 'pointer'}}>Deliver</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}