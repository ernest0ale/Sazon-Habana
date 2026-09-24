'use client';

import { useEffect, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

/**
 * DeleteAccountModal - Modal para eliminar cuenta con confirmación
 *
 * Props:
 *   open (bool)
 *   onClose (fn)
 *   onConfirm (async fn: () => { ok, error? })
 */
export default function DeleteAccountModal({ open, onClose, onConfirm }) {
  const toast = useToast();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmText('');
      setError('');
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

  const handleConfirm = async () => {
    if (confirmText.trim() !== 'ELIMINAR') {
      setError('Debes escribir exactamente "ELIMINAR".');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await onConfirm();
      if (res?.ok) {
        toast.info('Cuenta en Gracia', 'Se eliminará en 14 días.');
        onClose();
      } else {
        toast.error('Error', res?.error || 'No se pudo procesar la solicitud.');
      }
    } catch {
      toast.error('Error', 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="del-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Eliminar cuenta"
    >
      <div className="del-modal-card">
        <div className="del-modal-header">
          <h4 className="del-modal-title">¿Eliminar tu cuenta?</h4>
          <button
            type="button"
            className="del-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <p className="del-modal-warning">
          Tendrás 14 días para cancelar esta acción. Pasado ese tiempo, tus datos se
          eliminarán permanentemente.
        </p>

        <Input
          id="m-del-confirm"
          type="text"
          placeholder="Escribe ELIMINAR"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          error={error}
        />

        <div className="del-modal-actions">
          <Button variant="ghost" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .del-modal-overlay {
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

        .del-modal-card {
          background: var(--brand-card);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          max-width: 28rem;
          width: 100%;
          border: 1px solid var(--brand-border);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .del-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .del-modal-title {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 700;
          color: #dc3545;
        }

        .del-modal-close {
          font-size: 1.25rem;
          color: var(--brand-text);
          opacity: 0.6;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }
        .del-modal-close:hover {
          opacity: 1;
          color: var(--brand-primary);
        }

        .del-modal-warning {
          font-size: 0.8rem;
          color: var(--brand-text);
          opacity: 0.8;
          line-height: 1.5;
        }

        .del-modal-actions {
          display: flex;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
}