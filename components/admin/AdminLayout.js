import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const NAV = [
  { href: '/admin', label: 'Overview', icon: '⌂' },
  { href: '/admin/orders', label: 'Orders', icon: '▤' },
  { href: '/admin/products', label: 'Products & stock', icon: '□' },
  { href: '/admin/customers', label: 'Customers', icon: '◎' },
  { href: '/admin/analytics', label: 'Analytics', icon: '↗' },
  { href: '/admin/slider', label: 'Homepage', icon: '▧' },
  { href: '/admin/order-form', label: 'Supplier order', icon: '＋' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export function useAdminSession() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((response) => {
        if (!response.ok) throw new Error('unauthorized');
        setReady(true);
      })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  return ready;
}

export default function AdminLayout({ title, eyebrow, action, children }) {
  const router = useRouter();
  const ready = useAdminSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (!ready) return <div className="admin-loading">Loading OutletX admin…</div>;

  return (
    <div className="admin-shell">
      <Head><title>{title} | OutletX Admin</title></Head>
      <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="admin-brand">
          <a href="/admin" aria-label="OutletX admin home">OUTLET<span>X</span></a>
          <small>ADMIN CONSOLE</small>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {NAV.map((item) => {
            const active = item.href === '/admin' ? router.pathname === '/admin' : router.pathname.startsWith(item.href);
            return <a key={item.href} className={active ? 'active' : ''} href={item.href} onClick={() => setMenuOpen(false)}><b>{item.icon}</b><span>{item.label}</span></a>;
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer">View storefront ↗</a>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>

      {menuOpen && <button className="admin-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <main className="admin-main">
        <header className="admin-mobile-header">
          <a href="/admin">OUTLET<span>X</span></a>
          <button aria-label="Open admin navigation" onClick={() => setMenuOpen(true)}>☰</button>
        </header>
        <div className="admin-page-head">
          <div><p>{eyebrow || 'OUTLETX OPERATIONS'}</p><h1>{title}</h1></div>
          {action && <div className="admin-head-action">{action}</div>}
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export function StatCard({ label, value, detail, tone = 'neutral' }) {
  return <article className={`admin-stat tone-${tone}`}><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>;
}

export function EmptyState({ title, text, action }) {
  return <div className="admin-empty"><div>□</div><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export function StatusBadge({ status }) {
  const value = (status || 'pending').toLowerCase();
  return <span className={`admin-status status-${value}`}>{value.replace('_', ' ')}</span>;
}
