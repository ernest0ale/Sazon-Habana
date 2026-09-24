/**
 * ============================================
 * SOLICITUDES.JS - Acceso a datos de solicitudes
 * ============================================
 * Operaciones desde servidor (SERVICE_ROLE).
 */

import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';

export async function getSolicitudes() {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from('solicitudes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getSolicitudById(id) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from('solicitudes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function crearSolicitud(solicitud) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from('solicitudes')
    .insert(solicitud)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function eliminarSolicitud(id) {
  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from('solicitudes')
    .delete()
    .eq('id', id);

  if (error) return false;
  return true;
}

/**
 * Aprueba una solicitud:
 * - Crea el restaurante
 * - Crea el usuario gestor vinculado
 * - Elimina la solicitud
 *
 * Todo atómico vía función RPC de Supabase.
 */
export async function aprobarSolicitud(id) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.rpc('aprobar_solicitud', {
    p_solicitud_id: id
  });

  if (error) throw error;
  return data;
}

export async function rechazarSolicitud(id) {
  return eliminarSolicitud(id);
}