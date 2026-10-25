-- Tesouros da Palavra: estrutura isolada de pontuação.
-- Aplicar somente após conferir migrações já existentes e fazer backup.
CREATE TABLE IF NOT EXISTS public.user_points (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points integer NOT NULL DEFAULT 0 CHECK (total_points >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.point_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_key text NOT NULL,
  completion_key text NOT NULL,
  points integer NOT NULL CHECK (points > 0 AND points <= 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_key, completion_key)
);
CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_key)
);
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own points" ON public.user_points FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Read own point events" ON public.point_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Read own achievements" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- Sem INSERT/UPDATE/DELETE para clientes: premiação deve ocorrer via função segura
-- com validação de atividade, idempotência e atualização transacional do total.
