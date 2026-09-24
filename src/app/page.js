'use client';

import { useMemo } from 'react';
import PageTitle from '@/components/layout/PageTitle';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import CarouselSection from '@/components/home/CarouselSection';
import { getRestaurantes } from '@/lib/data/restaurantes';
import { getCalificacionPromedio } from '@/lib/data/resenas';

export default function HomePage() {
  const { nuevos, populares, mejorValorados } = useMemo(() => {
    const all = getRestaurantes();

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const nuevos = all.filter((r) => {
      if (!r.createdAt) return false;
      return new Date(r.createdAt) >= oneMonthAgo;
    });

    const populares = [...all]
      .map((r) => ({ r, rating: getCalificacionPromedio(r.id) }))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .map((x) => x.r);

    const mejorValorados = all
      .filter((r) => {
        const avg = getCalificacionPromedio(r.id);
        return avg !== null && avg >= 4;
      })
      .sort((a, b) => {
        const ra = getCalificacionPromedio(a.id) ?? 0;
        const rb = getCalificacionPromedio(b.id) ?? 0;
        return rb - ra;
      });

    return { nuevos, populares, mejorValorados };
  }, []);

  return (
    <>
      <PageTitle title="Inicio" />

      <div className="home-page">
        <HeroSection />
        <CategoryGrid />

        <section className="home-carousels">
          <CarouselSection
            title="Más recientes"
            icon="fa-regular fa-clock"
            restaurantes={nuevos.slice(0, 10)}
          />
          <CarouselSection
            title="Más destacados"
            icon="fa-solid fa-fire"
            restaurantes={populares.slice(0, 10)}
          />
          <CarouselSection
            title="Mejores reseñas"
            icon="fa-solid fa-star"
            restaurantes={mejorValorados.slice(0, 10)}
          />
        </section>
      </div>

      <style jsx>{`
        .home-carousels {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          padding: 4rem 1rem;
          max-width: var(--max-width);
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .home-carousels { padding: 4rem 1.5rem; }
        }
        @media (min-width: 1024px) {
          .home-carousels { padding: 4rem 2rem; }
        }
      `}</style>
    </>
  );
}