import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AdminSessionContext = createContext({ ready: false, clearSession: () => {} });

export function AdminSessionProvider({ children }) {
  const { pathname, replace } = useRouter();
  const [ready, setReady] = useState(false);
  const clearSession = useCallback(() => setReady(false), []);
  const isPrivatePage = pathname === '/admin' || (pathname.startsWith('/admin/') && pathname !== '/admin/login');

  useEffect(() => {
    if (!isPrivatePage) {
      setReady(false);
      return;
    }
    let active = true;
    const controller = new AbortController();
    const check = async () => {
      try {
        const response = await fetch('/api/admin/session', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Session expired');
        if (active) setReady(true);
      } catch {
        if (active) {
          setReady(false);
          replace('/admin/login');
        }
      }
    };
    // Recheck on every admin route and on return to the tab, without discarding
    // a confirmed session during navigation. All admin APIs still check the cookie.
    check();
    window.addEventListener('focus', check);
    return () => {
      active = false;
      controller.abort();
      window.removeEventListener('focus', check);
    };
  }, [pathname, isPrivatePage, replace]);

  return <AdminSessionContext.Provider value={{ ready: isPrivatePage && ready, clearSession }}>{children}</AdminSessionContext.Provider>;
}
export function useAdminSessionState() { return useContext(AdminSessionContext); }
