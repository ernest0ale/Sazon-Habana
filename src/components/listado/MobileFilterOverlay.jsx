'use client';

import { useEffect, useState } from 'react';
import { MUNICIPIOS_LA_HABANA } from '@/lib/utils/constants';

/**
 * MobileFilterOverlay - Panel lateral de filtros para móvil
 *
 * Props:
 *   open (bool)
 *   onClose (fn)
 *   filters (object)
 *   onApply (fn: (filters) => void)
 *   municipiosDisponibles (array)
 */
export default function MobileFilterOverlay({
  open,
  onClose,
  filters,
  onApply,
  municipiosDisponibles = []
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sincronizar cuando se abre
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, filters]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const municipios = municipiosDisponibles.length > 0
    ? municipiosDisponibles
    : MUNICIPIOS_LA_HABANA;

  const update = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setLocalFilters({
      municipio: 'todos',
      tipo: 'todos',
      precio: 'todos',
      aire: false,
      clima: false,
      parqueo: false
    });
  };

  const apply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <div
      className="mfo-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Filtros"
    >
      <div className="mfo-panel">
        <div className="mfo-header">
          <h3 className="mfo-title">
            <i className="fa-solid fa-sliders mfo-icon" /> Filtros
          </h3>
          <button
            type="button"
            className="mfo-close"
            onClick={onClose}
            aria-label="Cerrar filtros"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="mfo-body">
          {/* Municipio */}
          <div className="mfo-group">
            <label htmlFor="m-filter-municipio" className="mfo-label">Municipio</label>
            <select
              id="m-filter-municipio"
              className="mfo-select"
              value={localFilters.municipio}
              onChange={(e) => update('municipio', e.target.value)}
            >
              <option value="todos">Cualquier Municipio</option>
              {municipios.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div className="mfo-group">
            <label htmlFor="m-filter-tipo" className="mfo-label">Tipo de Cocina</label>
            <select
              id="m-filter-tipo"
              className="mfo-select"
              value={localFilters.tipo}
              onChange={(e) => update('tipo', e.target.value)}
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
          <div className="mfo-group">
            <label htmlFor="m-filter-precio" className="mfo-label">Precio</label>
            <select
              id="m-filter-precio"
              className="mfo-select"
              value={localFilters.precio}
              onChange={(e) => update('precio', e.target.value)}
            >
              <option value="todos">Cualquier precio</option>
              <option value="1">Económico ($)</option>
              <option value="2">Moderado ($$)</option>
              <option value="3">Premium ($$$)</option>
            </select>
          </div>

          {/* Comodidades */}
          <div className="mfo-group mfo-group--amenities">
            <span className="mfo-label">Comodidades</span>
            <label className="mfo-checkbox">
              <input
                type="checkbox"
                id="m-filter-aire"
                checked={localFilters.aire}
                onChange={(e) => update('aire', e.target.checked)}
              />
              <span>Terraza</span>
            </label>
            <label className="mfo-checkbox">
              <input
                type="checkbox"
                id="m-filter-clima"
                checked={localFilters.clima}
                onChange={(e) => update('clima', e.target.checked)}
              />
              <span>Climatizado</span>
            </label>
            <label className="mfo-checkbox">
              <input
                type="checkbox"
                id="m-filter-parqueo"
                checked={localFilters.parqueo}
                onChange={(e) => update('parqueo', e.target.checked)}
              />
              <span>Parqueo Privado</span>
            </label>
          </div>
        </div>

        <div className="mfo-footer">
          <button
            type="button"
            className="mfo-btn mfo-btn--ghost"
            onClick={reset}
          >
            Limpiar todo
          </button>
          <button
            type="button"
            className="mfo-btn mfo-btn--primary"
            onClick={apply}
          >
            Aplicar
          </button>
        </div>
      </div>

      <style jsx>{`
        .mfo-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mfo-panel {
          background: var(--brand-bg);
          width: 100%;
          max-width: 24rem;
          height: 100%;
          overflow-y: auto;
          padding: 1.5rem;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          animation: slideIn 0.25s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .mfo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--brand-border);
          margin-bottom: 1.5rem;
        }

        .mfo-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mfo-icon { color: var(--brand-primary); }

        .mfo-close {
          font-size: 1.5rem;
          color: var(--brand-text);
          opacity: 0.6;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
        }
        .mfo-close:hover {
          opacity: 1;
          color: var(--brand-primary);
        }

        .mfo-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }

        .mfo-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mfo-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--brand-text);
          opacity: 0.6;
          font-weight: 700;
        }

        .mfo-select {
          background: var(--brand-card);
          color: var(--brand-text);
          font-size: 0.875rem;
          border-radius: var(--radius-md);
          padding: 0.75rem;
          border: 1px solid var(--brand-border);
          outline: none;
          cursor: pointer;
          width: 100%;
        }
        .mfo-select:focus {
          border-color: var(--brand-primary);
        }

        .mfo-group--amenities {
          padding-top: 0.5rem;
          border-top: 1px solid var(--brand-border);
        }

        .mfo-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--brand-text);
          cursor: pointer;
        }

        .mfo-checkbox input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
          accent-color: var(--brand-primary);
          cursor: pointer;
        }

        .mfo-footer {
          padding-top: 1.5rem;
          border-top: 1px solid var(--brand-border);
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
        }

        .mfo-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .mfo-btn--ghost {
          background: var(--brand-card);
          border-color: var(--brand-border);
          color: var(--brand-text);
        }
        .mfo-btn--ghost:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .mfo-btn--primary {
          background: var(--brand-primary);
          color: #ffffff;
        }
        .mfo-btn--primary:hover {
          background: var(--brand-hover);
        }

        @media (min-width: 1024px) {
          .mfo-overlay { display: none; }
        }
      `}</style>
    </div>
  );
}