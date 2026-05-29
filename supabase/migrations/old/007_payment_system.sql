-- =====================================================================
-- ALLIN Sistema - Sistema de Pagamentos
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela: wallets
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    saldo_sacavel NUMERIC DEFAULT 0 CHECK (saldo_sacavel >= 0),
    saldo_nao_sacavel NUMERIC DEFAULT 0 CHECK (saldo_nao_sacavel >= 0),
    saldo_loja_online NUMERIC DEFAULT 0 CHECK (saldo_loja_online >= 0),
    saldo_perdido NUMERIC DEFAULT 0 CHECK (saldo_perdido >= 0),
    saldo_a_receber NUMERIC DEFAULT 0 CHECK (saldo_a_receber >= 0),
    saldo_para_compra NUMERIC DEFAULT 0 CHECK (saldo_para_compra >= 0),
    total_recebido NUMERIC DEFAULT 0 CHECK (total_recebido >= 0),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(customer_id)
);

-- ---------------------------------------------------------------------
-- Tabela: accounts
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_type public.account_type NOT NULL,
    balance NUMERIC DEFAULT 0 CHECK (balance >= 0),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, account_type)
);

-- ---------------------------------------------------------------------
-- Tabela: account_transactions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.account_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    transaction_type public.transaction_type NOT NULL,
    amount NUMERIC NOT NULL,
    balance_before NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    description TEXT,
    related_bonus_id TEXT REFERENCES public.bonuses(id),
    related_order_id UUID REFERENCES public.orders(id),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: transactions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount != 0),
    balance_before NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    description TEXT,
    reference_id TEXT,
    reference_type TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: payments
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    payment_method TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: payment_methods
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: gateways
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gateways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    gateway_type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}'::JSONB,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: gateway_webhooks
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gateway_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_id UUID NOT NULL REFERENCES public.gateways(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    webhook_url TEXT NOT NULL,
    secret_key TEXT,
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: payment_attempts
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    gateway_id UUID REFERENCES public.gateways(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    gateway_response JSONB DEFAULT '{}'::JSONB,
    gateway_transaction_id TEXT,
    error_message TEXT,
    attempted_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- Tabela: payment_installments
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL CHECK (installment_number > 0),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    due_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: installment_rules
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.installment_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    min_amount NUMERIC NOT NULL CHECK (min_amount > 0),
    max_installments INTEGER NOT NULL CHECK (max_installments > 0),
    interest_rate NUMERIC DEFAULT 0 CHECK (interest_rate >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: boleto_details
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.boleto_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    barcode TEXT,
    digitable_line TEXT,
    our_number TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'overdue')),
    paid_at TIMESTAMPTZ,
    pdf_url TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: pix_details
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pix_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    qr_code TEXT,
    qr_code_image_url TEXT,
    copy_paste_code TEXT,
    expiration_date TIMESTAMPTZ,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'expired')),
    paid_at TIMESTAMPTZ,
    txid TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: chargebacks
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chargebacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected', 'resolved')),
    opened_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: ledger
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL,
    debit NUMERIC DEFAULT 0 CHECK (debit >= 0),
    credit NUMERIC DEFAULT 0 CHECK (credit >= 0),
    balance NUMERIC NOT NULL,
    description TEXT,
    reference_id TEXT,
    reference_type TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: shipping_quotes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipping_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    carrier TEXT NOT NULL,
    service TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    delivery_days INTEGER,
    delivery_date TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: shipments
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_number TEXT,
    carrier TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'cancelled')),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tabela: shipping_events
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipping_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT,
    location TEXT,
    occurred_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}'::JSONB
);

-- ---------------------------------------------------------------------
-- Tabela: delivery_payments
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS wallets_customer_id_idx ON public.wallets(customer_id);
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS accounts_type_idx ON public.accounts(account_type);
CREATE INDEX IF NOT EXISTS account_transactions_account_id_idx ON public.account_transactions(account_id);
CREATE INDEX IF NOT EXISTS account_transactions_bonus_id_idx ON public.account_transactions(related_bonus_id);
CREATE INDEX IF NOT EXISTS account_transactions_order_id_idx ON public.account_transactions(related_order_id);
CREATE INDEX IF NOT EXISTS account_transactions_created_at_idx ON public.account_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS transactions_wallet_id_idx ON public.transactions(wallet_id);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON public.transactions(transaction_type);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments(status);
CREATE INDEX IF NOT EXISTS payments_payment_date_idx ON public.payments(payment_date);
CREATE INDEX IF NOT EXISTS payment_methods_is_active_idx ON public.payment_methods(is_active);
CREATE INDEX IF NOT EXISTS gateways_slug_idx ON public.gateways(slug);
CREATE INDEX IF NOT EXISTS gateways_is_active_idx ON public.gateways(is_active);
CREATE INDEX IF NOT EXISTS gateway_webhooks_gateway_id_idx ON public.gateway_webhooks(gateway_id);
CREATE INDEX IF NOT EXISTS gateway_webhooks_event_type_idx ON public.gateway_webhooks(event_type);
CREATE INDEX IF NOT EXISTS payment_attempts_payment_id ON public.payment_attempts(payment_id);
CREATE INDEX IF NOT EXISTS payment_attempts_gateway_id ON public.payment_attempts(gateway_id);
CREATE INDEX IF NOT EXISTS payment_attempts_status_idx ON public.payment_attempts(status);
CREATE INDEX IF NOT EXISTS payment_installments_payment_id_idx ON public.payment_installments(payment_id);
CREATE INDEX IF NOT EXISTS payment_installments_due_date_idx ON public.payment_installments(due_date);
CREATE INDEX IF NOT EXISTS payment_installments_status_idx ON public.payment_installments(status);
CREATE INDEX IF NOT EXISTS installment_rules_is_active_idx ON public.installment_rules(is_active);
CREATE INDEX IF NOT EXISTS boleto_details_payment_id_idx ON public.boleto_details(payment_id);
CREATE INDEX IF NOT EXISTS boleto_details_due_date_idx ON public.boleto_details(due_date);
CREATE INDEX IF NOT EXISTS boleto_details_status_idx ON public.boleto_details(status);
CREATE INDEX IF NOT EXISTS pix_details_payment_id_idx ON public.pix_details(payment_id);
CREATE INDEX IF NOT EXISTS pix_details_txid_idx ON public.pix_details(txid);
CREATE INDEX IF NOT EXISTS pix_details_status_idx ON public.pix_details(status);
CREATE INDEX IF NOT EXISTS chargebacks_payment_id_idx ON public.chargebacks(payment_id);
CREATE INDEX IF NOT EXISTS chargebacks_status_idx ON public.chargebacks(status);
CREATE INDEX IF NOT EXISTS ledger_entity_id_idx ON public.ledger(entity_id);
CREATE INDEX IF NOT EXISTS ledger_entity_type_idx ON public.ledger(entity_type);
CREATE INDEX IF NOT EXISTS ledger_created_at_idx ON public.ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS shipping_quotes_order_id_idx ON public.shipping_quotes(order_id);
CREATE INDEX IF NOT EXISTS shipments_order_id_idx ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS shipments_tracking_number_idx ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS shipments_status_idx ON public.shipments(status);
CREATE INDEX IF NOT EXISTS shipping_events_shipment_id_idx ON public.shipping_events(shipment_id);
CREATE INDEX IF NOT EXISTS shipping_events_occurred_at_idx ON public.shipping_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS delivery_payments_shipment_id_idx ON public.delivery_payments(shipment_id);
CREATE INDEX IF NOT EXISTS delivery_payments_status_idx ON public.delivery_payments(status);

-- ---------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gateway_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boleto_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pix_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chargebacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_payments ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------

-- Wallets: acesso próprio
CREATE POLICY "Wallets own read" ON public.wallets FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Wallets own write" ON public.wallets FOR ALL USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);

-- Accounts: acesso próprio
CREATE POLICY "Accounts own read" ON public.accounts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Accounts own write" ON public.accounts FOR ALL USING (user_id = auth.uid());

-- Account Transactions: acesso próprio
CREATE POLICY "Account Transactions own read" ON public.account_transactions FOR SELECT USING (
  account_id IN (SELECT id FROM public.accounts WHERE user_id = auth.uid())
);
CREATE POLICY "Account Transactions own write" ON public.account_transactions FOR ALL USING (
  account_id IN (SELECT id FROM public.accounts WHERE user_id = auth.uid())
);

-- Transactions: acesso próprio
CREATE POLICY "Transactions own read" ON public.transactions FOR SELECT USING (
  wallet_id IN (SELECT id FROM public.wallets WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)))
);
CREATE POLICY "Transactions admin write" ON public.transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Payments: acesso próprio
CREATE POLICY "Payments own read" ON public.payments FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
);
CREATE POLICY "Payments admin write" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Payment Methods: leitura pública
CREATE POLICY "Payment Methods public read" ON public.payment_methods FOR SELECT USING (true);
CREATE POLICY "Payment Methods admin write" ON public.payment_methods FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Gateways: admin only
CREATE POLICY "Gateways admin all" ON public.gateways FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Gateway Webhooks: admin only
CREATE POLICY "Gateway Webhooks admin all" ON public.gateway_webhooks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Payment Attempts: admin only
CREATE POLICY "Payment Attempts admin all" ON public.payment_attempts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Payment Installments: acesso próprio
CREATE POLICY "Payment Installments own read" ON public.payment_installments FOR SELECT USING (
  payment_id IN (SELECT id FROM public.payments WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)))
);
CREATE POLICY "Payment Installments admin write" ON public.payment_installments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Installment Rules: leitura pública
CREATE POLICY "Installment Rules public read" ON public.installment_rules FOR SELECT USING (true);
CREATE POLICY "Installment Rules admin write" ON public.installment_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Boleto Details: acesso próprio
CREATE POLICY "Boleto Details own read" ON public.boleto_details FOR SELECT USING (
  payment_id IN (SELECT id FROM public.payments WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)))
);
CREATE POLICY "Boleto Details admin write" ON public.boleto_details FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- PIX Details: acesso próprio
CREATE POLICY "PIX Details own read" ON public.pix_details FOR SELECT USING (
  payment_id IN (SELECT id FROM public.payments WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)))
);
CREATE POLICY "PIX Details admin write" ON public.pix_details FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Chargebacks: admin only
CREATE POLICY "Chargebacks admin all" ON public.chargebacks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Ledger: admin only
CREATE POLICY "Ledger admin all" ON public.ledger FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Shipping Quotes: acesso próprio
CREATE POLICY "Shipping Quotes own read" ON public.shipping_quotes FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)))
);
CREATE POLICY "Shipping Quotes admin write" ON public.shipping_quotes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Shipments: acesso próprio
CREATE POLICY "Shipments own read" ON public.shipments FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1)))
);
CREATE POLICY "Shipments admin write" ON public.shipments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Shipping Events: acesso através do shipment
CREATE POLICY "Shipping Events shipment read" ON public.shipping_events FOR SELECT USING (
  shipment_id IN (SELECT id FROM public.shipments WHERE order_id IN (SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))))
);
CREATE POLICY "Shipping Events admin write" ON public.shipping_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Delivery Payments: admin only
CREATE POLICY "Delivery Payments admin all" ON public.delivery_payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- ---------------------------------------------------------------------
-- Triggers para atualização de timestamps
-- ---------------------------------------------------------------------
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gateways_updated_at BEFORE UPDATE ON public.gateways
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gateway_webhooks_updated_at BEFORE UPDATE ON public.gateway_webhooks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_installments_updated_at BEFORE UPDATE ON public.payment_installments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_installment_rules_updated_at BEFORE UPDATE ON public.installment_rules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_boleto_details_updated_at BEFORE UPDATE ON public.boleto_details
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pix_details_updated_at BEFORE UPDATE ON public.pix_details
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chargebacks_updated_at BEFORE UPDATE ON public.chargebacks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON public.shipments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_payments_updated_at BEFORE UPDATE ON public.delivery_payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
