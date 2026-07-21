-- ============================================================
-- Portfolio — Supabase Storage Policies
-- ============================================================
-- Bucket único: Images
--   {user_id}/avatar.webp   → foto de perfil
--   {user_id}/cv.pdf        → archivo CV
--   {project_id}/image.webp → imagen de proyecto
-- ============================================================

-- ============================================================
-- DROP de políticas antiguas (si existen)
-- ============================================================
DROP POLICY IF EXISTS "public_read_avatars" ON storage.objects;
DROP POLICY IF EXISTS "admin_write_avatars" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_avatars" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_avatars" ON storage.objects;
DROP POLICY IF EXISTS "public_read_cv" ON storage.objects;
DROP POLICY IF EXISTS "admin_write_cv" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_cv" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_cv" ON storage.objects;
DROP POLICY IF EXISTS "public_read_projects" ON storage.objects;
DROP POLICY IF EXISTS "admin_write_projects" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_projects" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_projects" ON storage.objects;

-- ============================================================
-- Bucket: Images (lectura pública)
-- ============================================================
CREATE POLICY "public_read_images" ON storage.objects
    FOR SELECT USING (bucket_id = 'Images');

-- ============================================================
-- Bucket: Images (escritura autenticada)
-- ============================================================
CREATE POLICY "admin_write_images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'Images' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_update_images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'Images' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_delete_images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'Images' AND auth.role() = 'authenticated'
    );
