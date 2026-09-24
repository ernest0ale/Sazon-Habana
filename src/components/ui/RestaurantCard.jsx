'use client';

import Link from 'next/link';
import { getResenasByRestauranteId } from '@/lib/data/resenas';
import { isRestaurantOpen } from '@/lib/utils/horario-parser';
import { formatRating, capitalize } from '@/lib/utils/formatters';

/**
 * RestaurantCard - Tarjeta de restaurante
 *
 * Props:
 *   restaurante (object)
 *   variant: 'grid' | 'carousel' (solo cambia el ancho en carrusel)
 */
export default function RestaurantCard({ restaurante, variant = 'grid' }) {
  if (!restaurante) return null;

  const resenas = getResenasByRestauranteId(restaurante.id);
  const promedio = resenas.length
    ? resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length
    : null;

  const isOpen = isRestaurantOpen(restaurante);
  const statusText = isOpen ? 'Abierto' : 'Cerrado';
  const statusClass = isOpen ? 'open' : 'closed';

  const platoEstrella =
    restaurante.platos_populares?.[0]?.nombre ||
    restaurante.platosPopulares?.[0]?.nombre ||
    'Especialidad de la Casa';

  return (
    <Link
      href={`/espacios/${restaurante.id}`}
      className={`restaurant-card ${variant === 'carousel' ? 'restaurant-card--carousel' : ''}`}
    >
      <div className="card-image-wrapper">
        <img
          src={restaurante.img}
          alt={restaurante.nombre}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600';
          }}
        />
      </div>

      <div className="card-body">
        <div className="card-name">{restaurante.nombre}</div>

        <div className="card-meta">
          <span className={`status-text ${statusClass}`}>
            <span className={`status-dot ${statusClass}`} />
            {statusText}
          </span>
          <span className="divider">·</span>
          <span className="rating">
            <i className="fa-solid fa-star" /> {formatRating(promedio)}
          </span>
        </div>

        <div className="card-category">
          <i className="fa-regular fa-compass" /> {capitalize(restaurante.tipo)} · {restaurante.municipio}
        </div>

        <div className="card-footer">
          <div>
            <div className="star-dish-label">Plato estrella</div>
            <div className="star-dish-name">{platoEstrella}</div>
          </div>
          <i className="fa-solid fa-chevron-right arrow-icon" />
        </div>
      </div>

      <style jsx>{`
        .restaurant-card {
          background: var(--brand-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--brand-border);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }
        .restaurant-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
          border-color: var(--brand-primary);
        }

        .restaurant-card--carousel {
          flex-shrink: 0;
          width: 280px;
          scroll-snap-align: start;
        }

        .card-image-wrapper {
          overflow: hidden;
          position: relative;
        }

        .card-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          background: var(--brand-bg);
          transition: transform 0.4s ease;
        }
        .restaurant-card:hover .card-image {
          transform: scale(1.03);
        }

        .card-body {
          padding: 16px 18px 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .card-name {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--brand-text);
          line-height: 1.3;
          margin-bottom: 2px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--brand-text);
          opacity: 0.85;
          flex-wrap: wrap;
        }

        .status-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          margin-right: 3px;
        }
        .status-dot.open { background: #22c55e; }
        .status-dot.closed { background: #ef4444; }

        .status-text { font-weight: 600; font-size: 0.8rem; }
        .status-text.open { color: #22c55e; }
        .status-text.closed { color: #ef4444; }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .rating :global(.fa-star) {
          color: #f5b301;
          font-size: 0.75rem;
        }

        .divider { opacity: 0.3; }

        .card-category {
          font-size: 0.85rem;
          color: var(--brand-text);
          opacity: 0.7;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        .card-category :global(.fa-regular) {
          font-size: 0.7rem;
          opacity: 0.5;
        }

        .card-footer {
          margin-top: 6px;
          padding-top: 10px;
          border-top: 1px solid var(--brand-border);
          opacity: 0.8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .star-dish-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          color: var(--brand-text);
          opacity: 0.5;
        }

        .star-dish-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--brand-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        .arrow-icon {
          color: var(--brand-primary);
          opacity: 0.4;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }
        .restaurant-card:hover .arrow-icon {
          opacity: 1;
          transform: translateX(3px);
        }

        :global(html.dark) .card-category {
          color: #CCCCCC;
        }
      `}</style>
    </Link>
  );
}