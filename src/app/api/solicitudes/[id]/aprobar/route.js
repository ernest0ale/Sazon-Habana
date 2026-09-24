import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/session';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

async function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const admin = createAdminSupabaseClient();
  const { data } = await admin
    .from('usuarios')
    .select('rol, estado')
    .eq('id', payload.userId)
    .maybeSingle();

  if (!data || data.estado !== 'activo' || data.rol !== 'admin') return null;
  return data;
}

export async function POST(request, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) return errorResponse('No autorizado.', 403);

    const { id } = params;

    const client = createAdminSupabaseClient();
    const { data, error } = await client.rpc('aprobar_solicitud', {
      p_solicitud_id: id
    });

    if (error) {
      console.error('[aprobar]', error);
      return errorResponse('No se pudo aprobar.', 500);
    }

    return applySecurityHeaders(NextResponse.json({ ok: true, ...data }));
  } catch (err) {
    console.error('[solicitudes aprobar]', err);
    return errorResponse('Error interno.', 500);
  }
}