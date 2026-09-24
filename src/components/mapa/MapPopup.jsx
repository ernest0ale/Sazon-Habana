'use client';

import { capitalize, formatRating } from '@/lib/utils/formatters';

/**
 * MapPopup - Contenido del popup del mapa
 * No es un componente "React" tradicional; se exporta como string HTML
 * para pasárselo a Leaflet.
 *
 * Exporta:
 *   - buildMapPopupHTML(restaurante, { promedio, isOpen })
 *   - getMapPopupStyles() — devuelve CSS string para inyectar
 */
export function buildMapPopupHTML(restaurante, { promedio = null, isOpen = false } = {}) {
  const statusText = isOpen ? 'Abierto' : 'Cerrado';
  const statusClass = isOpen ? 'open' : 'closed';
  const tipoFormatted = capitalize(restaurante.tipo || '');

  return `
    <div class="map-popup-body">
      <img
        src="${restaurante.img}"
        class="map-popup-img"
        alt="${restaurante.nombre}"
        onerror="this.src='https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400'"
      />
      <div class="map-popup-content">
        <div class="map-popup-title">${restaurante.nombre}</div>
        <div class="map-popup-meta">
          <span class="map-popup-status ${statusClass}">
            <span class="map-popup-dot ${statusClass}"></span>${statusText}
          </span>
          <span class="map-popup-divider">·</span>
          <span class="map-popup-rating">
            <i class="fa-solid fa-star"></i> ${formatRating(promedio)}
          </span>
        </div>
        <div class="map-popup-category">
          <i class="fa-regular fa-compass"></i> ${tipoFormatted} · ${restaurante.municipio}
        </div>
        <button
          class="map-popup-btn"
          onclick="event.stopPropagation(); window.location.href='/espacios/${restaurante.id}'"
        >
          Ver detalles
        </button>
      </div>
    </div>
  `;
}

export function getMapPopupStyles() {
  return `
    .custom-popup-wrapper .leaflet-popup-content-wrapper {
      border-radius: 16px !important;
      padding: 0 !important;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }
    .custom-popup-wrapper .leaflet-popup-content {
      margin: 0 !important;
      padding: 0 !important;
      min-width: 250px;
      max-width: 290px;
    }
    .custom-popup-wrapper .leaflet-popup-tip {
      background: var(--brand-card) !important;
    }
    .custom-popup-wrapper .leaflet-popup-close-button {
      position: absolute !important;
      top: 8px !important;
      right: 8px !important;
      z-index: 10 !important;
      background: rgba(0, 0, 0, 0.55) !important;
      border: none !important;
      border-radius: 50% !important;
      width: 28px !important;
      height: 28px !important;
      cursor: pointer !important;
      color: white !important;
      font-size: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-weight: bold !important;
      transition: all 0.2s ease !important;
      line-height: 1 !important;
      padding: 0 !important;
    }
    .custom-popup-wrapper .leaflet-popup-close-button:hover {
      background: rgba(0, 0, 0, 0.85) !important;
      transform: scale(1.1) !important;
    }
    .map-popup-img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      display: block;
    }
    .map-popup-content {
      padding: 14px 16px 16px 16px;
    }
    .map-popup-title {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--brand-text);
      line-height: 1.2;
      margin-bottom: 4px;
    }
    .map-popup-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;
      color: var(--brand-text);
      opacity: 0.85;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }
    .map-popup-status {
      font-weight: 600;
      font-size: 0.8rem;
      display: inline-flex;
      align-items: center;
    }
    .map-popup-status.open { color: #22c55e; }
    .map-popup-status.closed { color: #ef4444; }
    .map-popup-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      margin-right: 4px;
    }
    .map-popup-dot.open { background: #22c55e; }
    .map-popup-dot.closed { background: #ef4444; }
    .map-popup-rating {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .map-popup-rating .fa-star {
      color: #f5b301;
      font-size: 0.75rem;
    }
    .map-popup-divider { opacity: 0.3; }
    .map-popup-category {
      font-size: 0.85rem;
      color: var(--brand-text);
      opacity: 0.7;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
      font-weight: 500;
    }
    .map-popup-category .fa-regular { font-size: 0.7rem; opacity: 0.5; }
    .map-popup-btn {
      width: 100%;
      padding: 9px 0;
      background: var(--brand-primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 4px;
    }
    .map-popup-btn:hover {
      background: var(--brand-hover);
      transform: scale(1.02);
    }
    html.dark .map-popup-category {
      color: #CCCCCC !important;
    }
    html.dark .custom-popup-wrapper .leaflet-popup-tip {
      background: #243029 !important;
    }
    html.dark .custom-popup-wrapper .leaflet-popup-content-wrapper {
      background: #243029 !important;
      color: #E8F0E5 !important;
      border: 1px solid #3A4F3E !important;
    }
  `;
}