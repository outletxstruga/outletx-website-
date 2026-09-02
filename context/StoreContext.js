import { createContext, useContext, useEffect, useState } from 'react';
import defaultContent from '../data/content.json';

const StoreContext = createContext();
export function StoreProvider({ children }) {
  const [store, setStore] = useState({ products: [], content: defaultContent, checkoutReady: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch('/api/store', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'The shop is temporarily unavailable.');
        if (active) { setStore(data); setError(''); }
      } catch (error) { if (active) { setError(error.message); setStore((old) => ({ ...old, checkoutReady: false })); } }
      finally { if (active) setLoading(false); }
    };
    load();
    window.addEventListener('focus', load);
    return () => { active = false; window.removeEventListener('focus', load); };
  }, []);
  return <StoreContext.Provider value={{ ...store, loading, error }}>{children}</StoreContext.Provider>;
}
export function useStore() { return useContext(StoreContext); }
