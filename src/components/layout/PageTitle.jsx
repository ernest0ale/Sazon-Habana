'use client';

import { useEffect } from 'react';

/**
 * PageTitle - Establece el título dinámico de la página Y renderiza
 * el encabezado visual (eyebrow + heading + subtitle).
 *
 * Uso simple (solo cambia el título):
 *   <PageTitle title="Mapa" />
 *
 * Uso completo (con encabezado visual):
 *   <PageTitle
 *     title="Mapa"
 *     eyebrow="Explora"
 *     heading="Mapa de La Habana"
 *     subtitle="Descubre restaurantes cerca de ti"
 *   />
 */
export default function PageTitle({
  title,
  eyebrow,
  heading,
  subtitle,
  align = 'center',
  children
}) {
  // Efecto: actualizar document.title
  useEffect(() => {
    if (title) {
      document.title = `${title} | Sazón Habana`;
    } else {
      document.title = 'Sazón Habana';
    }
  }, [title]);

  // Si no hay heading visual, solo cambia el título
  if (!heading && !eyebrow && !subtitle && !children) {
    return null;
  }

  return (
    <div className={`page-title page-title--${align}`}>
      {eyebrow && <span className="page-title-eyebrow">{eyebrow}</span>}
      {heading && <h1 className="page-title-heading">{heading}</h1>}
      {subtitle && <p className="page-title-subtitle">{subtitle}</p>}
      {children}

      <style jsx>{`
        .page-title {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 2.5rem;
        }
        .page-title--center {
          align-items: center;
          text-align: center;
          max-width: 42rem;
          margin-left: auto;
          margin-right: auto;
        }
        .page-title--left {
          align-items: flex-start;
          text-align: left;
        }
        .page-title-eyebrow {
          color: var(--brand-primary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .page-title-heading {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--brand-text);
          line-height: 1.1;
          margin-top: 0.25rem;
        }
        .page-title-subtitle {
          color: var(--brand-text);
          opacity: 0.7;
          font-size: 1rem;
          margin-top: 0.5rem;
        }
        @media (min-width: 768px) {
          .page-title-heading { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}