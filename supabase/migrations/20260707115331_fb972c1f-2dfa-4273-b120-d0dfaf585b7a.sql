
DO $$ BEGIN
  CREATE POLICY "read lemos-play-videos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'lemos-play-videos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "upload lemos-play-videos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'lemos-play-videos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "update lemos-play-videos"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'lemos-play-videos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
