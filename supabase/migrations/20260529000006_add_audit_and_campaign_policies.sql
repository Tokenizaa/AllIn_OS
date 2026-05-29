BEGIN;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_intelligence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_log_admin_read" ON public.audit_log;
DROP POLICY IF EXISTS "audit_log_admin_insert" ON public.audit_log;

CREATE POLICY "audit_log_admin_read"
ON public.audit_log
FOR SELECT
TO authenticated
USING (public.is_active_admin_user());

CREATE POLICY "audit_log_admin_insert"
ON public.audit_log
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "campaign_intelligence_admin_read" ON public.campaign_intelligence;
DROP POLICY IF EXISTS "campaign_intelligence_admin_write" ON public.campaign_intelligence;

CREATE POLICY "campaign_intelligence_admin_read"
ON public.campaign_intelligence
FOR SELECT
TO authenticated
USING (public.is_active_admin_user());

CREATE POLICY "campaign_intelligence_admin_write"
ON public.campaign_intelligence
FOR ALL
TO authenticated
USING (public.is_active_admin_user())
WITH CHECK (public.is_active_admin_user());

COMMIT;
