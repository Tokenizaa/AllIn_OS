BEGIN;

ALTER VIEW public.customer_360_view SET (security_invoker = true);
ALTER VIEW public.network_tree_view SET (security_invoker = true);
ALTER VIEW public.audit_log_summary SET (security_invoker = true);
ALTER VIEW public.payment_summary_view SET (security_invoker = true);
ALTER VIEW public.order_summary_view SET (security_invoker = true);

ALTER FUNCTION public.get_customer_type_from_purchase() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.calculate_generation_bonus(uuid, integer, numeric) SET search_path = public;
ALTER FUNCTION public.refresh_analytics_views() SET search_path = public;
ALTER FUNCTION public.calculate_order_bonus(uuid) SET search_path = public;
ALTER FUNCTION public.get_customer_plan(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.update_bonus_rules_updated_at() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.map_tipo_compra_to_code(text) SET search_path = public;
ALTER FUNCTION public.recalculate_customer_types(uuid) SET search_path = public;
ALTER FUNCTION public.update_wallet_balance() SET search_path = public;
ALTER FUNCTION public.refresh_mlm_analytics(uuid, integer) SET search_path = public;
ALTER FUNCTION public.rls_auto_enable() SET search_path = public;

COMMIT;
