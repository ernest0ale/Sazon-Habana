'use client';

import { useState, useRef, useEffect } from 'react';
import { parsearHorario } from '@/lib/utils/horario-parser';
import { getTodayName } from '@/lib/utils/formatters';

const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/**
 * HorarioPopover - Resumen del horario del día actual + popover con todos los días
 *
 * Props:
 *   horario (string) - texto crudo del horario
 */
export default function HorarioPopover({ horario }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar al click fuera
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!horario) {
    return <span className="horario-simple">Horario no disponible</span>;
  }

  const horarios = parsearHorario(horario);

  if (!horarios) {
    return <span className="horario-simple">{horario}</span>;
  }

  const diaHoy = getTodayName();
  const horarioHoy = horarios[diaHoy] || 'Cerrado';
  const esCerradoHoy = horarioHoy.toLowerCase().includes('cerrado');

  return (
    <div className="horarios-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className="horario-resumen"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className={`horario-resumen-hora ${esCerradoHoy ? 'cerrado' : ''}`}>
          <span className={`estado-indicador ${esCerradoHoy ? 'cerrado' : 'abierto'}`} />
          {horarioHoy}
        </span>
        <span className="horario-resumen-toggle">
          <i className={`fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
        </span>
      </button>

      <div className={`horarios-popover ${open ? 'is-open' : ''}`}>
        {DIAS_ORDEN.map((dia) => {
          const h = horarios[dia] || 'Cerrado';
          const esHoy = dia === diaHoy;
          const esCerrado = h.toLowerCase().includes('cerrado');

          return (
            <div
              key={dia}
              className={`horario-dia-item ${esHoy ? 'hoy' : ''} ${esCerrado ? 'cerrado' : ''}`}
            >
              <span className="dia">{dia}</span>
              <span className={`horario-text ${esCerrado ? 'cerrado' : ''}`}>
                <span className={`estado-indicador ${esCerrado ? 'cerrado' : 'abierto'}`} />
                {esCerrado ? 'Cerrado' : h}
              </span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .horarios-wrapper {
          display: inline-flex;
          align-items: center;
          position: relative;
          cursor: pointer;
        }

        .horario-simple {
          font-size: 0.9rem;
          color: var(--brand-text);
          opacity: 0.85;
        }

        .horario-resumen {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px 2px 4px;
          border-radius: 6px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .horario-resumen:hover { background: var(--brand-bg); }

        .horario-resumen-hora {
          font-size: 0.9rem;
          color: var(--brand-text);
          opacity: 0.85;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .horario-resumen-hora.cerrado {
          color: #ef4444;
          font-weight: 600;
          opacity: 1;
        }

        .horario-resumen-toggle {
          color: var(--brand-text);
          opacity: 0.3;
          font-size: 0.7rem;
          transition: all 0.3s ease;
        }
        .horario-resumen:hover .horario-resumen-toggle { opacity: 0.7; }

        .horarios-popover {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 260px;
          max-width: 300px;
          max-height: 280px;
          overflow-y: auto;
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          padding: 8px 14px;
          z-index: 5;
          animation: popoverFadeIn 0.2s ease;
        }
        .horarios-popover.is-open { display: block; }

        @keyframes popoverFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .horarios-popover::-webkit-scrollbar { width: 4px; }
        .horarios-popover::-webkit-scrollbar-thumb {
          background: var(--brand-primary);
          border-radius: 4px;
        }

        .horario-dia-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          border-bottom: 1px solid var(--brand-border);
          opacity: 0.5;
          gap: 16px;
        }
        .horario-dia-item:last-child { border-bottom: none; }

        .horario-dia-item .dia {
          font-weight: 500;
          font-size: 0.8rem;
          color: var(--brand-text);
          white-space: nowrap;
        }

        .horario-dia-item .horario-text {
          font-size: 0.8rem;
          color: var(--brand-text);
          opacity: 0.8;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .horario-dia-item .horario-text.cerrado {
          color: #ef4444;
          font-weight: 600;
          opacity: 1;
        }

        .horario-dia-item.hoy {
          opacity: 1;
          background: var(--brand-primary);
          margin: 0 -14px;
          padding: 4px 14px;
          border-radius: 4px;
        }
        .horario-dia-item.hoy .dia,
        .horario-dia-item.hoy .horario-text {
          color: #ffffff;
          opacity: 1;
        }
        .horario-dia-item.hoy .horario-text.cerrado {
          color: #fca5a5;
        }

        .estado-indicador {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .estado-indicador.abierto { background: #22c55e; }
        .estado-indicador.cerrado { background: #ef4444; }
        .horario-dia-item.hoy .estado-indicador.abierto { background: #86efac; }
        .horario-dia-item.hoy .estado-indicador.cerrado { background: #fca5a5; }
      `}</style>
    </div>
  );
}