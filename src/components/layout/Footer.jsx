'use client';

import Link from 'next/link';
import { APP_NAME, APP_TAGLINE } from '@/lib/utils/constants';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Columna 1: Brand */}
          <div className="footer-col footer-col--brand">
            <div className="footer-brand">
              <img
                src="/images/sazonHabana_darkLogo.png"
                alt={APP_NAME}
                className="footer-logo"
              />
              <div className="footer-brand-text">
                <span className="footer-brand-name">{APP_NAME}</span>
                <span className="footer-brand-tagline">{APP_TAGLINE}</span>
              </div>
            </div>
            <p className="footer-description">
              Descubre y vive el sabor de Cuba. Restaurantes auténticos en La Habana.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div className="footer-col">
            <h4 className="footer-heading">Navegación</h4>
            <ul className="footer-links">
              <li><Link href="/" className="footer-link">Inicio</Link></li>
              <li><Link href="/espacios" className="footer-link">Espacios</Link></li>
              <li><Link href="/mapa" className="footer-link">Mapa</Link></li>
            </ul>
          </div>

          {/* Columna 3: Información */}
          <div className="footer-col">
            <h4 className="footer-heading">Información</h4>
            <ul className="footer-links">
              <li><Link href="/privacidad" className="footer-link">Política de privacidad</Link></li>
              <li><Link href="/terminos" className="footer-link">Términos de servicio</Link></li>
              <li><Link href="/cookies" className="footer-link">Política de cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 {APP_NAME}. Todos los derechos reservados.</p>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          background-color: var(--footer-bg);
          color: #ffffff;
          padding: 3rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: auto;
        }

        .footer-container {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 1rem;
        }
        @media (min-width: 640px) {
          .footer-container { padding: 0 1.5rem; }
        }
        @media (min-width: 1024px) {
          .footer-container { padding: 0 2rem; }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        @media (min-width: 768px) {
          .footer-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }
        @media (min-width: 768px) {
          .footer-col { text-align: left; }
        }

        /* ===== Brand ===== */
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .footer-brand { justify-content: flex-start; }
        }

        .footer-logo {
          height: 48px;
          width: auto;
        }

        .footer-brand-text {
          display: flex;
          flex-direction: column;
        }

        .footer-brand-name {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.025em;
          color: #ffffff;
        }

        .footer-brand-tagline {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 700;
        }

        .footer-description {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 24rem;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .footer-description { margin: 0; }
        }

        /* ===== Encabezados ===== */
        .footer-heading {
          position: relative;
          display: inline-block;
          padding-bottom: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #ffffff;
          font-family: var(--font-sans);
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #ffffff;
          border-radius: 2px;
        }

        /* ===== Links ===== */
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-link {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: #ffffff; }

        /* ===== Copyright ===== */
        .footer-bottom {
          padding-top: 2rem;
          display: flex;
          justify-content: center;
        }

        .footer-copyright {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }
      `}</style>
    </footer>
  );
}