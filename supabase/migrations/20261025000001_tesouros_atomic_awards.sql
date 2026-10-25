-- Atomic award function. Must only be called from a trusted server after
-- validating that the activity was genuinely completed.
CREATE OR REPLACE FUNCTION public.award_verified_activity_points(
  p_user_id uuid,
  p_activity_key text,
  p_completion_key text,
  p_points integer
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE v_event_id uuid;
BEGIN
  IF p_user_id IS NULL OR p_activity_key IS NULL OR length(trim(p_activity_key)) = 0
     OR p_completion_key IS NULL OR length(trim(p_completion_key)) = 0
     OR p_points IS NULL OR p_points < 1 OR p_points > 1000 THEN
    RAISE EXCEPTION 'Invalid point award request';
  END IF;
  INSERT INTO public.point_events(user_id, activity_key, completion_key, points)
  VALUES (p_user_id, p_activity_key, p_completion_key, p_points)
  ON CONFLICT (user_id, activity_key, completion_key) DO NOTHING
  RETURNING id INTO v_event_id;
  IF v_event_id IS NULL THEN RETURN false; END IF;
  INSERT INTO public.user_points(user_id, total_points)
  VALUES (p_user_id, p_points)
  ON CONFLICT (user_id) DO UPDATE
  SET total_points = public.user_points.total_points + EXCLUDED.total_points,
      updated_at = now();
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.award_verified_activity_points(uuid,text,text,integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_verified_activity_points(uuid,text,text,integer) FROM anon;
REVOKE ALL ON FUNCTION public.award_verified_activity_points(uuid,text,text,integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.award_verified_activity_points(uuid,text,text,integer) TO service_role;
-- IMPORTANT: service_role key must never be exposed to browser code.
