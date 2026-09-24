'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error en la app:', error);
  }, [error]);

  return (
    <div className="error-page">
      <span className="error-emoji">⚠️</span>
      <h1 className="error-title">Algo salió mal</h1>
      <p className="error-desc">
        Ha ocurrido un error inesperado. Intenta recargar la página.
      </p>
      <button type="button" className="error-btn" onClick={reset}>
        <i className="fa-solid fa-rotate-right" /> Reintentar
      </button>

      <style jsx>{`
        .error-page {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 4rem 1rem;
          text-align: center;
        }
        .error-emoji { font-size: 4rem; }
        .error-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--brand-text);
        }
        .error-desc {
          color: var(--brand-text);
          opacity: 0.7;
          max-width: 30rem;
        }
        .error-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: var(--brand-primary);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .error-btn:hover {
          background: var(--brand-hover);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}