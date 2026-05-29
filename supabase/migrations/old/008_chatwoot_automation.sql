-- =====================================================================
-- ALLIN Sistema - Sistema Chatwoot e Automações
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela: workspace_settings
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workspace_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    chatwoot_url TEXT,
    chatwoot_api_token TEXT,
    chatwoot_account_id TEXT,
    chatwoot_inbox_id TEXT,
    webhook_secret TEXT DEFAULT encode(extensions.gen_random_bytes(24), 'hex'::TEXT),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: leads
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT,
    phone TEXT,
    email TEXT,
    source TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    score INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::JSONB,
    import_id UUID REFERENCES public.imports(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: imports
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
    total_rows INTEGER DEFAULT 0,
    valid_rows INTEGER DEFAULT 0,
    invalid_rows INTEGER DEFAULT 0,
    mapping JSONB DEFAULT '{}'::JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- Tabela: import_rows
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.import_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_id UUID NOT NULL REFERENCES public.imports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    row_number INTEGER,
    raw JSONB NOT NULL,
    errors TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'invalid', 'error')),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: campaigns
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'paused', 'cancelled')),
    audience_count INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    read_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    chatwoot_campaign_id INTEGER UNIQUE,
    channel TEXT,
    trigger_rules JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: chatwoot_conversations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chatwoot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    chatwoot_conversation_id INTEGER,
    chatwoot_contact_id INTEGER,
    contact_phone TEXT,
    contact_name TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed', 'pending')),
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: chatwoot_messages
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chatwoot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chatwoot_conversations(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('incoming', 'outgoing', 'system')),
    content TEXT NOT NULL,
    sender_type TEXT,
    sender_id TEXT,
    chatwoot_message_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: customer_events
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: labels
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#6B7280',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: templates
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    variables JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: bots
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    bot_type TEXT NOT NULL,
    config JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: automations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    trigger_config JSONB DEFAULT '{}'::JSONB,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: macros
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.macros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    shortcut TEXT UNIQUE,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: audit_log
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    changes JSONB DEFAULT '{}'::JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS workspace_settings_user_id_idx ON public.workspace_settings(user_id);
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS leads_import_id_idx ON public.leads(import_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_tags_idx ON public.leads USING GIN(tags);
CREATE INDEX IF NOT EXISTS imports_user_id_idx ON public.imports(user_id);
CREATE INDEX IF NOT EXISTS imports_status_idx ON public.imports(status);
CREATE INDEX IF NOT EXISTS import_rows_import_id_idx ON public.import_rows(import_id);
CREATE INDEX IF NOT EXISTS import_rows_user_id_idx ON public.import_rows(user_id);
CREATE INDEX IF NOT EXISTS import_rows_lead_id_idx ON public.import_rows(lead_id);
CREATE INDEX IF NOT EXISTS campaigns_user_id_idx ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS campaigns_status_idx ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS campaigns_scheduled_at_idx ON public.campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS chatwoot_conversations_user_id_idx ON public.chatwoot_conversations(user_id);
CREATE INDEX IF NOT EXISTS chatwoot_conversations_campaign_id_idx ON public.chatwoot_conversations(campaign_id);
CREATE INDEX IF NOT EXISTS chatwoot_conversations_lead_id_idx ON public.chatwoot_conversations(lead_id);
CREATE INDEX IF NOT EXISTS chatwoot_conversations_status_idx ON public.chatwoot_conversations(status);
CREATE INDEX IF NOT EXISTS chatwoot_messages_conversation_id_idx ON public.chatwoot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS chatwoot_messages_created_at_idx ON public.chatwoot_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS customer_events_customer_id_idx ON public.customer_events(customer_id);
CREATE INDEX IF NOT EXISTS customer_events_event_type_idx ON public.customer_events(event_type);
CREATE INDEX IF NOT EXISTS customer_events_created_at_idx ON public.customer_events(created_at DESC);
CREATE INDEX IF NOT EXISTS labels_is_active_idx ON public.labels(is_active);
CREATE INDEX IF NOT EXISTS templates_is_active_idx ON public.templates(is_active);
CREATE INDEX IF NOT EXISTS templates_category_idx ON public.templates(category);
CREATE INDEX IF NOT EXISTS bots_is_active_idx ON public.bots(is_active);
CREATE INDEX IF NOT EXISTS bots_type_idx ON public.bots(bot_type);
CREATE INDEX IF NOT EXISTS automations_is_active_idx ON public.automations(is_active);
CREATE INDEX IF NOT EXISTS automations_trigger_type_idx ON public.automations(trigger_type);
CREATE INDEX IF NOT EXISTS macros_is_active_idx ON public.macros(is_active);
CREATE INDEX IF NOT EXISTS macros_shortcut_idx ON public.macros(shortcut);
CREATE INDEX IF NOT EXISTS audit_log_user_id_idx ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS audit_log_action_idx ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS audit_log_entity_type_idx ON public.audit_log(entity_type);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON public.audit_log(created_at DESC);

-- ---------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------
ALTER TABLE public.workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatwoot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatwoot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.macros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------

-- Workspace Settings: acesso próprio
CREATE POLICY "Workspace Settings own read" ON public.workspace_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Workspace Settings own write" ON public.workspace_settings FOR ALL USING (user_id = auth.uid());

-- Leads: acesso próprio
CREATE POLICY "Leads own read" ON public.leads FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Leads own write" ON public.leads FOR ALL USING (user_id = auth.uid());

-- Imports: acesso próprio
CREATE POLICY "Imports own read" ON public.imports FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Imports own write" ON public.imports FOR ALL USING (user_id = auth.uid());

-- Import Rows: acesso próprio
CREATE POLICY "Import Rows own read" ON public.import_rows FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Import Rows own write" ON public.import_rows FOR ALL USING (user_id = auth.uid());

-- Campaigns: acesso próprio
CREATE POLICY "Campaigns own read" ON public.campaigns FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Campaigns own write" ON public.campaigns FOR ALL USING (user_id = auth.uid());

-- Chatwoot Conversations: acesso próprio
CREATE POLICY "Chatwoot Conversations own read" ON public.chatwoot_conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Chatwoot Conversations own write" ON public.chatwoot_conversations FOR ALL USING (user_id = auth.uid());

-- Chatwoot Messages: acesso através da conversa
CREATE POLICY "Chatwoot Messages conversation read" ON public.chatwoot_messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM public.chatwoot_conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Chatwoot Messages conversation write" ON public.chatwoot_messages FOR ALL USING (
  conversation_id IN (SELECT id FROM public.chatwoot_conversations WHERE user_id = auth.uid())
);

-- Customer Events: acesso próprio
CREATE POLICY "Customer Events own read" ON public.customer_events FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Customer Events admin write" ON public.customer_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Labels: leitura pública
CREATE POLICY "Labels public read" ON public.labels FOR SELECT USING (true);
CREATE POLICY "Labels admin write" ON public.labels FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Templates: leitura pública
CREATE POLICY "Templates public read" ON public.templates FOR SELECT USING (true);
CREATE POLICY "Templates admin write" ON public.templates FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Bots: admin only
CREATE POLICY "Bots admin all" ON public.bots FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Automations: admin only
CREATE POLICY "Automations admin all" ON public.automations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Macros: leitura pública
CREATE POLICY "Macros public read" ON public.macros FOR SELECT USING (true);
CREATE POLICY "Macros admin write" ON public.macros FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Audit Log: admin only
CREATE POLICY "Audit Log admin all" ON public.audit_log FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- ---------------------------------------------------------------------
-- Triggers para atualização de timestamps
-- ---------------------------------------------------------------------
CREATE TRIGGER update_workspace_settings_updated_at BEFORE UPDATE ON public.workspace_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chatwoot_conversations_updated_at BEFORE UPDATE ON public.chatwoot_conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_labels_updated_at BEFORE UPDATE ON public.labels
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bots_updated_at BEFORE UPDATE ON public.bots
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.automations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_macros_updated_at BEFORE UPDATE ON public.macros
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
