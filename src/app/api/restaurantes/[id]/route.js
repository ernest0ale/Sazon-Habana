import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/session';
import { validateRestauranteUpdate } from '@/lib/validators/restaurante.validator';
import { sanitizeText, sanitizePhone } from '@/lib/security/sanitize';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const admin = createAdminSupabaseClient();
  const { data } = await admin
    .from('usuarios')
    .select('id, rol, restaurante_id, estado')
    .eq('id', payload.userId)
    .maybeSingle();

  if (!data || data.estado !== 'activo') return null;
  return data;
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse('No autenticado.', 401);

    const { id } = params;

    // Solo admin o el gestor dueño del restaurante
    if (user.rol !== 'admin' && user.restaurante_id !== id) {
      return errorResponse('No autorizado.', 403);
    }

    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    const clean = {};
    if (body.nombre !== undefined) clean.nombre = sanitizeText(body.nombre, { maxLength: 120 });
    if (body.horario !== undefined) clean.horario = sanitizeText(body.horario, { maxLength: 500 });
    if (body.descripcion !== undefined) clean.descripcion = sanitizeText(body.descripcion, { maxLength: 2000 });
    if (body.telefono !== undefined) clean.telefono = sanitizePhone(body.telefono);
    if (body.direccion !== undefined) clean.direccion = sanitizeText(body.direccion, { maxLength: 250 });

    const v = validateRestauranteUpdate(clean);
    if (!v.ok) return errorResponse(v.errors[0], 400);

    const admin = createAdminSupabaseClient();
    const { data, error } = await admin
      .from('restaurantes')
      .update(clean)
      .eq('id', id)
      .select()
      .single();

    if (error) return errorResponse('No se pudo actualizar.', 500);

    return applySecurityHeaders(NextResponse.json({ ok: true, restaurante: data }));
  } catch (err) {
    console.error('[restaurantes PUT]', err);
    return errorResponse('Error interno.', 500);
  }
}