-- Keep the admin role limited to the designated authenticated account.
-- Apply through the Supabase migration pipeline with elevated database privileges.
DELETE FROM public.user_roles WHERE role = 'admin' AND user_id NOT IN (
  SELECT id FROM auth.users WHERE lower(email) = 'marcelloborbas@gmail.com'
);
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE lower(email) = 'marcelloborbas@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.users.id AND ur.role = 'admin'
);
