-- =====================================================================
-- ALLIN Sistema - Complete Bonus Summary View
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-27
-- Purpose: Complete bonus_summary_view with bonus by type and trend analysis
-- =====================================================================

-- ---------------------------------------------------------------------
-- View: Bonus Summary View (Complete - with bonus by type and trend analysis)
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
    p.name AS plano_nome,
    
    -- Bonus qualification info
    q.name AS qualificacao_nome,
    q.level AS qualificacao_nivel,
    
    -- Network metrics context
    cnm.network_revenue AS personal_volume,
    cnm.estimated_bonus AS total_volume,
    cnm.total_network_size AS active_downline
    
FROM public.bonuses b
LEFT JOIN public.customers c ON c.id_comprador = b.distributor_id::text
LEFT JOIN public.customer_plans cp ON cp.customer_id = c.id AND (cp.status = 'active' OR cp.deactivated_at IS NULL)
LEFT JOIN public.plans p ON p.id = cp.plan_id
LEFT JOIN public.qualifications q ON q.name = c.qualification
LEFT JOIN public.customer_network_metrics cnm ON cnm.customer_id = c.id;

-- ---------------------------------------------------------------------
-- Grant Permissions
-- ---------------------------------------------------------------------
GRANT SELECT ON public.bonus_summary_view TO authenticated;

-- Add comment
COMMENT ON VIEW public.bonus_summary_view IS 'Complete bonus summary including qualification context and network metrics';
