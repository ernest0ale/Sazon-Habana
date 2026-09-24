/**
 * ============================================
 * SUPABASE-SERVER.JS - Clientes para el servidor
 * ============================================
 * - createServerSupabaseClient: usa cookies (respeta sesión del usuario + RLS)
 * - createAdminSupabaseClient: usa SERVICE_ROLE (bypassa RLS, SOLO server)
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

function getEnv(name, { required = true } = {}) {
  const value = process.env[name];
  if (required && (!value || value.length === 0)) {
    throw new Error(`Variable de entorno ${name} no configurada.`);
  }
  return value;
}

/**
 * Cliente Supabase para Server Components y API routes.
 * Respeta RLS usando la sesión del usuario desde cookies.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  return createServerClient(url, anonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // En Server Components no se puede setear. Se ignora.
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        } catch {
          // Ignorar
        }
      }
    }
  });
}

/**
 * ⚠️ Cliente ADMIN - bypassa RLS. SOLO usar en API routes del servidor.
 * NUNCA exponer al cliente. NUNCA usar en Client Components.
 */
export function createAdminSupabaseClient() {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}