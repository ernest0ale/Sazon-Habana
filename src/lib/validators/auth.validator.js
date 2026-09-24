/**
 * ============================================
 * AUTH.VALIDATOR.JS - Validación específica de autenticación
 * ============================================
 * Envuelve los validadores base para los flujos concretos de auth.
 */

import {
  validateLoginPayload,
  validateRegisterPayload,
  validateEmail,
  validatePassword,
  validateName,
  validatePhoneCU
} from '@/lib/security/validators';

/**
 * Valida el formulario de login.
 * Acepta email o teléfono como identificador.
 */
export function validateLoginForm({ identificador, password }) {
  const errors = [];

  if (!identificador || identificador.trim() === '') {
    errors.push('El correo o teléfono es obligatorio.');
  } else {
    const ident = identificador.trim();
    const isEmail = ident.includes('@');
    const isPhone = /^\d{8}$/.test(ident.replace(/\D/g, ''));

    if (!isEmail && !isPhone) {
      errors.push('Ingresa un correo o teléfono cubano válido (8 dígitos).');
    }
  }

  if (!password || password.length < 1) {
    errors.push('La contraseña es obligatoria.');
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Valida el formulario de registro completo.
 */
export function validateRegisterForm(data) {
  return validateRegisterPayload({
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    password: data.password,
    confirmPassword: data.confirmPassword,
    rol: data.rol || 'casual'
  });
}

export function validateChangePasswordForm({ oldPass, newPass, confirmPass }) {
  const errors = [];

  if (!oldPass) errors.push('La contraseña actual es obligatoria.');

  const vNew = validatePassword(newPass, { minLength: 8 });
  if (!vNew.ok) errors.push(...vNew.errors);

  if (newPass !== confirmPass) {
    errors.push('Las contraseñas no coinciden.');
  }

  return { ok: errors.length === 0, errors };
}