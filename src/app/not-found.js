import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <span className="not-found-emoji">🍽️</span>
      <h1 className="not-found-title">Página no encontrada</h1>
      <p className="not-found-desc">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link href="/" className="not-found-btn">
        <i className="fa-solid fa-house" /> Volver al inicio
      </Link>

      <style jsx>{`
        .not-found-page {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 4rem 1rem;
          text-align: center;
        }
        .not-found-emoji {
          font-size: 4rem;
        }
        .not-found-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--brand-text);
        }
        .not-found-desc {
          color: var(--brand-text);
          opacity: 0.7;
          max-width: 30rem;
        }
        .not-found-btn {
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
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .not-found-btn:hover {
          background: var(--brand-hover);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}