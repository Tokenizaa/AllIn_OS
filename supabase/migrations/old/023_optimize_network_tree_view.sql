-- =====================================================================
-- ALLIN Sistema - Optimized Network Tree View
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-27
-- Purpose: Optimize network_tree_view with search/filter support and performance improvements
-- =====================================================================

-- Drop existing view to recreate
DROP VIEW IF EXISTS public.network_tree_view CASCADE;

-- ---------------------------------------------------------------------
-- View: Network Tree View (Optimized - with search/filter support)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.network_tree_view AS
WITH RECURSIVE network_tree AS (
    -- Base case: Root nodes (distributors with no sponsor)
    SELECT
        c.id AS customer_id,
        c.id_comprador AS node_id,
        c.nome_completo AS node_nome,
        c.email AS node_email,
        c.telefone AS node_telefone,
        c.plan_id,
        c.qualification,
        c.status AS customer_status,
        NULL::TEXT AS parent_id,
        0 AS level,
        ARRAY[c.id_comprador] AS path,
        1 AS total_nodes_in_path
    FROM public.customers c
    WHERE c.id IN (
        SELECT DISTINCT sponsor_customer_id FROM public.network_relationships
        WHERE sponsor_customer_id NOT IN (SELECT customer_id FROM public.network_relationships)
    )
    
    UNION ALL
    
    -- Recursive case: Child nodes
    SELECT
        c.id,
        c.id_comprador,
        c.nome_completo,
        c.email,
        c.telefone,
        c.plan_id,
        c.qualification,
        c.status,
        nr.sponsor_customer_id::TEXT AS parent_id,
        nt.level + 1,
        nt.path || c.id::TEXT,
        nt.total_nodes_in_path + 1
    FROM public.customers c
    INNER JOIN public.network_relationships nr ON nr.customer_id = c.id
    INNER JOIN network_tree nt ON nt.customer_id = nr.sponsor_customer_id
    WHERE NOT c.id::TEXT = ANY(nt.path)
    -- Limit depth to prevent infinite recursion (max 20 levels)
    AND nt.level < 20
)
SELECT
    nt.customer_id,
    nt.node_id,
    nt.node_nome,
    nt.node_email,
    nt.node_telefone,
    nt.parent_id,
    nt.level,
    nt.path,
    nt.total_nodes_in_path,
    
    -- Network metrics
    cnm.total_network_size AS total_downline,
    cnm.active_network_size AS active_downline,
    cnm.network_revenue AS personal_volume,
    cnm.estimated_bonus AS total_volume,
    cnm.leadership_score AS network_level,
    cnm.influence_score AS rank,
    
    -- Plan info
    p.name AS plano_nome,
    p.description AS plano_descricao,
    
    -- Qualification info
    q.name AS qualificacao_nome,
    q.level AS qualificacao_nivel,
    
    -- Status indicators
    CASE 
        WHEN nt.customer_status = 'active' THEN 'ATIVO'
        WHEN nt.customer_status = 'inactive' THEN 'INATIVO'
        WHEN nt.customer_status = 'suspended' THEN 'SUSPENSO'
        ELSE nt.customer_status
    END AS status_label,
    
    -- Performance score (calculated from metrics)
    CASE 
        WHEN cnm.network_revenue >= 1000 THEN 'HIGH'
        WHEN cnm.network_revenue >= 500 THEN 'MEDIUM'
        WHEN cnm.network_revenue >= 100 THEN 'LOW'
        ELSE 'NONE'
    END AS performance_score,
    
    -- Direct children count
    (
        SELECT COUNT(*)
        FROM public.network_relationships nr2
        WHERE nr2.sponsor_customer_id = nt.customer_id
    ) AS direct_children_count,
    
    -- Last activity (from orders)
    (
        SELECT MAX(o.data_criacao)
        FROM public.orders o
        WHERE o.customer_id = nt.customer_id
    ) AS last_activity_date,
    
    -- Days since last activity
    EXTRACT(DAY FROM (CURRENT_DATE - (
        SELECT MAX(o.data_criacao)
        FROM public.orders o
        WHERE o.customer_id = nt.customer_id
    ))) AS days_since_last_activity
    
FROM network_tree nt
LEFT JOIN public.customer_network_metrics cnm ON cnm.customer_id = nt.customer_id
LEFT JOIN public.customer_plans cp ON cp.customer_id = nt.customer_id AND (cp.status = 'active' OR cp.deactivated_at IS NULL)
LEFT JOIN public.plans p ON p.id = cp.plan_id
LEFT JOIN public.qualifications q ON q.name = nt.qualification
ORDER BY nt.path;

-- ---------------------------------------------------------------------
-- Create indexes for performance
-- ---------------------------------------------------------------------

-- Index on network_relationships for faster tree queries
CREATE INDEX IF NOT EXISTS idx_network_relationships_sponsor 
ON public.network_relationships(sponsor_customer_id);

CREATE INDEX IF NOT EXISTS idx_network_relationships_customer 
ON public.network_relationships(customer_id);

-- Index on customers for id_comprador lookups
CREATE INDEX IF NOT EXISTS idx_customers_id_comprador 
ON public.customers(id_comprador);

-- Index on customer_network_metrics for performance
CREATE INDEX IF NOT EXISTS idx_customer_network_metrics_customer_id 
ON public.customer_network_metrics(customer_id);

-- ---------------------------------------------------------------------
-- Grant Permissions
-- ---------------------------------------------------------------------
GRANT SELECT ON public.network_tree_view TO authenticated;

-- Add comment
COMMENT ON VIEW public.network_tree_view IS 'Optimized network tree view with search/filter support, performance metrics, and depth limit (max 20 levels)';
