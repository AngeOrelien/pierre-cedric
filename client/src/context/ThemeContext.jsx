/**
 * ThemeContext — Gestion du mode clair/sombre
 * Persiste dans localStorage, applique la classe 'dark' sur <html>
 */
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('pc_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (dark) { html.classList.add('dark');    localStorage.setItem('pc_theme','dark'); }
    else       { html.classList.remove('dark'); localStorage.setItem('pc_theme','light'); }
  }, [dark]);

  const toggle = () => setDark(d => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
