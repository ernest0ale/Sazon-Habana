import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/session';
import { hashPassword, verifyPassword } from '@/lib/security/password';
import { validatePassword } from '@/lib/security/validators';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return errorResponse('No autenticado.', 401);

    const payload = await verifySessionToken(token);
    if (!payload) return errorResponse('Sesión inválida.', 401);

    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    const { oldPass, newPass } = body;

    const admin = createAdminSupabaseClient();
    const { data: user } = await admin
      .from('usuarios')
      .select('password_hash')
      .eq('id', payload.userId)
      .single();

    if (!user) return errorResponse('Usuario no encontrado.', 404);

    const valid = await verifyPassword(oldPass, user.password_hash);
    if (!valid) return errorResponse('Contraseña actual incorrecta.', 401);

    const v = validatePassword(newPass, { minLength: 8 });
    if (!v.ok) return errorResponse(v.errors[0], 400);

    const newHash = await hashPassword(newPass);
    const { error } = await admin
      .from('usuarios')
      .update({ password_hash: newHash })
      .eq('id', payload.userId);

    if (error) return errorResponse('No se pudo actualizar la contraseña.', 500);

    return applySecurityHeaders(NextResponse.json({ ok: true }));
  } catch (err) {
    console.error('[perfil password]', err);
    return errorResponse('Error interno.', 500);
  }
}