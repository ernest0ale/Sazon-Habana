'use client';

import { useEffect } from 'react';

/**
 * RestaurantMenu - Modal con la carta completa de un restaurante
 *
 * Props:
 *   restaurante (object)
 *   open (bool)
 *   onClose (fn)
 */
export default function RestaurantMenu({ restaurante, open, onClose }) {
  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !restaurante) return null;

  const secciones = restaurante.secciones_carta || restaurante.seccionesCarta || [];

  return (
    <div
      className="carta-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Carta de ${restaurante.nombre}`}
    >
      <div className="carta-modal-content">
        <div className="carta-modal-header">
          <h2 className="carta-modal-title">
            <i className="fa-solid fa-clipboard-list" /> Carta de {restaurante.nombre}
          </h2>
          <button
            type="button"
            className="carta-modal-close"
            onClick={onClose}
            aria-label="Cerrar carta"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="carta-modal-body">
          {secciones.length > 0 ? (
            secciones.map((sec, idx) => (
              <div key={idx} className="carta-seccion">
                <h3 className="carta-seccion-title">{sec.seccion}</h3>
                <div className="carta-seccion-platos">
                  {sec.platos.map((plato, pIdx) => (
                    <div key={pIdx} className="carta-plato">
                      <span className="carta-plato-nombre">{plato.nombre}</span>
                      <span className="carta-plato-precio">{plato.precio}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="carta-empty">
              <p className="carta-empty-title">No hay carta disponible para este establecimiento.</p>
              <p className="carta-empty-sub">Consulta directamente con el personal del local.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .carta-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .carta-modal-content {
          background: var(--brand-card);
          border-radius: var(--radius-xl);
          max-width: 42rem;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          padding: 1.5rem;
          scroll-behavior: smooth;
        }

        .carta-modal-content::-webkit-scrollbar { width: 6px; }
        .carta-modal-content::-webkit-scrollbar-track { background: transparent; }
        .carta-modal-content::-webkit-scrollbar-thumb {
          background: var(--brand-primary);
          border-radius: 10px;
        }

        .carta-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          position: sticky;
          top: 0;
          background: var(--brand-card);
          padding: 0.5rem 0 0.75rem;
          border-bottom: 1px solid var(--brand-border);
          z-index: 10;
        }

        .carta-modal-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .carta-modal-title :global(i) {
          color: var(--brand-primary);
        }

        .carta-modal-close {
          font-size: 1.5rem;
          color: var(--brand-text);
          opacity: 0.6;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.3s ease;
        }
        .carta-modal-close:hover {
          color: var(--brand-primary);
          opacity: 1;
          transform: rotate(90deg);
        }

        .carta-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .carta-seccion {
          margin-bottom: 1.5rem;
        }

        .carta-seccion-title {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--brand-primary);
          border-bottom: 1px solid var(--brand-border);
          padding-bottom: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .carta-seccion-platos {
          display: flex;
          flex-direction: column;
        }

        .carta-plato {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          border-bottom: 1px solid rgba(200, 214, 192, 0.3);
          border-radius: var(--radius-sm);
          transition: background 0.2s ease;
        }
        .carta-plato:hover {
          background: var(--brand-bg);
        }

        .carta-plato-nombre {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--brand-text);
        }

        .carta-plato-precio {
          font-weight: 700;
          color: var(--brand-primary);
          font-size: 0.875rem;
          white-space: nowrap;
          margin-left: 1rem;
        }

        .carta-empty {
          text-align: center;
          padding: 2rem;
        }

        .carta-empty-title {
          color: var(--brand-text);
          opacity: 0.6;
          margin-bottom: 0.5rem;
        }

        .carta-empty-sub {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.4;
        }
      `}</style>
    </div>
  );
}