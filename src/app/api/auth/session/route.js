import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/security/session';
import { applySecurityHeaders } from '@/lib/security/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return applySecurityHeaders(
        NextResponse.json({ ok: false, usuario: null }, { status: 200 })
      );
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return applySecurityHeaders(
        NextResponse.json({ ok: false, usuario: null }, { status: 200 })
      );
    }

    const admin = createAdminSupabaseClient();
    const { data: usuario } = await admin
      .from('usuarios')
      .select('id, nombre, email, telefono, rol, estado, preferencias, color_primario, restaurante_id')
      .eq('id', payload.userId)
      .maybeSingle();

    if (!usuario || usuario.estado !== 'activo') {
      return applySecurityHeaders(
        NextResponse.json({ ok: false, usuario: null }, { status: 200 })
      );
    }

    return applySecurityHeaders(
      NextResponse.json({ ok: true, usuario })
    );
  } catch (err) {
    console.error('[session]', err);
    return applySecurityHeaders(
      NextResponse.json({ ok: false, usuario: null }, { status: 500 })
    );
  }
}