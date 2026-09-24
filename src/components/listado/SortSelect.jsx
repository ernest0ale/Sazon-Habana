'use client';

/**
 * SortSelect - Selector de ordenamiento para el listado
 *
 * Props:
 *   value (string)
 *   onChange (fn: (value: string) => void)
 */
export default function SortSelect({ value, onChange }) {
  return (
    <div className="sort-select-wrapper">
      <label htmlFor="sort-select" className="sort-label">
        Ordenar:
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="pop">Popularidad</option>
        <option value="p-low">Precio: Menor a Mayor</option>
        <option value="p-high">Precio: Mayor a Menor</option>
        <option value="name">Nombre (A-Z)</option>
      </select>

      <style jsx>{`
        .sort-select-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sort-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--brand-text);
          opacity: 0.6;
        }

        .sort-select {
          background: var(--brand-bg);
          color: var(--brand-text);
          font-size: 0.875rem;
          border-radius: var(--radius-md);
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--brand-border);
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .sort-select:focus {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(91, 138, 114, 0.15);
        }
      `}</style>
    </div>
  );
}