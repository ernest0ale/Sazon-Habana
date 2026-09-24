'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getRestauranteById } from '@/lib/data/restaurantes';
import { validateRestauranteUpdate } from '@/lib/validators/restaurante.validator';

export default function MiEspacioPage() {
  const router = useRouter();
  const { profile, isAuthenticated, loading: authLoading, refreshProfile } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const restaurante = profile?.restaurante_id
    ? getRestauranteById(profile.restaurante_id)
    : null;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || profile?.rol !== 'gestor')) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, profile, router]);

  useEffect(() => {
    if (restaurante) {
      setForm({
        nombre: restaurante.nombre,
        horario: restaurante.horario,
        descripcion: restaurante.descripcion,
        telefono: restaurante.telefono,
        direccion: restaurante.direccion
      });
    }
  }, [restaurante]);

  if (authLoading || !isAuthenticated || !restaurante || !form) return null;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    const v = validateRestauranteUpdate(form);
    if (!v.ok) {
      toast.error('Validación', v.errors[0]);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/restaurantes/${restaurante.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Actualizado', 'Tu espacio ha sido actualizado.');
      await refreshProfile();
    } catch (err) {
      toast.error('Error', err.message || 'No se pudo actualizar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Mi Espacio"
        eyebrow="Panel de Control"
        heading="Mi Espacio"
        subtitle="Gestiona la información de tu establecimiento gastronómico."
      />

      <div className="miespacio-page">
        <div className="miespacio-container">
          <div className="miespacio-card">
            <h2 className="miespacio-name">{restaurante.nombre}</h2>
            <p className="miespacio-sub">Panel de gestión de tu espacio</p>

            <div className="miespacio-grid">
              <Input
                id="me-nombre"
                type="text"
                label="Nombre del espacio"
                value={form.nombre}
                onChange={(e) => update('nombre', e.target.value)}
                maxLength={120}
              />
              <Input
                id="me-horario"
                type="text"
                label="Horario"
                value={form.horario}
                onChange={(e) => update('horario', e.target.value)}
                maxLength={500}
              />

              <div className="miespacio-full">
                <label htmlFor="me-descripcion" className="miespacio-label">
                  Descripción
                </label>
                <textarea
                  id="me-descripcion"
                  className="miespacio-textarea"
                  rows={4}
                  value={form.descripcion}
                  onChange={(e) => update('descripcion', e.target.value)}
                  maxLength={2000}
                />
              </div>

              <Input
                id="me-telefono"
                type="tel"
                label="Teléfono de contacto"
                value={form.telefono}
                onChange={(e) =>
                  update('telefono', e.target.value.replace(/\D/g, '').slice(0, 8))
                }
                maxLength={8}
              />
              <Input
                id="me-direccion"
                type="text"
                label="Dirección"
                value={form.direccion}
                onChange={(e) => update('direccion', e.target.value)}
                maxLength={250}
              />
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        <style jsx>{`
          .miespacio-page { flex: 1; padding: 0 0 3rem; }
          .miespacio-container {
            max-width: 56rem;
            margin: 0 auto;
            padding: 0 1rem;
          }
          @media (min-width: 640px) { .miespacio-container { padding: 0 1.5rem; } }
          .miespacio-card {
            background: var(--brand-card);
            padding: 2rem;
            border-radius: var(--radius-xl);
            border: 1px solid var(--brand-border);
            box-shadow: var(--shadow-lg);
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          .miespacio-name {
            font-family: var(--font-serif);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--brand-text);
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--brand-border);
          }
          .miespacio-sub {
            font-size: 0.75rem;
            color: var(--brand-text);
            opacity: 0.5;
            margin-top: -1rem;
          }
          .miespacio-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          @media (min-width: 768px) {
            .miespacio-grid { grid-template-columns: 1fr 1fr; }
          }
          .miespacio-full {
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }
          .miespacio-label {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--brand-text);
            opacity: 0.6;
          }
          .miespacio-textarea {
            background: var(--brand-bg);
            color: var(--brand-text);
            padding: 0.9rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--brand-border);
            outline: none;
            font-family: inherit;
            font-size: 0.95rem;
            resize: vertical;
          }
          .miespacio-textarea:focus {
            border-color: var(--brand-primary);
            box-shadow: 0 0 0 3px rgba(91, 138, 114, 0.15);
          }
        `}</style>
      </div>
    </>
  );
}