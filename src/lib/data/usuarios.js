/**
 * ============================================
 * USUARIOS.JS - Acceso a datos de usuarios
 * ============================================
 * SOLO funciona en el servidor con SERVICE_ROLE (bypassa RLS).
 * Para operaciones cliente, usar supabase-client con RLS.
 */

import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';

/**
 * Devuelve un usuario por ID (con perfil completo).
 * Usa SERVICE_ROLE → solo desde API routes.
 */
export async function getUsuarioById(id) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

/**
 * Devuelve un usuario por email o teléfono (para login).
 */
export async function getUsuarioByIdentificador(identificador) {
  const admin = createAdminSupabaseClient();
  const clean = String(identificador).trim().toLowerCase();

  const { data, error } = await admin
    .from('usuarios')
    .select('*')
    .or(`email.eq.${clean},telefono.eq.${clean}`)
    .maybeSingle();

  if (error) return null;
  return data;
}

export async function crearUsuario(usuario) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from('usuarios')
    .insert(usuario)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarUsuario(id, cambios) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from('usuarios')
    .update({ ...cambios, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listarUsuarios() {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from('usuarios')
    .select('id, nombre, email, telefono, rol, estado, color_primario, restaurante_id, created_at');

  if (error) return [];
  return data || [];
}