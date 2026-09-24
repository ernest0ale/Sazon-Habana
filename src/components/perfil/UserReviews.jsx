'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils/formatters';

/**
 * UserReviews - Lista de reseñas escritas por el usuario
 *
 * Props:
 *   resenas (array de reseñas con { id, restauranteId, texto, puntuacion, fecha })
 *   onDelete (async fn: (id) => void)
 *   getRestauranteNombre (fn: (id) => string)
 */
export default function UserReviews({ resenas = [], onDelete, getRestauranteNombre }) {
  const toast = useToast();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reseña?')) return;

    setDeletingId(id);
    try {
      await onDelete(id);
      toast.success('Reseña Eliminada', 'La valoración ha sido borrada.');
    } catch {
      toast.error('Error', 'No se pudo eliminar la reseña.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="user-reviews-card">
      <h3 className="user-reviews-title">
        <i className="fa-regular fa-star-half-stroke user-reviews-icon" />
        Mis Reseñas
      </h3>

      <div className="user-reviews-list">
        {resenas.length === 0 ? (
          <p className="user-reviews-empty">No has escrito reseñas todavía.</p>
        ) : (
          resenas.map((rev) => {
            const restNombre = getRestauranteNombre
              ? getRestauranteNombre(rev.restauranteId)
              : 'Restaurante';
            const isDeleting = deletingId === rev.id;

            return (
              <div key={rev.id} className="user-review-item">
                <div className="user-review-info">
                  <span className="user-review-rest">{restNombre}</span>
                  <span className="user-review-meta">
                    <span className="user-review-stars">
                      {'★'.repeat(rev.puntuacion)}{'☆'.repeat(5 - rev.puntuacion)}
                    </span>
                    <span className="user-review-date">{formatDate(rev.fecha)}</span>
                  </span>
                </div>

                <button
                  type="button"
                  className="user-review-delete"
                  onClick={() => handleDelete(rev.id)}
                  disabled={isDeleting}
                  aria-label="Eliminar reseña"
                >
                  <i className="fa-regular fa-trash-can" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .user-reviews-card {
          background: var(--brand-card);
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--brand-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .user-reviews-title {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          border-bottom: 1px solid var(--brand-border);
          padding-bottom: 0.5rem;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-reviews-icon {
          color: var(--brand-primary);
        }

        .user-reviews-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 15rem;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .user-reviews-list::-webkit-scrollbar {
          width: 6px;
        }
        .user-reviews-list::-webkit-scrollbar-thumb {
          background: var(--brand-primary);
          border-radius: 10px;
        }

        .user-reviews-empty {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.4;
          text-align: center;
          padding: 1rem 0;
        }

        .user-review-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--brand-bg);
          border: 1px solid rgba(200, 214, 192, 0.4);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
        }

        .user-review-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
          flex: 1;
        }

        .user-review-rest {
          font-weight: 600;
          color: var(--brand-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-review-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
        }

        .user-review-stars {
          color: #f5b301;
          font-size: 0.75rem;
          letter-spacing: 1px;
        }

        .user-review-date {
          color: var(--brand-text);
          opacity: 0.5;
        }

        .user-review-delete {
          background: none;
          border: none;
          color: #dc3545;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }
        .user-review-delete:hover {
          color: #a02030;
          transform: scale(1.1);
        }
        .user-review-delete:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}