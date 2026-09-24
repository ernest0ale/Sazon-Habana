'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { getRestaurantes } from '@/lib/data/restaurantes';
import { capitalize } from '@/lib/utils/formatters';

/**
 * SearchOverlay - Overlay de búsqueda global
 * Se abre desde cualquier parte via useSearch().openSearch()
 * Navegación completa con teclado (↑ ↓ Enter Escape Tab)
 */
export default function SearchOverlay() {
  const router = useRouter();
  const { isOpen, initialQuery, closeSearch } = useSearch();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const debouncedQuery = useDebounce(query, 150);

  // Inicializar query cuando se abre
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || '');
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, [isOpen, initialQuery]);

  // Buscar sugerencias
  useEffect(() => {
    if (!isOpen || !debouncedQuery || debouncedQuery.length < 1) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const q = debouncedQuery.toLowerCase().trim();
    const all = getRestaurantes();

    const results = all
      .filter((r) => {
        if (r.nombre.toLowerCase().includes(q)) return true;
        if (r.descripcion?.toLowerCase().includes(q)) return true;
        if (r.tipo.toLowerCase().includes(q)) return true;
        if (r.municipio.toLowerCase().includes(q)) return true;
        if (r.platos_populares?.some((p) => p.nombre.toLowerCase().includes(q))) return true;
        if (r.secciones_carta?.some((sec) =>
          sec.platos.some((p) => p.nombre.toLowerCase().includes(q))
        )) return true;
        return false;
      })
      .slice(0, 6);

    setSuggestions(results);
    setSelectedIndex(-1);
  }, [debouncedQuery, isOpen]);

  // Bloquear scroll cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Manejo de teclado global
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSearch();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (suggestions.length === 0) return;
        setSelectedIndex((i) => (i >= suggestions.length - 1 ? 0 : i + 1));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (suggestions.length === 0) return;
        setSelectedIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          goToRestaurant(suggestions[selectedIndex].id);
        } else if (query.trim()) {
          goToResults(query);
        }
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, suggestions, selectedIndex, query, closeSearch]);

  function goToRestaurant(id) {
    closeSearch();
    router.push(`/espacios/${id}`);
  }

  function goToResults(q) {
    if (!q.trim()) return;
    closeSearch();
    router.push(`/espacios?q=${encodeURIComponent(q.trim())}`);
  }

  function handleBackdropClick(e) {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      closeSearch();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Buscar">
      <div className="search-overlay-container" ref={containerRef}>
        <div className="search-input-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            ref={inputRef}
            type="text"
            id="search-overlay-input"
            placeholder="Buscar restaurantes, platos o zonas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            className="search-submit-btn"
            onClick={() => goToResults(query)}
            aria-label="Buscar"
          >
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          <button
            type="button"
            className="search-overlay-close"
            onClick={closeSearch}
            aria-label="Cerrar búsqueda"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div id="search-suggestions" className="search-results-suggestions">
          {suggestions.length === 0 && query.length >= 1 && (
            <div className="suggestion-empty">No se encontraron resultados</div>
          )}

          {suggestions.map((r, index) => (
            <div
              key={r.id}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => goToRestaurant(r.id)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="sug-info">
                <div className="sug-name">{r.nombre}</div>
                <div className="sug-desc">
                  {capitalize(r.tipo)} · {r.municipio}
                </div>
              </div>
            </div>
          ))}

          {suggestions.length > 0 && query.trim() && (
            <div
              className="suggestion-item see-all"
              onClick={() => goToResults(query)}
              role="button"
            >
              <div className="see-all-text">
                Ver todos los resultados para "<strong>{query}</strong>"
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          z-index: 10000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 5rem;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .search-overlay-container {
          background: var(--brand-card);
          border-radius: 2rem;
          padding: 1rem;
          width: 90%;
          max-width: 550px;
          border: 1px solid var(--brand-border);
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.3);
        }

        .search-input-wrapper {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          border-bottom: 2px solid var(--brand-border);
          padding-bottom: 0.5rem;
        }

        .search-icon {
          color: var(--brand-primary);
          font-size: 1.1rem;
          margin-left: 0.5rem;
        }

        .search-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--brand-text);
          font-size: 1.1rem;
          padding: 0.4rem 0;
        }
        .search-input-wrapper input::placeholder {
          color: var(--brand-text);
          opacity: 0.4;
        }

        .search-submit-btn {
          background: var(--brand-primary);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          color: #ffffff;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .search-submit-btn:hover {
          background: var(--brand-hover);
          transform: scale(1.05);
        }

        .search-overlay-close {
          background: none;
          border: none;
          color: var(--brand-text);
          font-size: 1.5rem;
          padding: 0 0.5rem;
          cursor: pointer;
          opacity: 0.5;
        }
        .search-overlay-close:hover { opacity: 1; }

        .search-results-suggestions {
          margin-top: 0.75rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .suggestion-empty {
          padding: 0.8rem;
          color: var(--brand-text);
          opacity: 0.5;
          font-size: 0.85rem;
          text-align: center;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.6rem 0.8rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.15s ease;
          color: var(--brand-text);
          font-size: 0.9rem;
        }
        .suggestion-item:hover,
        .suggestion-item.selected {
          background: var(--brand-primary);
          color: #ffffff;
        }
        .suggestion-item.selected .sug-name,
        .suggestion-item.selected .sug-desc {
          color: #ffffff;
        }

        .sug-info { flex: 1; min-width: 0; }

        .sug-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .sug-desc {
          font-size: 0.75rem;
          opacity: 0.6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .see-all {
          border-top: 1px solid var(--brand-border);
          margin-top: 4px;
          padding-top: 10px;
          justify-content: center;
        }
        .see-all-text {
          font-weight: 600;
          color: var(--brand-primary);
          font-size: 0.85rem;
          text-align: center;
        }
        .suggestion-item.see-all.selected .see-all-text {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}