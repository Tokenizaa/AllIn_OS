-- =====================================================================
-- ALLIN Sistema - Materialized Views de Analytics
-- Projeto: sistema-allin (isjsydhuqurneswstlyx)
-- Data: 2026-05-26
-- =====================================================================

-- ---------------------------------------------------------------------
-- Materialized View: Sales Summary (resumo de vendas por período)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.sales_summary CASCADE;
CREATE MATERIALIZED VIEW analytics.sales_summary AS
SELECT
    DATE_TRUNC('day', o.data_criacao)::DATE AS dia,
    COUNT(*) AS total_pedidos,
    COUNT(*) FILTER (WHERE o.pago = true) AS pedidos_pagos,
    COUNT(*) FILTER (WHERE o.cancelado = true) AS pedidos_cancelados,
    COALESCE(SUM(o.valor_total_pedido) FILTER (WHERE o.pago = true), 0)::NUMERIC(14,2) AS faturamento,
    COALESCE(AVG(o.valor_total_pedido) FILTER (WHERE o.pago = true), 0)::NUMERIC(14,2) AS ticket_medio,
    COUNT(DISTINCT o.customer_id) AS clientes_unicos
FROM public.orders o
WHERE o.data_criacao IS NOT NULL
GROUP BY 1
ORDER BY 1 DESC;

CREATE INDEX IF NOT EXISTS sales_summary_dia_idx ON analytics.sales_summary(dia DESC);

-- ---------------------------------------------------------------------
-- Materialized View: Customer Metrics Summary (métricas agregadas de clientes)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.customer_metrics_summary CASCADE;
CREATE MATERIALIZED VIEW analytics.customer_metrics_summary AS
SELECT
    cm.customer_id,
    c.id_comprador,
    c.nome,
    c.email,
    cm.total_orders,
    cm.total_spent,
    cm.average_order_value,
    cm.last_order_date,
    cm.first_order_date,
    cm.days_since_last_order,
    cm.churn_score,
    cm.ltv,
    cm.segment,
    c.plano_id,
    c.qualification,
    c.status,
    cm.calculated_at
FROM public.customer_metrics cm
INNER JOIN public.customers c ON c.id = cm.customer_id
ORDER BY cm.total_spent DESC;

CREATE INDEX IF NOT EXISTS customer_metrics_summary_customer_id_idx ON analytics.customer_metrics_summary(customer_id);
CREATE INDEX IF NOT EXISTS customer_metrics_summary_id_comprador_idx ON analytics.customer_metrics_summary(id_comprador);
CREATE INDEX IF NOT EXISTS customer_metrics_summary_segment_idx ON analytics.customer_metrics_summary(segment);
CREATE INDEX IF NOT EXISTS customer_metrics_summary_churn_score_idx ON analytics.customer_metrics_summary(churn_score DESC);

-- ---------------------------------------------------------------------
-- Materialized View: Product Metrics Summary (métricas agregadas de produtos)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.product_metrics_summary CASCADE;
CREATE MATERIALIZED VIEW analytics.product_metrics_summary AS
SELECT
    pm.product_id,
    p.name AS product_name,
    p.category,
    p.price,
    p.sku,
    pm.total_sold,
    pm.total_revenue,
    pm.average_rating,
    pm.review_count,
    pm.view_count,
    pm.conversion_rate,
    pm.return_rate,
    pm.stock_turnover_days,
    p.is_active,
    pm.calculated_at
FROM public.product_metrics pm
INNER JOIN public.products p ON p.id = pm.product_id
ORDER BY pm.total_revenue DESC;

CREATE INDEX IF NOT EXISTS product_metrics_summary_product_id_idx ON analytics.product_metrics_summary(product_id);
CREATE INDEX IF NOT EXISTS product_metrics_summary_category_idx ON analytics.product_metrics_summary(category);
CREATE INDEX IF NOT EXISTS product_metrics_summary_is_active_idx ON analytics.product_metrics_summary(is_active);

-- ---------------------------------------------------------------------
-- Materialized View: Network Performance (performance da rede MLM)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.network_performance CASCADE;
CREATE MATERIALIZED VIEW analytics.network_performance AS
SELECT
    cnm.customer_id,
    c.id_comprador,
    c.nome,
    c.plano_id,
    c.qualification,
    cnm.total_downline,
    cnm.active_downline,
    cnm.personal_volume,
    cnm.total_volume,
    cnm.level,
    cnm.rank,
    (cnm.active_downline::NUMERIC / NULLIF(cnm.total_downline, 0) * 100)::NUMERIC(6,2) AS activation_rate,
    cnm.calculated_at
FROM public.customer_network_metrics cnm
INNER JOIN public.customers c ON c.id = cnm.customer_id
ORDER BY cnm.total_volume DESC;

CREATE INDEX IF NOT EXISTS network_performance_customer_id_idx ON analytics.network_performance(customer_id);
CREATE INDEX IF NOT EXISTS network_performance_id_comprador_idx ON analytics.network_performance(id_comprador);
CREATE INDEX IF NOT EXISTS network_performance_level_idx ON analytics.network_performance(level);
CREATE INDEX IF NOT EXISTS network_performance_rank_idx ON analytics.network_performance(rank);

-- ---------------------------------------------------------------------
-- Materialized View: Bonus Distribution (distribuição de bônus)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.bonus_distribution CASCADE;
CREATE MATERIALIZED VIEW analytics.bonus_distribution AS
SELECT
    b.distributor_id,
    c.nome AS distributor_nome,
    b.type AS bonus_type,
    b.amount,
    b.status,
    b.period,
    b.created_at,
    b.paid_at
FROM public.bonuses b
INNER JOIN public.customers c ON c.id_comprador = b.distributor_id
ORDER BY b.period DESC, b.amount DESC;

CREATE INDEX IF NOT EXISTS bonus_distribution_distributor_id_idx ON analytics.bonus_distribution(distributor_id);
CREATE INDEX IF NOT EXISTS bonus_distribution_type_idx ON analytics.bonus_distribution(bonus_type);
CREATE INDEX IF NOT EXISTS bonus_distribution_status_idx ON analytics.bonus_distribution(status);
CREATE INDEX IF NOT EXISTS bonus_distribution_period_idx ON analytics.bonus_distribution(period DESC);

-- ---------------------------------------------------------------------
-- Materialized View: Plan Performance (performance de planos)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.plan_performance CASCADE;
CREATE MATERIALIZED VIEW analytics.plan_performance AS
SELECT
    p.id AS plan_id,
    p.slug,
    p.name AS plan_name,
    p.price,
    COUNT(DISTINCT cp.customer_id) AS total_customers,
    COUNT(DISTINCT cp.customer_id) FILTER (WHERE cp.is_active = true) AS active_customers,
    COALESCE(SUM(cm.total_spent), 0)::NUMERIC(14,2) AS total_revenue,
    COALESCE(AVG(cm.total_spent), 0)::NUMERIC(14,2) AS avg_revenue_per_customer,
    p.is_active
FROM public.plans p
LEFT JOIN public.customer_plans cp ON cp.plan_id = p.id
LEFT JOIN public.customer_metrics cm ON cm.customer_id = cp.customer_id
GROUP BY p.id, p.slug, p.name, p.price, p.is_active
ORDER BY total_revenue DESC;

CREATE INDEX IF NOT EXISTS plan_performance_plan_id_idx ON analytics.plan_performance(plan_id);
CREATE INDEX IF NOT EXISTS plan_performance_slug_idx ON analytics.plan_performance(slug);
CREATE INDEX IF NOT EXISTS plan_performance_is_active_idx ON analytics.plan_performance(is_active);

-- ---------------------------------------------------------------------
-- Materialized View: Payment Analytics (analytics de pagamentos)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.payment_analytics CASCADE;
CREATE MATERIALIZED VIEW analytics.payment_analytics AS
SELECT
    DATE_TRUNC('day', p.created_at)::DATE AS dia,
    p.payment_method,
    p.status,
    COUNT(*) AS total_payments,
    COALESCE(SUM(p.amount), 0)::NUMERIC(14,2) AS total_amount,
    COALESCE(AVG(p.amount), 0)::NUMERIC(14,2) AS avg_amount,
    COUNT(DISTINCT p.customer_id) AS unique_customers
FROM public.payments p
WHERE p.created_at IS NOT NULL
GROUP BY 1, 2, 3
ORDER BY 1 DESC, 2, 3;

CREATE INDEX IF NOT EXISTS payment_analytics_dia_idx ON analytics.payment_analytics(dia DESC);
CREATE INDEX IF NOT EXISTS payment_analytics_method_idx ON analytics.payment_analytics(payment_method);
CREATE INDEX IF NOT EXISTS payment_analytics_status_idx ON analytics.payment_analytics(status);

-- ---------------------------------------------------------------------
-- Materialized View: Cohort Analysis (análise de coorte)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.cohort_analysis CASCADE;
CREATE MATERIALIZED VIEW analytics.cohort_analysis AS
WITH first_orders AS (
    SELECT 
        customer_id,
        DATE_TRUNC('month', MIN(data_pagamento))::DATE AS cohort_month
    FROM public.orders
    WHERE pago = true
    GROUP BY customer_id
),
monthly_activity AS (
    SELECT 
        fo.customer_id,
        fo.cohort_month,
        DATE_TRUNC('month', o.data_pagamento)::DATE AS activity_month,
        EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', o.data_pagamento), fo.cohort_month))::INTEGER AS month_number
    FROM first_orders fo
    INNER JOIN public.orders o ON o.customer_id = fo.customer_id
    WHERE o.pago = true
    AND o.data_pagamento >= fo.cohort_month
)
SELECT
    cohort_month,
    month_number,
    COUNT(DISTINCT customer_id) AS active_customers,
    COUNT(DISTINCT customer_id) OVER (PARTITION BY cohort_month) AS cohort_size,
    (COUNT(DISTINCT customer_id)::NUMERIC / COUNT(DISTINCT customer_id) OVER (PARTITION BY cohort_month) * 100)::NUMERIC(6,2) AS retention_rate
FROM monthly_activity
GROUP BY cohort_month, month_number
ORDER BY cohort_month DESC, month_number;

CREATE INDEX IF NOT EXISTS cohort_analysis_cohort_month_idx ON analytics.cohort_analysis(cohort_month DESC);
CREATE INDEX IF NOT EXISTS cohort_analysis_month_number_idx ON analytics.cohort_analysis(month_number);

-- ---------------------------------------------------------------------
-- Materialized View: Affiliate Performance (performance de afiliados)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.affiliate_performance CASCADE;
CREATE MATERIALIZED VIEW analytics.affiliate_performance AS
SELECT
    c.id_comprador AS affiliate_id,
    c.nome AS affiliate_nome,
    c.email,
    COUNT(DISTINCT nr.child_id) AS total_referrals,
    COUNT(DISTINCT nr.child_id) FILTER (
        WHERE EXISTS (
            SELECT 1 FROM public.orders o
            INNER JOIN public.customers rc ON rc.id = o.customer_id
            WHERE rc.id_comprador = nr.child_id
            AND o.pago = true
        )
    ) AS active_referrals,
    COALESCE(SUM(o.valor_total_pedido), 0)::NUMERIC(14,2) AS referral_revenue,
    COALESCE(SUM(b.amount), 0)::NUMERIC(14,2) AS total_commissions,
    c.plano_id,
    c.qualification
FROM public.customers c
LEFT JOIN public.network_relationships nr ON nr.parent_id = c.id_comprador
LEFT JOIN public.orders o ON o.customer_id = (SELECT id FROM public.customers WHERE id_comprador = nr.child_id)
LEFT JOIN public.bonuses b ON b.distributor_id = c.id_comprador
GROUP BY c.id_comprador, c.nome, c.email, c.plano_id, c.qualification
ORDER BY referral_revenue DESC;

CREATE INDEX IF NOT EXISTS affiliate_performance_affiliate_id_idx ON analytics.affiliate_performance(affiliate_id);
CREATE INDEX IF NOT EXISTS affiliate_performance_plano_id_idx ON analytics.affiliate_performance(plano_id);

-- ---------------------------------------------------------------------
-- Materialized View: Daily Active Users (usuários ativos diários)
-- ---------------------------------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS analytics.daily_active_users CASCADE;
CREATE MATERIALIZED VIEW analytics.daily_active_users AS
SELECT
    DATE_TRUNC('day', o.data_pagamento)::DATE AS dia,
    COUNT(DISTINCT o.customer_id) AS active_customers,
    COUNT(DISTINCT CASE WHEN o.data_pagamento::DATE = CURRENT_DATE THEN o.customer_id END) AS today_active
FROM public.orders o
WHERE o.pago = true
AND o.data_pagamento >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;

CREATE INDEX IF NOT EXISTS daily_active_users_dia_idx ON analytics.daily_active_users(dia DESC);

-- ---------------------------------------------------------------------
-- Função para refresh de todas as materialized views
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION analytics.refresh_all_materialized_views()
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.sales_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.customer_metrics_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.product_metrics_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.network_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.bonus_distribution;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.plan_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.payment_analytics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.cohort_analysis;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.affiliate_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.daily_active_users;
END;
$$;

-- ---------------------------------------------------------------------
-- Grant Permissions
-- ---------------------------------------------------------------------
GRANT SELECT ON analytics.sales_summary TO authenticated;
GRANT SELECT ON analytics.customer_metrics_summary TO authenticated;
GRANT SELECT ON analytics.product_metrics_summary TO authenticated;
GRANT SELECT ON analytics.network_performance TO authenticated;
GRANT SELECT ON analytics.bonus_distribution TO authenticated;
GRANT SELECT ON analytics.plan_performance TO authenticated;
GRANT SELECT ON analytics.payment_analytics TO authenticated;
GRANT SELECT ON analytics.cohort_analysis TO authenticated;
GRANT SELECT ON analytics.affiliate_performance TO authenticated;
GRANT SELECT ON analytics.daily_active_users TO authenticated;

GRANT EXECUTE ON FUNCTION analytics.refresh_all_materialized_views() TO service_role;
