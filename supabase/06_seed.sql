-- ============================================
-- 06_SEED.SQL - Datos iniciales
-- ============================================
-- ⚠️ Los hashes son PLACEHOLDER.
-- Ejecuta `node scripts/hash-passwords.js` para generarlos reales.

INSERT INTO usuarios (
  email, telefono, password_hash, nombre, rol, estado, preferencias, color_primario
) VALUES (
  'admin@sazonhabana.com',
  '50000000',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiTQZ7u1nRy2',
  'Administrador Sazón',
  'admin',
  'activo',
  '{}',
  '#5B8A72'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO usuarios (
  email, telefono, password_hash, nombre, rol, estado, preferencias, color_primario
) VALUES (
  'gestor@elbiky.com',
  '51111111',
  '$2a$12$8YQZKqHnJyLqR8J8XKpC9OqZ7B4bPqV1qK8QvZ1QZ1QZ1QZ1QZ1QZ',
  'Dueño El Biky',
  'gestor',
  'activo',
  ARRAY['criolla'],
  '#5B8A72'
)
ON CONFLICT (email) DO NOTHING;

DO $$
DECLARE
  v_gestor_id UUID;
  v_restaurante_id UUID;
BEGIN
  SELECT id INTO v_gestor_id FROM usuarios WHERE email = 'gestor@elbiky.com';

  INSERT INTO restaurantes (
    gestor_id, nombre, municipio, direccion, tipo, precio, horario, telefono,
    descripcion, img, galeria, lat, lng, aire, clima, parqueo,
    secciones_carta, platos_populares
  ) VALUES (
    v_gestor_id,
    'El Biky',
    'Plaza de la Revolución',
    'Calle Infanta e/ San Lázaro y Concordia',
    'rápida',
    '2',
    'Lunes - Sábado: 11:00 AM - 12:00 AM | Domingo: 10:00 AM - 10:00 PM',
    '78706515',
    'Complejo gastronómico icónico en Vedado. Ofrece pastelería de primer nivel, comidas rápidas sabrosas, pizzas crujientes y platos de cocina internacional en un ambiente moderno y climatizado.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
    ARRAY[
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600'
    ],
    23.1368, -82.3785, TRUE, TRUE, FALSE,
    '[{"seccion":"Entrantes","platos":[{"nombre":"Croquetas de Jamón","precio":"$600 CUP"},{"nombre":"Focaccia de Ajo","precio":"$750 CUP"}]},{"seccion":"Platos Fuertes","platos":[{"nombre":"Fettuccine Alfredo","precio":"$1950 CUP"},{"nombre":"Lomo de Cerdo Asado","precio":"$2200 CUP"},{"nombre":"Pizza Margarita Biky","precio":"$1200 CUP"},{"nombre":"Hamburguesa Suprema","precio":"$1800 CUP"}]}]'::jsonb,
    '[{"nombre":"Pizza Margarita Biky","precio":"$1200 CUP","img":"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200"},{"nombre":"Hamburguesa Suprema","precio":"$1800 CUP","img":"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200"}]'::jsonb
  ) RETURNING id INTO v_restaurante_id;

  UPDATE usuarios SET restaurante_id = v_restaurante_id WHERE id = v_gestor_id;
END $$;