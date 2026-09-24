import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/session';
import { validateName, validatePhoneCU } from '@/lib/security/validators';
import { sanitizeName, sanitizePhone } from '@/lib/security/sanitize';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const admin = createAdminSupabaseClient();
  const { data: usuario } = await admin
    .from('usuarios')
    .select('*')
    .eq('id', payload.userId)
    .maybeSingle();

  if (!usuario || usuario.estado !== 'activo') return null;
  return usuario;
}

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse('No autenticado.', 401);

    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Payload inválido.', 400);

    const cleanNombre = sanitizeName(body.nombre);
    const cleanTelefono = body.telefono ? sanitizePhone(body.telefono) : null;

    const vName = validateName(cleanNombre);
    if (!vName.ok) return errorResponse(vName.errors[0], 400);

    if (cleanTelefono) {
      const vPhone = validatePhoneCU(cleanTelefono);
      if (!vPhone.ok) return errorResponse(vPhone.errors[0], 400);
    }

    const admin = createAdminSupabaseClient();
    const { data, error } = await admin
      .from('usuarios')
      .update({
        nombre: cleanNombre,
        telefono: cleanTelefono
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) return errorResponse('No se pudo actualizar.', 500);

    return applySecurityHeaders(
      NextResponse.json({
        ok: true,
        usuario: {
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          rol: data.rol
        }
      })
    );
  } catch (err) {
    console.error('[perfil PUT]', err);
    return errorResponse('Error interno.', 500);
  }
}

export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) return errorResponse('No autenticado.', 401);

    const admin = createAdminSupabaseClient();
    await admin
      .from('usuarios')
      .update({ estado: 'eliminado_pendiente' })
      .eq('id', user.id);

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
    return applySecurityHeaders(res);
  } catch (err) {
    console.error('[perfil DELETE]', err);
    return errorResponse('Error interno.', 500);
  }
}