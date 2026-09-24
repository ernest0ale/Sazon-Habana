'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const openSearch = useCallback((query = '') => {
    setInitialQuery(query);
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setInitialQuery('');
  }, []);

  const value = useMemo(
    () => ({ isOpen, initialQuery, openSearch, closeSearch }),
    [isOpen, initialQuery, openSearch, closeSearch]
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearchContext debe usarse dentro de <SearchProvider>.');
  return ctx;
}