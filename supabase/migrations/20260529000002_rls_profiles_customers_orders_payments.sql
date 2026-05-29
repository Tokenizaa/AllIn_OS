BEGIN;

CREATE OR REPLACE FUNCTION public.is_active_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
      AND au.status = 'active'
      AND au.role IN ('admin', 'executive', 'manager', 'support', 'operational', 'financial', 'marketing')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_own_customer(p_customer_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.customers c
    WHERE c.id = p_customer_id
      AND c.user_id = auth.uid()
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatwoot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatwoot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;

CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user());

CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

CREATE POLICY "profiles_delete_admin"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.is_active_admin_user());

DROP POLICY IF EXISTS "customers_select_own" ON public.customers;
DROP POLICY IF EXISTS "customers_insert_own" ON public.customers;
DROP POLICY IF EXISTS "customers_update_own" ON public.customers;
DROP POLICY IF EXISTS "customers_delete_admin" ON public.customers;

CREATE POLICY "customers_select_own"
ON public.customers
FOR SELECT
TO authenticated
USING (public.is_own_customer(id) OR public.is_active_admin_user());

CREATE POLICY "customers_insert_own"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

CREATE POLICY "customers_update_own"
ON public.customers
FOR UPDATE
TO authenticated
USING (public.is_own_customer(id) OR public.is_active_admin_user())
WITH CHECK (public.is_own_customer(id) OR public.is_active_admin_user());

CREATE POLICY "customers_delete_admin"
ON public.customers
FOR DELETE
TO authenticated
USING (public.is_active_admin_user());

DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
DROP POLICY IF EXISTS "orders_update_staff" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_staff" ON public.orders;

CREATE POLICY "orders_select_own"
ON public.orders
FOR SELECT
TO authenticated
USING (
  (select auth.uid()) = user_id
  OR EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.user_id = auth.uid())
  OR public.is_active_admin_user()
);

CREATE POLICY "orders_insert_own"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  (select auth.uid()) = user_id
  OR EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.user_id = auth.uid())
  OR public.is_active_admin_user()
);

CREATE POLICY "orders_update_staff"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_active_admin_user())
WITH CHECK (public.is_active_admin_user());

CREATE POLICY "orders_delete_staff"
ON public.orders
FOR DELETE
TO authenticated
USING (public.is_active_admin_user());

DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
DROP POLICY IF EXISTS "payments_insert_own" ON public.payments;
DROP POLICY IF EXISTS "payments_update_staff" ON public.payments;
DROP POLICY IF EXISTS "payments_delete_staff" ON public.payments;

CREATE POLICY "payments_select_own"
ON public.payments
FOR SELECT
TO authenticated
USING (
  (select auth.uid()) = user_id
  OR EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.user_id = auth.uid())
  OR public.is_active_admin_user()
);

CREATE POLICY "payments_insert_own"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (
  (select auth.uid()) = user_id
  OR EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.user_id = auth.uid())
  OR public.is_active_admin_user()
);

CREATE POLICY "payments_update_staff"
ON public.payments
FOR UPDATE
TO authenticated
USING (public.is_active_admin_user())
WITH CHECK (public.is_active_admin_user());

CREATE POLICY "payments_delete_staff"
ON public.payments
FOR DELETE
TO authenticated
USING (public.is_active_admin_user());

DROP POLICY IF EXISTS "admin_users_self_or_admin" ON public.admin_users;
CREATE POLICY "admin_users_self_or_admin"
ON public.admin_users
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "leads_owner" ON public.leads;
CREATE POLICY "leads_owner"
ON public.leads
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "campaigns_owner" ON public.campaigns;
CREATE POLICY "campaigns_owner"
ON public.campaigns
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "chatwoot_conversations_owner" ON public.chatwoot_conversations;
CREATE POLICY "chatwoot_conversations_owner"
ON public.chatwoot_conversations
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "chatwoot_messages_owner" ON public.chatwoot_messages;
CREATE POLICY "chatwoot_messages_owner"
ON public.chatwoot_messages
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "customer_events_owner" ON public.customer_events;
CREATE POLICY "customer_events_owner"
ON public.customer_events
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "workspace_settings_owner" ON public.workspace_settings;
CREATE POLICY "workspace_settings_owner"
ON public.workspace_settings
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "marketing_links_owner" ON public.marketing_links;
CREATE POLICY "marketing_links_owner"
ON public.marketing_links
FOR ALL
TO authenticated
USING ((select auth.uid()) = created_by OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = created_by OR public.is_active_admin_user());

DROP POLICY IF EXISTS "products_owner" ON public.products;
CREATE POLICY "products_owner"
ON public.products
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id OR public.is_active_admin_user())
WITH CHECK ((select auth.uid()) = user_id OR public.is_active_admin_user());

DROP POLICY IF EXISTS "product_variants_owner" ON public.product_variants;
CREATE POLICY "product_variants_owner"
ON public.product_variants
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND (p.user_id = auth.uid() OR public.is_active_admin_user())))
WITH CHECK (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND (p.user_id = auth.uid() OR public.is_active_admin_user())));

DROP POLICY IF EXISTS "customer_plans_owner" ON public.customer_plans;
CREATE POLICY "customer_plans_owner"
ON public.customer_plans
FOR ALL
TO authenticated
USING (public.is_own_customer(customer_id) OR public.is_active_admin_user())
WITH CHECK (public.is_own_customer(customer_id) OR public.is_active_admin_user());

DROP POLICY IF EXISTS "plan_bonuses_staff" ON public.plan_bonuses;
CREATE POLICY "plan_bonuses_staff"
ON public.plan_bonuses
FOR ALL
TO authenticated
USING (public.is_active_admin_user())
WITH CHECK (public.is_active_admin_user());

DROP POLICY IF EXISTS "customer_predictions_owner" ON public.customer_predictions;
CREATE POLICY "customer_predictions_owner"
ON public.customer_predictions
FOR ALL
TO authenticated
USING (public.is_own_customer(customer_id) OR public.is_active_admin_user())
WITH CHECK (public.is_own_customer(customer_id) OR public.is_active_admin_user());

DROP POLICY IF EXISTS "shipments_owner" ON public.shipments;
CREATE POLICY "shipments_owner"
ON public.shipments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.orders o
    JOIN public.customers c ON c.id = o.customer_id
    WHERE o.id = order_id AND (c.user_id = auth.uid() OR public.is_active_admin_user())
  )
  OR public.is_active_admin_user()
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders o
    JOIN public.customers c ON c.id = o.customer_id
    WHERE o.id = order_id AND (c.user_id = auth.uid() OR public.is_active_admin_user())
  )
  OR public.is_active_admin_user()
);

COMMIT;
