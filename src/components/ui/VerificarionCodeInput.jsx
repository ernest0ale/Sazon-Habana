'use client';

import { useState, useEffect, useRef } from 'react';
import Button from './Button';

/**
 * VerificationCodeInput - Input de 6 dígitos + botón reenviar con cooldown
 *
 * Props:
 *   email (string)
 *   tipo ('registro' | 'recuperar_password' | 'reactivar_cuenta')
 *   onVerified (fn) — se llama cuando el código es válido
 *   segundosIniciales (number) — segundos que faltan para poder reenviar
 */
export default function VerificationCodeInput({
  email,
  tipo,
  onVerified,
  segundosIniciales = 0
}) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(segundosIniciales);
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef(null);

  // Countdown
  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const t = setInterval(() => {
      setSegundosRestantes((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [segundosRestantes]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formatTiempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    setError('');
    if (codigo.length !== 6) {
      setError('El código debe tener 6 dígitos.');
      return;
    }

    setVerificando(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tipo, codigo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código incorrecto.');
      onVerified?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setVerificando(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setEnviando(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tipo, reenvio: true })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo reenviar el código.');
      }

      setSegundosRestantes(data.segundosRestantes || 90);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const puedeReenviar = segundosRestantes <= 0 && !enviando;

  return (
    <div className="vci-wrapper">
      <div className="vci-header">
        <h3 className="vci-title">Verifica tu correo</h3>
        <p className="vci-subtitle">
          Enviamos un código a <strong>{email}</strong>
        </p>
      </div>

      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        className="vci-input"
        placeholder="000000"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={(e) => { if (e.key === 'Enter') handleVerify(); }}
      />

      {error && <p className="vci-error">{error}</p>}

      <Button
        variant="primary"
        fullWidth
        onClick={handleVerify}
        disabled={verificando || codigo.length !== 6}
      >
        {verificando ? 'Verificando...' : 'Verificar código'}
      </Button>

      <button
        type="button"
        className="vci-resend"
        onClick={handleResend}
        disabled={!puedeReenviar}
      >
        {segundosRestantes > 0
          ? `Volver a enviar ${formatTiempo(segundosRestantes)}`
          : 'Volver a enviar'}
      </button>

      <style jsx>{`
        .vci-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 0.5rem 0;
        }
        .vci-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .vci-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--brand-text);
        }
        .vci-subtitle {
          font-size: 0.85rem;
          color: var(--brand-text);
          opacity: 0.6;
        }
        .vci-subtitle :global(strong) {
          color: var(--brand-primary);
        }
        .vci-input {
          width: 100%;
          padding: 1rem;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-size: 2rem;
          letter-spacing: 0.5rem;
          font-weight: 700;
          background: var(--brand-bg);
          color: var(--brand-text);
          border: 2px solid var(--brand-border);
          border-radius: var(--radius-md);
          outline: none;
          transition: border-color 0.2s ease;
        }
        .vci-input:focus {
          border-color: var(--brand-primary);
        }
        .vci-input::placeholder {
          color: var(--brand-text);
          opacity: 0.2;
        }
        .vci-error {
          color: #dc3545;
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
        }
        .vci-resend {
          background: transparent;
          border: none;
          color: var(--brand-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem;
          transition: opacity 0.2s ease;
        }
        .vci-resend:hover:not(:disabled) {
          text-decoration: underline;
        }
        .vci-resend:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          color: var(--brand-text);
        }
      `}</style>
    </div>
  );
}