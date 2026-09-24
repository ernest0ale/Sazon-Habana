'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * HeroSection - Sección hero de la página principal
 * Incluye título, subtítulo, buscador y imagen lateral
 */
export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/espacios?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">
          {/* Columna texto */}
          <div className="hero-content">
            <span className="hero-eyebrow" />

            <h1 className="hero-title">
              Descubre el Paladar de{' '}
              <span className="hero-title-accent">La Habana</span>
            </h1>

            <p className="hero-subtitle">
              De los restaurantes más elegantes del Vedado y Miramar, a las joyas
              escondidas en la Habana Vieja. Encuentra cartas completas y ubicaciones.
            </p>

            <div className="hero-search-wrapper">
              <form className="hero-search-form" onSubmit={handleSubmit}>
                <div className="hero-search-input-wrapper">
                  <i className="fa-solid fa-magnifying-glass hero-search-icon" />
                  <input
                    type="text"
                    id="hero-search-input"
                    className="hero-search-input"
                    placeholder="¿Qué se te antoja hoy? (pizzas, criolla, mariscos, helados...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="hero-search-submit"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>

          {/* Columna imagen */}
          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              <img
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800"
                alt="Plato cubano"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #E8F0E5 0%, var(--brand-bg) 100%);
          overflow: hidden;
          padding: 4rem 0;
        }
        :global(html.dark) .hero-section {
          background: linear-gradient(135deg, #1A241C 0%, var(--brand-bg) 100%);
        }
        @media (min-width: 768px) {
          .hero-section { padding: 6rem 0; }
        }

        .hero-container {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 1rem;
          position: relative;
          z-index: 10;
        }
        @media (min-width: 640px) {
          .hero-container { padding: 0 1.5rem; }
        }
        @media (min-width: 1024px) {
          .hero-container { padding: 0 2rem; }
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 7fr 5fr;
          }
        }

        /* ===== CONTENIDO ===== */
        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: center;
        }
        @media (min-width: 1024px) {
          .hero-content { text-align: left; }
        }

        .hero-eyebrow {
          display: inline-block;
        }

        .hero-title {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--brand-text);
          line-height: 1.1;
        }
        @media (min-width: 768px) {
          .hero-title { font-size: 3rem; }
        }
        @media (min-width: 1024px) {
          .hero-title { font-size: 3.75rem; }
        }

        .hero-title-accent {
          font-style: italic;
          color: var(--brand-primary);
          text-decoration: underline;
          text-decoration-color: var(--brand-border);
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: var(--brand-text);
          opacity: 0.8;
          max-width: 36rem;
          margin: 0 auto;
          font-weight: 300;
          line-height: 1.6;
        }
        @media (min-width: 1024px) {
          .hero-subtitle { margin: 0; }
        }
        @media (min-width: 768px) {
          .hero-subtitle { font-size: 1.25rem; }
        }

        /* ===== BUSCADOR ===== */
        .hero-search-wrapper {
          padding-top: 1rem;
          max-width: 42rem;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .hero-search-wrapper { margin: 0; }
        }

        .hero-search-form {
          background: var(--brand-card);
          padding: 0.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--brand-border);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: stretch;
        }
        @media (min-width: 768px) {
          .hero-search-form {
            flex-direction: row;
            align-items: center;
            border-radius: var(--radius-full);
          }
        }

        .hero-search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          width: 100%;
        }

        .hero-search-icon {
          color: var(--brand-primary);
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        :global(html.dark) .hero-search-icon {
          color: #E8F0E5;
        }

        .hero-search-input {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          color: var(--brand-text);
          font-size: 1rem;
        }
        .hero-search-input::placeholder {
          color: var(--brand-text);
          opacity: 0.5;
        }

        .hero-search-submit {
          background: var(--brand-primary);
          color: #ffffff;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        .hero-search-submit:hover {
          background: var(--brand-hover);
        }
        @media (min-width: 768px) {
          .hero-search-submit {
            width: auto;
            border-radius: var(--radius-full);
          }
        }

        /* ===== IMAGEN ===== */
        .hero-image-wrapper {
          position: relative;
        }

        .hero-image-container {
          position: relative;
          max-width: 400px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .hero-image-container { max-width: none; }
        }

        .hero-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
          border-radius: var(--radius-xl);
          border: 4px solid var(--brand-card);
          box-shadow: var(--shadow-xl);
          position: relative;
          z-index: 10;
        }
        @media (min-width: 768px) {
          .hero-image { height: 450px; }
        }
      `}</style>
    </section>
  );
}