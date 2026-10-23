-- Tesouros da Palavra: pontos permanentes, independentes das moedas.
-- A concessão é restrita ao servidor/admin; usuários só podem ler os próprios pontos.
CREATE TABLE IF NOT EXISTS public.reward_experience (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0 CHECK (points >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.reward_experience_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_key text NOT NULL,
  points integer NOT NULL CHECK (points > 0 AND points <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_key)
);
ALTER TABLE public.reward_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_experience_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read own reward experience" ON public.reward_experience;
CREATE POLICY "Read own reward experience" ON public.reward_experience
FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Read own reward events" ON public.reward_experience_events;
CREATE POLICY "Read own reward events" ON public.reward_experience_events
FOR SELECT TO authenticated USING (user_id = auth.uid());
REVOKE INSERT, UPDATE, DELETE ON public.reward_experience FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.reward_experience_events FROM anon, authenticated;
-- Concessão controlada, idempotente e auditável. Não chamar diretamente do navegador do aluno.
CREATE OR REPLACE FUNCTION public.admin_award_experience(target_user uuid, reward_key text, reward_points integer)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso restrito ao administrador';
  END IF;
  IF reward_key IS NULL OR length(trim(reward_key)) < 3 OR length(reward_key) > 200
     OR reward_points IS NULL OR reward_points < 1 OR reward_points > 100 THEN
    RAISE EXCEPTION 'Premiação inválida';
  END IF;
  INSERT INTO public.reward_experience_events (user_id, activity_key, points)
  VALUES (target_user, trim(reward_key), reward_points)
  ON CONFLICT (user_id, activity_key) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF;
  INSERT INTO public.reward_experience (user_id, points)
  VALUES (target_user, reward_points)
  ON CONFLICT (user_id) DO UPDATE
    SET points = public.reward_experience.points + EXCLUDED.points, updated_at = now();
  RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.admin_award_experience(uuid,text,integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_award_experience(uuid,text,integer) TO authenticated;
