import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminCustomers() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
    fetch('/api/orders').then(r => r.json()).then(d => setOrders(d || []));
  }, []);

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };
  if (!authorized) return null;

  // Group orders by customer
  const customerMap = {};
  orders.forEach(o => {
    const key = (o.customer_phone || o.customerInfo?.phone || 'no-phone').trim();
    if (!customerMap[key]) {
      customerMap[key] = {
        phone: key,
        name: o.customer_name || o.customerInfo?.fullName || 'Unknown',
        email: o.customer_email || o.customerInfo?.email || '',
        city: o.customer_city || o.customerInfo?.city || '',
        address: o.customer_address || o.customerInfo?.address || '',
        orders: [],
        totalSpent: 0,
        lastOrder: '',
      };
    }
    customerMap[key].orders.push(o);
    customerMap[key].totalSpent += o.total || 0;
    if (!customerMap[key].lastOrder || new Date(o.createdAt || o.created_at) > new Date(customerMap[key].lastOrder)) {
      customerMap[key].lastOrder = o.createdAt || o.created_at;
    }
    if (!customerMap[key].name || customerMap[key].name === 'Unknown') {
      customerMap[key].name = o.customer_name || o.customerInfo?.fullName || 'Unknown';
    }
    if (!customerMap[key].email) {
      customerMap[key].email = o.customer_email || o.customerInfo?.email || '';
    }
  });

  let customers = Object.values(customerMap);
  if (search) {
    const q = search.toLowerCase();
    customers = customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q));
  }
  customers.sort((a, b) => new Date(b.lastOrder) - new Date(a.lastOrder));

  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter(c => c.orders.length > 1).length;

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'City', 'Address', 'Orders', 'Total Spent', 'Last Order'];
    const rows = customers.map(c => [c.name, c.phone, c.email, c.city, c.address, c.orders.length, c.totalSpent, new Date(c.lastOrder).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `outletx_customers_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  return (
    <>
      <Head><title>Customers | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, margin: 0}}>OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888', fontSize: 12, fontWeight: 400}}>Customers</span></h1>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap'}}>
            <a href="/admin" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Dashboard</a>
            <a href="/admin/products" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Products</a>
            <a href="/admin/orders" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Orders</a>
            <a href="/admin/settings" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Settings</a>
            <button onClick={handleLogout} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, padding: '7px 14px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: 1500, margin: '0 auto', padding: '24px'}}>
          {/* Stats */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24}}>
            {[
              { label: 'Total Customers', value: totalCustomers, color: '#000' },
              { label: 'Repeat Customers', value: repeatCustomers, color: '#2563EB' },
              { label: 'Total Orders', value: orders.length, color: '#16A34A' },
              { label: 'Avg Order Value', value: orders.length ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / orders.length) + ' MKD' : '0 MKD', color: '#EA580C' },
            ].map(s => (
              <div key={s.label} style={{background: '#FFF', padding: 16, borderLeft: `4px solid ${s.color}`, border: '1px solid #F0F0F0'}}>
                <p style={{fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 900, margin: '0 0 4px'}}>{s.value}</p>
                <p style={{color: '#999', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', margin: 0}}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Export */}
          <div style={{display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center'}}>
            <input type="text" placeholder="Search by name, phone, email..." value={search} onChange={(e) => setSearch(e.target.value)} style={{flex: 1, minWidth: 200, padding: '8px 14px', border: '1px solid #E5E5E5', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none'}} />
            <button onClick={exportCSV} style={{background: '#16A34A', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap'}}>Export CSV</button>
            <span style={{color: '#999', fontSize: 12, whiteSpace: 'nowrap'}}>{customers.length} customers</span>
          </div>

          {/* Customer Table */}
          <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0', overflowX: 'auto'}}>
            {customers.length === 0 ? (
              <p style={{color: '#999', fontSize: 13, textAlign: 'center', padding: 40}}>No customers found</p>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #000'}}>
                    <th style={th}>Customer</th><th style={th}>Phone</th><th style={th}>Email</th><th style={th}>City</th><th style={th}>Orders</th><th style={th}>Total Spent</th><th style={th}>Last Order</th><th style={th}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={i} style={{borderBottom: '1px solid #F0F0F0'}}>
                      <td style={{...td, fontWeight: 600}}>{c.name}</td>
                      <td style={td}>{c.phone !== 'no-phone' ? c.phone : '-'}</td>
                      <td style={{...td, fontSize: 10}}>{c.email || '-'}</td>
                      <td style={td}>{c.city || '-'}</td>
                      <td style={{...td, fontWeight: 700}}>{c.orders.length}</td>
                      <td style={{...td, fontWeight: 700}}>{c.totalSpent} MKD</td>
                      <td style={{...td, color: '#999', fontSize: 10}}>{c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : '-'}</td>
                      <td style={td}>
                        <button onClick={() => setSelectedCustomer(selectedCustomer?.phone === c.phone ? null : c)} style={{background: '#000', color: '#FFF', border: 'none', padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer'}}>
                          {selectedCustomer?.phone === c.phone ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Customer Detail */}
          {selectedCustomer && (
            <div style={{background: '#FFF', padding: 20, marginTop: 20, border: '1px solid #F0F0F0'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 16}}>
                {selectedCustomer.name} — {selectedCustomer.orders.length} Orders
              </h2>
              <p style={{color: '#666', fontSize: 12, margin: '0 0 4px'}}>Phone: {selectedCustomer.phone}</p>
              <p style={{color: '#666', fontSize: 12, margin: '0 0 4px'}}>Email: {selectedCustomer.email || '-'}</p>
              <p style={{color: '#666', fontSize: 12, margin: '0 0 16px'}}>Address: {selectedCustomer.city}{selectedCustomer.address ? ', ' + selectedCustomer.address : ''}</p>
              <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 12}}>
                <thead><tr style={{borderBottom: '1px solid #E5E5E5'}}><th style={th}>Order ID</th><th style={th}>Date</th><th style={th}>Product</th><th style={th}>Size</th><th style={th}>Total</th><th style={th}>Status</th></tr></thead>
                <tbody>
                  {selectedCustomer.orders.map(o => (
                    <tr key={o.id} style={{borderBottom: '1px solid #F0F0F0'}}>
                      <td style={td}>#{String(o.id).slice(-6)}</td>
                      <td style={{...td, color: '#999', fontSize: 10}}>{new Date(o.createdAt || o.created_at).toLocaleDateString()}</td>
                      <td style={{...td, fontWeight: 600}}>{o.product_name || o.product?.name || '-'}</td>
                      <td style={td}>{o.size || '-'}</td>
                      <td style={{...td, fontWeight: 700}}>{o.total} MKD</td>
                      <td style={td}><span style={{background: o.status === 'shipped' ? '#F0FDF4' : o.status === 'delivered' ? '#EFF6FF' : '#FFF7ED', color: o.status === 'shipped' ? '#16A34A' : o.status === 'delivered' ? '#2563EB' : '#EA580C', padding: '3px 8px', fontSize: 10, fontWeight: 700}}>{o.status || 'Pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const th = { textAlign: 'left', padding: '8px 6px', fontWeight: 700, textTransform: 'uppercase', fontSize: 9, letterSpacing: 1, whiteSpace: 'nowrap' };
const td = { padding: '8px 6px', whiteSpace: 'nowrap', fontSize: 11 };