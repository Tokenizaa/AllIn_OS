-- =====================================================================
-- SUPABASE MIGRATION SCRIPT: RBAC & ROW LEVEL SECURITY (RLS)
-- Target Tables: profiles, customers, orders, payments, admin_invites
-- Authority: Admin Master, Gestão Admin, Financeiro, Auditor, etc.
-- Created At: 2026-05-29
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. SCHEMAS, TYPING & EXTENSIONS
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Status definitions for administrative invites
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');

-- ---------------------------------------------------------------------
-- 2. CORE TABLE: admin_invites
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'admin_master', 'finance', 'support', 'distributor', 'customer',
        'gestão_admin', 'financeiro', 'suporte', 'logística', 'marketing',
        'analytics', 'auditor', 'operador'
    )),
    permissions JSONB DEFAULT '[]'::jsonb,
    invite_token VARCHAR(255) NOT NULL UNIQUE,
    invite_link VARCHAR(512),
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    status invite_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Safety constraint: An invite can only be accepted once
    CONSTRAINT chk_accepted_dates CHECK (
        (status = 'accepted' AND accepted_at IS NOT NULL) OR
        (status <> 'accepted' AND accepted_at IS NULL)
    ),
    -- Safety constraint: Only pending invites can avoid revoked/expires fields
    CONSTRAINT chk_revoked_dates CHECK (
        (status = 'revoked' AND revoked_at IS NOT NULL) OR
        (status <> 'revoked' AND revoked_at IS NULL)
    )
);

-- Index details for ultra-fast validation of secure invitation tokens
CREATE INDEX IF NOT EXISTS idx_invites_token ON public.admin_invites(invite_token);
CREATE INDEX IF NOT EXISTS idx_invites_email ON public.admin_invites(email);

-- ---------------------------------------------------------------------
-- 3. HELPER FUNCTIONS FOR ROLE-BASED ACCESS CONTROL (RBAC)
-- ---------------------------------------------------------------------

-- Function to extract user role from user metadata/claim or profile
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS VARCHAR AS $$
DECLARE
    v_role VARCHAR;
BEGIN
    -- 1. Try to read from app_metadata (common JWT setup in Supabase RBAC)
    v_role := co_auth_metadata_role();
    IF v_role IS NOT NULL THEN
        RETURN v_role;
    END IF;

    -- 2. Fall back to profiling table role
    SELECT role INTO v_role 
    FROM public.profiles 
    WHERE id = auth.uid() 
    LIMIT 1;
    
    RETURN COALESCE(v_role, 'customer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to pull custom claim metadata role cleanly
CREATE OR REPLACE FUNCTION public.co_auth_metadata_role()
RETURNS VARCHAR AS $$
BEGIN
    RETURN (auth.jwt() -> 'app_metadata' ->> 'role')::VARCHAR;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if the current user has access level of admin or management administrative roles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    v_role VARCHAR;
BEGIN
    v_role := public.get_auth_user_role();
    RETURN v_role IN ('admin_master', 'gestão_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES FOR CORE TABLES
-- ---------------------------------------------------------------------

-- A. Table: profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admin Masters & Gestão Admins can do anything on profiles
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy: Users can view and update their own profiles
CREATE POLICY "Users can reference own profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can modify own profile attributes"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Distributors can view unilevel/downline profiles
CREATE POLICY "Distributors can view direct downline profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    public.get_auth_user_role() = 'distributor' 
    AND (sponsor_id = auth.uid() OR id = auth.uid())
);


-- B. Table: customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage customers
CREATE POLICY "Admins manage customers"
ON public.customers
FOR ALL
TO authenticated
USING (public.get_auth_user_role() IN ('admin_master', 'gestão_admin', 'suporte', 'financeiro'))
WITH CHECK (public.get_auth_user_role() IN ('admin_master', 'gestão_admin', 'suporte', 'financeiro'));

-- Policy: Distributors can view direct and indirect downlines, but never other network distributors outside their downline
CREATE POLICY "Distributors can view downlines and own record"
ON public.customers
FOR SELECT
TO authenticated
USING (
    public.get_auth_user_role() = 'distributor' 
    AND (
        id = auth.uid()
        OR sponsor_id = auth.uid()
        OR auth.uid() = ANY(path)
    )
);

-- Policy: Customers can manage their own details
CREATE POLICY "Customers own check"
ON public.customers
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- C. Table: orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Administration, logistics and operators can update & read orders
CREATE POLICY "Admins and logistics manage orders"
ON public.orders
FOR ALL
TO authenticated
USING (
    public.get_auth_user_role() IN ('admin_master', 'gestão_admin', 'logística', 'operador', 'suporte')
)
WITH CHECK (
    public.get_auth_user_role() IN ('admin_master', 'gestão_admin', 'logística', 'operador', 'suporte')
);

-- Policy: Customer or Distributor can view or place self orders
CREATE POLICY "Users browse own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (customer_id = auth.uid() OR distributor_id = auth.uid());

CREATE POLICY "Users issue new orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
    customer_id = auth.uid() 
    OR distributor_id = auth.uid() 
    OR public.is_admin()
);


-- D. Table: payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policy: Finance directors, financeiro and auditors can review/modify payments
CREATE POLICY "Finance staff manages payments"
ON public.payments
FOR ALL
TO authenticated
USING (
    public.get_auth_user_role() IN ('admin_master', 'gestão_admin', 'financeiro', 'finance', 'auditor')
)
WITH CHECK (
    public.get_auth_user_role() IN ('admin_master', 'gestão_admin', 'financeiro', 'finance')
);

-- Policy: Customers and Distributors can select/create their own checkout payments
CREATE POLICY "Own payments access"
ON public.payments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Own payments submission"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());


-- E. Table: admin_invites (our new table)
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Only Admin Masters & Gestão Admins can manage (insert/update/delete) invites
CREATE POLICY "Master admins manage all invites"
ON public.admin_invites
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy: Allow prospective candidates to read invite validation token details anonymously
CREATE POLICY "Candidate validates metadata anonymously by token"
ON public.admin_invites
FOR SELECT
TO anon, authenticated
USING (
    status = 'pending' 
    AND expires_at > NOW() 
    AND revoked_at IS NULL
);

-- ---------------------------------------------------------------------
-- 5. AUDITOR SYSTEM: AUTOMATIC CHANGE AUDIT TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    actor VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only master administrators and auditors can view audit logs
CREATE POLICY "Only admins and auditors read logs"
ON public.system_audit_logs
FOR SELECT
TO authenticated
USING (public.get_auth_user_role() IN ('admin_master', 'gestão_admin', 'auditor'));

-- ---------------------------------------------------------------------
-- 6. AUTOMATION COMPLIANCE: INVITE ACCEPT SERVICE FUNCTION
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.proc_complete_invite_signup(
    p_token VARCHAR,
    p_auth_user_id UUID,
    p_name VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_invite public.admin_invites%ROWTYPE;
BEGIN
    -- Secure validations inside backend Transaction
    SELECT * INTO v_invite 
    FROM public.admin_invites 
    WHERE invite_token = p_token AND status = 'pending'
    FOR UPDATE; -- Prevent race conditions / double activation
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Convite inválido ou token inexistente.';
    END IF;
    
    IF v_invite.expires_at < NOW() THEN
        UPDATE public.admin_invites SET status = 'expired' WHERE id = v_invite.id;
        RAISE EXCEPTION 'O tempo limite de 48 horas expirarou.';
    END IF;
    
    IF v_invite.revoked_at IS NOT NULL THEN
        UPDATE public.admin_invites SET status = 'revoked' WHERE id = v_invite.id;
        RAISE EXCEPTION 'Este convite foi cancelado.';
    END IF;

    -- Update invite status
    UPDATE public.admin_invites 
    SET status = 'accepted', 
        accepted_at = NOW() 
    WHERE id = v_invite.id;

    -- Update destination user role & custom metadata inside auth.users
    UPDATE auth.users 
    SET raw_app_meta_data = jsonb_build_object('role', v_invite.role),
        raw_user_meta_data = jsonb_build_object('full_name', p_name)
    WHERE id = p_auth_user_id;

    -- Create public profile matching the invited role
    INSERT INTO public.profiles (id, full_name, email, role, status, active, created_at)
    VALUES (p_auth_user_id, p_name, v_invite.email, v_invite.role, 'active', TRUE, NOW())
    ON CONFLICT (id) DO UPDATE 
    SET role = v_invite.role, status = 'active', active = TRUE;

    -- Track secure audit statement
    INSERT INTO public.system_audit_logs (user_id, actor, action, entity, details, ip_address)
    VALUES (p_auth_user_id, v_invite.email, 'ACCEPT_INVITE', 'admin_invites', 
            'Convite aceito por ' || p_name || ' para o cargo de ' || UPPER(v_invite.role), 
            '127.0.0.1'::inet);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 7. MLM SYSTEM: COMPLETE DOWNLINE TREE FETCH WITH RBAC VALIDATION
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_complete_downline_tree(p_customer_id UUID)
RETURNS TABLE (
    customer_id UUID,
    name VARCHAR,
    email VARCHAR,
    status VARCHAR,
    plan_id UUID,
    sponsor_id UUID,
    level INT,
    path UUID[]
) AS $$
DECLARE
    v_caller_role VARCHAR;
    v_caller_id UUID;
    v_authorized BOOLEAN := FALSE;
BEGIN
    -- 1. Get authenticated user properties
    v_caller_role := public.get_auth_user_role();
    v_caller_id := auth.uid();

    -- 2. Validate access based on RBAC & relationship
    IF v_caller_role IN ('admin_master', 'gestão_admin', 'suporte', 'financeiro', 'finance', 'auditor', 'operador', 'logística') THEN
        -- Admins and backoffice staff can access any customer's tree
        v_authorized := TRUE;
    ELSIF v_caller_role = 'distributor' THEN
        -- Distributors can access their own tree, or any tree rooted at a customer in their downline
        IF p_customer_id = v_caller_id THEN
            v_authorized := TRUE;
        ELSE
            -- Check if p_customer_id is a direct downline (sponsor_id = v_caller_id)
            -- or indirect downline via network_relationships table
            SELECT EXISTS (
                SELECT 1 
                FROM public.customers c
                WHERE c.id = p_customer_id 
                  AND (c.sponsor_id = v_caller_id OR EXISTS (
                      SELECT 1 
                      FROM public.network_relationships nr 
                      WHERE nr.customer_id = p_customer_id 
                        AND nr.sponsor_customer_id = v_caller_id
                  ))
            ) INTO v_authorized;
        END IF;
    ELSIF v_caller_role = 'customer' THEN
        -- Customers can only access their own detailed node (depth 0, no child downlines)
        IF p_customer_id = v_caller_id THEN
            v_authorized := TRUE;
        END IF;
    END IF;

    -- 3. Block unauthorized access
    IF NOT v_authorized THEN
        RAISE EXCEPTION 'Acesso negado. Você não tem permissão para visualizar a downline deste cliente.';
    END IF;

    -- 4. Calculate tree recursively using CTE (Common Table Expression / Hierarchical query)
    RETURN QUERY
    WITH RECURSIVE downline_cte AS (
        -- Anchor member: select the starting customer
        SELECT 
            c.id, 
            c.name, 
            c.email, 
            c.status::VARCHAR, 
            c.plan_id, 
            c.sponsor_id, 
            0 AS calculated_level, 
            ARRAY[c.id] AS calculated_path
        FROM public.customers c
        WHERE c.id = p_customer_id

        UNION ALL

        -- Recursive member: select child customers sponsored by members in the downline_cte
        SELECT 
            c.id, 
            c.name, 
            c.email, 
            c.status::VARCHAR, 
            c.plan_id, 
            c.sponsor_id, 
            d.calculated_level + 1 AS calculated_level, 
            d.calculated_path || c.id AS calculated_path
        FROM public.customers c
        INNER JOIN downline_cte d ON c.sponsor_id = d.id
        -- Safety condition to prevent loops (cycles)
        WHERE NOT (c.id = ANY(d.calculated_path))
    )
    SELECT 
        cte.id AS customer_id, 
        cte.name::VARCHAR, 
        cte.email::VARCHAR, 
        cte.status::VARCHAR, 
        cte.plan_id, 
        cte.sponsor_id, 
        cte.calculated_level AS level, 
        cte.calculated_path AS path
    FROM downline_cte cte
    ORDER BY cte.calculated_level, cte.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 8. SYSTEM DOWNLINE PATH MATERIALIZATION & RECURSIVE CASCADING TRIGGERS
-- ---------------------------------------------------------------------

-- A. Add path column and GIN index for high-speed unilevel queries
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS path UUID[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_customers_path ON public.customers USING GIN (path);

-- B. Before-Trigger: Automatically calculate ancestor path array and prevent cyclic sponsor loops
CREATE OR REPLACE FUNCTION public.handle_customer_path_change()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_path UUID[];
BEGIN
    IF NEW.sponsor_id IS NULL THEN
        NEW.path := '{}'::UUID[];
    ELSE
        -- Select parent's path and append parent's ID
        SELECT COALESCE(path, '{}'::UUID[]) || NEW.sponsor_id INTO v_parent_path 
        FROM public.customers 
        WHERE id = NEW.sponsor_id;
        
        -- Prevent loops by checking if the customer's own ID is in the parent path
        IF NEW.id = ANY(v_parent_path) THEN
            RAISE EXCEPTION 'Erro de referência cíclica: O cliente % não pode pertencer ao seu próprio downline.', NEW.id;
        END IF;
        
        NEW.path := v_parent_path;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. After-Trigger: Cascade path updates recursively to direct and indirect descendants
CREATE OR REPLACE FUNCTION public.cascade_customer_path_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update path of direct children, which triggers their own cascade
    UPDATE public.customers 
    SET path = NEW.path || NEW.id
    WHERE sponsor_id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D. Attach triggers to customers table
DROP TRIGGER IF EXISTS trigger_customers_path_calc ON public.customers;
CREATE TRIGGER trigger_customers_path_calc
BEFORE INSERT OR UPDATE OF sponsor_id ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.handle_customer_path_change();

DROP TRIGGER IF EXISTS trigger_customers_path_cascade ON public.customers;
CREATE TRIGGER trigger_customers_path_cascade
AFTER UPDATE OF path ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.cascade_customer_path_change();

-- =====================================================================
-- Migration complete! Ensure you run this inside the Supabase Query Editor.
-- =====================================================================
