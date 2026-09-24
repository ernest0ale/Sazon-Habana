'use client';

/**
 * SpecialtiesSection - Carrusel horizontal de especialidades sugeridas
 *
 * Props:
 *   platos (array de { nombre, precio, descripcion?, img? })
 *   titulo (string, opcional)
 */
export default function SpecialtiesSection({ platos = [], titulo = 'Especialidades Sugeridas' }) {
  if (!platos || platos.length === 0) return null;

  const FALLBACK_IMG =
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200';

  return (
    <section className="specialties-section">
      <h2 className="specialties-title">
        <i className="fa-solid fa-wand-magic-sparkles specialties-title-icon" />
        {titulo}
      </h2>

      <div className="specialties-scroll custom-scrollbar">
        {platos.map((plato, i) => (
          <div key={i} className="specialty-item">
            <img
              src={plato.img || FALLBACK_IMG}
              alt={plato.nombre}
              className="specialty-image"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            />
            <div className="specialty-name">{plato.nombre}</div>
            <div className="specialty-price">{plato.precio}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .specialties-section {
          margin-top: 0.5rem;
        }

        .specialties-title {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--brand-text);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .specialties-title-icon {
          color: var(--brand-primary);
        }

        .specialties-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          scrollbar-width: thin;
        }

        .specialties-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .specialties-scroll::-webkit-scrollbar-thumb {
          background: var(--brand-primary);
          border-radius: 10px;
        }

        .specialty-item {
          flex-shrink: 0;
          width: 180px;
          background: var(--brand-card);
          border-radius: var(--radius-md);
          border: 1px solid var(--brand-border);
          overflow: hidden;
          padding: 0.75rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .specialty-image {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          margin-bottom: 0.5rem;
        }

        .specialty-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--brand-text);
          line-height: 1.2;
        }

        .specialty-price {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--brand-primary);
        }
      `}</style>
    </section>
  );
}