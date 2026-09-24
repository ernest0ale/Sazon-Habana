'use client';

import { useState, useEffect } from 'react';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/**
 * HorarioRango - Fila individual de rango de horario (día desde - día hasta + horas)
 *
 * Props:
 *   index (number)
 *   value (object): { diaDesde, diaHasta, horaInicio, horaFin, cerrado }
 *   onChange (fn: (newValue) => void)
 *   onRemove (fn opcional — null si es el único)
 *   canRemove (bool)
 */
export default function HorarioRango({ index, value, onChange, onRemove, canRemove }) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const update = (field, val) => {
    const next = { ...local, [field]: val };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="horario-rango">
      <div className="rango-header">
        <select
          className="dia-desde"
          value={local.diaDesde}
          onChange={(e) => update('diaDesde', e.target.value)}
          aria-label={`Día desde (rango ${index + 1})`}
        >
          {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <span className="separador-dias">—</span>

        <select
          className="dia-hasta"
          value={local.diaHasta}
          onChange={(e) => update('diaHasta', e.target.value)}
          aria-label={`Día hasta (rango ${index + 1})`}
        >
          {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="rango-horas">
        <input
          type="time"
          className="hora-inicio"
          value={local.horaInicio}
          onChange={(e) => update('horaInicio', e.target.value)}
          disabled={local.cerrado}
          aria-label={`Hora de inicio (rango ${index + 1})`}
        />

        <span className="separador-hora">—</span>

        <input
          type="time"
          className="hora-fin"
          value={local.horaFin}
          onChange={(e) => update('horaFin', e.target.value)}
          disabled={local.cerrado}
          aria-label={`Hora de cierre (rango ${index + 1})`}
        />

        <label className={`cerrado-label ${local.cerrado ? 'is-active' : ''}`}>
          <input
            type="checkbox"
            className="cerrado-checkbox"
            checked={local.cerrado}
            onChange={(e) => update('cerrado', e.target.checked)}
          />
          <span>Cerrado</span>
        </label>
      </div>

      {canRemove && onRemove && (
        <button
          type="button"
          className="btn-eliminar-rango"
          onClick={onRemove}
          title="Eliminar este rango"
          aria-label={`Eliminar rango ${index + 1}`}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}

      <style jsx>{`
        .horario-rango {
          background: var(--brand-bg);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          border: 1px solid var(--brand-border);
          transition: all 0.2s ease;
          position: relative;
        }
        .horario-rango:hover {
          border-color: var(--brand-primary);
        }

        .rango-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .rango-header select {
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-sm);
          padding: 0.375rem 0.625rem;
          color: var(--brand-text);
          font-size: 0.85rem;
          font-weight: 500;
          outline: none;
          cursor: pointer;
          min-width: 110px;
        }
        .rango-header select:focus {
          border-color: var(--brand-primary);
        }

        .separador-dias {
          color: var(--brand-text);
          opacity: 0.3;
          font-size: 0.8rem;
        }

        .rango-horas {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .rango-horas input[type="time"] {
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-sm);
          padding: 0.375rem 0.625rem;
          color: var(--brand-text);
          font-size: 0.85rem;
          outline: none;
          width: 130px;
        }
        .rango-horas input[type="time"]:focus {
          border-color: var(--brand-primary);
        }
        .rango-horas input[type="time"]:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .separador-hora {
          color: var(--brand-text);
          opacity: 0.3;
          font-size: 0.8rem;
        }

        .cerrado-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--brand-text);
          cursor: pointer;
          padding: 4px 14px;
          border-radius: var(--radius-sm);
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          transition: all 0.2s ease;
        }
        .cerrado-label:hover {
          border-color: #ef4444;
        }
        .cerrado-label.is-active {
          border-color: #ef4444;
          background: #fef2f2;
        }
        .cerrado-label.is-active span {
          color: #dc2626;
        }
        :global(html.dark) .cerrado-label.is-active {
          background: #1a1a1a;
          border-color: #ef4444;
        }

        .cerrado-label input[type="checkbox"] {
          accent-color: #ef4444;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .btn-eliminar-rango {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: var(--brand-text);
          opacity: 0.3;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 4px 6px;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .btn-eliminar-rango:hover {
          opacity: 1;
          background: #fef2f2;
          color: #dc2626;
        }
        :global(html.dark) .btn-eliminar-rango:hover {
          background: #1a1a1a;
        }

        @media (max-width: 640px) {
          .rango-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.375rem;
          }
          .rango-horas {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.375rem;
            width: 100%;
          }
          .rango-horas input[type="time"] {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}