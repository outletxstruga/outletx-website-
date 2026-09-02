import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch('/api/admin/session').then((response) => { if (response.ok) router.replace('/admin'); }); }, [router]);

  const login = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ password }) });
      if (!response.ok) { setError('That password is not correct. Please try again.'); setLoading(false); return; }
      router.replace('/admin');
    } catch { setError('The admin area could not be reached. Please try again.'); setLoading(false); }
  };

  return <div className="admin-login-page">
    <Head><title>Sign in | OutletX Admin</title></Head>
    <section className="admin-login-brand"><a href="/">OUTLET<span>X</span></a><div><p>STORE MANAGEMENT</p><h1>Everything your store needs, in one place.</h1><span>Manage products, stock, customer orders, and homepage content securely.</span></div></section>
    <main className="admin-login-main"><form onSubmit={login} className="admin-login-card"><p>PRIVATE ADMIN AREA</p><h2>Welcome back</h2><span>Enter your admin password to continue.</span><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event)=>setPassword(event.target.value)} placeholder="Your admin password" required autoFocus/>{error&&<div className="admin-alert">{error}</div>}<button className="admin-button red" disabled={loading}>{loading?'Signing in…':'Sign in securely'}</button><a href="/">← Back to the store</a></form></main>
  </div>;
}
