'use client';

import SortSelect from './SortSelect';

/**
 * ListingToolbar - Barra superior del listado con botón de filtros móvil, contador y ordenamiento
 *
 * Props:
 *   totalCount (number)
 *   query (string)
 *   sortValue (string)
 *   onSortChange (fn)
 *   onOpenMobileFilters (fn)
 */
export default function ListingToolbar({
  totalCount = 0,
  query = '',
  sortValue,
  onSortChange,
  onOpenMobileFilters
}) {
  return (
    <div className="listing-toolbar">
      <div className="toolbar-left">
        <button
          type="button"
          className="toolbar-filter-btn"
          onClick={onOpenMobileFilters}
          aria-label="Abrir filtros"
        >
          <i className="fa-solid fa-sliders" /> Filtros
        </button>

        <span className="toolbar-count">
          {query ? (
            <>Resultados para "<strong>{query}</strong>"</>
          ) : (
            <>Se encontraron <strong>{totalCount}</strong> establecimientos</>
          )}
        </span>
      </div>

      <div className="toolbar-right">
        <SortSelect value={sortValue} onChange={onSortChange} />
      </div>

      <style jsx>{`
        .listing-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          background: var(--brand-card);
          padding: 1rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--brand-border);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .toolbar-filter-btn {
          background: var(--brand-primary);
          color: #ffffff;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: var(--shadow-md);
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .toolbar-filter-btn:hover {
          background: var(--brand-hover);
        }
        @media (min-width: 1024px) {
          .toolbar-filter-btn { display: none; }
        }

        .toolbar-count {
          display: none;
          color: var(--brand-text);
          opacity: 0.6;
          font-size: 0.875rem;
          font-weight: 600;
        }
        @media (min-width: 1024px) {
          .toolbar-count { display: block; }
        }

        .toolbar-count :global(strong) {
          font-weight: 700;
          opacity: 1;
          color: var(--brand-text);
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}