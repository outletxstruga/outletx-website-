import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminAnalytics() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    setAuthorized(true);
  }, []);

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };
  if (!authorized) return null;

  return (
    <>
      <Head><title>Analytics | OUTLETX Admin</title></Head>
      <div style={{minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif'}}>
        <div style={{background: '#000000', color: '#FFFFFF', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 18, fontWeight: 900, margin: 0}}>OUTLET<span style={{color: '#DC2626'}}>X</span> <span style={{color: '#888', fontSize: 12, fontWeight: 400}}>Analytics</span></h1>
          <div style={{display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap'}}>
            <a href="/admin" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Dashboard</a>
            <a href="/admin/orders" style={{color: '#FFF', textDecoration: 'none', fontSize: 12, fontWeight: 600}}>Orders</a>
            <button onClick={handleLogout} style={{background: '#DC2626', color: '#FFF', border: 'none', fontSize: 11, fontWeight: 700, padding: '7px 14px', cursor: 'pointer'}}>Logout</button>
          </div>
        </div>

        <div style={{maxWidth: 1500, margin: '0 auto', padding: '24px'}}>
          <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0', marginBottom: 20}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 16}}>Real-Time Visitors</h2>
            <div style={{background: '#F9F9F9', padding: 16, textAlign: 'center', borderRadius: 2}}>
              <p style={{fontSize: 48, fontWeight: 900, fontFamily: 'Montserrat, sans-serif', margin: '0 0 4px'}}>—</p>
              <p style={{color: '#999', fontSize: 12}}>Active users on site right now</p>
              <p style={{color: '#999', fontSize: 10, marginTop: 8}}>Open Google Analytics for live data</p>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20}}>
            <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 16}}>Traffic Overview</h2>
              <p style={{color: '#999', fontSize: 12, lineHeight: 1.8}}>
                Visit Google Analytics for full data:<br/>
                • Page views<br/>
                • Traffic sources<br/>
                • User demographics<br/>
                • Top products viewed<br/>
                • Conversion rates
              </p>
            </div>
            <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0'}}>
              <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 16}}>Quick Links</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <a href="https://analytics.google.com/analytics/web/#/realtime" target="_blank" rel="noopener noreferrer" style={{color: '#DC2626', textDecoration: 'none', fontSize: 13, fontWeight: 600}}>→ Real-Time Report</a>
                <a href="https://analytics.google.com/analytics/web/#/report/trafficsources" target="_blank" rel="noopener noreferrer" style={{color: '#DC2626', textDecoration: 'none', fontSize: 13, fontWeight: 600}}>→ Traffic Sources</a>
                <a href="https://analytics.google.com/analytics/web/#/report/audience" target="_blank" rel="noopener noreferrer" style={{color: '#DC2626', textDecoration: 'none', fontSize: 13, fontWeight: 600}}>→ Audience Report</a>
              </div>
            </div>
          </div>

          <div style={{background: '#FFF', padding: 20, border: '1px solid #F0F0F0'}}>
            <h2 style={{fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 900, letterSpacing: -0.5, textTransform: 'uppercase', marginBottom: 16}}>Site Stats (From Your Database)</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14}}>
              {[
                { label: 'Total Products', value: 'Loading...' },
                { label: 'Total Orders', value: 'Loading...' },
                { label: 'Total Customers', value: 'Loading...' },
                { label: 'Revenue', value: 'Loading...' },
              ].map(s => (
                <div key={s.label} style={{background: '#F9F9F9', padding: 14, textAlign: 'center'}}>
                  <p style={{fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, margin: '0 0 4px'}}>{s.value}</p>
                  <p style={{color: '#999', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', margin: 0}}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}