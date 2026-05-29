-- ============================================================================
-- PHASE 5: REFRESH MATERIALIZED VIEWS
-- ============================================================================
-- This script refreshes all materialized views
-- Execute this AFTER dropping tables
-- ============================================================================

BEGIN;

-- Refresh all materialized views
REFRESH MATERIALIZED VIEW analytics_sales_summary;
REFRESH MATERIALIZED VIEW analytics_customer_summary;
REFRESH MATERIALIZED VIEW analytics_network_summary;
REFRESH MATERIALIZED VIEW analytics_product_summary;

COMMIT;

-- Verify materialized views have data
SELECT 
    'analytics_sales_summary' as view_name,
    COUNT(*) as row_count
FROM analytics_sales_summary
UNION ALL
SELECT 
    'analytics_customer_summary',
    COUNT(*)
FROM analytics_customer_summary
UNION ALL
SELECT 
    'analytics_network_summary',
    COUNT(*)
FROM analytics_network_summary
UNION ALL
SELECT 
    'analytics_product_summary',
    COUNT(*)
FROM analytics_product_summary;
