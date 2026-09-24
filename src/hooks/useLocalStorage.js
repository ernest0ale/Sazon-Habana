'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignorar
    }
  }, [key, value]);

  const remove = useCallback(() => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.removeItem(key); } catch {}
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove];
}