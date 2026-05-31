-- ============================================================================
-- PHASE 3: CREATE MATERIALIZED VIEWS
-- ============================================================================
-- This script creates materialized views for analytics
-- Execute this BEFORE dropping any tables
-- ============================================================================

BEGIN;

-- ============================================================================
-- ANALYTICS SALES SUMMARY
-- ============================================================================
CREATE MATERIALIZED VIEW analytics_sales_summary AS
SELECT
    DATE_TRUNC('month', data_criacao) AS month,
    COUNT(*) AS total_orders,
    SUM(valor_total_pedido) AS total_revenue,
    AVG(valor_total_pedido) AS avg_order_value,
    COUNT(DISTINCT customer_id) AS unique_customers,
    COUNT(CASE WHEN pago = true THEN 1 END) AS paid_orders,
    SUM(CASE WHEN pago = true THEN valor_total_pedido ELSE 0 END) AS paid_revenue
FROM orders
GROUP BY DATE_TRUNC('month', data_criacao);

CREATE INDEX ON analytics_sales_summary(month);

-- ============================================================================
-- ANALYTICS CUSTOMER SUMMARY
-- ============================================================================
CREATE MATERIALIZED VIEW analytics_customer_summary AS
SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS new_customers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_customers,
    COUNT(CASE WHEN qualification = 'Cliente' THEN 1 END) AS customers,
    COUNT(CASE WHEN qualification = 'Afiliado' THEN 1 END) AS affiliates,
    COUNT(CASE WHEN qualification = 'Avanço' THEN 1 END) AS advancement,
    COUNT(CASE WHEN qualification = 'Excelência' THEN 1 END) AS excellence
FROM customers
GROUP BY DATE_TRUNC('month', created_at);

CREATE INDEX ON analytics_customer_summary(month);

-- ============================================================================
-- ANALYTICS NETWORK SUMMARY
-- ============================================================================
CREATE MATERIALIZED VIEW analytics_network_summary AS
SELECT
    DATE_TRUNC('month', cnm.updated_at) AS month,
    SUM(cnm.total_network_size) AS total_downlines,
    SUM(cnm.active_network_size) AS active_downlines,
    AVG(cnm.network_revenue) AS avg_network_revenue,
    COUNT(DISTINCT cnm.customer_id) AS active_distributors
FROM customer_network_metrics cnm
GROUP BY DATE_TRUNC('month', cnm.updated_at);

CREATE INDEX ON analytics_network_summary(month);

-- ============================================================================
-- ANALYTICS PRODUCT SUMMARY
-- ============================================================================
CREATE MATERIALIZED VIEW analytics_product_summary AS
SELECT
    p.id,
    p.name AS nome,
    p.category AS categoria,
    COUNT(oi.id) AS total_sold,
    SUM(oi.quantity) AS total_quantity,
    SUM(oi.total_price) AS total_revenue,
    AVG(oi.unit_price) AS avg_price,
    pm.frequencia_compra,
    pm.clientes_unicos,
    pm.ticket_medio_produto,
    pm.recorrencia
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN product_metrics pm ON p.id = pm.product_id
GROUP BY p.id, p.name, p.category, pm.frequencia_compra, pm.clientes_unicos, pm.ticket_medio_produto, pm.recorrencia;

CREATE INDEX ON analytics_product_summary(id);
CREATE INDEX ON analytics_product_summary(categoria);

COMMIT;

-- Verify materialized views created
SELECT 
    schemaname,
    matviewname,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) as size
FROM pg_matviews 
WHERE schemaname = 'public'
ORDER BY matviewname;
