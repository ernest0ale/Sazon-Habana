/**
 * ============================================
 * SUPABASE-CLIENT.JS - Cliente para el navegador
 * ============================================
 * Solo usa la ANON KEY (pública por diseño).
 * La seguridad real la da RLS.
 */

'use client';

import { createBrowserClient } from '@supabase/ssr';

let client = null;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  client = createBrowserClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'x-application-name': 'sazon-habana'
      }
    }
  });

  return client;
}