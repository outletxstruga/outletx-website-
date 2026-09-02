import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import defaultContent from '../data/content.json';

const StoreContext = createContext();
const REVALIDATE_AFTER_MS = 30000;

export function StoreProvider({ children }) {
  const { pathname } = useRouter();
  const [store, setStore] = useState({ products: [], content: defaultContent, checkoutReady: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const lastLoaded = useRef(0);

  useEffect(() => {
    // Admin pages have their own protected data requests; do not fetch the whole shop too.
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      lastLoaded.current = 0;
      return;
    }
    let active = true;
    let pending = false;
    const controller = new AbortController();
    const load = async (force = false) => {
      if (pending || (!force && Date.now() - lastLoaded.current < REVALIDATE_AFTER_MS)) return;
      pending = true;
      try {
        const response = await fetch('/api/store', { cache: 'no-store', signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'The shop is temporarily unavailable.');
        if (active) {
          setStore(data);
          setError('');
          lastLoaded.current = Date.now();
        }
      } catch (error) {
        if (active) {
          setError(error.message);
          setStore((old) => ({ ...old, checkoutReady: false }));
        }
      } finally {
        pending = false;
        if (active) setLoading(false);
      }
    };
    const refresh = () => load(true);
    load();
    window.addEventListener('focus', refresh);
    window.addEventListener('outletx:store-updated', refresh);
    return () => {
      active = false;
      controller.abort();
      window.removeEventListener('focus', refresh);
      window.removeEventListener('outletx:store-updated', refresh);
    };
  }, [pathname]);

  return <StoreContext.Provider value={{ ...store, loading, error }}>{children}</StoreContext.Provider>;
}
export function useStore() { return useContext(StoreContext); }
