INSERT INTO public.user_roles (user_id, role)
VALUES ('4fa23509-0a08-4f76-b306-8ef908dacdec', 'admin'),
       ('2181a38e-b3f6-4eee-a4f7-4dc0f823f837', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;