-- =====================================================================
-- ALLIN Sistema - Complete Customer 360 View
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-27
-- Purpose: Complete customer_360_view with missing fields
-- =====================================================================

-- ---------------------------------------------------------------------
-- View: Customer 360 View (Complete - with contact history, support tickets, activity timeline)
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
    cnm.network_revenue AS personal_volume,
    cnm.estimated_bonus AS total_volume,
    cnm.leadership_score AS level,
    cnm.influence_score AS rank,
    
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
            'status', o.status_pedido,
            'pago', o.pago,
            'cancelado', o.cancelado
        ))
        FROM (
            SELECT o.numero_pedido, o.data_criacao, o.valor_total_pedido, o.status_pedido, o.pago, o.cancelado
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
            'created_at', b.created_at,
            'paid_at', b.paid_at
        ))
        FROM (
            SELECT b.type, b.amount, b.status, b.created_at, b.paid_at
            FROM public.bonuses b
            WHERE b.distributor_id = c.id_comprador::text
            ORDER BY b.created_at DESC
            LIMIT 5
        ) b
    ) AS bonus_recentes,
    
    -- Histórico de contato (Chatwoot conversations)
    (
        SELECT json_agg(json_build_object(
            'conversation_id', cc.chatwoot_conversation_id,
            'status', cc.status,
            'last_message_at', cc.last_message_at,
            'created_at', cc.created_at
        ))
        FROM (
            SELECT cc.chatwoot_conversation_id, cc.status, cc.last_message_at, cc.created_at
            FROM public.chatwoot_conversations cc
            WHERE cc.lead_id IN (SELECT id FROM public.leads WHERE email = c.email OR phone = c.telefone)
            ORDER BY cc.created_at DESC
            LIMIT 5
        ) cc
    ) AS historico_contato,
    
    -- Tickets de suporte (Customer events)
    (
        SELECT json_agg(json_build_object(
            'event_type', ce.event_type,
            'event_data', ce.event_data,
            'created_at', ce.created_at
        ))
        FROM (
            SELECT ce.event_type, ce.event_data, ce.created_at
            FROM public.customer_events ce
            WHERE ce.customer_id = c.id
            ORDER BY ce.created_at DESC
            LIMIT 10
        ) ce
    ) AS tickets_suporte,
    
    -- Timeline de atividade (Combined events)
    (
        SELECT json_agg(json_build_object(
            'event_type', event_type,
            'description', description,
            'created_at', created_at
        ) ORDER BY created_at DESC)
        FROM (
            SELECT 'order' AS event_type, 
                   'Pedido #' || o.numero_pedido AS description, 
                   o.data_criacao AS created_at
            FROM public.orders o
            WHERE o.customer_id = c.id
            
            UNION ALL
            
            SELECT 'bonus' AS event_type,
                   'Bônus: ' || b.type AS description,
                   b.created_at
            FROM public.bonuses b
            WHERE b.distributor_id = c.id_comprador::text
            
            UNION ALL
            
            SELECT 'wallet' AS event_type,
                   'Transação: ' || t.type AS description,
                   t.created_at
            FROM public.transactions t
            WHERE t.wallet_id = w.id
            
            UNION ALL
            
            SELECT 'qualification' AS event_type,
                   'Qualificação: ' || q.name AS description,
                   uq.achieved_at
            FROM public.user_qualifications uq
            JOIN public.qualifications q ON q.id = uq.qualification_id
            WHERE uq.user_id IN (SELECT user_id FROM public.profiles WHERE user_id = auth.uid())
            
            ORDER BY created_at DESC
            LIMIT 20
        ) activity
    ) AS timeline_atividade
    
FROM public.customers c
LEFT JOIN public.customer_metrics cm ON cm.customer_id = c.id
LEFT JOIN public.wallets w ON w.customer_id = c.id
LEFT JOIN public.customer_network_metrics cnm ON cnm.customer_id = c.id
LEFT JOIN public.customer_plans cp ON cp.customer_id = c.id AND (cp.status = 'active' OR cp.deactivated_at IS NULL)
LEFT JOIN public.plans p ON p.id = cp.plan_id
LEFT JOIN public.qualifications q ON q.name = c.qualification;

-- ---------------------------------------------------------------------
-- Grant Permissions
-- ---------------------------------------------------------------------
GRANT SELECT ON public.customer_360_view TO authenticated;

-- Add comment
COMMENT ON VIEW public.customer_360_view IS 'Complete 360-degree view of customer including orders, bonuses, wallet, network, contact history, support tickets, and activity timeline';
