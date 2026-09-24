'use client';

import { useState } from 'react';

/**
 * StarRating - Selector de estrellas para reseñas
 *
 * Props:
 *   value (number 1-5)
 *   onChange (fn)
 *   name (string, para el input radio group)
 *   readOnly (bool) - si es true, solo muestra las estrellas
 *   size ('sm' | 'md' | 'lg')
 */
export default function StarRating({
  value = 0,
  onChange,
  name = 'rating',
  readOnly = false,
  size = 'md'
}) {
  const [hover, setHover] = useState(0);
  const displayValue = hover || value;

  if (readOnly) {
    return (
      <span className={`star-rating-readonly star-rating-readonly--${size}`} aria-label={`${value} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <i
            key={n}
            className={n <= value ? 'fa-solid fa-star is-filled' : 'fa-regular fa-star'}
            aria-hidden="true"
          />
        ))}

        <style jsx>{`
          .star-rating-readonly {
            display: inline-flex;
            gap: 2px;
            color: #f5b301;
          }
          .star-rating-readonly--sm { font-size: 0.75rem; }
          .star-rating-readonly--md { font-size: 0.9rem; }
          .star-rating-readonly--lg { font-size: 1.2rem; }
          .star-rating-readonly :global(.is-filled) { color: #f5b301; }
          .star-rating-readonly :global(.fa-regular) { color: #ddd; }
        `}</style>
      </span>
    );
  }

  return (
    <div className={`star-rating star-rating--${size}`} role="radiogroup" aria-label="Valoración">
      {[5, 4, 3, 2, 1].map((n) => (
        <label
          key={n}
          className="star-rating__label"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange?.(n)}
            aria-label={`${n} estrella${n !== 1 ? 's' : ''}`}
          />
          <i
            className={n <= displayValue ? 'fa-solid fa-star is-filled' : 'fa-regular fa-star'}
            aria-hidden="true"
          />
        </label>
      ))}

      <style jsx>{`
        .star-rating {
          display: inline-flex;
          flex-direction: row-reverse;
          justify-content: flex-end;
          gap: 0.25rem;
        }

        .star-rating--sm { font-size: 1rem; }
        .star-rating--md { font-size: 1.5rem; }
        .star-rating--lg { font-size: 2rem; }

        .star-rating__label {
          cursor: pointer;
          color: #ddd;
          transition: color 0.2s ease, transform 0.15s ease;
          line-height: 1;
        }
        .star-rating__label:hover {
          transform: scale(1.1);
        }

        .star-rating__label :global(input) {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .star-rating__label :global(.is-filled) {
          color: #f5b301;
        }

        /* Hover: iluminar esta y las anteriores */
        .star-rating__label:hover :global(i),
        .star-rating__label:hover ~ .star-rating__label :global(i) {
          color: #f5b301;
        }
      `}</style>
    </div>
  );
}