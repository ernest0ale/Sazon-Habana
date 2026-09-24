'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';

/**
 * ShareModal - Modal de compartir en dos pasos
 *
 * Paso 1: elegir "Compartir enlace" o "Compartir detalles"
 * Paso 2: elegir red social (copiar, Facebook, WhatsApp, Telegram)
 *
 * Props:
 *   restaurante (object)
 *   open (bool)
 *   onClose (fn)
 */

const TIPO_ICONS = {
  criolla: '🍛',
  rápida: '🍔',
  italiana: '🍕',
  mariscos: '🦞',
  cafetería: '☕',
  heladería: '🍦',
  dulcería: '🍰'
};

export default function ShareModal({ restaurante, open, onClose }) {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [shareType, setShareType] = useState(null); // 'enlace' | 'detalles'

  useEffect(() => {
    if (open) {
      setStep(1);
      setShareType(null);
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

  if (!open || !restaurante) return null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/espacios/${restaurante.id}`
    : '';

  const generarTextoDetalles = () => {
    const lines = [];
    const emoji = TIPO_ICONS[restaurante.tipo] || '🍽️';
    lines.push(`${emoji} ${restaurante.nombre}`);
    lines.push('');
    if (restaurante.descripcion) {
      lines.push(restaurante.descripcion);
      lines.push('');
    }
    lines.push(`📍 ${restaurante.direccion}`);
    lines.push(`📆 ${restaurante.municipio}`);
    lines.push(`🕐 ${restaurante.horario}`);
    lines.push(`📞 ${restaurante.telefono}`);
    lines.push(restaurante.aire ? '🌳 Terraza disponible' : '🏠 Bajo techo');
    if (restaurante.clima) lines.push('❄️ Climatizado');
    if (restaurante.parqueo) lines.push('🅿️ Parqueo privado');
    const platos = restaurante.platos_populares || restaurante.platosPopulares;
    if (platos?.length > 0) {
      lines.push('');
      lines.push(`🌟 Especialidades: ${platos.map((p) => p.nombre).join(', ')}`);
    }
    lines.push('');
    lines.push(`🔗 Más información: ${shareUrl}`);
    return lines.join('\n');
  };

  const handleShare = async (red) => {
    const texto = shareType === 'enlace'
      ? `🍽️ Restaurante en Sazón Habana: ${shareUrl}`
      : generarTextoDetalles();

    if (red === 'copy') {
      try {
        await navigator.clipboard.writeText(texto);
        toast.success('✅ Contenido copiado al portapapeles');
      } catch {
        toast.error('No se pudo copiar');
      }
      onClose();
      return;
    }

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(texto.substring(0, 500))}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(texto.substring(0, 200))}`
    };

    if (urls[red]) {
      window.open(urls[red], '_blank', 'width=600,height=400');
      onClose();
    }
  };

  return (
    <div
      className="share-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Compartir"
    >
      <div className="share-modal-card">
        {step === 1 ? (
          <>
            <h3 className="share-modal-title">
              <i className="fa-regular fa-share-from-square" /> Compartir
            </h3>
            <p className="share-modal-subtitle">{restaurante.nombre}</p>

            <button
              type="button"
              className="share-btn share-btn--primary"
              onClick={() => { setShareType('enlace'); setStep(2); }}
            >
              <i className="fa-solid fa-link" /> Compartir enlace
            </button>

            <button
              type="button"
              className="share-btn share-btn--success"
              onClick={() => { setShareType('detalles'); setStep(2); }}
            >
              <i className="fa-solid fa-info-circle" /> Compartir detalles
            </button>

            <button
              type="button"
              className="share-btn share-btn--cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <h3 className="share-modal-title">
              {shareType === 'enlace' ? 'Compartir enlace' : 'Compartir detalles'}
            </h3>
            <p className="share-modal-subtitle">Elige cómo quieres compartir</p>

            <div className="share-icons-row">
              <button
                type="button"
                className="share-icon-btn share-icon-btn--copy"
                onClick={() => handleShare('copy')}
                aria-label="Copiar al portapapeles"
                title="Copiar"
              >
                <i className="fa-regular fa-clipboard" />
              </button>

              <button
                type="button"
                className="share-icon-btn share-icon-btn--facebook"
                onClick={() => handleShare('facebook')}
                aria-label="Compartir en Facebook"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f" />
              </button>

              <button
                type="button"
                className="share-icon-btn share-icon-btn--whatsapp"
                onClick={() => handleShare('whatsapp')}
                aria-label="Compartir en WhatsApp"
                title="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp" />
              </button>

              <button
                type="button"
                className="share-icon-btn share-icon-btn--telegram"
                onClick={() => handleShare('telegram')}
                aria-label="Compartir en Telegram"
                title="Telegram"
              >
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>

            <button
              type="button"
              className="share-btn share-btn--back"
              onClick={() => setStep(1)}
            >
              ← Volver
            </button>

            <button
              type="button"
              className="share-btn share-btn--cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .share-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 10001;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
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

        .share-modal-card {
          background: var(--brand-card);
          border-radius: var(--radius-xl);
          padding: 2rem;
          width: 90%;
          max-width: 380px;
          text-align: center;
          border: 1px solid var(--brand-border);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .share-modal-title {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--brand-text);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .share-modal-title :global(i) {
          color: var(--brand-primary);
        }

        .share-modal-subtitle {
          font-size: 0.85rem;
          color: var(--brand-text);
          opacity: 0.7;
          margin-bottom: 1rem;
        }

        .share-btn {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          color: #ffffff;
        }
        .share-btn:hover {
          transform: scale(1.02);
        }

        .share-btn--primary {
          background: var(--brand-primary);
        }
        .share-btn--primary:hover {
          background: var(--brand-hover);
        }

        .share-btn--success {
          background: #2ecc71;
          margin-bottom: 0.5rem;
        }
        .share-btn--success:hover {
          background: #27ae60;
        }

        .share-btn--back {
          background: #7f8c8d;
          margin-bottom: 0.5rem;
        }
        .share-btn--back:hover {
          background: #6c7a7b;
        }

        .share-btn--cancel {
          background: transparent;
          color: var(--brand-text);
          border: 1px solid var(--brand-border);
        }
        .share-btn--cancel:hover {
          background: var(--brand-bg);
          transform: none;
        }

        .share-icons-row {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          margin: 1rem 0;
          flex-wrap: wrap;
        }

        .share-icon-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          color: #ffffff;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .share-icon-btn:hover {
          transform: scale(1.1);
        }

        .share-icon-btn--copy { background: #3498db; }
        .share-icon-btn--facebook { background: #1877f2; }
        .share-icon-btn--whatsapp { background: #25d366; }
        .share-icon-btn--telegram { background: #0088cc; }
      `}</style>
    </div>
  );
}