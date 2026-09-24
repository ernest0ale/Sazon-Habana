/**
 * ============================================
 * AUTH-GUARD.JS - Verificación de sesión reutilizable
 * ============================================
 * Valida:
 * - Cookie de sesión presente
 * - JWT válido y no expirado
 * - Usuario existe y está activo
 * - tokenVersion coincide (invalida sesiones tras cambio de contraseña)
 */

import { cookies } from 'next/headers';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifySessionToken, SESSION_COOKIE_NAME } from './session';

export async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const admin = createAdminSupabaseClient();
  const { data: usuario } = await admin
    .from('usuarios')
    .select(
      'id, nombre, email, telefono, rol, estado, preferencias, color_primario, restaurante_id, token_version'
    )
    .eq('id', payload.userId)
    .maybeSingle();

  if (!usuario || usuario.estado !== 'activo') return null;
  if ((usuario.token_version || 0) !== (payload.tokenVersion || 0)) return null;

  return usuario;
}

export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.rol !== 'admin') return null;
  return user;
}