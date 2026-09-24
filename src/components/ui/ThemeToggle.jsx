'use client';

import { useTheme } from '@/hooks/useTheme';

/**
 * ThemeToggle - Botón para cambiar entre tema claro y oscuro
 *
 * Props:
 *   variant: 'icon' | 'labeled'
 */
export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const { isDark, toggleDark, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        className={`theme-toggle theme-toggle--${variant} ${className}`}
        aria-label="Cambiar tema"
        disabled
      >
        <i className="fa-solid fa-moon" />
        <style jsx>{`
          .theme-toggle {
            color: var(--brand-text);
            padding: 0.5rem;
            font-size: 1.25rem;
            background: none;
            border: none;
          }
        `}</style>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${variant} ${className}`}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-pressed={isDark}
      onClick={toggleDark}
    >
      <i className={isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} />
      {variant === 'labeled' && (
        <span className="theme-toggle__label">
          {isDark ? 'Tema claro' : 'Tema oscuro'}
        </span>
      )}

      <style jsx>{`
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--brand-text);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0.5rem;
          font-size: 1.25rem;
        }
        .theme-toggle:hover {
          color: var(--brand-primary);
        }

        .theme-toggle--labeled {
          padding: 0.5rem 1rem;
          border: 1px solid var(--brand-border);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 600;
        }
        .theme-toggle--labeled:hover {
          border-color: var(--brand-primary);
        }

        .theme-toggle__label {
          font-size: 0.875rem;
        }
      `}</style>
    </button>
  );
}