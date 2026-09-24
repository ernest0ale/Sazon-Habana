'use client';

import { useToastContext } from '@/contexts/ToastContext';

/**
 * Toast - Notificación flotante
 *
 * Normalmente no se usa directamente.
 * El ToastProvider ya renderiza el viewport con los toasts activos.
 * Este componente es útil si quieres renderizar un toast manualmente en algún lugar.
 */
export default function Toast({ titulo, descripcion, tipo = 'info', onClose }) {
  return (
    <div className={`toast toast--${tipo}`} role="status" aria-live="polite">
      <div className="toast__icon" aria-hidden="true">
        {tipo === 'success' ? (
          <i className="fa-solid fa-circle-check" />
        ) : tipo === 'error' ? (
          <i className="fa-solid fa-circle-exclamation" />
        ) : (
          <i className="fa-solid fa-circle-info" />
        )}
      </div>

      <div className="toast__body">
        <div className="toast__title">{titulo}</div>
        {descripcion && <div className="toast__desc">{descripcion}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          className="toast__close"
          aria-label="Cerrar notificación"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}

      <style jsx>{`
        .toast {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-lg);
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          box-shadow: var(--shadow-lg);
          animation: toast-in 0.25s ease;
          pointer-events: auto;
        }

        .toast__icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .toast--success .toast__icon { background: #22c55e; }
        .toast--error .toast__icon { background: #ef4444; }
        .toast--info .toast__icon { background: var(--brand-primary); }

        .toast__body { flex: 1; min-width: 0; }

        .toast__title {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--brand-text);
        }

        .toast__desc {
          font-size: 0.8rem;
          opacity: 0.8;
          margin-top: 2px;
          color: var(--brand-text);
        }

        .toast__close {
          background: transparent;
          border: none;
          color: var(--brand-text);
          opacity: 0.5;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
        }
        .toast__close:hover { opacity: 1; }

        @keyframes toast-in {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}