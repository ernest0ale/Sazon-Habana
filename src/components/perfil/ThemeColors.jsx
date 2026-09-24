'use client';

import { useTheme } from '@/hooks/useTheme';
import { COLORES_TEMA } from '@/lib/utils/constants';

/**
 * ThemeColors - Selector de color de identidad de la app
 *
 * Props:
 *   onChanged (fn opcional)
 */
export default function ThemeColors({ onChanged }) {
  const { brandColor, setBrandColor } = useTheme();

  const handleSelect = (color) => {
    setBrandColor(color);
    onChanged?.(color);
  };

  return (
    <div className="theme-colors-card">
      <h3 className="theme-colors-title">
        <i className="fa-solid fa-wand-magic-sparkles theme-colors-icon" />
        Apariencia
      </h3>

      <div className="theme-colors-content">
        <p className="theme-colors-label">Color de identidad:</p>

        <div className="theme-colors-swatches">
          {COLORES_TEMA.map((color) => (
            <button
              key={color}
              type="button"
              className={`theme-color-swatch ${brandColor === color ? 'is-active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleSelect(color)}
              aria-label={`Seleccionar color ${color}`}
              aria-pressed={brandColor === color}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .theme-colors-card {
          background: var(--brand-card);
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--brand-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .theme-colors-title {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          border-bottom: 1px solid var(--brand-border);
          padding-bottom: 0.5rem;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .theme-colors-icon {
          color: var(--brand-primary);
        }

        .theme-colors-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .theme-colors-label {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.6;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .theme-colors-swatches {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .theme-color-swatch {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .theme-color-swatch:hover {
          transform: scale(1.1);
        }
        .theme-color-swatch.is-active {
          box-shadow: 0 0 0 2px var(--brand-card), 0 0 0 4px currentColor;
          border-color: var(--brand-text);
        }
      `}</style>
    </div>
  );
}