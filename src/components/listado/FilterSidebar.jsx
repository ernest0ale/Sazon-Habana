'use client';

import { MUNICIPIOS_LA_HABANA, TIPOS_COCINA } from '@/lib/utils/constants';

/**
 * FilterSidebar - Panel de filtros para desktop
 *
 * Props:
 *   filters (object): { municipio, tipo, precio, aire, clima, parqueo }
 *   onFilterChange (fn: (key: string, value: any) => void)
 *   onReset (fn)
 *   municipiosDisponibles (array) - municipios con restaurantes reales
 */
export default function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  municipiosDisponibles = []
}) {
  const municipios = municipiosDisponibles.length > 0
    ? municipiosDisponibles
    : MUNICIPIOS_LA_HABANA;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3 className="filter-title">
          <i className="fa-solid fa-filter filter-icon" /> Filtrar
        </h3>
        <button
          type="button"
          className="filter-reset"
          onClick={onReset}
        >
          Limpiar
        </button>
      </div>

      {/* Municipio */}
      <div className="filter-group">
        <label htmlFor="filter-municipio" className="filter-label">
          Municipio
        </label>
        <select
          id="filter-municipio"
          className="filter-select"
          value={filters.municipio}
          onChange={(e) => onFilterChange('municipio', e.target.value)}
        >
          <option value="todos">Cualquier Municipio</option>
          {municipios.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Tipo de cocina */}
      <div className="filter-group">
        <label htmlFor="filter-tipo" className="filter-label">
          Tipo de Cocina
        </label>
        <select
          id="filter-tipo"
          className="filter-select"
          value={filters.tipo}
          onChange={(e) => onFilterChange('tipo', e.target.value)}
        >
          <option value="todos">Cualquier Tipo</option>
          <option value="criolla">Comida Criolla</option>
          <option value="rápida">Comida Rápida</option>
          <option value="italiana">Comida Italiana</option>
          <option value="mariscos">Mariscos</option>
          <option value="cafetería">Cafetería</option>
          <option value="heladería">Heladería</option>
          <option value="dulcería">Dulcería</option>
        </select>
      </div>

      {/* Precio */}
      <div className="filter-group">
        <label htmlFor="filter-precio" className="filter-label">
          Rango de Precios
        </label>
        <select
          id="filter-precio"
          className="filter-select"
          value={filters.precio}
          onChange={(e) => onFilterChange('precio', e.target.value)}
        >
          <option value="todos">Cualquier precio</option>
          <option value="1">Económico ($)</option>
          <option value="2">Moderado ($$)</option>
          <option value="3">Premium ($$$)</option>
        </select>
      </div>

      {/* Comodidades */}
      <div className="filter-group filter-group--amenities">
        <span className="filter-label">Comodidades</span>
        <div className="filter-checkboxes">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              id="filter-aire"
              checked={filters.aire}
              onChange={(e) => onFilterChange('aire', e.target.checked)}
            />
            <span>Terraza</span>
          </label>

          <label className="filter-checkbox">
            <input
              type="checkbox"
              id="filter-clima"
              checked={filters.clima}
              onChange={(e) => onFilterChange('clima', e.target.checked)}
            />
            <span>Climatizado</span>
          </label>

          <label className="filter-checkbox">
            <input
              type="checkbox"
              id="filter-parqueo"
              checked={filters.parqueo}
              onChange={(e) => onFilterChange('parqueo', e.target.checked)}
            />
            <span>Parqueo Privado</span>
          </label>
        </div>
      </div>

      <style jsx>{`
        .filter-sidebar {
          background: var(--brand-card);
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--brand-border);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: sticky;
          top: 6rem;
          height: fit-content;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--brand-border);
        }

        .filter-title {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-icon {
          color: var(--brand-primary);
        }

        .filter-reset {
          background: none;
          border: none;
          font-size: 0.75rem;
          color: var(--brand-primary);
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: text-decoration 0.2s ease;
        }
        .filter-reset:hover {
          text-decoration: underline;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--brand-text);
          opacity: 0.6;
          font-weight: 700;
        }

        .filter-select {
          background: var(--brand-bg);
          color: var(--brand-text);
          font-size: 0.875rem;
          border-radius: var(--radius-md);
          padding: 0.75rem;
          border: 1px solid var(--brand-border);
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s ease;
          width: 100%;
        }
        .filter-select:focus {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(91, 138, 114, 0.15);
        }

        .filter-group--amenities {
          padding-top: 0.5rem;
          border-top: 1px solid var(--brand-border);
        }

        .filter-checkboxes {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--brand-text);
          cursor: pointer;
        }

        .filter-checkbox input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
          accent-color: var(--brand-primary);
          cursor: pointer;
        }
      `}</style>
    </aside>
  );
}