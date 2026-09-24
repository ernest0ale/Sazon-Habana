/**
 * ============================================
 * RESENA.VALIDATOR.JS
 * ============================================
 */

import { validateResenaPayload } from '@/lib/security/validators';

export function validateResenaForm({ restauranteId, puntuacion, texto }) {
  return validateResenaPayload({ restauranteId, puntuacion, texto });
}

export function validateResenaUpdate({ texto }) {
  const errors = [];

  if (!texto || texto.trim().length < 3) {
    errors.push('El texto debe tener al menos 3 caracteres.');
  }
  if (texto && texto.length > 1000) {
    errors.push('El texto no puede superar 1000 caracteres.');
  }

  return { ok: errors.length === 0, errors };
}