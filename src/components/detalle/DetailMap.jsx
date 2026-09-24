'use client';

import { useEffect, useRef } from 'react';

/**
 * DetailMap - Mapa Leaflet con el marcador del restaurante
 *
 * Props:
 *   lat (number)
 *   lng (number)
 *   direccion (string)
 *   height (string, opcional — ej '18rem' o '16rem')
 */
export default function DetailMap({ lat, lng, direccion, height = '18rem' }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !lat || !lng) return;

    let L;
    let map;

    async function init() {
      // Cargar Leaflet dinámicamente solo en el cliente
      L = (await import('leaflet')).default;

      // Evitar duplicado si el componente se re-monta
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([lat, lng], 16);

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.cartodb.com/">CartoDB</a> | &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
          maxZoom: 19,
          minZoom: 8,
          updateWhenIdle: false,
          updateWhenZooming: true,
          keepBuffer: 4
        }
      ).addTo(map);

      const blueIcon = L.divIcon({
        html: `
          <div class="detail-map-pin">
            <i class="fa-solid fa-utensils"></i>
          </div>
        `,
        className: 'detail-map-pin-wrapper',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      markerRef.current = L.marker([lat, lng], { icon: blueIcon })
        .addTo(map)
        .bindPopup(`<b>${direccion || ''}</b>`)
        .openPopup();

      mapRef.current = map;

      // Ajustar tamaño después del render
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 150);
    }

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, direccion]);

  const handleCenter = () => {
    if (mapRef.current && lat && lng) {
      mapRef.current.setView([lat, lng], 16);
    }
  };

  if (!lat || !lng) {
    return (
      <div className="detail-map-empty" style={{ height }}>
        <i className="fa-solid fa-map-location-dot" />
        <p>Ubicación no disponible</p>
        <style jsx>{`
          .detail-map-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: var(--brand-bg);
            border: 1px solid var(--brand-border);
            border-radius: var(--radius-lg);
            color: var(--brand-text);
            opacity: 0.6;
          }
          .detail-map-empty :global(i) {
            font-size: 2rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="detail-map-wrapper" style={{ height }}>
      <div ref={containerRef} className="detail-map-container" />
      <button
        type="button"
        className="detail-map-center-btn"
        onClick={handleCenter}
        aria-label="Centrar mapa"
      >
        <i className="fa-solid fa-location-crosshairs" />
      </button>

      <style jsx>{`
        .detail-map-wrapper {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--brand-border);
          z-index: 1;
        }

        .detail-map-container {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .detail-map-center-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 1001;
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-sm);
          width: 36px;
          height: 36px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .detail-map-center-btn:hover {
          transform: scale(1.05);
          background: var(--brand-bg);
        }
        .detail-map-center-btn :global(i) {
          font-size: 1.2rem;
          color: var(--brand-primary);
        }

        :global(.detail-map-pin) {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #3498db;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        :global(.detail-map-pin i) {
          color: #ffffff;
          font-size: 0.7rem;
        }

        :global(.detail-map-pin-wrapper) {
          background: transparent;
          border: none;
        }

        /* Modo oscuro: invertir tiles */
        :global(html.dark) .detail-map-container :global(.leaflet-tile) {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3);
        }
        :global(html.dark) .detail-map-container :global(.leaflet-container) {
          background: #243029;
        }
        :global(html.dark) .detail-map-container :global(.leaflet-popup-content-wrapper),
        :global(html.dark) .detail-map-container :global(.leaflet-popup-tip) {
          background: #243029;
          color: #E8F0E5;
          border: 1px solid #3A4F3E;
        }
      `}</style>
    </div>
  );
}