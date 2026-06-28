import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('mk');

  useEffect(() => {
    const saved = localStorage.getItem('outletx_lang');
    if (saved) setLang(saved);
  }, []);

  const toggleLang = () => {
    const langs = ['mk', 'sq', 'en'];
    const currentIndex = langs.indexOf(lang);
    const next = langs[(currentIndex + 1) % 3];
    setLang(next);
    localStorage.setItem('outletx_lang', next);
  };

  const t = translations[lang] || translations['mk'];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}