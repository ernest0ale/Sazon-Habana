export default function Loading() {
  return (
    <div className="loading-page">
      <div className="spinner" />
      <p className="loading-text">Cargando...</p>

      <style jsx>{`
        .loading-page {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          min-height: 60vh;
        }
        .loading-text {
          color: var(--brand-text);
          opacity: 0.6;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}