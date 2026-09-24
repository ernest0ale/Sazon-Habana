'use client';

import { useEffect, useRef, useState } from 'react';
import { getRestaurantes } from '@/lib/data/restaurantes';
import { getResenasByRestauranteId } from '@/lib/data/resenas';
import { isRestaurantOpen } from '@/lib/utils/horario-parser';
import { TIPO_ICONS } from '@/lib/utils/constants';
import { buildMapPopupHTML, getMapPopupStyles } from './MapPopup';

/**
 * MapView - Mapa principal con marcadores filtrables
 *
 * Props:
 *   filters (object): { municipio, tipo, aire, clima, parqueo }
 *   onFilteredCount (fn opcional) — recibe el número de restaurantes visibles
 */
export default function MapView({ filters, onFilteredCount }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const activePopupRef = useRef(null);
  const leafletRef = useRef(null);

  const [ready, setReady] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    async function init() {
      const L = (await import('leaflet')).default;
      if (!mounted) return;
      leafletRef.current = L;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, { zoomControl: true })
        .setView([23.1136, -82.3666], 12);

      L.control.zoom({ position: 'topleft' }).addTo(map);

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { attribution: '&copy; Carto' }
      ).addTo(map);

      // Control custom "centrar mapa"
      const CenterControl = L.Control.extend({
        options: { position: 'topright' },
        onAdd: function () {
          const div = L.DomUtil.create('div', 'leaflet-control-custom-center');
          div.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
          div.title = 'Centrar mapa';
          div.onclick = function () {
            map.setView([23.1136, -82.3666], 12);
          };
          return div;
        }
      });
      new CenterControl().addTo(map);

      map.on('click', function () {
        if (activePopupRef.current) {
          try { activePopupRef.current.closePopup(); } catch {}
          activePopupRef.current = null;
        }
      });

      mapRef.current = map;
      setReady(true);
    }

    init();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores cuando cambian los filtros
  useEffect(() => {
    if (!ready || !mapRef.current || !leafletRef.current) return;

    const L = leafletRef.current;
    const map = mapRef.current;

    // Limpiar capa anterior
    if (markersLayerRef.current) {
      try { map.removeLayer(markersLayerRef.current); } catch {}
      markersLayerRef.current = null;
    }
    if (activePopupRef.current) {
      try { activePopupRef.current.closePopup(); } catch {}
      activePopupRef.current = null;
    }

    const all = getRestaurantes();

    const filtered = all.filter((r) => {
      if (filters.municipio !== 'todos' && r.municipio !== filters.municipio) return false;
      if (filters.tipo !== 'todos' && r.tipo !== filters.tipo) return false;
      if (filters.aire && !r.aire) return false;
      if (filters.clima && !r.clima) return false;
      if (filters.parqueo && !r.parqueo) return false;
      return true;
    });

    onFilteredCount?.(filtered.length);

    const layer = L.layerGroup().addTo(map);
    markersLayerRef.current = layer;

    filtered.forEach((r) => {
      const tipoIcon = TIPO_ICONS[r.tipo] || TIPO_ICONS.criolla;
      const isOpen = isRestaurantOpen(r);
      const resenas = getResenasByRestauranteId(r.id);
      const promedio = resenas.length
        ? (resenas.reduce((a, b) => a + b.puntuacion, 0) / resenas.length).toFixed(1)
        : null;

      const icon = L.divIcon({
        className: 'custom-map-pin-wrapper',
        html: `
          <div class="custom-map-pin" style="background-color: ${tipoIcon.color};">
            <i class="fa-solid ${tipoIcon.icon}"></i>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([r.lat, r.lng], { icon });
      marker.bindPopup(buildMapPopupHTML(r, { promedio, isOpen }), {
        className: 'custom-popup-wrapper',
        maxWidth: 290,
        minWidth: 250
      });

      marker.on('click', function (e) {
        if (e?.originalEvent) {
          e.originalEvent.stopPropagation();
          e.originalEvent.preventDefault();
        }
        if (activePopupRef.current === this) {
          this.closePopup();
          activePopupRef.current = null;
          return;
        }
        if (activePopupRef.current) {
          try { activePopupRef.current.closePopup(); } catch {}
        }
        try {
          this.openPopup();
          activePopupRef.current = this;
        } catch {}
      });

      marker.on('popupclose', function () {
        if (activePopupRef.current === this) activePopupRef.current = null;
      });

      layer.addLayer(marker);
    });

    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((r) => [r.lat, r.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [ready, filters, onFilteredCount]);

  return (
    <div className="map-view-wrapper">
      <div ref={containerRef} className="map-view-container" />

      <style jsx>{`
        .map-view-wrapper {
          position: relative;
          width: 100%;
          height: calc(100vh - 80px);
        }

        .map-view-container {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        :global(.custom-map-pin) {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        :global(.custom-map-pin i) {
          color: #ffffff;
          font-size: 0.7rem;
        }
        :global(.custom-map-pin-wrapper) {
          background: transparent;
          border: none;
        }

        :global(.leaflet-control-custom-center) {
          background: white;
          border-radius: 4px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
          cursor: pointer;
          text-align: center;
          width: 30px;
          height: 30px;
          line-height: 30px;
          margin-right: 8px !important;
          margin-top: 8px !important;
          transition: all 0.2s ease;
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #333;
        }
        :global(.leaflet-control-custom-center:hover) {
          background: #f0f0f0;
          transform: scale(1.05);
        }
        :global(html.dark) .leaflet-control-custom-center {
          background: #243029 !important;
          color: white !important;
          border-color: #3A4F3E !important;
        }
        :global(html.dark) .leaflet-control-custom-center i {
          color: white !important;
        }

        /* Modo oscuro: tiles */
        :global(html.dark) :global(.leaflet-tile) {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3);
        }
        :global(html.dark) :global(.leaflet-container) {
          background: #243029;
        }
        :global(html.dark) :global(.leaflet-popup-content-wrapper),
        :global(html.dark) :global(.leaflet-popup-tip) {
          background: #243029;
          color: #E8F0E5;
          border: 1px solid #3A4F3E;
        }
      `}</style>

      {/* Inyectar estilos del popup (no-JSX, van al document) */}
      <style jsx global>{getMapPopupStyles()}</style>
    </div>
  );
}