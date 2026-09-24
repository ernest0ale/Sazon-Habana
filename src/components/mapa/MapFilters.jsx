'use client';

import { MUNICIPIOS_LA_HABANA } from '@/lib/utils/constants';

/**
 * MapFilters - Barra flotante de filtros del mapa
 *
 * Props:
 *   filters (object): { municipio, tipo, aire, clima, parqueo }
 *   onFilterChange (fn: (key, value) => void)
 *   onReset (fn)
 *   municipiosDisponibles (array)
 */
export default function MapFilters({
  filters,
  onFilterChange,
  onReset,
  municipiosDisponibles = []
}) {
  const municipios = municipiosDisponibles.length > 0
    ? municipiosDisponibles
    : MUNICIPIOS_LA_HABANA;

  return (
    <div className="map-filters">
      <div className="map-filters-left">
        <span className="map-filters-badge">
          <i className="fa-solid fa-map-pin" /> Filtrar
        </span>

        <select
          id="map-select-municipio"
          className="map-filter-select"
          value={filters.municipio}
          onChange={(e) => onFilterChange('municipio', e.target.value)}
        >
          <option value="todos">Todos los Municipios</option>
          {municipios.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          id="map-select-tipo"
          className="map-filter-select"
          value={filters.tipo}
          onChange={(e) => onFilterChange('tipo', e.target.value)}
        >
          <option value="todos">Todos los Tipos</option>
          <option value="criolla">Comida Criolla</option>
          <option value="rápida">Comida Rápida</option>
          <option value="italiana">Comida Italiana</option>
          <option value="mariscos">Mariscos</option>
          <option value="cafetería">Cafeterías</option>
          <option value="heladería">Heladerías</option>
          <option value="dulcería">Dulcerías</option>
        </select>

        <div className="map-filter-amenities">
          <label className="map-filter-check">
            <input
              type="checkbox"
              id="map-chk-aire"
              checked={filters.aire}
              onChange={(e) => onFilterChange('aire', e.target.checked)}
            />
            Terraza
          </label>
          <label className="map-filter-check">
            <input
              type="checkbox"
              id="map-chk-clima"
              checked={filters.clima}
              onChange={(e) => onFilterChange('clima', e.target.checked)}
            />
            Climatizado
          </label>
          <label className="map-filter-check">
            <input
              type="checkbox"
              id="map-chk-parqueo"
              checked={filters.parqueo}
              onChange={(e) => onFilterChange('parqueo', e.target.checked)}
            />
            Parqueo
          </label>
        </div>
      </div>

      <div className="map-filters-right">
        <button
          type="button"
          className="map-filter-reset"
          onClick={onReset}
        >
          Limpiar
        </button>
      </div>

      <style jsx>{`
        .map-filters {
          position: absolute;
          bottom: 1.5rem;
          left: 1rem;
          right: 1rem;
          z-index: 20;
          background: rgba(245, 248, 242, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-xl);
          padding: 1rem;
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }
        :global(html.dark) .map-filters {
          background: rgba(26, 36, 28, 0.95);
        }

        @media (min-width: 768px) {
          .map-filters {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            left: 50%;
            right: auto;
            transform: translateX(-50%);
            width: 100%;
            max-width: 56rem;
          }
        }
        @media (min-width: 1024px) {
          .map-filters {
            bottom: 1.5rem;
          }
        }

        .map-filters-left {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
        }
        @media (min-width: 768px) {
          .map-filters-left { width: auto; }
        }

        .map-filters-badge {
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brand-primary);
          background: rgba(91, 138, 114, 0.1);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .map-filter-select {
          background: var(--brand-card);
          color: var(--brand-text);
          font-size: 0.75rem;
          border-radius: var(--radius-md);
          padding: 0.625rem;
          border: 1px solid var(--brand-border);
          outline: none;
          cursor: pointer;
        }
        .map-filter-select:focus {
          border-color: var(--brand-primary);
        }

        .map-filter-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .map-filter-check {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-md);
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          cursor: pointer;
        }

        .map-filter-check input[type="checkbox"] {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          accent-color: var(--brand-primary);
          cursor: pointer;
        }

        .map-filters-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          padding-top: 0.5rem;
          border-top: 1px solid var(--brand-border);
        }
        @media (min-width: 768px) {
          .map-filters-right {
            width: auto;
            padding-top: 0;
            border-top: none;
          }
        }

        .map-filter-reset {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--brand-primary);
          background: none;
          border: none;
          cursor: pointer;
        }
        .map-filter-reset:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}