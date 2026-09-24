'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((titulo, descripcion = '', tipo = 'info', duracion = 4000) => {
    const id = ++idRef.current;
    const toast = { id, titulo, descripcion, tipo };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => remove(id), duracion);
    return id;
  }, [remove]);

  const success = useCallback((titulo, desc = '') => show(titulo, desc, 'success'), [show]);
  const error = useCallback((titulo, desc = '') => show(titulo, desc, 'error'), [show]);
  const info = useCallback((titulo, desc = '') => show(titulo, desc, 'info'), [show]);

  const value = { toasts, show, success, error, info, remove };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext debe usarse dentro de <ToastProvider>.');
  return ctx;
}

function ToastViewport({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.tipo}`}>
          <div className="toast__icon" aria-hidden="true">
            {t.tipo === 'success' ? '✓' : t.tipo === 'error' ? '!' : 'i'}
          </div>
          <div className="toast__body">
            <div className="toast__title">{t.titulo}</div>
            {t.descripcion && <div className="toast__desc">{t.descripcion}</div>}
          </div>
          <button
            type="button"
            className="toast__close"
            aria-label="Cerrar notificación"
            onClick={() => onRemove(t.id)}
          >
            ×
          </button>
        </div>
      ))}

      <style jsx>{`
        .toast-viewport {
          position: fixed;
          top: 96px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 380px;
          width: calc(100% - 48px);
          pointer-events: none;
        }
        .toast {
          pointer-events: auto;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          animation: toast-in 0.25s ease;
        }
        .toast__icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
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
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
        }
        .toast__close:hover { opacity: 1; }

        @keyframes toast-in {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 640px) {
          .toast-viewport {
            top: 80px;
            right: 12px;
            left: 12px;
            width: auto;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}