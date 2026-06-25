import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    fetchProducts();
    fetchOrders();
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

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  if (!authorized) return null;

  const totalProducts = products.length;
  const inStock = products.filter(p => p.inStock).length;
  const lowStock = products.filter(p => p.stock && p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter(p => !p.inStock || p.stock === 0);
  const totalValue = products.reduce((sum, p) => sum + (p.newPrice * (p.stock || 0)), 0);
  const todayOrders = orders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.createdAt).toDateString() === today;
  });
  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <>
      <Head><title>Dashboard | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        {/* Header */}
        <div style={{background: '#000000', color: '#FFFFFF', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '900', margin: 0}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888888', fontSize: '14px', fontWeight: '400'}}>Dashboard</span>
          </h1>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <a href="/admin/products" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Products</a>
            <a href="/admin/orders" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Orders</a>
            <a href="/admin/order-form" style={{color: '#FFFFFF', textDecoration: 'none', fontSize: '13px', fontWeight: '600'}}>Order Form</a>
            <a href="/" target="_blank" style={{color: '#888888', textDecoration: 'none', fontSize: '13px'}}>View Site</a>
            <button onClick={handleLogout} style={{background: '#DC2626', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700', padding: '8px 16px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: '1400px', margin: '40px auto', padding: '0 40px'}}>
          {/* Stats */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px'}}>
            {[
              { label: 'Total Products', value: totalProducts, color: '#000000' },
              { label: 'In Stock', value: inStock, color: '#16A34A' },
              { label: 'Pending Orders', value: pendingOrders.length, color: '#EA580C' },
              { label: 'Inventory Value', value: totalValue.toLocaleString() + ' MKD', color: '#000000' },
            ].map((stat) => (
              <div key={stat.label} style={{background: '#FFFFFF', padding: '24px', borderLeft: `4px solid ${stat.color}`}}>
                <p style={{color: '#999999', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'}}>{stat.label}</p>
                <p style={{fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '900', margin: 0}}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Low Stock Alerts */}
          {lowStock.length > 0 && (
            <div style={{background: '#FFF7ED', border: '2px solid #EA580C', padding: '24px', marginBottom: '32px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <div>
                  <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', margin: 0, color: '#EA580C'}}>
                    Low Stock Alert ({lowStock.length})
                  </h2>
                  <p style={{color: '#9A3412', fontSize: '13px', margin: '4px 0 0'}}>These products need restocking soon</p>
                </div>
                <a href="/admin/products" style={{color: '#EA580C', textDecoration: 'none', fontSize: '13px', fontWeight: '700'}}>Manage Products &rarr;</a>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px'}}>
                {lowStock.map((p) => (
                  <div key={p.id} style={{background: '#FFFFFF', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <p style={{fontWeight: '700', fontSize: '13px', marginBottom: '2px', textTransform: 'uppercase'}}>{p.name}</p>
                      <p style={{color: '#DC2626', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase'}}>{p.brand}</p>
                      <p style={{color: '#999999', fontSize: '11px'}}>SKU: {p.sku}</p>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <span style={{
                        background: '#FEF2F2', color: '#DC2626', fontWeight: '900', fontSize: '20px',
                        padding: '8px 16px', display: 'block',
                      }}>{p.stock}</span>
                      <span style={{color: '#DC2626', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase'}}>Left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Out of Stock */}
          {outOfStock.length > 0 && (
            <div style={{background: '#FEF2F2', border: '2px solid #DC2626', padding: '24px', marginBottom: '32px'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '12px', color: '#DC2626'}}>
                Out of Stock ({outOfStock.length})
              </h2>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {outOfStock.map((p) => (
                  <span key={p.id} style={{background: '#FFFFFF', color: '#DC2626', fontWeight: '600', fontSize: '12px', padding: '6px 14px'}}>
                    {p.brand} {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <div style={{background: '#FFFFFF', padding: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', margin: 0}}>Recent Orders</h2>
              <a href="/admin/orders" style={{color: '#000000', textDecoration: 'none', fontSize: '13px', fontWeight: '700'}}>View All &rarr;</a>
            </div>
            {orders.length === 0 ? (
              <p style={{color: '#999999', fontSize: '14px', textAlign: 'center', padding: '40px'}}>No orders yet.</p>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #000000'}}>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px'}}>Order</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px'}}>Customer</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px'}}>Phone</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px'}}>Products</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px'}}>Total</th>
                    <th style={{textAlign: 'left', padding: '12px 8px', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order, i) => (
                    <tr key={i} style={{borderBottom: '1px solid #F0F0F0'}}>
                      <td style={{padding: '10px 8px'}}>#{order.id}</td>
                      <td style={{padding: '10px 8px', fontWeight: '600'}}>{order.customerInfo?.fullName || 'N/A'}</td>
                      <td style={{padding: '10px 8px'}}>{order.customerInfo?.phone || 'N/A'}</td>
                      <td style={{padding: '10px 8px'}}>{order.product?.name || 'Multiple items'}</td>
                      <td style={{padding: '10px 8px', fontWeight: '700'}}>{order.total} MKD</td>
                      <td style={{padding: '10px 8px'}}>
                        <span style={{
                          background: order.status === 'shipped' ? '#F0FDF4' : '#FFF7ED',
                          color: order.status === 'shipped' ? '#16A34A' : '#EA580C',
                          padding: '4px 10px', fontSize: '11px', fontWeight: '700',
                        }}>{order.status || 'Pending'}</span>
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
