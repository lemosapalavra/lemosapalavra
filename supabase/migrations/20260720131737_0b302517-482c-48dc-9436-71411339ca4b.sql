
-- 1) Role enum + dedicated user_roles table (never store role on profiles)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_roles_select_own ON public.user_roles;
CREATE POLICY user_roles_select_own
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 2) Security-definer has_role() so RLS can call it without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

-- 3) Migrate any existing admin flag from profiles into user_roles, then
--    make is_admin() read strictly from user_roles (profiles.role is ignored).
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM public.profiles
WHERE lower(role) = 'admin'
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin(_uid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_uid, 'admin'::public.app_role);
$$;

-- 4) Block regular users from changing the role column on their profile.
--    Only postgres / service_role may alter it (server-side flows).
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF current_setting('request.jwt.claim.role', true) NOT IN ('service_role') THEN
      RAISE EXCEPTION 'Not allowed to change role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_block_role_change ON public.profiles;
CREATE TRIGGER profiles_block_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_role_change();

-- Also block INSERT with role != null/'user' from clients
CREATE OR REPLACE FUNCTION public.prevent_profile_role_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS NOT NULL AND lower(NEW.role) <> 'user' THEN
    IF current_setting('request.jwt.claim.role', true) NOT IN ('service_role') THEN
      NEW.role := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_block_role_insert ON public.profiles;
CREATE TRIGGER profiles_block_role_insert
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_role_insert();
