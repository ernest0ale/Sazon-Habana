'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearch } from '@/hooks/useSearch';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { getInitials } from '@/lib/utils/formatters';
import { APP_NAME, APP_TAGLINE } from '@/lib/utils/constants';
import MobileMenu from './MobileMenu';

const { openSearch } = useSearch();

export default function Header() {
  const pathname = usePathname();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const { isDark, toggleDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  const rol = profile?.rol || null;
  const isAdmin = rol === 'admin';
  const isGestor = rol === 'gestor';

  // Cerrar dropdown avatar al click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    }
    if (avatarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [avatarOpen]);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setAvatarOpen(false);
  }, [pathname]);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

  const handleLogout = async () => {
    setAvatarOpen(false);
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo + botón menú móvil */}
        <div className="header-brand-wrapper">
          <button
            type="button"
            className="header-mobile-toggle"
            aria-label="Abrir menú"
            onClick={() => setMobileMenuOpen(true)}
          >
            <i className="fa-solid fa-bars" />
          </button>

          <Link href="/" className="header-brand">
            <img
              src={isDark
                ? '/images/sazonHabana_darkLogo.png'
                : '/images/sazonHabana_lightLogo.png'}
              alt={APP_NAME}
              className="header-logo"
            />
            <div className="header-brand-text">
              <span className="header-brand-name">{APP_NAME}</span>
              <span className="header-brand-tagline">{APP_TAGLINE}</span>
            </div>
          </Link>
        </div>

        {/* Nav desktop */}
        <nav className="header-nav" aria-label="Navegación principal">
          <Link
            href="/"
            className={`nav-btn ${isActive('/') && pathname === '/' ? 'is-active' : ''}`}
          >
            <i className="fa-solid fa-house" /> Inicio
          </Link>
          <Link
            href="/espacios"
            className={`nav-btn ${isActive('/espacios') ? 'is-active' : ''}`}
          >
            <i className="fa-solid fa-utensils" /> Espacios
          </Link>
          <Link
            href="/mapa"
            className={`nav-btn ${isActive('/mapa') ? 'is-active' : ''}`}
          >
            <i className="fa-solid fa-map" /> Mapa
          </Link>

          {isAuthenticated && (isGestor || (!isGestor && !isAdmin)) && (
            <Link
              href="/solicitar-espacio"
              className={`nav-btn ${isActive('/solicitar-espacio') ? 'is-active' : ''}`}
            >
              <i className="fa-solid fa-store" /> Solicitar espacio
            </Link>
          )}

          {isAuthenticated && isGestor && (
            <Link
              href="/mi-espacio"
              className={`nav-btn ${isActive('/mi-espacio') ? 'is-active' : ''}`}
            >
              <i className="fa-solid fa-pen-to-square" /> Mi espacio
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              href="/admin"
              className={`nav-btn ${isActive('/admin') ? 'is-active' : ''}`}
            >
              <i className="fa-solid fa-shield-halved" /> Admin Panel
            </Link>
          )}
        </nav>

        {/* Acciones derecha */}
        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label="Buscar"
            onClick={() => openSearch()}
          >
            <i className="fa-solid fa-magnifying-glass" />
          </button>

          <button
            type="button"
            className="icon-btn"
            aria-label="Cambiar tema"
            onClick={toggleDark}
          >
            <i className={isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
          </button>

          {isAuthenticated ? (
            <div className="avatar-dropdown" ref={avatarRef}>
              <button
                type="button"
                className="avatar-trigger"
                aria-label="Menú de usuario"
                aria-expanded={avatarOpen}
                onClick={() => setAvatarOpen((v) => !v)}
              >
                <span className="avatar-circle">
                  {getInitials(profile?.nombre || user?.email || '?')}
                </span>
                <i className="fa-solid fa-chevron-down avatar-chevron" />
              </button>

              <div className={`avatar-dropdown-menu ${avatarOpen ? 'is-open' : ''}`}>
                <Link
                  href="/perfil"
                  className="avatar-dropdown-item"
                  onClick={() => setAvatarOpen(false)}
                >
                  <i className="fa-regular fa-user" /> Configuración
                </Link>
                <button
                  type="button"
                  className="avatar-dropdown-item avatar-dropdown-item--danger"
                  onClick={handleLogout}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" /> Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="login-btn">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAdmin={isAdmin}
        isGestor={isGestor}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      <style jsx>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background-color: var(--brand-bg);
          border-bottom: 1px solid var(--brand-border);
          box-shadow: var(--shadow-sm);
        }

        .header-container {
          max-width: var(--max-width);
          margin: 0 auto;
          height: var(--header-height);
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .header-container { padding: 0 1.5rem; }
        }
        @media (min-width: 1024px) {
          .header-container { padding: 0 2rem; }
        }

        /* ===== BRAND ===== */
        .header-brand-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
          flex: 1;
        }
        @media (min-width: 768px) {
          .header-brand-wrapper {
            justify-content: flex-start;
            flex: 0 1 auto;
          }
        }

        .header-mobile-toggle {
          position: absolute;
          left: 1rem;
          color: var(--brand-text);
          font-size: 1.5rem;
          padding: 0.5rem;
          background: none;
          border: none;
        }
        .header-mobile-toggle:hover { color: var(--brand-primary); }
        @media (min-width: 768px) {
          .header-mobile-toggle { display: none; }
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .header-logo {
          height: 48px;
          width: auto;
          transition: all 0.3s ease;
        }

        .header-brand-text {
          display: flex;
          flex-direction: column;
        }

        .header-brand-name {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--brand-text);
          line-height: 1;
          transition: color 0.2s ease;
        }
        .header-brand:hover .header-brand-name { color: var(--brand-primary); }

        .header-brand-tagline {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--brand-secondary);
          font-weight: 700;
          margin-top: 2px;
          display: none;
        }
        @media (min-width: 768px) {
          .header-brand-tagline { display: block; }
        }

        /* ===== NAV DESKTOP ===== */
        .header-nav {
          display: none;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .header-nav {
            display: flex;
            align-items: center;
          }
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--brand-text);
          font-weight: 700;
          font-size: 1rem;
          padding-bottom: 4px;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .nav-btn:hover { color: var(--brand-primary); }
        .nav-btn.is-active {
          border-bottom-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        /* ===== ACCIONES ===== */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-btn {
          color: var(--brand-text);
          font-size: 1.25rem;
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .icon-btn:hover { color: var(--brand-primary); }

        .login-btn {
          background: transparent;
          border: 2px solid var(--brand-primary);
          color: var(--brand-primary);
          font-weight: 700;
          font-size: 0.875rem;
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }
        .login-btn:hover {
          background: var(--brand-primary);
          color: #ffffff;
        }
        html.dark .login-btn {
          border-color: #E8F0E5;
          color: #E8F0E5;
        }
        html.dark .login-btn:hover {
          background: var(--brand-primary);
          border-color: var(--brand-primary);
          color: #ffffff;
        }

        /* ===== AVATAR DROPDOWN ===== */
        .avatar-dropdown { position: relative; }

        .avatar-trigger {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .avatar-trigger:hover { color: var(--brand-primary); }

        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--brand-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-family: var(--font-serif);
          font-size: 0.875rem;
        }

        .avatar-chevron {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.5;
          margin-left: 0.25rem;
          display: none;
        }
        @media (min-width: 768px) {
          .avatar-chevron { display: inline-block; }
        }

        .avatar-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 180px;
          background: var(--brand-card);
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          display: none;
          z-index: 50;
        }
        .avatar-dropdown-menu.is-open { display: block; }

        .avatar-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--brand-text);
          font-size: 0.875rem;
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.2s ease;
        }
        .avatar-dropdown-item:hover { background: var(--brand-bg); }
        .avatar-dropdown-item--danger {
          color: #dc3545;
          border-top: 1px solid var(--brand-border);
        }
      `}</style>
    </header>
  );
}