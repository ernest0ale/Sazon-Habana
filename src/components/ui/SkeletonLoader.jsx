'use client';

/**
 * SkeletonLoader - Placeholder de carga
 *
 * Props:
 *   variant: 'card' | 'line' | 'circle' | 'text' | 'detail'
 *   width, height (CSS values, ej: '100%', '2rem')
 *   lines (para variant="text")
 */
export default function SkeletonLoader({
  variant = 'line',
  width,
  height,
  lines = 3,
  className = ''
}) {
  if (variant === 'card') {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton skeleton-card__image" />
        <div className="skeleton-card__body">
          <div className="skeleton skeleton-card__title" />
          <div className="skeleton skeleton-card__meta" />
          <div className="skeleton skeleton-card__meta" />
        </div>

        <style jsx>{`
          .skeleton-card {
            background: var(--brand-card);
            border: 1px solid var(--brand-border);
            border-radius: var(--radius-lg);
            overflow: hidden;
          }
          .skeleton-card__image {
            width: 100%;
            height: 180px;
            border-radius: 0;
          }
          .skeleton-card__body {
            padding: 1rem 1.125rem 1.125rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .skeleton-card__title {
            height: 20px;
            width: 70%;
          }
          .skeleton-card__meta {
            height: 14px;
            width: 45%;
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`skeleton-text ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton skeleton-text__line"
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}

        <style jsx>{`
          .skeleton-text {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .skeleton-text__line {
            height: 12px;
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div
        className={`skeleton skeleton-circle ${className}`}
        style={{ width: width || '3rem', height: height || width || '3rem' }}
      >
        <style jsx>{`
          .skeleton-circle {
            border-radius: 50%;
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={`skeleton-detail ${className}`}>
        <div className="skeleton skeleton-detail__image" />
        <div className="skeleton-detail__info">
          <div className="skeleton skeleton-detail__title" />
          <div className="skeleton skeleton-detail__subtitle" />
          <div className="skeleton skeleton-detail__line" />
          <div className="skeleton skeleton-detail__line" />
          <div className="skeleton skeleton-detail__line" />
        </div>

        <style jsx>{`
          .skeleton-detail {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          .skeleton-detail__image {
            width: 100%;
            height: 320px;
            border-radius: var(--radius-lg);
          }
          .skeleton-detail__info {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .skeleton-detail__title {
            height: 28px;
            width: 60%;
          }
          .skeleton-detail__subtitle {
            height: 16px;
            width: 40%;
          }
          .skeleton-detail__line {
            height: 14px;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height: height || '1rem' }}
    />
  );
}