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
    const next = lang === 'mk' ? 'en' : 'mk';
    setLang(next);
    localStorage.setItem('outletx_lang', next);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}