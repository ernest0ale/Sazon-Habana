-- ============================================
-- 04_RPC.SQL - Funciones seguras (security definer)
-- ============================================

-- ============================================
-- RPC: aprobar_solicitud
-- ============================================
CREATE OR REPLACE FUNCTION aprobar_solicitud(p_solicitud_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sol RECORD;
  v_restaurante_id UUID;
  v_gestor_id UUID;
  v_result JSONB;
BEGIN
  SELECT * INTO v_sol FROM solicitudes WHERE id = p_solicitud_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Solicitud no encontrada: %', p_solicitud_id;
  END IF;

  IF v_sol.estado <> 'pendiente' THEN
    RAISE EXCEPTION 'La solicitud ya fue procesada (estado: %)', v_sol.estado;
  END IF;

  INSERT INTO restaurantes (
    nombre, municipio, direccion, tipo, precio, horario, telefono, descripcion,
    img, galeria, lat, lng, aire, clima, parqueo,
    platos_populares, secciones_carta
  ) VALUES (
    v_sol.nombre, v_sol.municipio, v_sol.direccion, v_sol.tipo, v_sol.precio,
    v_sol.horario, v_sol.telefono, v_sol.descripcion,
    COALESCE(v_sol.img, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600'),
    ARRAY[COALESCE(v_sol.img, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600')],
    v_sol.lat, v_sol.lng, v_sol.aire, v_sol.clima, v_sol.parqueo,
    '[{"nombre":"Especialidad de la Casa","precio":"$1500 CUP","descripcion":"Plato de firma introducido por el nuevo gestor.","img":"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=200"}]'::jsonb,
    '[{"seccion":"Especialidades","platos":[{"nombre":"Plato Aprobado","precio":"$1500 CUP"}]}]'::jsonb
  ) RETURNING id INTO v_restaurante_id;

  INSERT INTO usuarios (
    email, telefono, password_hash, nombre, rol, estado,
    preferencias, color_primario, restaurante_id
  ) VALUES (
    v_sol.email_gestor, v_sol.telefono, v_sol.password_gestor_hash,
    v_sol.nombre_gestor, 'gestor', 'activo',
    ARRAY[v_sol.tipo::text], '#5B8A72', v_restaurante_id
  ) RETURNING id INTO v_gestor_id;

  UPDATE restaurantes SET gestor_id = v_gestor_id WHERE id = v_restaurante_id;
  UPDATE solicitudes SET estado = 'aprobada' WHERE id = p_solicitud_id;
  DELETE FROM solicitudes WHERE id = p_solicitud_id;

  v_result := jsonb_build_object(
    'ok', true,
    'restaurante_id', v_restaurante_id,
    'gestor_id', v_gestor_id
  );
  RETURN v_result;
END;
$$;

-- ============================================
-- RPC: rechazar_solicitud
-- ============================================
CREATE OR REPLACE FUNCTION rechazar_solicitud(p_solicitud_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE solicitudes SET estado = 'rechazada' WHERE id = p_solicitud_id;
  DELETE FROM solicitudes WHERE id = p_solicitud_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ============================================
-- RPC: registrar_intento_login
-- ============================================
CREATE OR REPLACE FUNCTION registrar_intento_login(
  p_identificador CITEXT,
  p_ip VARCHAR,
  p_exitoso BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO intentos_login (identificador, ip, exitoso)
  VALUES (p_identificador, p_ip, p_exitoso);
END;
$$;

-- ============================================
-- RPC: verificar_bloqueo_login
-- ============================================
CREATE OR REPLACE FUNCTION verificar_bloqueo_login(
  p_identificador CITEXT,
  p_max_intentos INT DEFAULT 5,
  p_ventana_minutos INT DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_intentos INT;
BEGIN
  SELECT COUNT(*) INTO v_intentos
  FROM intentos_login
  WHERE identificador = p_identificador
    AND exitoso = FALSE
    AND created_at > NOW() - (p_ventana_minutos || ' minutes')::interval;

  RETURN v_intentos >= p_max_intentos;
END;
$$;

-- ============================================
-- RPC: cambiar_password
-- ============================================
CREATE OR REPLACE FUNCTION cambiar_password(
  p_usuario_id UUID,
  p_nuevo_hash TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE usuarios
  SET password_hash = p_nuevo_hash,
      token_version = token_version + 1,
      updated_at = NOW()
  WHERE id = p_usuario_id;
  RETURN FOUND;
END;
$$;

-- ============================================
-- RPC: limpiar_cuentas_expiradas (M3)
-- Anonimiza cuentas pasados los 14 días.
-- Se programa con pg_cron (ver 07_cron.sql).
-- ============================================
CREATE OR REPLACE FUNCTION limpiar_cuentas_expiradas()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT := 0;
  v_rec RECORD;
BEGIN
  FOR v_rec IN
    SELECT id, email FROM usuarios
    WHERE estado = 'eliminado_pendiente'
      AND eliminacion_programada_en IS NOT NULL
      AND eliminacion_programada_en < NOW()
  LOOP
    INSERT INTO email_blacklist (email, motivo)
    VALUES (v_rec.email, 'cuenta_eliminada')
    ON CONFLICT (email) DO NOTHING;

    UPDATE usuarios
    SET email = CONCAT('deleted_', v_rec.id, '@deleted.local'),
        telefono = NULL,
        nombre = 'Usuario eliminado',
        password_hash = 'DELETED',
        preferencias = '{}',
        estado = 'suspendido'
    WHERE id = v_rec.id;

    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'cuentas_eliminadas', v_count);
END;
$$;

-- ============================================
-- RPC: limpiar_verificaciones_expiradas
-- ============================================
CREATE OR REPLACE FUNCTION limpiar_verificaciones_expiradas()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM verificaciones WHERE expira_en < NOW() - INTERVAL '1 day';
  DELETE FROM email_bloqueos WHERE bloqueado_hasta < NOW() - INTERVAL '1 day';
END;
$$;