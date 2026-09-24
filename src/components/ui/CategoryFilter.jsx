'use client';

import Link from 'next/link';
import { TIPO_ICONS, TIPOS_COCINA } from '@/lib/utils/constants';

/**
 * CategoryFilter - Grid de botones de categoría (usado en la Home)
 *
 * Props:
 *   variant: 'home' | 'compact'
 *   selectedType (string) - solo para variant="compact"
 *   onSelect (fn) - solo para variant="compact"
 */
export default function CategoryFilter({
  variant = 'home',
  selectedType,
  onSelect
}) {
  const categorias = [
    { tipo: 'criolla', label: 'Comida Criolla', icon: 'fa-utensils' },
    { tipo: 'rápida', label: 'Comida Rápida', icon: 'fa-burger' },
    { tipo: 'italiana', label: 'Comida Italiana', icon: 'fa-pizza-slice' },
    { tipo: 'mariscos', label: 'Mariscos & Pescado', icon: 'fa-fish' },
    { tipo: 'cafetería', label: 'Cafetería', icon: 'fa-mug-hot' },
    { tipo: 'heladería', label: 'Heladería', icon: 'fa-ice-cream' },
    { tipo: 'dulcería', label: 'Dulcería', icon: 'fa-cake-candles' }
  ];

  if (variant === 'compact') {
    return (
      <div className="category-filter-compact">
        {categorias.map((cat) => (
          <button
            key={cat.tipo}
            type="button"
            className={`category-chip ${selectedType === cat.tipo ? 'is-active' : ''}`}
            onClick={() => onSelect?.(cat.tipo)}
          >
            <i className={`fa-solid ${cat.icon}`} /> {cat.label}
          </button>
        ))}

        <style jsx>{`
          .category-filter-compact {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .category-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.4rem 0.9rem;
            border-radius: var(--radius-full);
            border: 1px solid var(--brand-border);
            background: var(--brand-bg);
            color: var(--brand-text);
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .category-chip:hover {
            border-color: var(--brand-primary);
            color: var(--brand-primary);
          }
          .category-chip.is-active {
            background: var(--brand-primary);
            color: #ffffff;
            border-color: var(--brand-primary);
          }
        `}</style>
      </div>
    );
  }

  // variant="home" (por defecto)
  return (
    <div className="category-grid">
      {categorias.map((cat) => (
        <Link
          key={cat.tipo}
          href={`/espacios?tipo=${encodeURIComponent(cat.tipo)}`}
          className="category-btn"
        >
          <i className={`fa-solid ${cat.icon} category-btn__icon`} />
          <span className="category-btn__label">{cat.label}</span>
        </Link>
      ))}

      <style jsx>{`
        .category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .category-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 768px) {
          .category-grid { grid-template-columns: repeat(7, 1fr); }
        }

        .category-btn {
          padding: 1rem;
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-lg);
          text-align: center;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .category-btn:hover {
          border-color: var(--brand-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .category-btn__icon {
          font-size: 1.75rem;
          color: var(--brand-primary);
          transition: color 0.3s ease;
        }

        .category-btn__label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--brand-text);
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        :global(html.dark) .category-btn__icon {
          color: #E8F0E5;
        }
      `}</style>
    </div>
  );
}