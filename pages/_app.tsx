import '../styles/globals.css'
import type { AppProps } from 'next/app'

import React, { createContext, useContext, useState } from 'react';
import type { Locale } from '../utils/i18n';
import { locales } from '../utils/i18n';

export const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({ locale: 'en', setLocale: () => {} });

function LanguageSwitcher() {
  const { locale, setLocale } = useContext(LocaleContext);
  return (
    <div style={{ position: 'fixed', top: 18, right: 22, zIndex: 999, fontFamily: 'Comic Sans MS, cursive' }}>
      {locales.map(l => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code as Locale)}
          style={{
            marginLeft: 8,
            fontWeight: locale === l.code ? 700 : 400,
            background: locale === l.code ? '#ffd6e0' : '#fff',
            color: '#222',
            border: '1.5px solid #ffd6e0',
            borderRadius: 10,
            padding: '6px 16px',
            fontSize: 17,
            cursor: 'pointer',
            outline: 'none',
            boxShadow: locale === l.code ? '0 2px 8px #ffd6e088' : 'none',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const [locale, setLocaleState] = useState<Locale>('zh-TW');

  // On mount, load locale from localStorage if exists
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh-TW')) {
        setLocaleState(savedLocale as Locale);
      }
    }
  }, []);

  // When locale changes, save to localStorage
  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', l);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <div style={{ background: '#f5f5f5', minHeight: '100vh', minWidth: '100vw' }}>
        <LanguageSwitcher />
        <Component {...pageProps} />
      </div>
    </LocaleContext.Provider>
  );
}

export default MyApp;
