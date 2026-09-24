'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/layout/PageTitle';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import VerificationCodeInput from '@/components/ui/VerificationCodeInput';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { validateRegisterForm } from '@/lib/validators/auth.validator';

const PREFERENCIAS = [
  { key: 'criolla', icon: 'fa-solid fa-utensils', label: 'Criolla' },
  { key: 'rápida', icon: 'fa-solid fa-burger', label: 'Rápida' },
  { key: 'italiana', icon: 'fa-solid fa-pizza-slice', label: 'Italiana' },
  { key: 'mariscos', icon: 'fa-solid fa-fish', label: 'Mariscos' },
  { key: 'cafetería', icon: 'fa-solid fa-mug-hot', label: 'Cafetería' },
  { key: 'heladería', icon: 'fa-solid fa-ice-cream', label: 'Heladería' },
  { key: 'dulcería', icon: 'fa-solid fa-cake-candles', label: 'Dulcería' }
];

export default function RegistroPage() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: 'casual'
  });
  const [prefs, setPrefs] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Estado para flujo de verificación
  const [verifyMode, setVerifyMode] = useState(false);
  const [segundosIniciales, setSegundosIniciales] = useState(0);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const togglePref = (key) => {
    setPrefs((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const v = validateRegisterForm(form);
    if (!v.ok) {
      setErrors({ general: v.errors[0] });
      return;
    }

    setLoading(true);
    try {
      // 1. Enviar código de verificación al email
      const sendRes = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          tipo: 'registro',
          reenvio: false
        })
      });
      const sendData = await sendRes.json();

      if (!sendRes.ok) {
        setErrors({ general: sendData.error || 'No se pudo enviar el código.' });
        return;
      }

      setSegundosIniciales(sendData.segundosRestantes || 0);
      setVerifyMode(true);
    } catch {
      setErrors({ general: 'Error al conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta cuando el código es verificado correctamente
  const handleVerified = async () => {
    // Ahora sí creamos la cuenta
    try {
      const res = await register({
        ...form,
        telefono: form.telefono.trim() || null,
        preferencias: prefs      });
      if (res.ok) {
        toast.success('Registro Exitoso', 'Tu cuenta ha sido creada.');
        router.push('/');
      } else {
        toast.error('Error', res.error || 'No se pudo completar el registro.');
      }
    } catch {
      toast.error('Error', 'Error al crear la cuenta.');
    }
  };

  if (verifyMode) {
    return (
      <>
        <PageTitle title="Verifica tu correo" />
        <div className="auth-card">
          <VerificationCodeInput
            email={form.email}
            tipo="registro"
            onVerified={handleVerified}
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
      <PageTitle title="Registro" />

      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <h1 className="auth-title">Crea tu Cuenta</h1>
          <p className="auth-subtitle">Regístrate para calificar restaurantes y más.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            id="reg-nombre"
            type="text"
            label="Nombre Completo"
            value={form.nombre}
            onChange={(e) => update('nombre', e.target.value)}
            required
            maxLength={120}
            autoComplete="name"
          />

          <div className="auth-grid-2">
            <Input
              id="reg-email"
              type="email"
              label="Correo"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="reg-telefono"
              type="tel"
              label="Teléfono"
              placeholder="5XXXXXXX"
              value={form.telefono}
              onChange={(e) =>
                update('telefono', e.target.value.replace(/\D/g, '').slice(0, 8))
              }
              maxLength={8}
              autoComplete="tel"
            />
          </div>

          <Input
            id="reg-password"
            type="password"
            label="Contraseña"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            showPasswordToggle
            autoComplete="new-password"
            help="Mínimo 8 caracteres, mayúscula, minúscula, número y especial."
            required
          />

          <Input
            id="reg-confirm-password"
            type="password"
            label="Confirmar Contraseña"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            showPasswordToggle
            autoComplete="new-password"
            required
          />

          <div className="auth-prefs">
            <p className="auth-prefs-label">Preferencias de Comida</p>
            <div className="auth-prefs-grid">
              {PREFERENCIAS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`auth-pref-chip ${prefs.includes(p.key) ? 'is-active' : ''}`}
                  onClick={() => togglePref(p.key)}
                >
                  <i className={p.icon} /> {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="auth-role">
            <p className="auth-prefs-label">Tipo de Cuenta</p>
            <div className="auth-role-grid">
              <label className={`auth-role-option ${form.rol === 'casual' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="reg-rol"
                  value="casual"
                  checked={form.rol === 'casual'}
                  onChange={() => update('rol', 'casual')}
                />
                Usuario Casual
              </label>
              <label className={`auth-role-option ${form.rol === 'gestor' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="reg-rol"
                  value="gestor"
                  checked={form.rol === 'gestor'}
                  onChange={() => update('rol', 'gestor')}
                />
                Gestor Restaurante
              </label>
            </div>
          </div>

          {errors.general && <p className="auth-error">{errors.general}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Enviando código...' : 'Registrarse'}
          </Button>
        </form>

        <div className="auth-footer">
          <Link href="/login" className="auth-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>

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
          max-width: 32rem;
          margin: 0 auto;
        }
        .auth-card--wide { max-width: 36rem; }
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
        .auth-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .auth-grid-2 { grid-template-columns: 1fr 1fr; }
        }
        .auth-prefs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 0.5rem;
        }
        .auth-prefs-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--brand-text);
          opacity: 0.6;
        }
        .auth-prefs-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .auth-pref-chip {
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--brand-border);
          background: var(--brand-bg);
          color: var(--brand-text);
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .auth-pref-chip:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }
        .auth-pref-chip.is-active {
          background: var(--brand-primary);
          color: #ffffff;
          border-color: var(--brand-primary);
        }
        .auth-role {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--brand-border);
        }
        .auth-role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .auth-role-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--brand-bg);
          border: 1px solid rgba(200, 214, 192, 0.4);
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 0.75rem;
          color: var(--brand-text);
          transition: all 0.2s ease;
        }
        .auth-role-option.is-active {
          border-color: var(--brand-primary);
          background: rgba(91, 138, 114, 0.08);
        }
        .auth-role-option input[type="radio"] {
          accent-color: var(--brand-primary);
          cursor: pointer;
        }
        .auth-error {
          color: #dc3545;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .auth-footer {
          text-align: center;
        }
        .auth-link {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--brand-primary);
          text-decoration: none;
        }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </>
  );
}