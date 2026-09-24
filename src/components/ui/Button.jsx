'use client';

/**
 * Button - Botón reutilizable
 *
 * Props:
 *   variant: 'primary' | 'outline' | 'ghost' | 'danger'
 *   size: 'sm' | 'md' | 'lg'
 *   fullWidth: boolean
 *   icon: nombre de icono Font Awesome (ej: 'fa-solid fa-check')
 *   iconPosition: 'left' | 'right'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon && iconPosition === 'left' && (
        <i className={`${icon} btn__icon btn__icon--left`} aria-hidden="true" />
      )}
      <span className="btn__label">{children}</span>
      {icon && iconPosition === 'right' && (
        <i className={`${icon} btn__icon btn__icon--right`} aria-hidden="true" />
      )}

      <style jsx>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
          text-decoration: none;
          white-space: nowrap;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn--full { width: 100%; }

        /* Tamaños */
        .btn--sm { padding: 0.5rem 1rem; font-size: 0.8rem; }
        .btn--md { padding: 0.75rem 1.5rem; font-size: 0.9rem; }
        .btn--lg { padding: 1rem 2rem; font-size: 1rem; }

        /* Variantes */
        .btn--primary {
          background: var(--brand-primary);
          color: #ffffff;
          border-color: var(--brand-primary);
        }
        .btn--primary:hover:not(:disabled) {
          background: var(--brand-hover);
          border-color: var(--brand-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(91, 138, 114, 0.25);
        }

        .btn--outline {
          background: transparent;
          color: var(--brand-primary);
          border-color: var(--brand-primary);
        }
        .btn--outline:hover:not(:disabled) {
          background: var(--brand-primary);
          color: #ffffff;
          transform: translateY(-2px);
        }

        .btn--ghost {
          background: var(--brand-bg);
          color: var(--brand-text);
          border-color: var(--brand-border);
        }
        .btn--ghost:hover:not(:disabled) {
          background: var(--brand-card);
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .btn--danger {
          background: #dc3545;
          color: #ffffff;
          border-color: #dc3545;
        }
        .btn--danger:hover:not(:disabled) {
          background: #bb2d3b;
          border-color: #bb2d3b;
          transform: translateY(-2px);
        }

        .btn__icon { font-size: 0.9em; }

        :global(html.dark) .btn--outline {
          border-color: #E8F0E5;
          color: #E8F0E5;
        }
        :global(html.dark) .btn--outline:hover:not(:disabled) {
          background: var(--brand-primary);
          border-color: var(--brand-primary);
          color: #ffffff;
        }
      `}</style>
    </button>
  );
}