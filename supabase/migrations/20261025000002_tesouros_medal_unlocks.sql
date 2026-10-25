-- Unlock the six established medal tiers in the same trusted transaction.
-- Runs after a verified award has updated public.user_points.
CREATE OR REPLACE FUNCTION public.unlock_tesouros_achievements()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_achievements (user_id, achievement_key)
  SELECT NEW.user_id, tiers.achievement_key
  FROM (VALUES
    ('bronze', 0), ('prata', 100), ('ouro', 300),
    ('esmeralda', 600), ('rubi', 1000), ('diamante', 1500)
  ) AS tiers(achievement_key, minimum_points)
  WHERE NEW.total_points >= tiers.minimum_points
  ON CONFLICT (user_id, achievement_key) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_unlock_tesouros_achievements ON public.user_points;
CREATE TRIGGER trg_unlock_tesouros_achievements
AFTER INSERT OR UPDATE OF total_points ON public.user_points
FOR EACH ROW EXECUTE FUNCTION public.unlock_tesouros_achievements();
-- Backfill existing point totals, if any, without changing balances.
INSERT INTO public.user_achievements (user_id, achievement_key)
SELECT p.user_id, tiers.achievement_key
FROM public.user_points AS p
CROSS JOIN (VALUES
 ('bronze', 0), ('prata', 100), ('ouro', 300),
 ('esmeralda', 600), ('rubi', 1000), ('diamante', 1500)
) AS tiers(achievement_key, minimum_points)
WHERE p.total_points >= tiers.minimum_points
ON CONFLICT (user_id, achievement_key) DO NOTHING;
