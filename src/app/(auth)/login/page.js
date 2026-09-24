'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AccountDisabledModal from '@/components/modals/AccountDisabledModal';
import VerificationCodeInput from '@/components/ui/VerificationCodeInput';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { validateLoginForm } from '@/lib/validators/auth.validator';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();

  const redirect = searchParams.get('redirect') || '/';

  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Estado para cuenta deshabilitada
  const [disabledData, setDisabledData] = useState(null);
  const [emailRecuperacion, setEmailRecuperacion] = useState('');
  const [reactivarMode, setReactivarMode] = useState(false);
  const [segundosIniciales, setSegundosIniciales] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const v = validateLoginForm({ identificador, password });
    if (!v.ok) {
      setErrors({ general: v.errors[0] });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador: identificador.trim(), password })
      });
      const data = await res.json();

      if (data.disabled) {
        setDisabledData({
          usuario: data.usuario,
          diasRestantes: data.diasRestantes
        });
        return;
      }

      if (!res.ok) {
        setErrors({ general: data.error || 'Credenciales incorrectas.' });
        return;
      }

      await login(identificador.trim(), password);
      toast.success('Bienvenido', 'Has iniciado sesión correctamente.');
      router.push(redirect);
    } catch {
      setErrors({ general: 'Error al conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarCuenta = async () => {
    const email = disabledData.usuario.email;

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tipo: 'reactivar_cuenta',
          reenvio: false
        })
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error('Error', data.error || 'No se pudo enviar el código.');
        return;
      }

      setEmailRecuperacion(email);
      setSegundosIniciales(data.segundosRestantes || 0);
      setDisabledData(null);
      setReactivarMode(true);
    } catch {
      toast.error('Error', 'No se pudo enviar el código.');
    }
  };

  const handleReactivado = async () => {
    toast.success('Cuenta reactivada', 'Bienvenido de vuelta.');
    router.push('/');
  };

  if (reactivarMode) {
    return (
      <>
        <PageTitle title="Reactivar Cuenta" />
        <div className="auth-card">
          <VerificationCodeInput
            email={emailRecuperacion}
            tipo="reactivar_cuenta"
            onVerified={handleReactivado}
            segundosIniciales={segundosIniciales}
          />
        </div>
        <style jsx>{`
          .auth-card {
            background: var(--brand-card);
            border-radius: var(--radius-xl);
            padding: 2rem;
            border: 1px solid var(--brand-border);
            box-shadow: var(--shadow-xl);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Iniciar Sesión" />

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">Bienvenido de vuelta a Sazón Habana.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            id="login-id"
            type="text"
            label="Correo o Teléfono"
            placeholder="correo@ejemplo.com o 5XXXXXXX"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            autoComplete="username"
            required
          />

          <Input
            id="login-password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            autoComplete="current-password"
            required
          />

          {errors.general && <p className="auth-error">{errors.general}</p>}

          <Button type="submit" variant="outline" fullWidth disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="auth-divider">
          <span>¿No tienes cuenta?</span>
        </div>

        <Link href="/registro" className="auth-register-btn">
          Registrarse
        </Link>
      </div>

      <AccountDisabledModal
        open={!!disabledData}
        usuario={disabledData?.usuario}
        diasRestantes={disabledData?.diasRestantes}
        onRecuperar={handleRecuperarCuenta}
      />

      <style jsx>{`
        .auth-card {
          background: var(--brand-card);
          border-radius: var(--radius-xl);
          padding: 2rem;
          border: 1px solid var(--brand-border);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .auth-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .auth-title {
          font-family: var(--font-serif);
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--brand-text);
        }
        .auth-subtitle {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.6;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-error {
          color: #dc3545;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-top: 1px solid var(--brand-border);
        }
        .auth-divider span {
          font-size: 0.75rem;
          color: var(--brand-text);
          opacity: 0.5;
        }
        .auth-register-btn {
          display: block;
          width: 100%;
          padding: 0.875rem 1.5rem;
          background: var(--brand-primary);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .auth-register-btn:hover {
          background: var(--brand-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(91, 138, 114, 0.3);
        }
      `}</style>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="spinner" />}>
      <LoginContent />
    </Suspense>
  );
}