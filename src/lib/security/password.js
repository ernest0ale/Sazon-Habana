/**
 * ============================================
 * PASSWORD.JS - Hash y verificación de contraseñas
 * ============================================
 * Usa bcryptjs (única dependencia de seguridad externa).
 * NO implementar bcrypt a mano: es un error crítico.
 */

import bcrypt from 'bcryptjs';

const COST = 12; // cost factor: 2^12 iteraciones (~250ms en hardware moderno)

/**
 * Hashea una contraseña.
 */
export async function hashPassword(plain) {
  if (!plain || typeof plain !== 'string') {
    throw new Error('Password inválido.');
  }
  const salt = await bcrypt.genSalt(COST);
  return bcrypt.hash(plain, salt);
}

/**
 * Verifica una contraseña contra su hash.
 * bcrypt ya hace comparación en tiempo constante.
 */
export async function verifyPassword(plain, hash) {
  if (!plain || !hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/**
 * Rehash si el cost cambió (útil para migraciones).
 */
export function needsRehash(hash) {
  if (!hash) return true;
  try {
    const rounds = bcrypt.getRounds(hash);
    return rounds < COST;
  } catch {
    return true;
  }
}