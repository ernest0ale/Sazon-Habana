'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import ProfileForm from '@/components/perfil/ProfileForm';
import ThemeColors from '@/components/perfil/ThemeColors';
import UserReviews from '@/components/perfil/UserReviews';
import ChangePasswordModal from '@/components/modals/ChangePasswordModal';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import { useAuth } from '@/hooks/useAuth';
import { getResenasByUsuarioId, eliminarResena } from '@/lib/data/resenas';
import { getRestauranteById } from '@/lib/data/restaurantes';

export default function PerfilPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading, logout } = useAuth();

  const [changePassOpen, setChangePassOpen] = useState(false);
  const [deleteAccOpen, setDeleteAccOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) return null;

  const misResenas = getResenasByUsuarioId(user.id);

  const handleDeleteReview = async (id) => {
    eliminarResena(id);
    setRefreshKey((k) => k + 1);
  };

  const getRestauranteNombre = (id) => {
    const r = getRestauranteById(id);
    return r?.nombre || 'Restaurante eliminado';
  };

  const handleChangePassword = async (oldPass, newPass) => {
    try {
      const res = await fetch('/api/perfil/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPass, newPass })
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error };
      return { ok: true };
    } catch {
      return { ok: false, error: 'Error de conexión.' };
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/perfil', {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) return { ok: false, error: 'No se pudo eliminar la cuenta.' };

      await logout();
      router.push('/');
      return { ok: true };
    } catch {
      return { ok: false, error: 'Error de conexión.' };
    }
  };

  return (
    <>
      <PageTitle
        title="Perfil"
        eyebrow="Tu Cuenta"
        heading="Configuración del Perfil"
        subtitle="Personaliza tu experiencia y gestiona tu restaurante."
      />

      <div className="perfil-page">
        <div className="perfil-container">
          <div className="perfil-grid">
            <ProfileForm profile={profile} />

            <ThemeColors />

            <UserReviews
              key={refreshKey}
              resenas={misResenas}
              onDelete={handleDeleteReview}
              getRestauranteNombre={getRestauranteNombre}
            />

            <div className="perfil-security">
              <h3 className="perfil-security-title">
                <i className="fa-solid fa-shield-halved" /> Seguridad
              </h3>
              <div className="perfil-security-actions">
                <button
                  type="button"
                  className="perfil-security-btn"
                  onClick={() => setChangePassOpen(true)}
                >
                  <span>Cambiar Contraseña</span>
                  <i className="fa-solid fa-key" />
                </button>
                <button
                  type="button"
                  className="perfil-security-btn perfil-security-btn--danger"
                  onClick={() => setDeleteAccOpen(true)}
                >
                  <span>Eliminar Cuenta</span>
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <ChangePasswordModal
          open={changePassOpen}
          onClose={() => setChangePassOpen(false)}
          onSubmit={handleChangePassword}
        />

        <DeleteAccountModal
          open={deleteAccOpen}
          onClose={() => setDeleteAccOpen(false)}
          onConfirm={handleDeleteAccount}
        />

        <style jsx>{`
          .perfil-page { flex: 1; padding: 0 0 3rem; }
          .perfil-container {
            max-width: 56rem;
            margin: 0 auto;
            padding: 0 1rem;
          }
          @media (min-width: 640px) { .perfil-container { padding: 0 1.5rem; } }
          .perfil-grid {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          .perfil-security {
            background: var(--brand-card);
            padding: 1.5rem;
            border-radius: var(--radius-xl);
            border: 1px solid var(--brand-border);
            box-shadow: var(--shadow-sm);
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .perfil-security-title {
            font-family: var(--font-serif);
            font-size: 1.125rem;
            font-weight: 700;
            border-bottom: 1px solid var(--brand-border);
            padding-bottom: 0.5rem;
            color: #dc3545;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .perfil-security-actions {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .perfil-security-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            background: var(--brand-bg);
            border: 1px solid var(--brand-border);
            border-radius: var(--radius-md);
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--brand-text);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .perfil-security-btn:hover { border-color: var(--brand-primary); }
          .perfil-security-btn :global(i) { color: var(--brand-primary); }
          .perfil-security-btn--danger {
            background: rgba(220, 53, 69, 0.1);
            color: #dc3545;
            border-color: transparent;
          }
          .perfil-security-btn--danger:hover {
            background: rgba(220, 53, 69, 0.2);
            border-color: #dc3545;
          }
          .perfil-security-btn--danger :global(i) { color: #dc3545; }
        `}</style>
      </div>
    </>
  );
}