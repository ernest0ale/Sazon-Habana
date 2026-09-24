'use client';

import { useState } from 'react';

/**
 * ImageGallery - Galería de imágenes con miniaturas
 *
 * Props:
 *   images (array de URLs)
 *   alt (string)
 *   onImageChange (fn opcional) — recibe la URL de la imagen activa
 */
export default function ImageGallery({ images = [], alt = '', onImageChange }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeImages = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600'];

  const activeImage = safeImages[activeIndex];

  const handleThumbClick = (index) => {
    setActiveIndex(index);
    onImageChange?.(safeImages[index]);
  };

  return (
    <div className="gallery">
      <div className="gallery-main">
        <img
          id="det-main-img"
          src={activeImage}
          alt={alt}
          className="gallery-main-image"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600';
          }}
        />
      </div>

      {safeImages.length > 1 && (
        <div className="gallery-thumbs">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              className={`gallery-thumb ${i === activeIndex ? 'is-active' : ''}`}
              onClick={() => handleThumbClick(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <img src={img} alt={`${alt} - ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .gallery {
          position: relative;
        }

        .gallery-main {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-lg);
        }

        .gallery-main-image {
          width: 100%;
          height: 320px;
          object-fit: cover;
          display: block;
        }
        @media (max-width: 767px) {
          .gallery-main-image { height: 220px; }
        }

        .gallery-thumbs {
          position: absolute;
          bottom: 16px;
          left: 16px;
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .gallery-thumb {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          padding: 0;
          background: transparent;
        }
        .gallery-thumb:hover {
          border-color: var(--brand-primary);
          transform: scale(1.05);
        }
        .gallery-thumb.is-active {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(91, 138, 114, 0.4);
        }

        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </div>
  );
}