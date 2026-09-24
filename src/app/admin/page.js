'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import SolicitudesTable from '@/components/admin/SolicitudesTable';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function AdminPage() {
  const router = useRouter();
  const { profile, isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || profile?.rol !== 'admin')) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, profile, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/solicitudes', { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSolicitudes(data.solicitudes || []);
      } catch {
        toast.error('Error', 'No se pudieron cargar las solicitudes.');
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated && profile?.rol === 'admin') {
      load();
    }
  }, [isAuthenticated, profile, toast]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/solicitudes/${id}/aprobar`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      toast.success('Aprobado', 'Restaurante y gestor creados.');
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error('Error', 'No se pudo aprobar la solicitud.');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`/api/solicitudes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      toast.info('Rechazado', 'Solicitud eliminada.');
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error('Error', 'No se pudo rechazar la solicitud.');
    }
  };

  if (authLoading || (isAuthenticated && profile?.rol !== 'admin')) return null;

  return (
    <>
      <PageTitle
        title="Admin Panel"
        eyebrow="Panel de Administración"
        heading="Aprobación de Solicitudes"
      />

      <div className="admin-page">
        <div className="admin-container">
          {loading ? (
            <div className="admin-loading">
              <div className="spinner" />
            </div>
          ) : (
            <SolicitudesTable
              solicitudes={solicitudes}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>

        <style jsx>{`
          .admin-page { flex: 1; padding: 0 0 3rem; }
          .admin-container {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 0 1rem;
          }
          @media (min-width: 640px) { .admin-container { padding: 0 1.5rem; } }
          @media (min-width: 1024px) { .admin-container { padding: 0 2rem; } }
          .admin-loading {
            display: flex;
            justify-content: center;
            padding: 4rem 0;
          }
        `}</style>
      </div>
    </>
  );
}