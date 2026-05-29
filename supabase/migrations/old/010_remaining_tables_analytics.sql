-- =====================================================================
-- ALLIN Sistema - Tabelas Restantes e Schema Analytics
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela: virtual_store_orders
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.virtual_store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_pedido TEXT NOT NULL UNIQUE,
    cliente_nome TEXT,
    cliente_email TEXT,
    cliente_telefone TEXT,
    cliente_cpf TEXT,
    valor_total NUMERIC CHECK (valor_total >= 0),
    status TEXT,
    pagamento_confirmado BOOLEAN DEFAULT false,
    data_pagamento TIMESTAMPTZ,
    forma_pagamento TEXT,
    data_criacao TIMESTAMPTZ DEFAULT now(),
    data_modificacao TIMESTAMPTZ DEFAULT now(),
    notificar_cliente BOOLEAN DEFAULT false,
    fatura_gerada BOOLEAN DEFAULT false,
    data_fatura TIMESTAMPTZ,
    fatura_url TEXT,
    etiqueta_envio_url TEXT,
    comanda_impressao_url TEXT,
    comentario TEXT,
    distribuidor_id TEXT,
    loja_id TEXT,
    tipo_pedido TEXT
);

-- ---------------------------------------------------------------------
-- Tabela: virtual_store_order_history
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.virtual_store_order_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES public.virtual_store_orders(id) ON DELETE CASCADE,
    comentario TEXT,
    status TEXT,
    notificar_cliente BOOLEAN DEFAULT false,
    data_criacao TIMESTAMPTZ DEFAULT now(),
    usuario_id TEXT
);

-- ---------------------------------------------------------------------
-- Schema Analytics
-- ---------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS analytics;

-- ---------------------------------------------------------------------
-- Tabela: analytics.ai_insights
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: analytics.ai_conversations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: analytics.ai_messages
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES analytics.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    sql_generated TEXT,
    result_rows JSONB,
    chart_config JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Índices para tabelas restantes
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS virtual_store_orders_numero_pedido_idx ON public.virtual_store_orders(numero_pedido);
CREATE INDEX IF NOT EXISTS virtual_store_orders_status_idx ON public.virtual_store_orders(status);
CREATE INDEX IF NOT EXISTS virtual_store_orders_data_criacao_idx ON public.virtual_store_orders(data_criacao DESC);
CREATE INDEX IF NOT EXISTS virtual_store_orders_distribuidor_id_idx ON public.virtual_store_orders(distribuidor_id);
CREATE INDEX IF NOT EXISTS virtual_store_order_history_pedido_id_idx ON public.virtual_store_order_history(pedido_id);
CREATE INDEX IF NOT EXISTS virtual_store_order_history_data_criacao_idx ON public.virtual_store_order_history(data_criacao DESC);

-- ---------------------------------------------------------------------
-- Índices para analytics
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS ai_insights_created_idx ON analytics.ai_insights(created_at DESC);
CREATE INDEX IF NOT EXISTS ai_insights_type_idx ON analytics.ai_insights(type);
CREATE INDEX IF NOT EXISTS ai_insights_severity_idx ON analytics.ai_insights(severity);
CREATE INDEX IF NOT EXISTS ai_conversations_user_idx ON analytics.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS ai_conversations_created_idx ON analytics.ai_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS ai_messages_conv_idx ON analytics.ai_messages(conversation_id, created_at);

-- ---------------------------------------------------------------------
-- Row Level Security (RLS) para tabelas restantes
-- ---------------------------------------------------------------------
ALTER TABLE public.virtual_store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_store_order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.ai_messages ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- RLS Policies para tabelas restantes
-- ---------------------------------------------------------------------

-- Virtual Store Orders: admin only
CREATE POLICY "Virtual Store Orders admin all" ON public.virtual_store_orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Virtual Store Order History: admin only
CREATE POLICY "Virtual Store Order History admin all" ON public.virtual_store_order_history FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- AI Insights: admin only
CREATE POLICY "AI Insights admin all" ON analytics.ai_insights FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- AI Conversations: acesso próprio
CREATE POLICY "AI Conversations own read" ON analytics.ai_conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "AI Conversations own write" ON analytics.ai_conversations FOR ALL USING (user_id = auth.uid());

-- AI Messages: acesso através da conversa
CREATE POLICY "AI Messages conversation read" ON analytics.ai_messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM analytics.ai_conversations WHERE user_id = auth.uid())
);
CREATE POLICY "AI Messages conversation write" ON analytics.ai_messages FOR ALL USING (
  conversation_id IN (SELECT id FROM analytics.ai_conversations WHERE user_id = auth.uid())
);

-- ---------------------------------------------------------------------
-- Triggers para atualização de timestamps
-- ---------------------------------------------------------------------
CREATE TRIGGER update_virtual_store_orders_data_modificacao BEFORE UPDATE ON public.virtual_store_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------
-- Função segura para execução de SQL gerada por IA (SOMENTE SELECT)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION analytics.exec_safe_sql(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, analytics
AS $$
DECLARE
  result JSONB;
  forbidden TEXT[] := ARRAY['INSERT','UPDATE','DELETE','DROP','TRUNCATE','ALTER','GRANT','REVOKE','CREATE','COMMENT','VACUUM','COPY'];
  word TEXT;
  lower_q TEXT;
BEGIN
  lower_q := LOWER(query_text);

  -- Deve começar com SELECT ou WITH
  IF NOT (lower_q ~ '^\s*(select|with)\s') THEN
    RAISE EXCEPTION 'Apenas queries SELECT/WITH são permitidas';
  END IF;

  -- Bloqueia múltiplos statements
  IF POSITION(';' IN TRIM(TRAILING ';' FROM lower_q)) > 0 THEN
    RAISE EXCEPTION 'Múltiplos statements não são permitidos';
  END IF;

  -- Bloqueia palavras destrutivas como tokens isolados
  FOREACH word IN ARRAY forbidden LOOP
    IF lower_q ~ ('\m' || word || '\M') THEN
      RAISE EXCEPTION 'Palavra reservada não permitida: %', word;
    END IF;
  END LOOP;

  EXECUTE FORMAT('SELECT COALESCE(jsonb_agg(t), ''[]''::jsonb) FROM (%s LIMIT 1000) t', RTRIM(query_text, ';'))
    INTO result;
  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION analytics.exec_safe_sql(TEXT) FROM public;
GRANT EXECUTE ON FUNCTION analytics.exec_safe_sql(TEXT) TO service_role;

-- ---------------------------------------------------------------------
-- Helper para refresh de materialized views (se existirem)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION analytics.refresh_all()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  -- Função placeholder para refresh de views se necessário
  NULL;
END;
$$;
