-- =====================================================================
-- ALLIN Sistema - Views Básicas (Working - Ajustado para estrutura atual)
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- View: Customer Profile View (view segura para dados de cliente)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.customer_profile_view AS
SELECT
    c.id,
    c.id_comprador,
    c.nome_completo AS nome,
    c.email,
    c.telefone,
    c.data_criacao AS data_cadastro,
    c.plan_id,
    c.qualification,
    c.status,
    cm.total_pedidos,
    cm.total_gasto AS total_spent,
    cm.ltv,
    cm.ticket_medio AS average_order_value,
    cm.dias_desde_ultima_compra AS days_since_last_order,
    cm.plano_atual AS segment,
    w.balance AS saldo_sacavel,
    w.available_balance AS saldo_nao_sacavel,
    w.pending_balance AS saldo_loja_online,
    cnm.total_network_size AS total_downline,
    cnm.active_network_size AS active_downline,
    cnm.network_revenue AS total_volume,
    cnm.leadership_score AS level
FROM public.customers c
LEFT JOIN public.customer_metrics cm ON cm.customer_id = c.id
LEFT JOIN public.wallets w ON w.customer_id = c.id
LEFT JOIN public.customer_network_metrics cnm ON cnm.customer_id = c.id;

-- ---------------------------------------------------------------------
-- View: Order Summary View (view resumida de pedidos)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.order_summary_view AS
SELECT
    o.id,
    o.numero_pedido AS order_number,
    o.data_criacao,
    o.data_pagamento,
    o.valor_total_pedido,
    0 AS custo_frete,
    o.status_pedido AS status,
    o.pago,
    o.cancelado,
    c.id_comprador,
    c.nome_completo AS cliente_nome,
    c.email AS cliente_email,
    o.forma_pagamento,
    COUNT(oi.id) AS total_itens,
    SUM(oi.quantity) AS total_quantidade
FROM public.orders o
LEFT JOIN public.customers c ON c.id = o.customer_id
LEFT JOIN public.order_items oi ON oi.order_id = o.id
GROUP BY o.id, c.id_comprador, c.nome_completo, c.email;

-- ---------------------------------------------------------------------
-- View: Wallet Summary View (view resumida de carteira)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.wallet_summary_view AS
SELECT
    w.id,
    w.customer_id,
    c.id_comprador,
    c.nome_completo AS cliente_nome,
    w.balance AS saldo_sacavel,
    w.available_balance AS saldo_nao_sacavel,
    w.pending_balance AS saldo_loja_online,
    0 AS saldo_perdido,
    0 AS saldo_a_receber,
    0 AS saldo_para_compra,
    w.balance AS total_recebido,
    COUNT(t.id) AS total_transactions,
    COALESCE(SUM(t.amount), 0) AS total_amount,
    w.created_at,
    w.updated_at
FROM public.wallets w
LEFT JOIN public.customers c ON c.id = w.customer_id
LEFT JOIN public.transactions t ON t.wallet_id = w.id
GROUP BY w.id, c.id_comprador, c.nome_completo, w.balance, w.available_balance, w.pending_balance, w.created_at, w.updated_at;

-- ---------------------------------------------------------------------
-- View: Bonus Summary View (view resumida de bônus)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.bonus_summary_view AS
SELECT
    b.id,
    b.distributor_id,
    c.nome_completo AS distribuidor_nome,
    c.email AS distribuidor_email,
    b.type AS bonus_type,
    b.amount,
    b.status,
    b.period,
    b.description,
    b.created_at,
    b.paid_at,
    p.name AS plano_nome
FROM public.bonuses b
LEFT JOIN public.customers c ON c.id_comprador = b.distributor_id
LEFT JOIN public.customer_plans cp ON cp.customer_id = c.id
LEFT JOIN public.plans p ON p.id = cp.plan_id;

-- ---------------------------------------------------------------------
-- View: Audit Log Summary (view resumida de auditoria)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.audit_log_summary AS
SELECT
    al.id,
    al.user_id,
    p.display_name AS user_name,
    al.action,
    al.entity_type,
    al.entity_id,
    al.old_value,
    al.new_value,
    al.ip_address,
    al.created_at
FROM public.audit_log al
LEFT JOIN public.profiles p ON p.user_id = al.user_id
ORDER BY al.created_at DESC;

-- ---------------------------------------------------------------------
-- View: Payment Summary View (view resumida de pagamentos)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.payment_summary_view AS
SELECT
    p.id,
    p.order_id,
    o.numero_pedido AS order_number,
    p.customer_id,
    c.nome_completo AS cliente_nome,
    p.amount,
    p.payment_method,
    p.status,
    p.payment_date,
    p.due_date
FROM public.payments p
LEFT JOIN public.orders o ON o.id = p.order_id
LEFT JOIN public.customers c ON c.id = p.customer_id;

-- ---------------------------------------------------------------------
-- View: Customer 360 View (view completa do cliente)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.customer_360_view AS
SELECT
    c.id AS customer_id,
    c.id_comprador,
    c.nome_completo,
    c.email,
    c.telefone,
    c.endereco,
    c.cidade,
    c.estado,
    c.cep,
    c.data_criacao AS data_cadastro,
    c.data_ultima_compra,
    c.plan_id,
    c.qualification,
    c.status,
    
    -- Métricas
    cm.total_pedidos,
    cm.total_gasto AS total_spent,
    cm.ticket_medio AS average_order_value,
    cm.ultima_compra AS last_order_date,
    cm.primeira_compra AS first_order_date,
    cm.dias_desde_ultima_compra AS days_since_last_order,
    cm.ltv,
    cm.plano_atual AS segment,
    
    -- Wallet
    w.balance AS saldo_sacavel,
    w.available_balance AS saldo_nao_sacavel,
    w.pending_balance AS saldo_loja_online,
    0 AS saldo_perdido,
    0 AS saldo_a_receber,
    0 AS saldo_para_compra,
    w.balance AS total_recebido,
    
    -- Rede
    cnm.total_network_size AS total_downline,
    cnm.active_network_size AS active_downline,
    cnm.network_revenue AS total_volume,
    cnm.leadership_score AS level,
    
    -- Plano
    p.name AS plano_nome,
    p.description AS plano_descricao,
    p.price AS plano_preco,
    
    -- Qualificação
    q.name AS qualificacao_nome,
    q.level AS qualificacao_nivel,
    
    -- Últimos pedidos
    (
        SELECT json_agg(json_build_object(
            'order_number', o.numero_pedido,
            'data_pedido', o.data_criacao,
            'valor_total', o.valor_total_pedido,
            'status', o.status_pedido
        ))
        FROM (
            SELECT o.numero_pedido, o.data_criacao, o.valor_total_pedido, o.status_pedido
            FROM public.orders o
            WHERE o.customer_id = c.id
            ORDER BY o.data_criacao DESC
            LIMIT 5
        ) o
    ) AS ultimos_pedidos,
    
    -- Bônus recentes
    (
        SELECT json_agg(json_build_object(
            'type', b.type,
            'amount', b.amount,
            'status', b.status,
            'created_at', b.created_at
        ))
        FROM (
            SELECT b.type, b.amount, b.status, b.created_at
            FROM public.bonuses b
            WHERE b.distributor_id = c.id_comprador
            ORDER BY b.created_at DESC
            LIMIT 5
        ) b
    ) AS bonus_recentes
    
FROM public.customers c
LEFT JOIN public.customer_metrics cm ON cm.customer_id = c.id
LEFT JOIN public.wallets w ON w.customer_id = c.id
LEFT JOIN public.customer_network_metrics cnm ON cnm.customer_id = c.id
LEFT JOIN public.customer_plans cp ON cp.customer_id = c.id AND cp.is_active = true
LEFT JOIN public.plans p ON p.id = cp.plan_id
LEFT JOIN public.qualifications q ON q.id = c.qualification;

-- ---------------------------------------------------------------------
-- Grant Permissions para Views
-- ---------------------------------------------------------------------
GRANT SELECT ON public.customer_profile_view TO authenticated;
GRANT SELECT ON public.order_summary_view TO authenticated;
GRANT SELECT ON public.wallet_summary_view TO authenticated;
GRANT SELECT ON public.bonus_summary_view TO authenticated;
GRANT SELECT ON public.audit_log_summary TO service_role;
GRANT SELECT ON public.payment_summary_view TO authenticated;
GRANT SELECT ON public.customer_360_view TO authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security para Views
-- ---------------------------------------------------------------------
ALTER VIEW public.customer_profile_view SET (security_barrier = true);
ALTER VIEW public.order_summary_view SET (security_barrier = true);
ALTER VIEW public.wallet_summary_view SET (security_barrier = true);
ALTER VIEW public.bonus_summary_view SET (security_barrier = true);
ALTER VIEW public.payment_summary_view SET (security_barrier = true);
ALTER VIEW public.customer_360_view SET (security_barrier = true);

-- Policies para views
CREATE POLICY "Customer Profile View own read" ON public.customer_profile_view FOR SELECT USING (
    id_comprador IN (SELECT id_comprador FROM public.customers WHERE id IN (SELECT customer_id FROM public.wallets WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Order Summary View own read" ON public.order_summary_view FOR SELECT USING (
    id_comprador IN (SELECT id_comprador FROM public.customers WHERE id IN (SELECT customer_id FROM public.wallets WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Wallet Summary View own read" ON public.wallet_summary_view FOR SELECT USING (
    id_comprador IN (SELECT id_comprador FROM public.customers WHERE id IN (SELECT customer_id FROM public.wallets WHERE customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Bonus Summary View own read" ON public.bonus_summary_view FOR SELECT USING (
    distribuidor_id IN (SELECT id_comprador FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Payment Summary View own read" ON public.payment_summary_view FOR SELECT USING (
    customer_id IN (SELECT id FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Customer 360 View own read" ON public.customer_360_view FOR SELECT USING (
    id_comprador IN (SELECT id_comprador FROM public.customers WHERE id_comprador = (SELECT id_comprador FROM public.customers LIMIT 1))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);
