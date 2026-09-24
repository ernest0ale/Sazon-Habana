import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/session';
import { validateResenaForm } from '@/lib/validators/resena.validator';
import { sanitizeText } from '@/lib/security/sanitize';
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
    .select('id, nombre, estado')
    .eq('id', payload.userId)
    .maybeSingle();

  if (!data || data.estado !== 'activo') return null;
  return data;
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse('No autenticado.', 401);

    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    const clean = {
      restauranteId: body.restauranteId,
      puntuacion: parseInt(body.puntuacion, 10),
      texto: sanitizeText(body.texto, { maxLength: 1000 })
    };

    const v = validateResenaForm(clean);
    if (!v.ok) return errorResponse(v.errors[0], 400);

    const admin = createAdminSupabaseClient();
    const { data, error } = await admin
      .from('resenas')
      .insert({
        restaurante_id: clean.restauranteId,
        usuario_id: user.id,
        nombre_usuario: user.nombre,
        puntuacion: clean.puntuacion,
        texto: clean.texto
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return errorResponse('Ya has reseñado este restaurante.', 409);
      }
      return errorResponse('No se pudo guardar la reseña.', 500);
    }

    return applySecurityHeaders(NextResponse.json({ ok: true, resena: data }));
  } catch (err) {
    console.error('[resenas POST]', err);
    return errorResponse('Error interno.', 500);
  }
}