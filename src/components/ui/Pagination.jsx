'use client';

/**
 * Pagination - Control de paginación
 *
 * Props:
 *   currentPage (number, base 1)
 *   totalPages (number)
 *   onPageChange (fn: (page: number) => void)
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goTo = (page) => {
    const next = Math.max(1, Math.min(totalPages, page));
    if (next !== currentPage) onPageChange(next);
  };

  return (
    <div className="pagination-wrapper" role="navigation" aria-label="Paginación">
      <button
        type="button"
        className="pagination-btn"
        disabled={currentPage <= 1}
        onClick={() => goTo(currentPage - 1)}
        aria-label="Página anterior"
      >
        <i className="fa-solid fa-chevron-left" />
      </button>

      <input
        type="number"
        className="pagination-input"
        min={1}
        max={totalPages}
        value={currentPage}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) goTo(val);
        }}
        aria-label="Número de página"
      />

      <span className="pagination-total">
        de <span className="pagination-total-num">{totalPages}</span>
      </span>

      <button
        type="button"
        className="pagination-btn"
        disabled={currentPage >= totalPages}
        onClick={() => goTo(currentPage + 1)}
        aria-label="Página siguiente"
      >
        <i className="fa-solid fa-chevron-right" />
      </button>

      <style jsx>{`
        .pagination-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--brand-border);
          margin-top: 0.75rem;
        }

        .pagination-btn {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--brand-border);
          background: var(--brand-card);
          color: var(--brand-text);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
        }
        .pagination-btn:hover:not(:disabled) {
          background: var(--brand-primary);
          color: #ffffff;
          border-color: var(--brand-primary);
        }
        .pagination-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .pagination-input {
          width: 44px;
          height: 38px;
          text-align: center;
          border-radius: var(--radius-md);
          border: 1px solid var(--brand-border);
          background: var(--brand-bg);
          color: var(--brand-text);
          font-weight: 600;
          font-size: 0.95rem;
          outline: none;
          appearance: textfield;
          -moz-appearance: textfield;
        }
        .pagination-input::-webkit-outer-spin-button,
        .pagination-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .pagination-input:focus {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(91, 138, 114, 0.15);
        }

        .pagination-total {
          font-size: 0.85rem;
          color: var(--brand-text);
          opacity: 0.6;
          font-weight: 500;
        }
        .pagination-total-num {
          font-weight: 700;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}