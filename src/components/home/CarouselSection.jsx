'use client';

import RestaurantCard from '@/components/ui/RestaurantCard';

/**
 * CarouselSection - Carrusel horizontal de restaurantes
 *
 * Props:
 *   title (string)
 *   icon (Font Awesome class)
 *   restaurantes (array)
 *   emptyMessage (string)
 */
export default function CarouselSection({
  title,
  icon,
  restaurantes = [],
  emptyMessage = 'No hay restaurantes para mostrar.'
}) {
  if (!restaurantes || restaurantes.length === 0) {
    return null;
  }

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">
          <i className={`${icon} carousel-title-icon`} />
          {title}
        </h2>
      </div>

      <div className="carousel-scroll custom-scrollbar">
        {restaurantes.map((r) => (
          <RestaurantCard key={r.id} restaurante={r} variant="carousel" />
        ))}
      </div>

      <style jsx>{`
        .carousel-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .carousel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .carousel-title {
          font-family: var(--font-serif);
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .carousel-title-icon {
          color: var(--brand-primary);
          font-size: 1.5rem;
        }
        :global(html.dark) .carousel-title-icon {
          color: var(--brand-text);
        }

        .carousel-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
        }

        .carousel-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .carousel-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .carousel-scroll::-webkit-scrollbar-thumb {
          background: var(--brand-primary);
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}