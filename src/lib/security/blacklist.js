/**
 * ============================================
 * BLACKLIST.JS - Emails bloqueados
 * ============================================
 */

import { createAdminSupabaseClient } from '@/lib/supabase/supabase-server';
import { sanitizeEmail } from './sanitize';

export async function isEmailBlacklisted(email) {
  const clean = sanitizeEmail(email);
  if (!clean) return false;

  const admin = createAdminSupabaseClient();
  const { data } = await admin
    .from('email_blacklist')
    .select('email')
    .eq('email', clean)
    .maybeSingle();

  return !!data;
}

export async function addToBlacklist(email, motivo = 'cuenta_eliminada') {
  const clean = sanitizeEmail(email);
  if (!clean) return false;

  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from('email_blacklist')
    .upsert({ email: clean, motivo }, { onConflict: 'email' });

  return !error;
}

export async function removeFromBlacklist(email) {
  const clean = sanitizeEmail(email);
  const admin = createAdminSupabaseClient();
  await admin.from('email_blacklist').delete().eq('email', clean);
}