'use client';

import { useSearchContext } from '@/contexts/SearchContext';

export function useSearch() {
  return useSearchContext();
}