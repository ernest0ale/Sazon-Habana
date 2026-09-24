-- ============================================
-- 05_STORAGE.SQL - Buckets y políticas
-- ============================================

-- Bucket: licencias (privado)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'licencias', 'licencias', false, 5242880,
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS licencias_no_public ON storage.objects;
CREATE POLICY licencias_no_public ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id <> 'licencias');

-- Bucket: restaurantes (público, solo lectura)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'restaurantes', 'restaurantes', true, 5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS restaurantes_public_read_storage ON storage.objects;
CREATE POLICY restaurantes_public_read_storage ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'restaurantes');

DROP POLICY IF EXISTS restaurantes_no_write_anon ON storage.objects;
CREATE POLICY restaurantes_no_write_anon ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (false);