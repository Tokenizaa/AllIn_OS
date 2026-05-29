BEGIN;

REVOKE EXECUTE ON FUNCTION public.refresh_mlm_analytics(uuid, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.refresh_mlm_analytics(uuid, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.refresh_mlm_analytics(uuid, integer) FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

REVOKE SELECT ON TABLE public.analytics_plan_performance FROM anon, authenticated;
REVOKE SELECT ON TABLE public.analytics_bonus_distribution FROM anon, authenticated;
REVOKE SELECT ON TABLE public.analytics_sales_summary FROM anon, authenticated;
REVOKE SELECT ON TABLE public.analytics_customer_summary FROM anon, authenticated;
REVOKE SELECT ON TABLE public.analytics_network_summary FROM anon, authenticated;
REVOKE SELECT ON TABLE public.analytics_product_summary FROM anon, authenticated;

COMMIT;
