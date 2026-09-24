-- ============================================
-- 03_TRIGGERS.SQL - Triggers automáticos
-- ============================================

-- ============================================
-- updated_at automático
-- ============================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_restaurantes_updated_at ON restaurantes;
CREATE TRIGGER trg_restaurantes_updated_at
  BEFORE UPDATE ON restaurantes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_resenas_updated_at ON resenas;
CREATE TRIGGER trg_resenas_updated_at
  BEFORE UPDATE ON resenas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_solicitudes_updated_at ON solicitudes;
CREATE TRIGGER trg_solicitudes_updated_at
  BEFORE UPDATE ON solicitudes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- Recalcular rating de restaurante al cambiar reseñas
-- ============================================
CREATE OR REPLACE FUNCTION recalcular_rating_restaurante()
RETURNS TRIGGER AS $$
DECLARE
  v_restaurante_id UUID;
  v_promedio NUMERIC(3,2);
  v_total INT;
BEGIN
  v_restaurante_id := COALESCE(NEW.restaurante_id, OLD.restaurante_id);

  SELECT COALESCE(AVG(puntuacion), 0), COUNT(*)
  INTO v_promedio, v_total
  FROM resenas
  WHERE restaurante_id = v_restaurante_id;

  UPDATE restaurantes
  SET rating_promedio = ROUND(v_promedio, 2),
      total_resenas = v_total,
      updated_at = NOW()
  WHERE id = v_restaurante_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_resenas_rating_ins ON resenas;
CREATE TRIGGER trg_resenas_rating_ins
  AFTER INSERT ON resenas
  FOR EACH ROW EXECUTE FUNCTION recalcular_rating_restaurante();

DROP TRIGGER IF EXISTS trg_resenas_rating_upd ON resenas;
CREATE TRIGGER trg_resenas_rating_upd
  AFTER UPDATE ON resenas
  FOR EACH ROW EXECUTE FUNCTION recalcular_rating_restaurante();

DROP TRIGGER IF EXISTS trg_resenas_rating_del ON resenas;
CREATE TRIGGER trg_resenas_rating_del
  AFTER DELETE ON resenas
  FOR EACH ROW EXECUTE FUNCTION recalcular_rating_restaurante();

-- ============================================
-- Audit log: restaurantes
-- ============================================
CREATE OR REPLACE FUNCTION audit_restaurantes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (tabla, operacion, registro_id, datos_despues)
    VALUES ('restaurantes', 'INSERT', NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (tabla, operacion, registro_id, datos_antes, datos_despues)
    VALUES ('restaurantes', 'UPDATE', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (tabla, operacion, registro_id, datos_antes)
    VALUES ('restaurantes', 'DELETE', OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_restaurantes ON restaurantes;
CREATE TRIGGER trg_audit_restaurantes
  AFTER INSERT OR UPDATE OR DELETE ON restaurantes
  FOR EACH ROW EXECUTE FUNCTION audit_restaurantes();

-- ============================================
-- Audit log: usuarios (sin password_hash)
-- ============================================
CREATE OR REPLACE FUNCTION audit_usuarios()
RETURNS TRIGGER AS $$
DECLARE
  v_before JSONB;
  v_after JSONB;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    v_before := to_jsonb(OLD) - 'password_hash';
    v_after := to_jsonb(NEW) - 'password_hash';
    INSERT INTO audit_log (tabla, operacion, registro_id, datos_antes, datos_despues)
    VALUES ('usuarios', 'UPDATE', NEW.id, v_before, v_after);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_before := to_jsonb(OLD) - 'password_hash';
    INSERT INTO audit_log (tabla, operacion, registro_id, datos_antes)
    VALUES ('usuarios', 'DELETE', OLD.id, v_before);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_usuarios ON usuarios;
CREATE TRIGGER trg_audit_usuarios
  AFTER UPDATE OR DELETE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION audit_usuarios();

-- ============================================
-- Audit log: resenas
-- ============================================
CREATE OR REPLACE FUNCTION audit_resenas()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (tabla, operacion, registro_id, datos_despues)
    VALUES ('resenas', 'INSERT', NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (tabla, operacion, registro_id, datos_antes, datos_despues)
    VALUES ('resenas', 'UPDATE', NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (tabla, operacion, registro_id, datos_antes)
    VALUES ('resenas', 'DELETE', OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_resenas ON resenas;
CREATE TRIGGER trg_audit_resenas
  AFTER INSERT OR UPDATE OR DELETE ON resenas
  FOR EACH ROW EXECUTE FUNCTION audit_resenas();

-- ============================================
-- Limpieza de intentos_login antiguos
-- ============================================
CREATE OR REPLACE FUNCTION limpiar_intentos_antiguos()
RETURNS void AS $$
BEGIN
  DELETE FROM intentos_login WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;