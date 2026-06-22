
CREATE POLICY "Anyone can view gallery files" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Anyone can upload gallery files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Anyone can delete gallery files" ON storage.objects FOR DELETE USING (bucket_id = 'gallery');
