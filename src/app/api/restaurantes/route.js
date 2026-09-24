import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { applySecurityHeaders, errorResponse } from '@/lib/security/headers';

export async function GET() {
  try {
    const admin = createAdminSupabaseClient();
    const { data, error } = await admin
      .from('restaurantes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return errorResponse('Error al consultar.', 500);

    return applySecurityHeaders(NextResponse.json({ restaurantes: data || [] }));
  } catch (err) {
    console.error('[restaurantes GET]', err);
    return errorResponse('Error interno.', 500);
  }
}