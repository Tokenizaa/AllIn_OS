-- =====================================================================
-- ALLIN Sistema - Complete Wallet Summary View
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-27
-- Purpose: Complete wallet_summary_view with pending withdrawals and balance breakdown
-- =====================================================================

-- Drop existing view to recreate
DROP VIEW IF EXISTS public.wallet_summary_view CASCADE;

-- ---------------------------------------------------------------------
-- View: Wallet Summary View (Complete - with pending withdrawals and balance breakdown)
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
    
    -- Calculated fields
    0 AS saldo_perdido,
    0 AS saldo_a_receber,
    0 AS saldo_para_compra,
    w.balance AS total_recebido,
    
    -- Transaction counts
    COUNT(t.id) FILTER (WHERE t.transaction_type::TEXT = 'CREDIT') AS creditos,
    COUNT(t.id) FILTER (WHERE t.transaction_type::TEXT = 'DEBIT') AS debitos,
    COUNT(t.id) AS total_transacoes,
    
    -- Transaction totals
    COALESCE(SUM(t.amount) FILTER (WHERE t.transaction_type::TEXT = 'CREDIT'), 0) AS total_creditado,
    COALESCE(SUM(t.amount) FILTER (WHERE t.transaction_type::TEXT = 'DEBIT'), 0) AS total_debitado,
    
    -- Pending withdrawals (transactions with type 'WITHDRAWAL' and status 'PENDING')
    COALESCE(SUM(t.amount) FILTER (
        WHERE t.transaction_type::TEXT = 'WITHDRAWAL' 
        AND t.status::TEXT = 'PENDING'
    ), 0) AS saques_pendentes,
    
    COUNT(t.id) FILTER (
        WHERE t.transaction_type::TEXT = 'WITHDRAWAL' 
        AND t.status::TEXT = 'PENDING'
    ) AS total_saques_pendentes,
    
    -- Balance breakdown by type
    COALESCE(SUM(t.amount) FILTER (
        WHERE t.transaction_type::TEXT = 'BONUS'
    ), 0) AS saldo_bonus,
    
    COALESCE(SUM(t.amount) FILTER (
        WHERE t.transaction_type::TEXT = 'COMMISSION'
    ), 0) AS saldo_comissoes,
    
    COALESCE(SUM(t.amount) FILTER (
        WHERE t.transaction_type::TEXT = 'RETAIL'
    ), 0) AS saldo_varejo,
    
    COALESCE(SUM(t.amount) FILTER (
        WHERE t.transaction_type::TEXT = 'WHOLESALE'
    ), 0) AS saldo_atacado,
    
    -- Last transaction info
    (
        SELECT json_build_object(
            'transaction_type', t.transaction_type,
            'amount', t.amount,
            'status', t.status,
            'created_at', t.created_at
        )
        FROM public.transactions t
        WHERE t.wallet_id = w.id
        ORDER BY t.created_at DESC
        LIMIT 1
    ) AS ultima_transacao,
    
    -- Balance history (last 7 days)
    (
        SELECT json_agg(json_build_object(
            'date', t.created_at::DATE,
            'balance', w.balance - SUM(t2.amount) FILTER (WHERE t2.created_at > t.created_at)
        ) ORDER BY date DESC)
        FROM (
            SELECT DISTINCT t.created_at::DATE
            FROM public.transactions t
            WHERE t.wallet_id = w.id
            AND t.created_at >= CURRENT_DATE - INTERVAL '7 days'
        ) t
        CROSS JOIN public.wallets w2
        WHERE w2.id = w.id
    ) AS historico_saldo_7_dias,
    
    w.created_at,
    w.updated_at
    
FROM public.wallets w
LEFT JOIN public.customers c ON c.id = w.customer_id
LEFT JOIN public.transactions t ON t.wallet_id = w.id
GROUP BY 
    w.id, 
    c.id_comprador, 
    c.nome_completo, 
    w.balance, 
    w.available_balance, 
    w.pending_balance, 
    w.created_at, 
    w.updated_at;

-- ---------------------------------------------------------------------
-- Grant Permissions
-- ---------------------------------------------------------------------
GRANT SELECT ON public.wallet_summary_view TO authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
ALTER VIEW public.wallet_summary_view SET (security_barrier = true);

-- Simplified RLS policy
DROP POLICY IF EXISTS "Wallet Summary View own read" ON public.wallet_summary_view;

CREATE POLICY "Wallet Summary View own read" ON public.wallet_summary_view FOR SELECT USING (
    customer_id IN (
        SELECT id FROM public.customers 
        WHERE id IN (SELECT customer_id FROM public.wallets WHERE customer_id = c.id)
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
);

-- Add comment
COMMENT ON VIEW public.wallet_summary_view IS 'Complete wallet summary including pending withdrawals, balance breakdown by type, transaction history, and 7-day balance history';
