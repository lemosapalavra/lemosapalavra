-- Fix: restrict lemos-play-videos bucket policies to authenticated users only
-- Remove any existing overly-permissive policies on this bucket.
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (
        policyname ILIKE '%lemos-play-videos%'
        OR policyname ILIKE '%lemos_play_videos%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Recreate policies restricted to the authenticated role only.
CREATE POLICY "lemos-play-videos: authenticated read"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'lemos-play-videos');

CREATE POLICY "lemos-play-videos: authenticated insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lemos-play-videos' AND auth.uid() = owner);

CREATE POLICY "lemos-play-videos: authenticated update own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lemos-play-videos' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'lemos-play-videos' AND auth.uid() = owner);

CREATE POLICY "lemos-play-videos: authenticated delete own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lemos-play-videos' AND auth.uid() = owner);