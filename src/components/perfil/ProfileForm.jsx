'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { sanitizeName, sanitizePhone } from '@/lib/security/sanitize';
import { validateName, validatePhoneCU } from '@/lib/security/validators';

/**
 * ProfileForm - Formulario de datos personales del usuario
 *
 * Props:
 *   profile (object con { nombre, email, telefono })
 *   onSaved (fn opcional)
 */
export default function ProfileForm({ profile, onSaved }) {
  const { user, refreshProfile } = useAuth();
  const toast = useToast();

  const [nombre, setNombre] = useState(profile?.nombre || '');
  const [telefono, setTelefono] = useState(profile?.telefono || '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const cleanNombre = sanitizeName(nombre);
    const vName = validateName(cleanNombre, { fieldName: 'Nombre' });
    if (!vName.ok) newErrors.nombre = vName.errors[0];

    if (telefono && telefono.trim() !== '') {
      const cleanPhone = sanitizePhone(telefono);
      const vPhone = validatePhoneCU(cleanPhone);
      if (!vPhone.ok) newErrors.telefono = vPhone.errors[0];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nombre: cleanNombre,
          telefono: sanitizePhone(telefono)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error('Error', data.error || 'No se pudo actualizar el perfil.');
      } else {
        toast.success('Perfil Actualizado', 'Cambios guardados.');
        await refreshProfile();
        onSaved?.();
      }
    } catch {
      toast.error('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-form-card">
      <h3 className="profile-form-title">
        <i className="fa-regular fa-id-card profile-form-icon" />
        Datos Personales
      </h3>

      <form className="profile-form" onSubmit={handleSubmit}>
        <Input
          id="prof-nombre"
          type="text"
          label="Nombre Completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          error={errors.nombre}
          autoComplete="name"
          maxLength={120}
        />

        <Input
          id="prof-email"
          type="email"
          label="Correo Electrónico"
          value={profile?.email || user?.email || ''}
          disabled
          help="El correo no se puede cambiar."
        />

        <Input
          id="prof-telefono"
          type="tel"
          label="Teléfono"
          placeholder="5XXXXXXX"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          error={errors.telefono}
          maxLength={8}
          autoComplete="tel"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="md"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>

      <style jsx>{`
        .profile-form-card {
          background: var(--brand-card);
          padding: 1.5rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--brand-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .profile-form-title {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          border-bottom: 1px solid var(--brand-border);
          padding-bottom: 0.5rem;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .profile-form-icon {
          color: var(--brand-primary);
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}