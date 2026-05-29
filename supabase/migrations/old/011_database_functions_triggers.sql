-- =====================================================================
-- ALLIN Sistema - Database Functions e Triggers Avançados
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Funções de Auditoria
-- ---------------------------------------------------------------------

-- Função para registrar mudanças em tabelas críticas
CREATE OR REPLACE FUNCTION public.audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_log (
            user_id,
            action,
            entity_type,
            entity_id,
            changes,
            created_at
        ) VALUES (
            COALESCE(auth.uid(), NULL),
            TG_OP,
            TG_TABLE_NAME,
            OLD.id::TEXT,
            jsonb_build_object('old', row_to_json(OLD)),
            now()
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.audit_log (
            user_id,
            action,
            entity_type,
            entity_id,
            changes,
            created_at
        ) VALUES (
            COALESCE(auth.uid(), NULL),
            TG_OP,
            TG_TABLE_NAME,
            NEW.id::TEXT,
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)),
            now()
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_log (
            user_id,
            action,
            entity_type,
            entity_id,
            changes,
            created_at
        ) VALUES (
            COALESCE(auth.uid(), NULL),
            TG_OP,
            TG_TABLE_NAME,
            NEW.id::TEXT,
            jsonb_build_object('new', row_to_json(NEW)),
            now()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- Funções de Cálculo MLM
-- ---------------------------------------------------------------------

-- Função para calcular volume pessoal de um distribuidor
CREATE OR REPLACE FUNCTION public.calculate_personal_volume(distributor_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
    total_volume NUMERIC;
BEGIN
    SELECT COALESCE(SUM(o.valor_total_pedido), 0)
    INTO total_volume
    FROM public.orders o
    INNER JOIN public.customers c ON c.id = o.customer_id
    WHERE c.id_comprador = distributor_id
    AND o.pago = true
    AND o.data_pagamento >= DATE_TRUNC('month', CURRENT_DATE);
    
    RETURN total_volume;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular volume da rede de um distribuidor
CREATE OR REPLACE FUNCTION public.calculate_network_volume(distributor_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
    total_volume NUMERIC;
BEGIN
    WITH RECURSIVE network AS (
        SELECT id_comprador
        FROM public.customers
        WHERE id_comprador = distributor_id
        
        UNION ALL
        
        SELECT c.id_comprador
        FROM public.customers c
        INNER JOIN public.network_relationships nr ON nr.child_id = c.id_comprador
        INNER JOIN network n ON n.id_comprador = nr.parent_id
    )
    SELECT COALESCE(SUM(o.valor_total_pedido), 0)
    INTO total_volume
    FROM public.orders o
    INNER JOIN public.customers c ON c.id = o.customer_id
    WHERE c.id_comprador IN (SELECT id_comprador FROM network)
    AND o.pago = true
    AND o.data_pagamento >= DATE_TRUNC('month', CURRENT_DATE);
    
    RETURN total_volume;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para contar diretos ativos de um distribuidor
CREATE OR REPLACE FUNCTION public.count_active_directs(distributor_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    active_count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT nr.child_id)
    INTO active_count
    FROM public.network_relationships nr
    INNER JOIN public.customers c ON c.id_comprador = nr.child_id
    WHERE nr.parent_id = distributor_id
    AND EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.customer_id = c.id
        AND o.pago = true
        AND o.data_pagamento >= DATE_TRUNC('month', CURRENT_DATE)
    );
    
    RETURN COALESCE(active_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular bônus de geração
CREATE OR REPLACE FUNCTION public.calculate_generation_bonus(
    distributor_id TEXT,
    generation_level INTEGER,
    total_volume NUMERIC
)
RETURNS NUMERIC AS $$
DECLARE
    bonus_percentage NUMERIC;
    bonus_amount NUMERIC;
BEGIN
    SELECT COALESCE(bonus_percentage, 0)
    INTO bonus_percentage
    FROM public.generation_bonuses gb
    INNER JOIN public.customer_plans cp ON cp.plan_id = gb.plan_id
    INNER JOIN public.customers c ON c.id = cp.customer_id
    WHERE c.id_comprador = distributor_id
    AND gb.generation_level = generation_level
    AND gb.is_active = true
    AND cp.is_active = true
    LIMIT 1;
    
    bonus_amount := total_volume * (bonus_percentage / 100);
    RETURN bonus_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar métricas de rede
CREATE OR REPLACE FUNCTION public.update_network_metrics(distributor_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.customer_network_metrics
    SET 
        personal_volume = public.calculate_personal_volume(distributor_id),
        total_volume = public.calculate_network_volume(distributor_id),
        total_downline = (
            WITH RECURSIVE network AS (
                SELECT id_comprador
                FROM public.customers
                WHERE id_comprador = distributor_id
                UNION ALL
                SELECT c.id_comprador
                FROM public.customers c
                INNER JOIN public.network_relationships nr ON nr.child_id = c.id_comprador
                INNER JOIN network n ON n.id_comprador = nr.parent_id
            )
            SELECT COUNT(*) - 1 FROM network
        ),
        active_downline = (
            WITH RECURSIVE network AS (
                SELECT id_comprador
                FROM public.customers
                WHERE id_comprador = distributor_id
                UNION ALL
                SELECT c.id_comprador
                FROM public.customers c
                INNER JOIN public.network_relationships nr ON nr.child_id = c.id_comprador
                INNER JOIN network n ON n.id_comprador = nr.parent_id
            )
            SELECT COUNT(DISTINCT c.id_comprador)
            FROM public.customers c
            INNER JOIN public.orders o ON o.customer_id = c.id
            WHERE c.id_comprador IN (SELECT id_comprador FROM network)
            AND c.id_comprador != distributor_id
            AND o.pago = true
            AND o.data_pagamento >= DATE_TRUNC('month', CURRENT_DATE)
        ),
        calculated_at = now()
    WHERE customer_id = (SELECT id FROM public.customers WHERE id_comprador = distributor_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- Funções de Wallet
-- ---------------------------------------------------------------------

-- Função para creditar saldo
CREATE OR REPLACE FUNCTION public.credit_wallet(
    customer_id UUID,
    amount NUMERIC,
    transaction_type TEXT,
    description TEXT
)
RETURNS UUID AS $$
DECLARE
    wallet_id UUID;
    transaction_id UUID;
BEGIN
    -- Obter ou criar wallet
    SELECT id INTO wallet_id
    FROM public.wallets
    WHERE customer_id = customer_id
    FOR UPDATE;
    
    IF wallet_id IS NULL THEN
        INSERT INTO public.wallets (customer_id, saldo_sacavel)
        VALUES (customer_id, 0)
        RETURNING id INTO wallet_id;
    END IF;
    
    -- Criar transação
    INSERT INTO public.transactions (
        wallet_id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        description
    )
    SELECT 
        wallet_id,
        transaction_type,
        amount,
        w.saldo_sacavel,
        w.saldo_sacavel + amount,
        description
    FROM public.wallets w
    WHERE w.id = wallet_id
    RETURNING id INTO transaction_id;
    
    -- Atualizar saldo
    UPDATE public.wallets
    SET saldo_sacavel = saldo_sacavel + amount
    WHERE id = wallet_id;
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para debitar saldo
CREATE OR REPLACE FUNCTION public.debit_wallet(
    customer_id UUID,
    amount NUMERIC,
    transaction_type TEXT,
    description TEXT
)
RETURNS UUID AS $$
DECLARE
    wallet_id UUID;
    transaction_id UUID;
    current_balance NUMERIC;
BEGIN
    -- Obter wallet
    SELECT id, saldo_sacavel INTO wallet_id, current_balance
    FROM public.wallets
    WHERE customer_id = customer_id
    FOR UPDATE;
    
    IF wallet_id IS NULL THEN
        RAISE EXCEPTION 'Wallet not found for customer %', customer_id;
    END IF;
    
    IF current_balance < amount THEN
        RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', current_balance, amount;
    END IF;
    
    -- Criar transação
    INSERT INTO public.transactions (
        wallet_id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        description
    )
    SELECT 
        wallet_id,
        transaction_type,
        -amount,
        current_balance,
        current_balance - amount,
        description
    RETURNING id INTO transaction_id;
    
    -- Atualizar saldo
    UPDATE public.wallets
    SET saldo_sacavel = saldo_sacavel - amount
    WHERE id = wallet_id;
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- Funções de Analytics
-- ---------------------------------------------------------------------

-- Função para calcular churn score
CREATE OR REPLACE FUNCTION public.calculate_churn_score(customer_id UUID)
RETURNS INTEGER AS $$
DECLARE
    days_since_last_order INTEGER;
    order_frequency NUMERIC;
    churn_score INTEGER;
BEGIN
    SELECT EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(MAX(o.data_pagamento::DATE), CURRENT_DATE - 365)))::INTEGER
    INTO days_since_last_order
    FROM public.orders o
    WHERE o.customer_id = customer_id
    AND o.pago = true;
    
    SELECT COALESCE(AVG(EXTRACT(DAY FROM (o2.data_pagamento - o1.data_pagamento))), 30)
    INTO order_frequency
    FROM public.orders o1
    INNER JOIN public.orders o2 ON o2.customer_id = o1.customer_id AND o2.data_pagamento > o1.data_pagamento
    WHERE o1.customer_id = customer_id
    AND o1.pago = true
    AND o2.pago = true;
    
    -- Calcular churn score (0-100)
    churn_score := LEAST(100, GREATEST(0, 
        (days_since_last_order::NUMERIC / order_frequency) * 50
    ));
    
    RETURN churn_score::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular LTV
CREATE OR REPLACE FUNCTION public.calculate_ltv(customer_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    ltv NUMERIC;
BEGIN
    SELECT COALESCE(SUM(valor_total_pedido), 0)
    INTO ltv
    FROM public.orders
    WHERE customer_id = customer_id
    AND pago = true;
    
    RETURN ltv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar métricas de cliente
CREATE OR REPLACE FUNCTION public.update_customer_metrics(customer_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.customer_metrics (
        customer_id,
        total_orders,
        total_spent,
        average_order_value,
        last_order_date,
        first_order_date,
        days_since_last_order,
        churn_score,
        ltv,
        calculated_at
    )
    SELECT
        customer_id,
        COUNT(*),
        COALESCE(SUM(valor_total_pedido), 0),
        COALESCE(AVG(valor_total_pedido), 0),
        MAX(data_pagamento::DATE),
        MIN(data_pagamento::DATE),
        EXTRACT(DAY FROM (CURRENT_DATE - MAX(data_pagamento::DATE)))::INTEGER,
        public.calculate_churn_score(customer_id),
        public.calculate_ltv(customer_id),
        now()
    FROM public.orders
    WHERE customer_id = customer_id
    AND pago = true
    GROUP BY customer_id
    ON CONFLICT (customer_id) DO UPDATE SET
        total_orders = EXCLUDED.total_orders,
        total_spent = EXCLUDED.total_spent,
        average_order_value = EXCLUDED.average_order_value,
        last_order_date = EXCLUDED.last_order_date,
        first_order_date = EXCLUDED.first_order_date,
        days_since_last_order = EXCLUDED.days_since_last_order,
        churn_score = EXCLUDED.churn_score,
        ltv = EXCLUDED.ltv,
        calculated_at = EXCLUDED.calculated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- Triggers de Negócio
-- ---------------------------------------------------------------------

-- Trigger para atualizar métricas de cliente após pedido pago
CREATE OR REPLACE FUNCTION public.on_order_paid()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pago = true AND (OLD.pago IS NULL OR OLD.pago = false) THEN
        PERFORM public.update_customer_metrics(NEW.customer_id);
        
        -- Atualizar métricas de rede do distribuidor
        PERFORM public.update_network_metrics(
            (SELECT id_comprador FROM public.customers WHERE id = NEW.customer_id)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar ledger após transação
CREATE OR REPLACE FUNCTION public.on_transaction_created()
RETURNS TRIGGER AS $$
DECLARE
    entity_id UUID;
    entity_type TEXT;
    current_balance NUMERIC;
BEGIN
    IF NEW.transaction_type = 'CREDIT' THEN
        entity_id := (SELECT customer_id FROM public.wallets WHERE id = NEW.wallet_id);
        entity_type := 'customer';
        
        SELECT COALESCE(SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE -amount END), 0)
        INTO current_balance
        FROM public.transactions
        WHERE wallet_id = NEW.wallet_id;
        
        INSERT INTO public.ledger (
            entity_id,
            entity_type,
            credit,
            debit,
            balance,
            description,
            reference_id
        )
        VALUES (
            entity_id,
            entity_type,
            NEW.amount,
            0,
            current_balance,
            NEW.description,
            NEW.id::TEXT
        );
    ELSIF NEW.transaction_type = 'DEBIT' THEN
        entity_id := (SELECT customer_id FROM public.wallets WHERE id = NEW.wallet_id);
        entity_type := 'customer';
        
        SELECT COALESCE(SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE -amount END), 0)
        INTO current_balance
        FROM public.transactions
        WHERE wallet_id = NEW.wallet_id;
        
        INSERT INTO public.ledger (
            entity_id,
            entity_type,
            credit,
            debit,
            balance,
            description,
            reference_id
        )
        VALUES (
            entity_id,
            entity_type,
            0,
            NEW.amount,
            current_balance,
            NEW.description,
            NEW.id::TEXT
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar customer_network_metrics ao criar relacionamento
CREATE OR REPLACE FUNCTION public.on_network_relationship_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.customer_network_metrics (customer_id)
    VALUES (
        (SELECT id FROM public.customers WHERE id_comprador = NEW.child_id)
    )
    ON CONFLICT (customer_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- Aplicar Triggers
-- ---------------------------------------------------------------------

-- Auditoria em tabelas críticas
CREATE TRIGGER audit_plans_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.plans
    FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER audit_qualifications_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.qualifications
    FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER audit_bonus_rules_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.bonus_rules
    FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER audit_wallets_changes
    AFTER INSERT OR UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- Negócio
CREATE TRIGGER trigger_order_paid
    AFTER UPDATE ON public.orders
    FOR EACH ROW WHEN (NEW.pago = true AND (OLD.pago IS NULL OR OLD.pago = false))
    EXECUTE FUNCTION public.on_order_paid();

CREATE TRIGGER trigger_transaction_created
    AFTER INSERT ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.on_transaction_created();

CREATE TRIGGER trigger_network_relationship_created
    AFTER INSERT ON public.network_relationships
    FOR EACH ROW EXECUTE FUNCTION public.on_network_relationship_created();

-- ---------------------------------------------------------------------
-- Grant Permissions
-- ---------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.calculate_personal_volume(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.calculate_network_volume(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.count_active_directs(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.calculate_generation_bonus(TEXT, INTEGER, NUMERIC) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_network_metrics(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.credit_wallet(UUID, NUMERIC, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.debit_wallet(UUID, NUMERIC, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.calculate_churn_score(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.calculate_ltv(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_customer_metrics(UUID) TO service_role;
