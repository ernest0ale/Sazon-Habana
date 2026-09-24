'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import StarRating from '@/components/ui/StarRating';
import { getRestauranteById } from '@/lib/data/restaurantes';
import { getResenasByRestauranteId, agregarResena } from '@/lib/data/resenas';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils/formatters';
import { validateResenaForm } from '@/lib/validators/resena.validator';

export default function ResenasPage({ params }) {
  const { id } = use(params);
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const restaurante = getRestauranteById(id);
  if (!restaurante) notFound();

  const [, setRefreshKey] = useState(0);
  const resenas = getResenasByRestauranteId(id);

  const [puntuacion, setPuntuacion] = useState(0);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const v = validateResenaForm({ restauranteId: id, puntuacion, texto });
    if (!v.ok) {
      setError(v.errors[0]);
      return;
    }

    setLoading(true);
    try {
      agregarResena({
        restauranteId: id,
        usuarioId: user.id,
        nombreUsuario: user.nombre,
        puntuacion,
        texto: texto.trim()
      });
      setPuntuacion(0);
      setTexto('');
      setRefreshKey((k) => k + 1);
      toast.success('Reseña Registrada', 'Gracias por tu opinión.');
    } catch {
      toast.error('Error', 'No se pudo guardar la reseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={`Reseñas de ${restaurante.nombre}`} />

      <div className="resenas-page">
        <div className="resenas-container">
          <Link href={`/espacios/${id}`} className="resenas-back">
            <i className="fa-solid fa-arrow-left" /> Volver al restaurante
          </Link>

          <h1 className="resenas-title">Reseñas de {restaurante.nombre}</h1>
          <p className="resenas-count">{resenas.length} opiniones de la comunidad</p>

          <div className="resenas-list">
            {resenas.length === 0 ? (
              <p className="resenas-empty">
                No hay reseñas todavía. ¡Sé el primero en opinar!
              </p>
            ) : (
              resenas.map((rev) => (
                <div key={rev.id} className="resena-item">
                  <div className="resena-head">
                    <span className="resena-user">{rev.nombreUsuario}</span>
                    <span className="resena-date">{formatDate(rev.fecha)}</span>
                  </div>
                  <div className="resena-stars">
                    {'★'.repeat(rev.puntuacion)}
                    {'☆'.repeat(5 - rev.puntuacion)}
                  </div>
                  <p className="resena-text">{rev.texto}</p>
                </div>
              ))
            )}
          </div>

          <div className="resenas-divider" />

          {!isAuthenticated ? (
            <div className="resenas-login-box">
              <p className="resenas-login-msg">
                <i className="fa-regular fa-circle-user" /> Inicia sesión para dejar una reseña
              </p>
              <Link href="/login" className="resenas-login-btn">
                <i className="fa-solid fa-arrow-right-to-bracket" /> Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form className="resena-form" onSubmit={handleSubmit}>
              <h3 className="resena-form-title">Deja tu valoración</h3>

              <StarRating
                value={puntuacion}
                onChange={setPuntuacion}
                name="rating-resenas-page"
              />

              <textarea
                className="resena-textarea"
                rows={3}
                placeholder="Comparte tu experiencia..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                maxLength={1000}
              />

              {error && <p className="resena-error">{error}</p>}

              <button type="submit" className="resena-submit" disabled={loading}>
                {loading ? 'Publicando...' : 'Publicar reseña'}
              </button>
            </form>
          )}
        </div>

        <style jsx>{`
          .resenas-page { flex: 1; padding: 3rem 0; }
          .resenas-container {
            max-width: 56rem;
            margin: 0 auto;
            padding: 0 1rem;
          }
          @media (min-width: 640px) { .resenas-container { padding: 0 1.5rem; } }
          .resenas-back {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--brand-text);
            font-weight: 500;
            text-decoration: none;
            margin-bottom: 1rem;
            transition: color 0.2s ease;
          }
          .resenas-back:hover { color: var(--brand-primary); }
          .resenas-title {
            font-family: var(--font-serif);
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--brand-text);
            margin-bottom: 0.25rem;
          }
          .resenas-count {
            font-size: 0.75rem;
            color: var(--brand-text);
            opacity: 0.5;
            margin-bottom: 2rem;
          }
          .resenas-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .resenas-empty {
            text-align: center;
            padding: 2rem 0;
            color: var(--brand-text);
            opacity: 0.6;
          }
          .resena-item {
            padding: 1rem;
            background: rgba(245, 248, 242, 0.4);
            border: 1px solid rgba(200, 214, 192, 0.3);
            border-radius: var(--radius-md);
          }
          :global(html.dark) .resena-item {
            background: rgba(36, 48, 41, 0.5);
          }
          .resena-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .resena-user { font-weight: 700; color: var(--brand-text); }
          .resena-date {
            font-size: 0.625rem;
            color: var(--brand-text);
            opacity: 0.4;
          }
          .resena-stars {
            color: var(--brand-primary);
            font-weight: 700;
            font-size: 0.875rem;
            margin: 0.25rem 0;
          }
          .resena-text {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: var(--brand-text);
          }
          .resenas-divider {
            border-top: 2px solid var(--brand-border);
            margin: 1.5rem 0;
            opacity: 0.5;
          }
          .resenas-login-box {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .resenas-login-msg {
            font-size: 0.875rem;
            color: var(--brand-text);
            opacity: 0.7;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .resenas-login-msg :global(i) {
            color: var(--brand-primary);
            opacity: 0.6;
          }
          .resenas-login-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.625rem;
            padding: 0.75rem 2rem;
            background: var(--brand-primary);
            color: #ffffff;
            border: 2px solid var(--brand-primary);
            border-radius: var(--radius-md);
            font-weight: 600;
            font-size: 0.875rem;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          .resenas-login-btn:hover {
            background: var(--brand-hover);
            transform: translateY(-2px);
          }
          .resena-form {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .resena-form-title {
            font-weight: 700;
            color: var(--brand-text);
            margin-bottom: 0.25rem;
          }
          .resena-textarea {
            width: 100%;
            background: var(--brand-bg);
            color: var(--brand-text);
            padding: 0.75rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--brand-border);
            outline: none;
            font-size: 0.875rem;
            font-family: inherit;
            resize: vertical;
          }
          .resena-textarea:focus { border-color: var(--brand-primary); }
          .resena-error {
            color: #dc3545;
            font-size: 0.75rem;
            font-weight: 600;
          }
          .resena-submit {
            margin-top: 0.25rem;
            padding: 0.75rem;
            background: var(--brand-primary);
            color: #ffffff;
            border: none;
            border-radius: var(--radius-md);
            font-weight: 700;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .resena-submit:hover { background: var(--brand-hover); }
          .resena-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        `}</style>
      </div>
    </>
  );
}