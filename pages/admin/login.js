import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      localStorage.setItem('admin_token', 'admin_session_token');
      router.push('/admin');
    } else {
      setError('Invalid password');
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Admin Login | OUTLETX</title>
      </Head>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F5F5F5', fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{background: '#FFFFFF', padding: '48px', width: '400px', maxWidth: '90%'}}>
          <h1 style={{fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase', marginBottom: '8px'}}>
            OUTLET<span style={{color: '#DC2626'}}>X</span>
          </h1>
          <p style={{color: '#999999', fontSize: '13px', marginBottom: '32px'}}>Admin Panel</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%', padding: '14px', border: '1px solid #E5E5E5',
                fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none',
                marginBottom: '16px', boxSizing: 'border-box',
              }}
            />
            {error && (
              <p style={{color: '#DC2626', fontSize: '13px', marginBottom: '16px'}}>{error}</p>
            )}
            <button type="submit" disabled={loading} style={{
              width: '100%', background: '#000000', color: '#FFFFFF', border: 'none',
              fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '16px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

