-- ============================================
-- 07_CRON.SQL - Tareas programadas
-- ============================================
-- Requiere la extensión pg_cron (soportada por Supabase).
-- Se ejecuta una vez; los jobs quedan programados.

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Eliminar jobs previos si existen (idempotente)
DO $$ BEGIN
  PERFORM cron.unschedule('limpiar-cuentas-expiradas');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  PERFORM cron.unschedule('limpiar-verificaciones');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  PERFORM cron.unschedule('limpiar-intentos-login');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Limpiar cuentas expiradas: diario a las 4 AM UTC
SELECT cron.schedule(
  'limpiar-cuentas-expiradas',
  '0 4 * * *',
  $$ SELECT limpiar_cuentas_expiradas(); $$
);

-- Limpiar verificaciones y bloqueos expirados: cada hora
SELECT cron.schedule(
  'limpiar-verificaciones',
  '0 * * * *',
  $$ SELECT limpiar_verificaciones_expiradas(); $$
);

-- Limpiar intentos de login antiguos: diario a las 3 AM UTC
SELECT cron.schedule(
  'limpiar-intentos-login',
  '0 3 * * *',
  $$ SELECT limpiar_intentos_antiguos(); $$
);