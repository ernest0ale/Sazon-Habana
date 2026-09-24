'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { validatePassword, validatePasswordMatch } from '@/lib/security/validators';

/**
 * ChangePasswordModal - Modal para cambiar contraseña
 *
 * Props:
 *   open (bool)
 *   onClose (fn)
 *   onSubmit (async fn: (oldPass, newPass) => { ok, error? })
 */
export default function ChangePasswordModal({ open, onClose, onSubmit }) {
  const toast = useToast();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!oldPass) newErrors.oldPass = 'Ingresa tu contraseña actual.';

    const vPass = validatePassword(newPass, { minLength: 8 });
    if (!vPass.ok) newErrors.newPass = vPass.errors[0];

    const vMatch = validatePasswordMatch(newPass, confirmPass);
    if (!vMatch.ok) newErrors.confirmPass = vMatch.errors[0];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await onSubmit(oldPass, newPass);
      if (res?.ok) {
        toast.success('Contraseña actualizada', 'Tu contraseña ha sido cambiada.');
        onClose();
      } else {
        toast.error('Error', res?.error || 'No se pudo cambiar la contraseña.');
      }
    } catch {
      toast.error('Error', 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="cp-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Cambiar contraseña"
    >
      <form className="cp-modal-card" onSubmit={handleSubmit}>
        <div className="cp-modal-header">
          <h4 className="cp-modal-title">Cambiar Contraseña</h4>
          <button
            type="button"
            className="cp-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cp-modal-body">
          <Input
            id="m-old-pass"
            type="password"
            label="Contraseña actual"
            placeholder="••••••••"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            error={errors.oldPass}
            showPasswordToggle
            autoComplete="current-password"
          />

          <Input
            id="m-new-pass"
            type="password"
            label="Nueva contraseña"
            placeholder="Mínimo 8 caracteres"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            error={errors.newPass}
            showPasswordToggle
            autoComplete="new-password"
          />

          <Input
            id="m-confirm-pass"
            type="password"
            label="Confirmar contraseña"
            placeholder="Repite la nueva contraseña"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            error={errors.confirmPass}
            showPasswordToggle
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </Button>
      </form>

      <style jsx>{`
        .cp-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cp-modal-card {
          background: var(--brand-card);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          max-width: 24rem;
          width: 100%;
          border: 1px solid var(--brand-border);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cp-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cp-modal-title {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--brand-text);
        }

        .cp-modal-close {
          font-size: 1.25rem;
          color: var(--brand-text);
          opacity: 0.6;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }
        .cp-modal-close:hover {
          opacity: 1;
          color: var(--brand-primary);
        }

        .cp-modal-body {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
}