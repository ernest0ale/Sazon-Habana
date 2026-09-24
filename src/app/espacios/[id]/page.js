'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import DetailPanel from '@/components/detalle/DetailPanel';
import ImageGallery from '@/components/detalle/ImageGallery';
import SpecialtiesSection from '@/components/detalle/SpecialtiesSection';
import DetailMap from '@/components/detalle/DetailMap';
import { getRestauranteById } from '@/lib/data/restaurantes';

export default function DetallePage({ params }) {
  const { id } = use(params);
  const restaurante = getRestauranteById(id);

  if (!restaurante) notFound();

  const galeria = restaurante.galeria?.length ? restaurante.galeria : [restaurante.img];

  let especialidades = restaurante.platos_populares || restaurante.platosPopulares || [];
  if (especialidades.length === 0) {
    const secciones = restaurante.secciones_carta || restaurante.seccionesCarta || [];
    const allPlatos = secciones.flatMap((sec) => sec.platos || []);
    especialidades = allPlatos.slice(0, 3);
  }

  return (
    <>
      <PageTitle title={restaurante.nombre} />

      <div className="detalle-page">
        <div className="detalle-container">
          <Link href="/espacios" className="detalle-back">
            <i className="fa-solid fa-arrow-left" /> Volver
          </Link>

          <div className="detalle-grid">
            <div className="detalle-col detalle-col--left">
              <ImageGallery images={galeria} alt={restaurante.nombre} />
            </div>
            <div className="detalle-col detalle-col--right">
              <DetailPanel restaurante={restaurante} />
            </div>
          </div>

          {especialidades.length > 0 && (
            <div className="detalle-specialties">
              <SpecialtiesSection platos={especialidades} />
            </div>
          )}

          <div className="detalle-map-wrapper">
            <DetailMap
              lat={restaurante.lat}
              lng={restaurante.lng}
              direccion={restaurante.direccion}
            />
          </div>
        </div>

        <style jsx>{`
          .detalle-page { flex: 1; padding: 3rem 0; }
          .detalle-container {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 0 1rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          @media (min-width: 640px) { .detalle-container { padding: 0 1.5rem; } }
          @media (min-width: 1024px) { .detalle-container { padding: 0 2rem; } }
          .detalle-back {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--brand-text);
            font-weight: 500;
            text-decoration: none;
            transition: color 0.2s ease;
          }
          .detalle-back:hover { color: var(--brand-primary); }
          .detalle-back :global(i) { transition: transform 0.2s ease; }
          .detalle-back:hover :global(i) { transform: translateX(-4px); }
          .detalle-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            align-items: start;
          }
          @media (min-width: 1024px) {
            .detalle-grid { grid-template-columns: 6fr 6fr; }
          }
          .detalle-col { min-width: 0; }
          .detalle-specialties,
          .detalle-map-wrapper { margin-top: 1rem; }
        `}</style>
      </div>
    </>
  );
}