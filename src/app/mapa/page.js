'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageTitle from '@/components/layout/PageTitle';
import MapFilters from '@/components/mapa/MapFilters';
import { getMunicipiosConRestaurantes } from '@/lib/data/restaurantes';

const MapView = dynamic(() => import('@/components/mapa/MapView'), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <div className="spinner" />
      <style jsx>{`
        .map-loading {
          width: 100%;
          height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
});

export default function MapaPage() {
  const [filters, setFilters] = useState({
    municipio: 'todos',
    tipo: 'todos',
    aire: false,
    clima: false,
    parqueo: false
  });

  const municipiosDisponibles = getMunicipiosConRestaurantes();

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setFilters({
      municipio: 'todos',
      tipo: 'todos',
      aire: false,
      clima: false,
      parqueo: false
    });
  };

  return (
    <>
      <PageTitle title="Mapa" />

      <div className="mapa-page">
        <MapView filters={filters} />
        <MapFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          municipiosDisponibles={municipiosDisponibles}
        />

        <style jsx>{`
          .mapa-page {
            position: relative;
            width: 100%;
            flex: 1;
          }
        `}</style>
      </div>
    </>
  );
}