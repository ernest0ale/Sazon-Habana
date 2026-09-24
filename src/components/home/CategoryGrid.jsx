'use client';

import CategoryFilter from '@/components/ui/CategoryFilter';

/**
 * CategoryGrid - Sección "Busca según tus antojos"
 * Reutiliza el componente CategoryFilter con variant="home"
 */
export default function CategoryGrid() {
  return (
    <section className="category-section">
      <div className="category-section-container">
        <p className="category-section-title">Busca según tus antojos</p>
        <CategoryFilter variant="home" />
      </div>

      <style jsx>{`
        .category-section {
          padding: 3rem 0;
          background: rgba(255, 255, 255, 0.3);
          border-top: 1px solid var(--brand-border);
          border-bottom: 1px solid var(--brand-border);
        }
        :global(html.dark) .category-section {
          background: rgba(36, 48, 41, 0.3);
        }

        .category-section-container {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 1rem;
        }
        @media (min-width: 640px) {
          .category-section-container { padding: 0 1.5rem; }
        }
        @media (min-width: 1024px) {
          .category-section-container { padding: 0 2rem; }
        }

        .category-section-title {
          text-align: center;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--brand-primary);
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        :global(html.dark) .category-section-title {
          color: #E8F0E5;
        }
      `}</style>
    </section>
  );
}