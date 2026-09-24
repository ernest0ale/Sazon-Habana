'use client';

import RestaurantCard from './RestaurantCard';
import SkeletonLoader from './SkeletonLoader';

/**
 * RestaurantGrid - Grid de tarjetas
 *
 * Props:
 *   restaurantes (array)
 *   loading (bool)
 *   emptyMessage (string)
 *   emptyIcon (Font Awesome class)
 */
export default function RestaurantGrid({
  restaurantes = [],
  loading = false,
  emptyMessage = 'No se encontraron espacios.',
  emptyIcon = 'fa-solid fa-utensils'
}) {
  if (loading) {
    return (
      <div className="restaurant-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLoader key={i} variant="card" />
        ))}
        <style jsx>{`
          .restaurant-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          @media (min-width: 640px) {
            .restaurant-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (min-width: 1024px) {
            .restaurant-grid { grid-template-columns: repeat(3, 1fr); }
          }
        `}</style>
      </div>
    );
  }

  if (restaurantes.length === 0) {
    return (
      <div className="restaurant-empty">
        <i className={emptyIcon} />
        <p>{emptyMessage}</p>
        <style jsx>{`
          .restaurant-empty {
            text-align: center;
            padding: 4rem 1rem;
            background: var(--brand-card);
            border: 1px solid var(--brand-border);
            border-radius: var(--radius-xl);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .restaurant-empty :global(i) {
            font-size: 3rem;
            color: var(--brand-primary);
            opacity: 0.4;
          }
          .restaurant-empty :global(p) {
            color: var(--brand-text);
            opacity: 0.7;
            font-size: 1rem;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="restaurant-grid">
      {restaurantes.map((r) => (
        <RestaurantCard key={r.id} restaurante={r} variant="grid" />
      ))}
      <style jsx>{`
        .restaurant-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .restaurant-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .restaurant-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}