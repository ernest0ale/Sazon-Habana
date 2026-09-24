'use client';

import { useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import { MUNICIPIOS_LA_HABANA } from '@/lib/utils/constants';

/**
 * WizardStep2 - Paso 2: ubicación + mapa con marcador arrastrable
 *
 * Props:
 *   data (object)
 *   onChange (fn: (key, value) => void)
 *   errors (object)
 */
export default function WizardStep2({ data, onChange, errors = {} }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;
    let L;

    async function init() {
      L = (await import('leaflet')).default;
      if (!mounted) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const lat = data.lat || 23.1136;
      const lng = data.lng || -82.3666;

      const map = L.map(containerRef.current, { zoomControl: false })
        .setView([lat, lng], 13);

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { attribution: '© OSM' }
      ).addTo(map);

      const dragIcon = L.divIcon({
        className: 'wizard-drag-pin-wrapper',
        html: `
          <div class="wizard-drag-pin">
            <i class="fa-solid fa-map-pin"></i>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const marker = L.marker([lat, lng], { draggable: true, icon: dragIcon }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChange('lat', pos.lat);
        onChange('lng', pos.lng);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        onChange('lat', e.latlng.lat);
        onChange('lng', e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;

      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 400);
    }

    init();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wizard-step-2">
      <h3 className="wizard-step-title">
        <i className="fa-solid fa-location-dot wizard-step-icon" />
        Ubicación
      </h3>

      <div className="wizard-grid-2">
        <div className="wiz-select-group">
          <label htmlFor="wiz-municipio" className="wiz-label">Municipio *</label>
          <select
            id="wiz-municipio"
            className="wiz-select"
            value={data.municipio}
            onChange={(e) => onChange('municipio', e.target.value)}
            required
          >
            <option value="">Selecciona municipio...</option>
            {MUNICIPIOS_LA_HABANA.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.municipio && <p className="wiz-error">{errors.municipio}</p>}
        </div>

        <Input
          id="wiz-direccion"
          type="text"
          label="Dirección"
          value={data.direccion}
          onChange={(e) => onChange('direccion', e.target.value)}
          error={errors.direccion}
          required
          maxLength={250}
        />
      </div>

      <div className="wiz-map-wrapper">
        <label className="wiz-label">Ubica en el mapa (arrastra el marcador)</label>
        <div ref={containerRef} className="wiz-map-container" />
        <p className="wiz-map-hint">
          <i className="fa-solid fa-circle-info" /> Haz clic en el mapa para posicionar el pin.
        </p>
      </div>

      <style jsx>{`
        .wizard-step-2 {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .wizard-step-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          border-bottom: 1px solid rgba(200, 214, 192, 0.3);
          padding-bottom: 0.5rem;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .wizard-step-icon { color: var(--brand-primary); }

        .wizard-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .wizard-grid-2 { grid-template-columns: 1fr 1fr; }
        }

        .wiz-select-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .wiz-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--brand-text);
        }

        .wiz-select {
          background: var(--brand-bg);
          color: var(--brand-text);
          padding: 0.9rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--brand-border);
          outline: none;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .wiz-select:focus {
          border-color: var(--brand-primary);
        }

        .wiz-map-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .wiz-map-container {
          width: 100%;
          height: 18rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--brand-border);
          overflow: hidden;
          position: relative;
          z-index: 10;
        }

        .wiz-map-hint {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.5;
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .wiz-error {
          font-size: 0.75rem;
          color: #dc3545;
          font-weight: 600;
        }

        :global(.wizard-drag-pin) {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--brand-primary);
          color: #ffffff;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          animation: pin-bounce 1.5s infinite;
        }
        :global(.wizard-drag-pin i) {
          font-size: 1rem;
        }
        :global(.wizard-drag-pin-wrapper) {
          background: transparent;
          border: none;
        }

        @keyframes pin-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* Modo oscuro: tiles */
        :global(html.dark) .wiz-map-container :global(.leaflet-tile) {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3);
        }
        :global(html.dark) .wiz-map-container :global(.leaflet-container) {
          background: #243029;
        }
      `}</style>
    </div>
  );
}