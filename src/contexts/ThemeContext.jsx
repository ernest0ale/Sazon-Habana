'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { COLORES_TEMA } from '@/lib/utils/constants';

const ThemeContext = createContext(null);

const STORAGE_KEY_DARK = 'sh_dark_mode';
const STORAGE_KEY_COLOR = 'sh_theme_color';
const DEFAULT_COLOR = COLORES_TEMA[0];

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [brandColor, setBrandColorState] = useState(DEFAULT_COLOR);
  const [mounted, setMounted] = useState(false);

  // Cargar preferencias guardadas
  useEffect(() => {
    try {
      const savedDark = localStorage.getItem(STORAGE_KEY_DARK);
      const savedColor = localStorage.getItem(STORAGE_KEY_COLOR);

      if (savedDark === 'true') setIsDark(true);
      if (savedColor && COLORES_TEMA.includes(savedColor)) {
        setBrandColorState(savedColor);
      }
    } catch {
      // localStorage no disponible
    }
    setMounted(true);
  }, []);

  // Aplicar clase dark al <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_DARK, 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_DARK, 'false');
    }
  }, [isDark, mounted]);

  // Aplicar color primario a la variable CSS
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty('--brand-primary', brandColor);
    localStorage.setItem(STORAGE_KEY_COLOR, brandColor);
  }, [brandColor, mounted]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const setBrandColor = useCallback((color) => {
    if (!COLORES_TEMA.includes(color)) return;
    setBrandColorState(color);
  }, []);

  const value = {
    isDark,
    brandColor,
    mounted,
    toggleDark,
    setBrandColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>.');
  return ctx;
}