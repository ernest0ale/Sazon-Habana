'use client';

/**
 * SolicitudRow - Fila de la tabla de solicitudes pendientes
 *
 * Props:
 *   solicitud (object)
 *   onApprove (fn: (id) => void)
 *   onReject (fn: (id) => void)
 */
export default function SolicitudRow({ solicitud, onApprove, onReject }) {
  return (
    <tr className="solicitud-row">
      <td className="cell cell--restaurante">
        <span className="cell-text-bold">{solicitud.nombre}</span>
      </td>

      <td className="cell cell--gestor">
        <div className="gestor-info">
          <span className="gestor-nombre">{solicitud.nombreGestor}</span>
          <span className="gestor-email">{solicitud.emailGestor}</span>
        </div>
      </td>

      <td className="cell cell--tipo">
        <span className="tipo-text">{solicitud.tipo}</span>
        <span className="municipio-text">{solicitud.municipio}</span>
      </td>

      <td className="cell cell--doc">
        <i className="fa-solid fa-file-pdf doc-icon" />
        <span className="doc-name">{solicitud.fileLegal || 'documento.pdf'}</span>
      </td>

      <td className="cell cell--actions">
        <button
          type="button"
          className="action-btn action-btn--approve"
          onClick={() => onApprove(solicitud.id)}
        >
          Aprobar
        </button>
        <button
          type="button"
          className="action-btn action-btn--reject"
          onClick={() => onReject(solicitud.id)}
        >
          Rechazar
        </button>
      </td>

      <style jsx>{`
        .solicitud-row {
          border-bottom: 1px solid rgba(200, 214, 192, 0.2);
          transition: background 0.2s ease;
        }
        .solicitud-row:hover {
          background: var(--brand-bg);
        }

        .cell {
          padding: 1rem;
          font-size: 0.75rem;
          color: var(--brand-text);
          vertical-align: top;
        }

        .cell--restaurante {
          font-weight: 700;
        }
        .cell-text-bold { font-weight: 700; }

        .gestor-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .gestor-nombre { font-weight: 600; }
        .gestor-email {
          font-size: 0.625rem;
          opacity: 0.7;
        }

        .tipo-text {
          text-transform: capitalize;
          display: block;
        }
        .municipio-text {
          font-size: 0.625rem;
          opacity: 0.7;
          display: block;
        }

        .cell--doc {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .doc-icon {
          color: #dc3545;
          font-size: 0.9rem;
        }
        .doc-name {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .cell--actions {
          text-align: right;
          white-space: nowrap;
        }

        .action-btn {
          padding: 0.375rem 0.75rem;
          border: none;
          border-radius: var(--radius-md);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn--approve {
          background: var(--brand-primary);
          margin-right: 0.5rem;
        }
        .action-btn--approve:hover {
          background: var(--brand-hover);
        }

        .action-btn--reject {
          background: #ef4444;
        }
        .action-btn--reject:hover {
          background: #dc2626;
        }
      `}</style>
    </tr>
  );
}