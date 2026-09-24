'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileMenu({
  open,
  onClose,
  isAdmin,
  isGestor,
  isAuthenticated,
  onLogout
}) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <>
      <div
        className={`mobile-menu-overlay ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`mobile-menu-panel ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menú</span>
          <button
            type="button"
            className="mobile-menu-close"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <nav className="mobile-menu-nav" aria-label="Navegación móvil">
          <Link
            href="/"
            className={`mobile-nav-link ${isActive('/') && pathname === '/' ? 'is-active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-house mobile-nav-icon" /> Inicio
          </Link>
          <Link
            href="/espacios"
            className={`mobile-nav-link ${isActive('/espacios') ? 'is-active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-utensils mobile-nav-icon" /> Espacios
          </Link>
          <Link
            href="/mapa"
            className={`mobile-nav-link ${isActive('/mapa') ? 'is-active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-map mobile-nav-icon" /> Mapa
          </Link>

          {isAuthenticated && (isGestor || (!isGestor && !isAdmin)) && (
            <Link
              href="/solicitar-espacio"
              className={`mobile-nav-link ${isActive('/solicitar-espacio') ? 'is-active' : ''}`}
              onClick={onClose}
            >
              <i className="fa-solid fa-store mobile-nav-icon" /> Solicitar espacio
            </Link>
          )}

          {isAuthenticated && isGestor && (
            <Link
              href="/mi-espacio"
              className={`mobile-nav-link ${isActive('/mi-espacio') ? 'is-active' : ''}`}
              onClick={onClose}
            >
              <i className="fa-solid fa-pen-to-square mobile-nav-icon" /> Mi espacio
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              href="/admin"
              className={`mobile-nav-link ${isActive('/admin') ? 'is-active' : ''}`}
              onClick={onClose}
            >
              <i className="fa-solid fa-shield-halved mobile-nav-icon" /> Admin Panel
            </Link>
          )}
        </nav>

        <div className="mobile-menu-footer">
          {isAuthenticated ? (
            <>
              <Link
                href="/perfil"
                className="mobile-menu-btn mobile-menu-btn--outline"
                onClick={onClose}
              >
                <i className="fa-regular fa-user" /> Mi perfil
              </Link>
              <button
                type="button"
                className="mobile-menu-btn mobile-menu-btn--danger"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket" /> Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="mobile-menu-btn mobile-menu-btn--primary"
              onClick={onClose}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </aside>

      <style jsx>{`
        /* ===== OVERLAY (fondo oscuro) ===== */
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(2px);
          z-index: 60;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .mobile-menu-overlay.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        /* ===== PANEL LATERAL IZQUIERDO ===== */
        .mobile-menu-panel {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 85%;
          max-width: 340px;
          background: var(--brand-bg);
          border-right: 1px solid var(--brand-border);
          z-index: 61;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          box-shadow: 8px 0 32px rgba(0, 0, 0, 0.15);
        }
        .mobile-menu-panel.is-open {
          transform: translateX(0);
        }

        /* ===== HEADER DEL PANEL ===== */
        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--brand-border);
        }

        .mobile-menu-title {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--brand-text);
        }

        .mobile-menu-close {
          font-size: 1.5rem;
          color: var(--brand-text);
          opacity: 0.7;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }
        .mobile-menu-close:hover {
          opacity: 1;
          color: var(--brand-primary);
          transform: rotate(90deg);
        }

        /* ===== NAV ===== */
        .mobile-menu-nav {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.5rem;
          font-family: var(--font-serif);
          font-size: 1.05rem;
          color: var(--brand-text);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.is-active {
          color: var(--brand-primary);
          background: var(--brand-card);
        }

        .mobile-nav-icon {
          width: 20px;
          text-align: center;
          color: var(--brand-primary);
        }

        /* ===== FOOTER DEL PANEL ===== */
        .mobile-menu-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--brand-border);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .mobile-menu-btn--outline {
          background: transparent;
          border-color: var(--brand-border);
          color: var(--brand-text);
        }
        .mobile-menu-btn--outline:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }
        .mobile-menu-btn--danger {
          background: transparent;
          border-color: transparent;
          color: #dc3545;
        }
        .mobile-menu-btn--danger:hover {
          background: rgba(220, 53, 69, 0.1);
        }
        .mobile-menu-btn--primary {
          background: var(--brand-primary);
          color: #ffffff;
          border-color: var(--brand-primary);
        }
        .mobile-menu-btn--primary:hover {
          background: var(--brand-hover);
        }

        /* ===== OCULTAR EN DESKTOP ===== */
        @media (min-width: 768px) {
          .mobile-menu-overlay,
          .mobile-menu-panel {
            display: none;
          }
        }
      `}</style>
    </>
  );
}