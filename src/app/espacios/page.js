'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import ListingToolbar from '@/components/listado/ListingToolbar';
import FilterSidebar from '@/components/listado/FilterSidebar';
import MobileFilterOverlay from '@/components/listado/MobileFilterOverlay';
import RestaurantGrid from '@/components/ui/RestaurantGrid';
import Pagination from '@/components/ui/Pagination';
import {
  getMunicipiosConRestaurantes,
  filtrarRestaurantes,
  ordenarRestaurantes
} from '@/lib/data/restaurantes';
import { getCalificacionPromedio } from '@/lib/data/resenas';
import { ITEMS_PER_PAGE } from '@/lib/utils/constants';

function EspaciosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialTipo = searchParams.get('tipo') || 'todos';

  const [filters, setFilters] = useState({
    municipio: 'todos',
    tipo: initialTipo,
    precio: 'todos',
    aire: false,
    clima: false,
    parqueo: false
  });
  const [sort, setSort] = useState('pop');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  const municipiosDisponibles = useMemo(() => getMunicipiosConRestaurantes(), []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort, initialQuery]);

  const resultados = useMemo(() => {
    let rest = filtrarRestaurantes({ ...filters, query: initialQuery });
    rest = ordenarRestaurantes(rest, sort, getCalificacionPromedio);
    return rest;
  }, [filters, sort, initialQuery]);

  const totalPages = Math.ceil(resultados.length / ITEMS_PER_PAGE);
  const paginados = resultados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setFilters({
      municipio: 'todos',
      tipo: 'todos',
      precio: 'todos',
      aire: false,
      clima: false,
      parqueo: false
    });
    router.push('/espacios');
  };

  return (
    <div className="espacios-page">
      <PageTitle
        title="Espacios"
        eyebrow="Explora"
        heading="Espacios"
        subtitle="Encuentra el lugar perfecto según tus antojos."
      />

      <div className="espacios-container">
        <ListingToolbar
          totalCount={resultados.length}
          query={initialQuery}
          sortValue={sort}
          onSortChange={setSort}
          onOpenMobileFilters={() => setMobileOpen(true)}
        />

        <div className="espacios-layout">
          <div className="espacios-sidebar-desktop">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              municipiosDisponibles={municipiosDisponibles}
            />
          </div>

          <div className="espacios-main">
            <RestaurantGrid restaurantes={paginados} />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      <MobileFilterOverlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        filters={filters}
        onApply={setFilters}
        municipiosDisponibles={municipiosDisponibles}
      />

      <style jsx>{`
        .espacios-page { flex: 1; padding: 3rem 0; }
        .espacios-container {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 1rem;
        }
        @media (min-width: 640px) { .espacios-container { padding: 0 1.5rem; } }
        @media (min-width: 1024px) { .espacios-container { padding: 0 2rem; } }
        .espacios-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .espacios-layout { grid-template-columns: 3fr 9fr; }
        }
        .espacios-sidebar-desktop { display: none; }
        @media (min-width: 1024px) { .espacios-sidebar-desktop { display: block; } }
        .espacios-main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
      `}</style>
    </div>
  );
}

export default function EspaciosPage() {
  return (
    <Suspense fallback={<div className="spinner" style={{ margin: '3rem auto' }} />}>
      <EspaciosContent />
    </Suspense>
  );
}