'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageGallery from './ImageGallery';
import HorarioPopover from '@/components/ui/HorarioPopover';
import RestaurantMenu from '@/components/modals/RestaurantMenu';
import ShareModal from '@/components/modals/ShareModal';
import { isRestaurantOpen } from '@/lib/utils/horario-parser';
import { getResenasByRestauranteId } from '@/lib/data/resenas';
import { formatRating, capitalize } from '@/lib/utils/formatters';
import { useToast } from '@/hooks/useToast';

/**
 * DetailPanel - Panel principal del detalle de un restaurante
 *
 * Props:
 *   restaurante (object)
 */
export default function DetailPanel({ restaurante }) {
  const router = useRouter();
  const toast = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!restaurante) return null;

  const resenas = getResenasByRestauranteId(restaurante.id);
  const promedio = resenas.length
    ? (resenas.reduce((a, b) => a + b.puntuacion, 0) / resenas.length).toFixed(1)
    : 'Nuevo';

  const isOpen = isRestaurantOpen(restaurante);
  const statusText = isOpen ? 'Abierto' : 'Cerrado';
  const statusClass = isOpen ? 'open' : 'closed';

  const galeria = restaurante.galeria?.length
    ? restaurante.galeria
    : [restaurante.img];

  // Amenities
  const amenities = [];
  if (restaurante.aire) amenities.push({ icon: 'fa-solid fa-cloud-sun', label: 'Terraza' });
  if (restaurante.clima) amenities.push({ icon: 'fa-solid fa-snowflake', label: 'Climatizado' });
  if (restaurante.parqueo) amenities.push({ icon: 'fa-solid fa-square-parking', label: 'Parqueo Privado' });

  const handleComoLlegar = () => {
    if (!restaurante.lat || !restaurante.lng) {
      toast.error('❌ Ubicación no disponible', 'Este restaurante no tiene coordenadas asociadas');
      return;
    }

    const destino = `${restaurante.lat},${restaurante.lng}`;

    if ('geolocation' in navigator) {
      toast.info('📍 Obteniendo tu ubicación...', 'Por favor espera');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origen = `${position.coords.latitude},${position.coords.longitude}`;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${destino}`;
          window.open(url, '_blank');
          toast.success('🗺️ Abriendo Google Maps', `Desde tu ubicación hasta: ${restaurante.nombre}`);
        },
        () => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
          window.open(url, '_blank');
          toast.info('🗺️ Abriendo Google Maps', `Ruta hacia: ${restaurante.nombre}`);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
      window.open(url, '_blank');
      toast.success('🗺️ Abriendo Google Maps', `Ruta hacia: ${restaurante.nombre}`);
    }
  };

  const handleVerResenas = () => {
    router.push(`/espacios/${restaurante.id}/resenas`);
  };

  return (
    <>
      <div className="detail-panel">
        <div className="detail-body">
          {/* Nombre */}
          <h1 className="detail-name">{restaurante.nombre}</h1>

          {/* Meta: estado + rating */}
          <div className="detail-meta">
            <span className={`status-text ${statusClass}`}>
              <span className={`status-dot ${statusClass}`} />
              {statusText}
            </span>
            <span className="divider">·</span>
            <span className="rating">
              <i className="fa-solid fa-star" /> {promedio}{' '}
              <span className="rating-count">({resenas.length} reseñas)</span>
            </span>
          </div>

          {/* Categoría */}
          <div className="detail-category">
            <i className="fa-regular fa-compass" />{' '}
            {capitalize(restaurante.tipo)} · {restaurante.municipio}
          </div>

          <hr className="detail-divider" />

          {/* Info: horario + dirección + contacto */}
          <div className="detail-info-grid">
            <div className="info-row horario-row">
              <i className="fa-regular fa-clock" />
              <span className="info-label"><strong>Horario:</strong></span>
              <div className="horario-container-inline">
                <HorarioPopover horario={restaurante.horario} />
              </div>
            </div>

            <div className="info-row">
              <i className="fa-solid fa-location-arrow" />
              <span><strong>Dirección:</strong> {restaurante.direccion}</span>
            </div>

            <div className="info-row">
              <i className="fa-solid fa-phone" />
              <span><strong>Contacto:</strong> {restaurante.telefono}</span>
            </div>
          </div>

          <hr className="detail-divider" />

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="detail-amenities">
              {amenities.map((a, i) => (
                <span key={i} className="amenity-tag">
                  <i className={a.icon} /> {a.label}
                </span>
              ))}
            </div>
          )}

          {/* Botones escritorio */}
          <div className="detail-actions-wrapper">
            <button
              type="button"
              className="btn-action"
              onClick={() => setMenuOpen(true)}
            >
              <i className="fa-solid fa-receipt" /> Ver carta
            </button>

            <button
              type="button"
              className="btn-action"
              onClick={handleVerResenas}
            >
              <i className="fa-regular fa-comments" /> Reseñas
            </button>

            <button
              type="button"
              className="btn-action"
              onClick={handleComoLlegar}
            >
              <i className="fa-solid fa-location-dot" /> Cómo llegar
            </button>

            <button
              type="button"
              className="btn-action"
              onClick={() => setShareOpen(true)}
            >
              <i className="fa-regular fa-share-from-square" /> Compartir
            </button>
          </div>

          {/* Botones móviles */}
          <div className="detail-actions-mobile">
            <button
              type="button"
              className="btn-mobile-circle"
              onClick={() => setMenuOpen(true)}
              aria-label="Ver carta"
            >
              <i className="fa-solid fa-receipt" />
            </button>
            <button
              type="button"
              className="btn-mobile-circle"
              onClick={handleVerResenas}
              aria-label="Ver reseñas"
            >
              <i className="fa-regular fa-comments" />
            </button>
            <button
              type="button"
              className="btn-mobile-circle"
              onClick={handleComoLlegar}
              aria-label="Cómo llegar"
            >
              <i className="fa-solid fa-location-dot" />
            </button>
            <button
              type="button"
              className="btn-mobile-circle"
              onClick={() => setShareOpen(true)}
              aria-label="Compartir"
            >
              <i className="fa-regular fa-share-from-square" />
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <RestaurantMenu
        restaurante={restaurante}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <ShareModal
        restaurante={restaurante}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <style jsx>{`
        .detail-panel {
          background: var(--brand-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--brand-border);
        }

        .detail-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        @media (max-width: 767px) {
          .detail-body { padding: 1rem; }
        }

        .detail-name {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--brand-text);
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }
        @media (max-width: 767px) {
          .detail-name { font-size: 1.3rem; }
        }

        .detail-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: var(--brand-text);
          opacity: 0.85;
          flex-wrap: wrap;
          margin-bottom: 0.25rem;
        }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 3px;
        }
        .status-dot.open { background: #22c55e; }
        .status-dot.closed { background: #ef4444; }

        .status-text { font-weight: 600; }
        .status-text.open { color: #22c55e; }
        .status-text.closed { color: #ef4444; }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
        }
        .rating :global(.fa-star) {
          color: #f5b301;
          font-size: 0.85rem;
        }
        .rating-count {
          font-weight: 400;
          opacity: 0.6;
          font-size: 0.75rem;
        }

        .divider { opacity: 0.3; }

        .detail-category {
          font-size: 0.95rem;
          color: var(--brand-text);
          opacity: 0.6;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.875rem;
          font-weight: 500;
        }
        .detail-category :global(.fa-regular) {
          font-size: 0.8rem;
          opacity: 0.5;
        }
        :global(html.dark) .detail-category {
          color: #CCCCCC;
        }

        .detail-divider {
          border: none;
          border-top: 1px solid var(--brand-border);
          margin: 0.75rem 0 0.875rem;
          opacity: 0.5;
        }

        .detail-info-grid {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          font-size: 1rem;
          color: var(--brand-text);
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .info-row :global(i) {
          width: 22px;
          color: var(--brand-primary);
          opacity: 0.7;
          font-size: 1rem;
          text-align: center;
          flex-shrink: 0;
        }
        .info-row :global(span) {
          opacity: 0.85;
        }
        .info-row :global(strong) {
          font-weight: 600;
          opacity: 1;
        }

        .horario-row {
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .info-label { flex-shrink: 0; }

        .horario-container-inline {
          display: inline-flex;
          align-items: center;
          position: relative;
        }

        .detail-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0.75rem 0 0.875rem;
        }

        .amenity-tag {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: var(--radius-full);
          background: var(--brand-primary);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 1.5px solid var(--brand-primary);
        }
        .amenity-tag :global(i) {
          font-size: 0.8rem;
        }

        /* Botones escritorio */
        .detail-actions-wrapper {
          display: none;
          gap: 0.625rem;
          margin: 0.75rem 0 0.25rem;
          flex-wrap: wrap;
        }
        @media (min-width: 768px) {
          .detail-actions-wrapper { display: flex; }
        }

        .btn-action {
          flex: 1;
          min-width: 100px;
          padding: 0.625rem 0.875rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          border: 1px solid var(--brand-border);
          background: var(--brand-bg);
          color: var(--brand-text);
        }
        .btn-action:hover {
          background: var(--brand-primary);
          color: #ffffff;
          border-color: var(--brand-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(91, 138, 114, 0.25);
        }

        /* Botones móviles */
        .detail-actions-mobile {
          display: flex;
          gap: 0.875rem;
          margin: 0.875rem 0 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (min-width: 768px) {
          .detail-actions-mobile { display: none; }
        }

        .btn-mobile-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 1px solid var(--brand-border);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          transition: all 0.2s ease;
          background: var(--brand-bg);
          color: var(--brand-text);
        }
        .btn-mobile-circle:hover {
          background: var(--brand-primary);
          color: #ffffff;
          border-color: var(--brand-primary);
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}