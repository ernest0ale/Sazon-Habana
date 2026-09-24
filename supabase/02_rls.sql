-- ============================================
-- 02_RLS.SQL - Row Level Security
-- ============================================
-- Con auth propio + bcrypt, el cliente NUNCA habla directo con Supabase.
-- Todas las operaciones sensibles pasan por /api/* que usa SERVICE_ROLE.
-- Las políticas RLS solo protegen contra accesos anónimos.

-- ============================================
-- Activar RLS en todas las tablas
-- ============================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE intentos_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE verificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_bloqueos ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_blacklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Restaurantes: lectura pública
-- ============================================
DROP POLICY IF EXISTS restaurantes_public_read ON restaurantes;
CREATE POLICY restaurantes_public_read ON restaurantes
  FOR SELECT TO anon, authenticated
  USING (true);

-- ============================================
-- Reseñas: lectura pública
-- ============================================
DROP POLICY IF EXISTS resenas_public_read ON resenas;
CREATE POLICY resenas_public_read ON resenas
  FOR SELECT TO anon, authenticated
  USING (true);

-- ============================================
-- Bloquear lectura del resto para anon
-- ============================================
DROP POLICY IF EXISTS usuarios_no_public ON usuarios;
CREATE POLICY usuarios_no_public ON usuarios
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS solicitudes_no_public ON solicitudes;
CREATE POLICY solicitudes_no_public ON solicitudes
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS audit_no_public ON audit_log;
CREATE POLICY audit_no_public ON audit_log
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS intentos_no_public ON intentos_login;
CREATE POLICY intentos_no_public ON intentos_login
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS verif_no_public ON verificaciones;
CREATE POLICY verif_no_public ON verificaciones
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS bloqueos_no_public ON email_bloqueos;
CREATE POLICY bloqueos_no_public ON email_bloqueos
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS blacklist_no_public ON email_blacklist;
CREATE POLICY blacklist_no_public ON email_blacklist
  FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS bugs_no_public ON bug_reports;
CREATE POLICY bugs_no_public ON bug_reports
  FOR SELECT TO anon USING (false);

-- ============================================
-- Bloquear escrituras desde anon
-- ============================================
DROP POLICY IF EXISTS restaurantes_no_insert_anon ON restaurantes;
CREATE POLICY restaurantes_no_insert_anon ON restaurantes
  FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS restaurantes_no_update_anon ON restaurantes;
CREATE POLICY restaurantes_no_update_anon ON restaurantes
  FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS restaurantes_no_delete_anon ON restaurantes;
CREATE POLICY restaurantes_no_delete_anon ON restaurantes
  FOR DELETE TO anon USING (false);

DROP POLICY IF EXISTS resenas_no_insert_anon ON resenas;
CREATE POLICY resenas_no_insert_anon ON resenas
  FOR INSERT TO anon WITH CHECK (false);

DROP POLICY IF EXISTS resenas_no_update_anon ON resenas;
CREATE POLICY resenas_no_update_anon ON resenas
  FOR UPDATE TO anon USING (false);

DROP POLICY IF EXISTS resenas_no_delete_anon ON resenas;
CREATE POLICY resenas_no_delete_anon ON resenas
  FOR DELETE TO anon USING (false);