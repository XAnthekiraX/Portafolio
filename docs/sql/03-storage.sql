-- ============================================================
-- Portfolio — Supabase Storage Policies
-- ============================================================
-- Buckets:
--   avatars  → fotos de perfil
--   cv       → archivos CV (PDF)
--   projects → imágenes de proyectos
-- ============================================================

-- ============================================================
-- Bucket: avatars
-- ============================================================
CREATE POLICY "public_read_avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "admin_write_avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_update_avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_delete_avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND auth.role() = 'authenticated'
    );

-- ============================================================
-- Bucket: cv
-- ============================================================
CREATE POLICY "public_read_cv" ON storage.objects
    FOR SELECT USING (bucket_id = 'cv');

CREATE POLICY "admin_write_cv" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'cv' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_update_cv" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'cv' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_delete_cv" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'cv' AND auth.role() = 'authenticated'
    );

-- ============================================================
-- Bucket: projects
-- ============================================================
CREATE POLICY "public_read_projects" ON storage.objects
    FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY "admin_write_projects" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'projects' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_update_projects" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'projects' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_delete_projects" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'projects' AND auth.role() = 'authenticated'
    );
