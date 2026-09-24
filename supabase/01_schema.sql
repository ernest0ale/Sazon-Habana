-- ============================================
-- 01_SCHEMA.SQL - Tablas, tipos, constraints, índices
-- ============================================
-- Ejecutar PRIMERO en el SQL Editor de Supabase.

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ============================================
-- ENUMS
-- ============================================
DO $$ BEGIN
  CREATE TYPE user_rol AS ENUM ('casual', 'gestor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_estado AS ENUM ('activo', 'pendiente', 'suspendido', 'eliminado_pendiente');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_cocina AS ENUM (
    'criolla', 'rápida', 'italiana', 'mariscos', 'cafetería', 'heladería', 'dulcería'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE rango_precio AS ENUM ('1', '2', '3');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  telefono VARCHAR(15) UNIQUE,
  password_hash TEXT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  rol user_rol NOT NULL DEFAULT 'casual',
  estado user_estado NOT NULL DEFAULT 'activo',
  preferencias TEXT[] DEFAULT '{}',
  color_primario VARCHAR(7) DEFAULT '#5B8A72',
  restaurante_id UUID,
  token_version INT NOT NULL DEFAULT 0,
  eliminacion_programada_en TIMESTAMPTZ,
  intentos_fallidos INT DEFAULT 0,
  bloqueado_hasta TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT chk_telefono_format CHECK (telefono IS NULL OR telefono ~ '^\d{8}$'),
  CONSTRAINT chk_color_format CHECK (color_primario ~* '^#[0-9a-f]{6}$'),
  CONSTRAINT chk_nombre_length CHECK (char_length(nombre) BETWEEN 2 AND 120)
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_telefono ON usuarios(telefono);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON usuarios(estado);
CREATE INDEX IF NOT EXISTS idx_usuarios_restaurante ON usuarios(restaurante_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_eliminacion
  ON usuarios(eliminacion_programada_en)
  WHERE eliminacion_programada_en IS NOT NULL;

-- ============================================
-- TABLA: restaurantes
-- ============================================
CREATE TABLE IF NOT EXISTS restaurantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gestor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nombre VARCHAR(120) NOT NULL,
  municipio VARCHAR(100) NOT NULL,
  direccion VARCHAR(250) NOT NULL,
  tipo tipo_cocina NOT NULL,
  precio rango_precio NOT NULL,
  horario VARCHAR(500) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  descripcion TEXT NOT NULL,
  img TEXT,
  galeria TEXT[] DEFAULT '{}',
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  aire BOOLEAN NOT NULL DEFAULT FALSE,
  clima BOOLEAN NOT NULL DEFAULT FALSE,
  parqueo BOOLEAN NOT NULL DEFAULT FALSE,
  secciones_carta JSONB DEFAULT '[]'::jsonb,
  platos_populares JSONB DEFAULT '[]'::jsonb,
  rating_promedio NUMERIC(3, 2) DEFAULT 0,
  total_resenas INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_lat_range CHECK (lat BETWEEN -90 AND 90),
  CONSTRAINT chk_lng_range CHECK (lng BETWEEN -180 AND 180),
  CONSTRAINT chk_rating_range CHECK (rating_promedio BETWEEN 0 AND 5),
  CONSTRAINT chk_nombre_length CHECK (char_length(nombre) BETWEEN 3 AND 120),
  CONSTRAINT chk_descripcion_length CHECK (char_length(descripcion) BETWEEN 10 AND 2000)
);

CREATE INDEX IF NOT EXISTS idx_restaurantes_municipio ON restaurantes(municipio);
CREATE INDEX IF NOT EXISTS idx_restaurantes_tipo ON restaurantes(tipo);
CREATE INDEX IF NOT EXISTS idx_restaurantes_precio ON restaurantes(precio);
CREATE INDEX IF NOT EXISTS idx_restaurantes_gestor ON restaurantes(gestor_id);
CREATE INDEX IF NOT EXISTS idx_restaurantes_rating ON restaurantes(rating_promedio DESC);
CREATE INDEX IF NOT EXISTS idx_restaurantes_created ON restaurantes(created_at DESC);

-- FK circular usuarios.restaurante_id -> restaurantes.id
ALTER TABLE usuarios
  DROP CONSTRAINT IF EXISTS usuarios_restaurante_fk;
ALTER TABLE usuarios
  ADD CONSTRAINT usuarios_restaurante_fk
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE SET NULL;

-- ============================================
-- TABLA: resenas
-- ============================================
CREATE TABLE IF NOT EXISTS resenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id UUID NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre_usuario VARCHAR(120) NOT NULL,
  puntuacion SMALLINT NOT NULL,
  texto TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_puntuacion CHECK (puntuacion BETWEEN 1 AND 5),
  CONSTRAINT chk_texto_length CHECK (char_length(texto) BETWEEN 3 AND 1000),
  CONSTRAINT uniq_resena_por_usuario UNIQUE (restaurante_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_resenas_restaurante ON resenas(restaurante_id);
CREATE INDEX IF NOT EXISTS idx_resenas_usuario ON resenas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_resenas_fecha ON resenas(fecha DESC);

-- ============================================
-- TABLA: solicitudes
-- ============================================
CREATE TABLE IF NOT EXISTS solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(120) NOT NULL,
  tipo tipo_cocina NOT NULL,
  precio rango_precio NOT NULL,
  horario VARCHAR(500) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  descripcion TEXT NOT NULL,
  img TEXT,
  municipio VARCHAR(100) NOT NULL,
  direccion VARCHAR(250) NOT NULL,
  lat NUMERIC(10, 7) NOT NULL,
  lng NUMERIC(10, 7) NOT NULL,
  aire BOOLEAN DEFAULT FALSE,
  clima BOOLEAN DEFAULT FALSE,
  parqueo BOOLEAN DEFAULT FALSE,
  file_legal TEXT,
  nombre_gestor VARCHAR(120) NOT NULL,
  email_gestor CITEXT NOT NULL,
  password_gestor_hash TEXT NOT NULL,
  horarios_por_dia JSONB DEFAULT '{}'::jsonb,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_solicitud_estado CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  CONSTRAINT chk_lat_range CHECK (lat BETWEEN -90 AND 90),
  CONSTRAINT chk_lng_range CHECK (lng BETWEEN -180 AND 180)
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_created ON solicitudes(created_at DESC);

-- ============================================
-- TABLA: audit_log
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID,
  tabla VARCHAR(50) NOT NULL,
  operacion VARCHAR(10) NOT NULL,
  registro_id UUID,
  datos_antes JSONB,
  datos_despues JSONB,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_tabla ON audit_log(tabla);
CREATE INDEX IF NOT EXISTS idx_audit_usuario ON audit_log(usuario_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- ============================================
-- TABLA: intentos_login
-- ============================================
CREATE TABLE IF NOT EXISTS intentos_login (
  id BIGSERIAL PRIMARY KEY,
  identificador CITEXT NOT NULL,
  ip VARCHAR(45),
  exitoso BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intentos_ident ON intentos_login(identificador);
CREATE INDEX IF NOT EXISTS idx_intentos_created ON intentos_login(created_at DESC);

-- ============================================
-- TABLA: verificaciones (M4)
-- Códigos de 6 dígitos hasheados.
-- ============================================
CREATE TABLE IF NOT EXISTS verificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  codigo_hash TEXT NOT NULL,
  intentos_envio INT NOT NULL DEFAULT 1,
  proximo_envio_en TIMESTAMPTZ NOT NULL,
  expira_en TIMESTAMPTZ NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_verif_tipo CHECK (tipo IN ('registro', 'recuperar_password', 'reactivar_cuenta'))
);

CREATE INDEX IF NOT EXISTS idx_verif_email_tipo ON verificaciones(email, tipo);
CREATE INDEX IF NOT EXISTS idx_verif_expira ON verificaciones(expira_en);
CREATE INDEX IF NOT EXISTS idx_verif_usado ON verificaciones(usado);

-- ============================================
-- TABLA: email_bloqueos (M4)
-- Bloqueos temporales de 2h por exceso de solicitudes.
-- ============================================
CREATE TABLE IF NOT EXISTS email_bloqueos (
  email CITEXT PRIMARY KEY,
  bloqueado_hasta TIMESTAMPTZ NOT NULL,
  motivo VARCHAR(50) NOT NULL DEFAULT 'exceso_solicitudes',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bloqueos_hasta ON email_bloqueos(bloqueado_hasta);

-- ============================================
-- TABLA: email_blacklist (M2)
-- Emails que NO pueden volver a registrarse.
-- ============================================
CREATE TABLE IF NOT EXISTS email_blacklist (
  email CITEXT PRIMARY KEY,
  motivo VARCHAR(50) NOT NULL DEFAULT 'cuenta_eliminada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blacklist_created ON email_blacklist(created_at DESC);

-- ============================================
-- TABLA: bug_reports (A28)
-- ============================================
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  email CITEXT,
  descripcion TEXT NOT NULL,
  url TEXT,
  user_agent TEXT,
  ip VARCHAR(45),
  estado VARCHAR(20) NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_bug_desc CHECK (char_length(descripcion) BETWEEN 10 AND 2000),
  CONSTRAINT chk_bug_estado CHECK (estado IN ('nuevo', 'revisando', 'resuelto', 'descartado'))
);

CREATE INDEX IF NOT EXISTS idx_bugs_estado ON bug_reports(estado);
CREATE INDEX IF NOT EXISTS idx_bugs_created ON bug_reports(created_at DESC);