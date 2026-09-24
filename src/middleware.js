import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { PROTECTED_ROUTES, GUEST_ONLY_ROUTES } from '@/lib/utils/constants';
import { handlePreflight } from '@/lib/security/cors';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Preflight CORS (A2)
  const preflight = handlePreflight(request);
  if (preflight) return preflight;

  // Ignorar assets, api, _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: '', ...options, maxAge: 0 });
        }
      }
    }
  );

  // Verificar sesión (cookie JWT propia)
  const { verifySessionToken, SESSION_COOKIE_NAME } = await import('@/lib/security/session');
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;

  let rol = null;
  if (payload) {
    const { data: profile } = await supabase
      .from('usuarios')
      .select('rol, estado, token_version')
      .eq('id', payload.userId)
      .maybeSingle();

    if (
      profile?.estado === 'activo' &&
      (profile.token_version || 0) === (payload.tokenVersion || 0)
    ) {
      rol = profile.rol;
    }
  }

  // Rutas protegidas
  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!payload || !rol) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
      if (!roles.includes(rol)) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
  }

  // Rutas solo invitados
  if (GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    if (payload && rol) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'
  ]
};