-- Admin-only membership management. Never trust localStorage for authorization.
CREATE OR REPLACE FUNCTION public.admin_list_members()
RETURNS TABLE(id uuid, name text, email text, membership text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso restrito ao administrador';
  END IF;
  RETURN QUERY SELECT p.id, p.name, p.email,
    CASE WHEN lower(coalesce(p.role, '')) IN ('vip','familia','amigos') THEN lower(p.role)
      ELSE 'visitante' END
  FROM public.profiles p ORDER BY p.name NULLS LAST, p.email;
END;
$$;
CREATE OR REPLACE FUNCTION public.admin_set_membership(target_user uuid, new_membership text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso restrito ao administrador';
  END IF;
  IF lower(new_membership) NOT IN ('visitante','familia','amigos','vip') THEN
    RAISE EXCEPTION 'Status inválido';
  END IF;
  IF target_user = auth.uid() THEN
    RAISE EXCEPTION 'Não altere seu próprio perfil por este painel';
  END IF;
  UPDATE public.profiles SET role = lower(new_membership), updated_at = now() WHERE id = target_user;
  IF NOT FOUND THEN RAISE EXCEPTION 'Usuário não encontrado'; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_list_members() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_set_membership(uuid,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_members() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_membership(uuid,text) TO authenticated;