-- =====================================================================
-- ALLIN Sistema - Tabelas Principais
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensões necessárias
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "vector" SCHEMA public;

-- ---------------------------------------------------------------------
-- Types (Enums)
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.account_type AS ENUM (
      'SALDO_COMPRA',
      'SALDO_SACAVEL',
      'SALDO_NAO_SACAVEL',
      'SALDO_LOJA_ONLINE',
      'BONUS_DIRETOS',
      'BONUS_INDIRETOS'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.transaction_type AS ENUM (
      'CREDIT',
      'DEBIT',
      'BONUS_CREDIT',
      'WITHDRAWAL',
      'TRANSFER'
    );
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- Tabela: profiles
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: customers
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_comprador TEXT UNIQUE,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    documento_cpf_cnpj TEXT,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    pais TEXT DEFAULT 'Brasil',
    data_cadastro TIMESTAMPTZ DEFAULT now(),
    data_ultima_compra DATE,
    plano_id TEXT,
    plan_name TEXT,
    qualification TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: products
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price NUMERIC NOT NULL CHECK (price > 0),
    cost_price NUMERIC CHECK (cost_price >= 0),
    sku TEXT UNIQUE,
    manufacturer TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    weight NUMERIC,
    height NUMERIC,
    width NUMERIC,
    depth NUMERIC,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: product_variants
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price NUMERIC NOT NULL CHECK (price > 0),
    cost_price NUMERIC CHECK (cost_price >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    attributes JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: purchase_types
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.purchase_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: orders
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE,
    data_criacao TIMESTAMPTZ DEFAULT now(),
    data_pagamento TIMESTAMPTZ,
    hora_criacao TEXT,
    hora_pagamento TEXT,
    valor_total_pedido NUMERIC CHECK (valor_total_pedido >= 0),
    custo_frete NUMERIC DEFAULT 0 CHECK (custo_frete >= 0),
    forma_pagamento TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded', 'processing')),
    pago BOOLEAN DEFAULT false,
    cancelado BOOLEAN DEFAULT false,
    comprador TEXT,
    usuario TEXT,
    documento_cpf_cnpj TEXT,
    loja TEXT,
    grupos_consumo TEXT,
    normalized_data JSONB DEFAULT '{}'::JSONB,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: order_items
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC NOT NULL CHECK (unit_price > 0),
    total_price NUMERIC NOT NULL CHECK (total_price >= 0),
    discount NUMERIC DEFAULT 0 CHECK (discount >= 0),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: staging_orders
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staging_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'validated', 'error')),
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: staging_order_items
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staging_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staging_order_id UUID NOT NULL REFERENCES public.staging_orders(id) ON DELETE CASCADE,
    raw_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'validated', 'error')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: staging_orders_detalhado
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staging_orders_detalhado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_id UUID,
    codigo_pedido TEXT,
    comprador TEXT,
    usuario TEXT,
    documento_cpf_cnpj TEXT,
    loja TEXT,
    grupos_consumo TEXT,
    data_criacao_pedido DATE,
    hora_criacao_pedido TEXT,
    pedido_pago BOOLEAN DEFAULT false,
    data_pagamento_pedido DATE,
    hora_pagamento_pedido TEXT,
    forma_pagamento TEXT,
    valor_total NUMERIC,
    custo_frete NUMERIC,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'error')),
    normalized_data JSONB DEFAULT '{}'::JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: staging_customers
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staging_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'validated', 'error')),
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS customers_id_comprador_idx ON public.customers(id_comprador);
CREATE INDEX IF NOT EXISTS customers_email_idx ON public.customers(email);
CREATE INDEX IF NOT EXISTS customers_documento_idx ON public.customers(documento_cpf_cnpj);
CREATE INDEX IF NOT EXISTS customers_status_idx ON public.customers(status);
CREATE INDEX IF NOT EXISTS products_sku_idx ON public.products(sku);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products(is_active);
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS product_variants_sku_idx ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_data_criacao_idx ON public.orders(data_criacao DESC);
CREATE INDEX IF NOT EXISTS orders_pago_idx ON public.orders(pago);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS staging_orders_status_idx ON public.staging_orders(status);
CREATE INDEX IF NOT EXISTS staging_orders_created_at_idx ON public.staging_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS staging_order_items_staging_order_id_idx ON public.staging_order_items(staging_order_id);
CREATE INDEX IF NOT EXISTS staging_orders_detalhado_import_id_idx ON public.staging_orders_detalhado(import_id);
CREATE INDEX IF NOT EXISTS staging_orders_detalhado_codigo_pedido_idx ON public.staging_orders_detalhado(codigo_pedido);
CREATE INDEX IF NOT EXISTS staging_customers_status_idx ON public.staging_customers(status);

-- ---------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staging_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staging_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staging_orders_detalhado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staging_customers ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------

-- Profiles: acesso próprio
CREATE POLICY "Profiles own read" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Profiles own write" ON public.profiles FOR ALL USING (user_id = auth.uid());

-- Customers: leitura pública, escrita para admin
CREATE POLICY "Customers public read" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Customers admin write" ON public.customers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Products: leitura pública
CREATE POLICY "Products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products admin write" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Product Variants: leitura pública
CREATE POLICY "Product Variants public read" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Product Variants admin write" ON public.product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Purchase Types: leitura pública
CREATE POLICY "Purchase Types public read" ON public.purchase_types FOR SELECT USING (true);
CREATE POLICY "Purchase Types admin write" ON public.purchase_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Orders: acesso próprio ou admin
CREATE POLICY "Orders own read" ON public.orders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
  OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Orders admin write" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Order Items: acesso através do pedido
CREATE POLICY "Order Items order read" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)))
  OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Staging tables: admin only
CREATE POLICY "Staging Orders admin all" ON public.staging_orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Staging Order Items admin all" ON public.staging_order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Staging Orders Detalhado admin all" ON public.staging_orders_detalhado FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Staging Customers admin all" ON public.staging_customers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- ---------------------------------------------------------------------
-- Funções de Trigger para atualização de timestamps
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_types_updated_at BEFORE UPDATE ON public.purchase_types
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staging_orders_detalhado_updated_at BEFORE UPDATE ON public.staging_orders_detalhado
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
