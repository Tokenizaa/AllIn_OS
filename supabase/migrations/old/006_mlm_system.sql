-- =====================================================================
-- ALLIN Sistema - Sistema MLM
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela: plans
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC DEFAULT 0 CHECK (price >= 0),
    includes TEXT[],
    bonus_config JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: plan_benefits
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plan_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    benefit_name TEXT NOT NULL,
    benefit_description TEXT,
    benefit_type TEXT,
    benefit_value JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: plan_versions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plan_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    changes JSONB DEFAULT '{}'::JSONB,
    effective_date TIMESTAMPTZ DEFAULT now(),
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: customer_plans
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ DEFAULT now(),
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: qualifications
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    qualification_type TEXT DEFAULT 'MLM',
    description TEXT,
    min_value NUMERIC DEFAULT 0 CHECK (min_value >= 0),
    max_value NUMERIC CHECK (max_value > min_value),
    conditions JSONB DEFAULT '{}'::JSONB,
    benefits JSONB DEFAULT '{}'::JSONB,
    level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: user_qualifications
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    qualification_id UUID NOT NULL REFERENCES public.qualifications(id) ON DELETE CASCADE,
    achieved_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, qualification_id)
);

-- ---------------------------------------------------------------------
-- Tabela: network_relationships
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.network_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id TEXT NOT NULL,
    child_id TEXT NOT NULL,
    relationship_type TEXT DEFAULT 'sponsor',
    level INTEGER DEFAULT 1,
    position TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(parent_id, child_id)
);

-- ---------------------------------------------------------------------
-- Tabela: network_nodes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.network_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distributor_id TEXT NOT NULL UNIQUE,
    sponsor_id TEXT,
    position TEXT,
    level INTEGER DEFAULT 1,
    left_leg_volume NUMERIC DEFAULT 0 CHECK (left_leg_volume >= 0),
    right_leg_volume NUMERIC DEFAULT 0 CHECK (right_leg_volume >= 0),
    total_volume NUMERIC DEFAULT 0 CHECK (total_volume >= 0),
    active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: bonuses
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bonuses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    distributor_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('DIRECT', 'UNILEVEL', 'BINARY', 'LEADERSHIP', 'POOL')),
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    period DATE,
    description TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    paid_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- Tabela: bonus_calculations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bonus_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distributor_id TEXT NOT NULL,
    bonus_type TEXT NOT NULL,
    period DATE NOT NULL,
    base_amount NUMERIC DEFAULT 0 CHECK (base_amount >= 0),
    multiplier NUMERIC DEFAULT 1 CHECK (multiplier > 0),
    final_amount NUMERIC DEFAULT 0 CHECK (final_amount >= 0),
    calculation_details JSONB DEFAULT '{}'::JSONB,
    status TEXT DEFAULT 'CALCULATED' CHECK (status IN ('CALCULATED', 'APPROVED', 'PAID', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: bonus_rules
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bonus_rules (
    id TEXT PRIMARY KEY,
    rule_type TEXT NOT NULL,
    rule_key TEXT NOT NULL,
    rule_value NUMERIC NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: generation_bonuses
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.generation_bonuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    generation_level INTEGER NOT NULL CHECK (generation_level > 0),
    bonus_percentage NUMERIC NOT NULL CHECK (bonus_percentage > 0),
    max_bonus_percentage NUMERIC CHECK (max_bonus_percentage > bonus_percentage),
    conditions JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: mlm_campaigns
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mlm_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    target_audience JSONB DEFAULT '{}'::JSONB,
    budget NUMERIC DEFAULT 0 CHECK (budget >= 0),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: mlm_campaign_plans
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mlm_campaign_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.mlm_campaigns(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
    bonus_multiplier NUMERIC DEFAULT 1 CHECK (bonus_multiplier > 0),
    special_conditions JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: mlm_campaign_bonuses
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mlm_campaign_bonuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.mlm_campaigns(id) ON DELETE CASCADE,
    bonus_type TEXT NOT NULL,
    bonus_amount NUMERIC NOT NULL CHECK (bonus_amount >= 0),
    conditions JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: customer_network_metrics
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_network_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    total_downline INTEGER DEFAULT 0 CHECK (total_downline >= 0),
    active_downline INTEGER DEFAULT 0 CHECK (active_downline >= 0),
    total_volume NUMERIC DEFAULT 0 CHECK (total_volume >= 0),
    personal_volume NUMERIC DEFAULT 0 CHECK (personal_volume >= 0),
    level INTEGER DEFAULT 1,
    rank TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    calculated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS plans_slug_idx ON public.plans(slug);
CREATE INDEX IF NOT EXISTS plans_is_active_idx ON public.plans(is_active);
CREATE INDEX IF NOT EXISTS plan_benefits_plan_id_idx ON public.plan_benefits(plan_id);
CREATE INDEX IF NOT EXISTS plan_versions_plan_id_idx ON public.plan_versions(plan_id);
CREATE INDEX IF NOT EXISTS customer_plans_customer_id_idx ON public.customer_plans(customer_id);
CREATE INDEX IF NOT EXISTS customer_plans_plan_id_idx ON public.customer_plans(plan_id);
CREATE INDEX IF NOT EXISTS customer_plans_is_active_idx ON public.customer_plans(is_active);
CREATE INDEX IF NOT EXISTS qualifications_name_idx ON public.qualifications(name);
CREATE INDEX IF NOT EXISTS qualifications_level_idx ON public.qualifications(level);
CREATE INDEX IF NOT EXISTS qualifications_is_active_idx ON public.qualifications(is_active);
CREATE INDEX IF NOT EXISTS user_qualifications_user_id_idx ON public.user_qualifications(user_id);
CREATE INDEX IF NOT EXISTS user_qualifications_qualification_id_idx ON public.user_qualifications(qualification_id);
CREATE INDEX IF NOT EXISTS user_qualifications_is_active_idx ON public.user_qualifications(is_active);
CREATE INDEX IF NOT EXISTS network_relationships_parent_id_idx ON public.network_relationships(parent_id);
CREATE INDEX IF NOT EXISTS network_relationships_child_id_idx ON public.network_relationships(child_id);
CREATE INDEX IF NOT EXISTS network_relationships_type_idx ON public.network_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS network_nodes_distributor_id_idx ON public.network_nodes(distributor_id);
CREATE INDEX IF NOT EXISTS network_nodes_sponsor_id_idx ON public.network_nodes(sponsor_id);
CREATE INDEX IF NOT EXISTS network_nodes_level_idx ON public.network_nodes(level);
CREATE INDEX IF NOT EXISTS network_nodes_active_idx ON public.network_nodes(active);
CREATE INDEX IF NOT EXISTS bonuses_distributor_id_idx ON public.bonuses(distributor_id);
CREATE INDEX IF NOT EXISTS bonuses_type_idx ON public.bonuses(type);
CREATE INDEX IF NOT EXISTS bonuses_status_idx ON public.bonuses(status);
CREATE INDEX IF NOT EXISTS bonuses_period_idx ON public.bonuses(period);
CREATE INDEX IF NOT EXISTS bonus_calculations_distributor_id_idx ON public.bonus_calculations(distributor_id);
CREATE INDEX IF NOT EXISTS bonus_calculations_period_idx ON public.bonus_calculations(period);
CREATE INDEX IF NOT EXISTS bonus_calculations_status_idx ON public.bonus_calculations(status);
CREATE INDEX IF NOT EXISTS bonus_rules_type_idx ON public.bonus_rules(rule_type);
CREATE INDEX IF NOT EXISTS bonus_rules_is_active_idx ON public.bonus_rules(is_active);
CREATE INDEX IF NOT EXISTS generation_bonuses_plan_id_idx ON public.generation_bonuses(plan_id);
CREATE INDEX IF NOT EXISTS generation_bonuses_level_idx ON public.generation_bonuses(generation_level);
CREATE INDEX IF NOT EXISTS mlm_campaigns_status_idx ON public.mlm_campaigns(status);
CREATE INDEX IF NOT EXISTS mlm_campaigns_dates_idx ON public.mlm_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS mlm_campaign_plans_campaign_id_idx ON public.mlm_campaign_plans(campaign_id);
CREATE INDEX IF NOT EXISTS mlm_campaign_bonuses_campaign_id_idx ON public.mlm_campaign_bonuses(campaign_id);
CREATE INDEX IF NOT EXISTS customer_network_metrics_customer_id_idx ON public.customer_network_metrics(customer_id);
CREATE INDEX IF NOT EXISTS customer_network_metrics_level_idx ON public.customer_network_metrics(level);

-- ---------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mlm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mlm_campaign_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mlm_campaign_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_network_metrics ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------

-- Plans: leitura pública, escrita admin
CREATE POLICY "Plans public read" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Plans admin write" ON public.plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Plan Benefits: leitura pública
CREATE POLICY "Plan Benefits public read" ON public.plan_benefits FOR SELECT USING (true);
CREATE POLICY "Plan Benefits admin write" ON public.plan_benefits FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Plan Versions: leitura pública
CREATE POLICY "Plan Versions public read" ON public.plan_versions FOR SELECT USING (true);
CREATE POLICY "Plan Versions admin write" ON public.plan_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Customer Plans: acesso próprio
CREATE POLICY "Customer Plans own read" ON public.customer_plans FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Customer Plans admin write" ON public.customer_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Qualifications: leitura pública
CREATE POLICY "Qualifications public read" ON public.qualifications FOR SELECT USING (true);
CREATE POLICY "Qualifications admin write" ON public.qualifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- User Qualifications: acesso próprio
CREATE POLICY "User Qualifications own read" ON public.user_qualifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "User Qualifications own write" ON public.user_qualifications FOR ALL USING (user_id = auth.uid());

-- Network Relationships: leitura para admin
CREATE POLICY "Network Relationships admin read" ON public.network_relationships FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Network Relationships admin write" ON public.network_relationships FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Network Nodes: leitura para admin
CREATE POLICY "Network Nodes admin read" ON public.network_nodes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Network Nodes admin write" ON public.network_nodes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Bonuses: acesso próprio ou admin
CREATE POLICY "Bonuses own read" ON public.bonuses FOR SELECT USING (
  distributor_id = (SELECT id_comprador FROM public.customers LIMIT 1)
  OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Bonuses admin write" ON public.bonuses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Bonus Calculations: acesso próprio ou admin
CREATE POLICY "Bonus Calculations own read" ON public.bonus_calculations FOR SELECT USING (
  distributor_id = (SELECT id_comprador FROM public.customers LIMIT 1)
  OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Bonus Calculations admin write" ON public.bonus_calculations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Bonus Rules: leitura pública
CREATE POLICY "Bonus Rules public read" ON public.bonus_rules FOR SELECT USING (true);
CREATE POLICY "Bonus Rules admin write" ON public.bonus_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Generation Bonuses: leitura pública
CREATE POLICY "Generation Bonuses public read" ON public.generation_bonuses FOR SELECT USING (true);
CREATE POLICY "Generation Bonuses admin write" ON public.generation_bonuses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- MLM Campaigns: leitura para admin
CREATE POLICY "MLM Campaigns admin read" ON public.mlm_campaigns FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "MLM Campaigns admin write" ON public.mlm_campaigns FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- MLM Campaign Plans: leitura para admin
CREATE POLICY "MLM Campaign Plans admin read" ON public.mlm_campaign_plans FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "MLM Campaign Plans admin write" ON public.mlm_campaign_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- MLM Campaign Bonuses: leitura para admin
CREATE POLICY "MLM Campaign Bonuses admin read" ON public.mlm_campaign_bonuses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "MLM Campaign Bonuses admin write" ON public.mlm_campaign_bonuses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Customer Network Metrics: acesso próprio ou admin
CREATE POLICY "Customer Network Metrics own read" ON public.customer_network_metrics FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
  OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Customer Network Metrics admin write" ON public.customer_network_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- ---------------------------------------------------------------------
-- Triggers para atualização de timestamps
-- ---------------------------------------------------------------------
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plan_benefits_updated_at BEFORE UPDATE ON public.plan_benefits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_plans_updated_at BEFORE UPDATE ON public.customer_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qualifications_updated_at BEFORE UPDATE ON public.qualifications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_network_relationships_updated_at BEFORE UPDATE ON public.network_relationships
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_network_nodes_updated_at BEFORE UPDATE ON public.network_nodes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bonus_rules_updated_at BEFORE UPDATE ON public.bonus_rules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_generation_bonuses_updated_at BEFORE UPDATE ON public.generation_bonuses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mlm_campaigns_updated_at BEFORE UPDATE ON public.mlm_campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mlm_campaign_plans_updated_at BEFORE UPDATE ON public.mlm_campaign_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mlm_campaign_bonuses_updated_at BEFORE UPDATE ON public.mlm_campaign_bonuses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_network_metrics_updated_at BEFORE UPDATE ON public.customer_network_metrics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
