'use client';

import SolicitudRow from './SolicitudRow';

/**
 * SolicitudesTable - Tabla completa de solicitudes pendientes
 *
 * Props:
 *   solicitudes (array)
 *   onApprove (fn: (id) => void)
 *   onReject (fn: (id) => void)
 */
export default function SolicitudesTable({ solicitudes = [], onApprove, onReject }) {
  return (
    <div className="solicitudes-table-wrapper">
      <div className="solicitudes-header">
        <h3 className="solicitudes-title">Solicitudes Pendientes</h3>
        <span className="solicitudes-badge">{solicitudes.length}</span>
      </div>

      {solicitudes.length === 0 ? (
        <div className="solicitudes-empty">
          <span className="empty-emoji">🎉</span>
          <p className="empty-text">No hay solicitudes pendientes.</p>
        </div>
      ) : (
        <div className="solicitudes-scroll">
          <table className="solicitudes-table">
            <thead>
              <tr className="solicitudes-thead">
                <th className="th">Restaurante</th>
                <th className="th">Gestor</th>
                <th className="th">Municipio / Tipo</th>
                <th className="th">Documento</th>
                <th className="th th--actions">Acciones</th>
              </tr>
            </thead>
            <tbody className="solicitudes-tbody">
              {solicitudes.map((s) => (
                <SolicitudRow
                  key={s.id}
                  solicitud={s}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .solicitudes-table-wrapper {
          background: var(--brand-card);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          border: 1px solid var(--brand-border);
          box-shadow: var(--shadow-lg);
        }
        @media (min-width: 768px) {
          .solicitudes-table-wrapper { padding: 2rem; }
        }

        .solicitudes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--brand-border);
        }

        .solicitudes-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--brand-text);
        }

        .solicitudes-badge {
          background: var(--brand-primary);
          color: #ffffff;
          font-size: 0.75rem;
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .solicitudes-scroll {
          overflow-x: auto;
        }

        .solicitudes-table {
          width: 100%;
          text-align: left;
          font-size: 0.875rem;
          border-collapse: collapse;
        }

        .solicitudes-thead {
          border-bottom: 1px solid var(--brand-border);
        }

        .th {
          padding: 0.75rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brand-text);
          opacity: 0.6;
        }

        .th--actions { text-align: right; }

        .solicitudes-empty {
          text-align: center;
          padding: 3rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .empty-emoji { font-size: 2.5rem; }
        .empty-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--brand-text);
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}