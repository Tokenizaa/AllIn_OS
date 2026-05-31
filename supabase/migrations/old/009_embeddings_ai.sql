-- =====================================================================
-- ALLIN Sistema - Sistema de Embeddings e IA
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela: customer_embeddings
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: product_embeddings
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: conversation_embeddings
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversation_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id TEXT NOT NULL,
    message_id TEXT,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: insight_embeddings
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.insight_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_type TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: ai_prompt_context
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_prompt_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    context_type TEXT NOT NULL,
    context_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: customer_metrics
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    total_orders INTEGER DEFAULT 0 CHECK (total_orders >= 0),
    total_spent NUMERIC DEFAULT 0 CHECK (total_spent >= 0),
    average_order_value NUMERIC DEFAULT 0 CHECK (average_order_value >= 0),
    last_order_date DATE,
    first_order_date DATE,
    days_since_last_order INTEGER,
    order_frequency_days NUMERIC,
    preferred_categories TEXT[],
    preferred_products TEXT[],
    churn_score INTEGER DEFAULT 0 CHECK (churn_score >= 0 AND churn_score <= 100),
    ltv NUMERIC DEFAULT 0 CHECK (ltv >= 0),
    segment TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    calculated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(customer_id)
);

-- ---------------------------------------------------------------------
-- Tabela: customer_scores
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    score_type TEXT NOT NULL,
    score NUMERIC NOT NULL,
    score_details JSONB DEFAULT '{}'::JSONB,
    calculated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(customer_id, score_type)
);

-- ---------------------------------------------------------------------
-- Tabela: product_metrics
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    total_sold INTEGER DEFAULT 0 CHECK (total_sold >= 0),
    total_revenue NUMERIC DEFAULT 0 CHECK (total_revenue >= 0),
    average_rating NUMERIC CHECK (average_rating >= 0 AND average_rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
    conversion_rate NUMERIC CHECK (conversion_rate >= 0 AND conversion_rate <= 100),
    return_rate NUMERIC CHECK (return_rate >= 0 AND return_rate <= 100),
    stock_turnover_days NUMERIC CHECK (stock_turnover_days >= 0),
    metadata JSONB DEFAULT '{}'::JSONB,
    calculated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id)
);

-- ---------------------------------------------------------------------
-- Tabela: product_affinities
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_affinities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_a_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_b_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    affinity_score NUMERIC NOT NULL CHECK (affinity_score >= 0 AND affinity_score <= 1),
    co_occurrence_count INTEGER DEFAULT 0 CHECK (co_occurrence_count >= 0),
    calculated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    CHECK (product_a_id < product_b_id),
    UNIQUE(product_a_id, product_b_id)
);

-- ---------------------------------------------------------------------
-- Tabela: customer_product_affinities
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_product_affinities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    affinity_score NUMERIC NOT NULL CHECK (affinity_score >= 0 AND affinity_score <= 1),
    purchase_count INTEGER DEFAULT 0 CHECK (purchase_count >= 0),
    last_purchased_at TIMESTAMPTZ,
    calculated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(customer_id, product_id)
);

-- ---------------------------------------------------------------------
-- Tabela: customer_segments
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_name TEXT NOT NULL UNIQUE,
    segment_description TEXT,
    segment_criteria JSONB NOT NULL,
    customer_count INTEGER DEFAULT 0 CHECK (customer_count >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: customer_labels
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(customer_id, label_id)
);

-- ---------------------------------------------------------------------
-- Tabela: customer_predictions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    prediction_type TEXT NOT NULL,
    prediction_value NUMERIC NOT NULL,
    prediction_confidence NUMERIC CHECK (prediction_confidence >= 0 AND prediction_confidence <= 1),
    prediction_details JSONB DEFAULT '{}'::JSONB,
    model_version TEXT,
    predicted_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: campaign_intelligence
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    intelligence_type TEXT NOT NULL,
    intelligence_data JSONB NOT NULL,
    confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),
    generated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: order_items_normalized
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items_normalized (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC NOT NULL CHECK (unit_price > 0),
    total_price NUMERIC NOT NULL CHECK (total_price >= 0),
    normalized_data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS customer_embeddings_customer_id_idx ON public.customer_embeddings(customer_id);
CREATE INDEX IF NOT EXISTS customer_embeddings_embedding_idx ON public.customer_embeddings USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS product_embeddings_product_id_idx ON public.product_embeddings(product_id);
CREATE INDEX IF NOT EXISTS product_embeddings_embedding_idx ON public.product_embeddings USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS conversation_embeddings_conversation_id_idx ON public.conversation_embeddings(conversation_id);
CREATE INDEX IF NOT EXISTS conversation_embeddings_embedding_idx ON public.conversation_embeddings USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS insight_embeddings_type_idx ON public.insight_embeddings(insight_type);
CREATE INDEX IF NOT EXISTS insight_embeddings_embedding_idx ON public.insight_embeddings USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS ai_prompt_context_user_id_idx ON public.ai_prompt_context(user_id);
CREATE INDEX IF NOT EXISTS ai_prompt_context_type_idx ON public.ai_prompt_context(context_type);
CREATE INDEX IF NOT EXISTS ai_prompt_context_is_active_idx ON public.ai_prompt_context(is_active);
CREATE INDEX IF NOT EXISTS ai_prompt_context_expires_at_idx ON public.ai_prompt_context(expires_at);
CREATE INDEX IF NOT EXISTS customer_metrics_customer_id_idx ON public.customer_metrics(customer_id);
CREATE INDEX IF NOT EXISTS customer_metrics_segment_idx ON public.customer_metrics(segment);
CREATE INDEX IF NOT EXISTS customer_metrics_churn_score_idx ON public.customer_metrics(churn_score);
CREATE INDEX IF NOT EXISTS customer_scores_customer_id_idx ON public.customer_scores(customer_id);
CREATE INDEX IF NOT EXISTS customer_scores_type_idx ON public.customer_scores(score_type);
CREATE INDEX IF NOT EXISTS product_metrics_product_id_idx ON public.product_metrics(product_id);
CREATE INDEX IF NOT EXISTS product_affinities_product_a_idx ON public.product_affinities(product_a_id);
CREATE INDEX IF NOT EXISTS product_affinities_product_b_idx ON public.product_affinities(product_b_id);
CREATE INDEX IF NOT EXISTS product_affinities_score_idx ON public.product_affinities(affinity_score);
CREATE INDEX IF NOT EXISTS customer_product_affinities_customer_id_idx ON public.customer_product_affinities(customer_id);
CREATE INDEX IF NOT EXISTS customer_product_affinities_product_id_idx ON public.customer_product_affinities(product_id);
CREATE INDEX IF NOT EXISTS customer_product_affinities_score_idx ON public.customer_product_affinities(affinity_score);
CREATE INDEX IF NOT EXISTS customer_segments_is_active_idx ON public.customer_segments(is_active);
CREATE INDEX IF NOT EXISTS customer_labels_customer_id_idx ON public.customer_labels(customer_id);
CREATE INDEX IF NOT EXISTS customer_labels_label_id_idx ON public.customer_labels(label_id);
CREATE INDEX IF NOT EXISTS customer_predictions_customer_id_idx ON public.customer_predictions(customer_id);
CREATE INDEX IF NOT EXISTS customer_predictions_type_idx ON public.customer_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS customer_predictions_predicted_at_idx ON public.customer_predictions(predicted_at DESC);
CREATE INDEX IF NOT EXISTS campaign_intelligence_campaign_id_idx ON public.campaign_intelligence(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_intelligence_type_idx ON public.campaign_intelligence(intelligence_type);
CREATE INDEX IF NOT EXISTS order_items_normalized_order_id_idx ON public.order_items_normalized(order_id);
CREATE INDEX IF NOT EXISTS order_items_normalized_product_id_idx ON public.order_items_normalized(product_id);

-- ---------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------
ALTER TABLE public.customer_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompt_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_affinities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_product_affinities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items_normalized ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------

-- Embeddings tables: admin only
CREATE POLICY "Customer Embeddings admin all" ON public.customer_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Product Embeddings admin all" ON public.product_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Conversation Embeddings admin all" ON public.conversation_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Insight Embeddings admin all" ON public.insight_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- AI Prompt Context: acesso próprio
CREATE POLICY "AI Prompt Context own read" ON public.ai_prompt_context FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "AI Prompt Context own write" ON public.ai_prompt_context FOR ALL USING (user_id = auth.uid());

-- Customer Metrics: acesso próprio
CREATE POLICY "Customer Metrics own read" ON public.customer_metrics FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Customer Metrics admin write" ON public.customer_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Customer Scores: acesso próprio
CREATE POLICY "Customer Scores own read" ON public.customer_scores FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Customer Scores admin write" ON public.customer_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Product Metrics: leitura pública
CREATE POLICY "Product Metrics public read" ON public.product_metrics FOR SELECT USING (true);
CREATE POLICY "Product Metrics admin write" ON public.product_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Product Affinities: leitura pública
CREATE POLICY "Product Affinities public read" ON public.product_affinities FOR SELECT USING (true);
CREATE POLICY "Product Affinities admin write" ON public.product_affinities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Customer Product Affinities: acesso próprio
CREATE POLICY "Customer Product Affinities own read" ON public.customer_product_affinities FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Customer Product Affinities admin write" ON public.customer_product_affinities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Customer Segments: leitura pública
CREATE POLICY "Customer Segments public read" ON public.customer_segments FOR SELECT USING (true);
CREATE POLICY "Customer Segments admin write" ON public.customer_segments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Customer Labels: acesso próprio
CREATE POLICY "Customer Labels own read" ON public.customer_labels FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Customer Labels admin write" ON public.customer_labels FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Customer Predictions: acesso próprio
CREATE POLICY "Customer Predictions own read" ON public.customer_predictions FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Customer Predictions admin write" ON public.customer_predictions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Campaign Intelligence: admin only
CREATE POLICY "Campaign Intelligence admin all" ON public.campaign_intelligence FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Order Items Normalized: acesso próprio
CREATE POLICY "Order Items Normalized own read" ON public.order_items_normalized FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)))
);
CREATE POLICY "Order Items Normalized admin write" ON public.order_items_normalized FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- ---------------------------------------------------------------------
-- Triggers para atualização de timestamps
-- ---------------------------------------------------------------------
CREATE TRIGGER update_customer_embeddings_updated_at BEFORE UPDATE ON public.customer_embeddings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_embeddings_updated_at BEFORE UPDATE ON public.product_embeddings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_prompt_context_updated_at BEFORE UPDATE ON public.ai_prompt_context
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_metrics_updated_at BEFORE UPDATE ON public.customer_metrics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_metrics_updated_at BEFORE UPDATE ON public.product_metrics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_segments_updated_at BEFORE UPDATE ON public.customer_segments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
