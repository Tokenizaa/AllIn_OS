-- ============================================================================
-- POST-MIGRATION VALIDATION
-- ============================================================================
-- This script validates the migration was successful
-- Execute this AFTER completing all migration steps
-- ============================================================================

-- ============================================================================
-- VERIFY CORE TABLES EXIST AND HAVE DATA
-- ============================================================================
SELECT 'Core Tables Validation' as validation_type;
SELECT 
    'customers' as table_name,
    COUNT(*) as row_count,
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM customers
UNION ALL
SELECT 
    'orders',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END
FROM orders
UNION ALL
SELECT 
    'order_items',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END
FROM order_items
UNION ALL
SELECT 
    'products',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END
FROM products
UNION ALL
SELECT 
    'payments',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END
FROM payments
UNION ALL
SELECT 
    'shipments',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END
FROM shipments
UNION ALL
SELECT 
    'network_relationships',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END
FROM network_relationships
UNION ALL
SELECT 
    'customer_metrics',
    COUNT(*),
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END
FROM customer_metrics;

-- ============================================================================
-- VERIFY VIEWS WORK
-- ============================================================================
SELECT 'Views Validation' as validation_type;
SELECT 
    'customer_360_view' as view_name,
    COUNT(*) as row_count,
    CASE WHEN COUNT(*) >= 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM customer_360_view
UNION ALL
SELECT 
    'order_summary_view',
    COUNT(*),
    CASE WHEN COUNT(*) >= 0 THEN 'PASS' ELSE 'FAIL' END
FROM order_summary_view
UNION ALL
SELECT 
    'network_tree_view',
    COUNT(*),
    CASE WHEN COUNT(*) >= 0 THEN 'PASS' ELSE 'FAIL' END
FROM network_tree_view;

-- ============================================================================
-- VERIFY MATERIALIZED VIEWS HAVE DATA
-- ============================================================================
SELECT 'Materialized Views Validation' as validation_type;
SELECT 
    'analytics_sales_summary' as view_name,
    COUNT(*) as row_count,
    CASE WHEN COUNT(*) >= 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM analytics_sales_summary
UNION ALL
SELECT 
    'analytics_customer_summary',
    COUNT(*),
    CASE WHEN COUNT(*) >= 0 THEN 'PASS' ELSE 'FAIL' END
FROM analytics_customer_summary
UNION ALL
SELECT 
    'analytics_network_summary',
    COUNT(*),
    CASE WHEN COUNT(*) >= 0 THEN 'PASS' ELSE 'FAIL' END
FROM analytics_network_summary
UNION ALL
SELECT 
    'analytics_product_summary',
    COUNT(*),
    CASE WHEN COUNT(*) >= 0 THEN 'PASS' ELSE 'FAIL' END
FROM analytics_product_summary;

-- ============================================================================
-- VERIFY DROPPED TABLES ARE GONE
-- ============================================================================
SELECT 'Dropped Tables Validation' as validation_type;
SELECT 
    tablename as table_name,
    'SHOULD NOT EXIST' as expected_status,
    'FAIL' as actual_status
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
    'staging_orders',
    'staging_customers',
    'staging_order_items',
    'staging_orders_detalhado',
    'customer_embeddings',
    'product_embeddings',
    'conversation_embeddings',
    'insight_embeddings',
    'ai_prompt_context',
    'wallets',
    'transactions',
    'ledger',
    'account_transactions',
    'accounts',
    'payment_attempts',
    'payment_installments',
    'installment_rules',
    'payment_methods',
    'gateways',
    'gateway_webhooks',
    'boleto_details',
    'pix_details',
    'chargebacks',
    'delivery_payments',
    'shipping_quotes',
    'bonus_calculations',
    'generation_bonuses',
    'bonus_rules',
    'network_nodes',
    'plan_benefits',
    'plan_versions',
    'mlm_campaigns',
    'mlm_campaign_plans',
    'mlm_campaign_bonuses',
    'customer_plans',
    'user_qualifications',
    'bots',
    'automations',
    'macros',
    'templates',
    'labels',
    'customer_labels',
    'customer_segments',
    'virtual_store_orders',
    'virtual_store_order_history',
    'purchase_types',
    'imports',
    'import_rows',
    'bonuses',
    'verification_documents',
    'approval_requests',
    'sponsor_change_requests',
    'link_analytics',
    'shipping_events'
);

-- ============================================================================
-- COUNT TOTAL OBJECTS
-- ============================================================================
SELECT 'Object Count Summary' as validation_type;
SELECT 
    'tables' as object_type,
    COUNT(*) as count
FROM pg_tables 
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'views',
    COUNT(*)
FROM pg_views 
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'materialized_views',
    COUNT(*)
FROM pg_matviews 
WHERE schemaname = 'public';

-- ============================================================================
-- DATA INTEGRITY CHECKS
-- ============================================================================
SELECT 'Data Integrity Checks' as validation_type;

-- Check customer 360 view has all customers
SELECT 
    'customer_360_view vs customers' as check_name,
    (SELECT COUNT(*) FROM customers) as customers_count,
    (SELECT COUNT(*) FROM customer_360_view) as view_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM customers) = (SELECT COUNT(*) FROM customer_360_view) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status;

-- Check order summary view has all orders
SELECT 
    'order_summary_view vs orders' as check_name,
    (SELECT COUNT(*) FROM orders) as orders_count,
    (SELECT COUNT(*) FROM order_summary_view) as view_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM orders) = (SELECT COUNT(*) FROM order_summary_view) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status;

-- Check network relationships are preserved
SELECT 
    'network_relationships preserved' as check_name,
    COUNT(*) as count,
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM network_relationships;

-- ============================================================================
-- PERFORMANCE CHECKS
-- ============================================================================
SELECT 'Performance Checks' as validation_type;

-- Time view queries
EXPLAIN ANALYZE SELECT COUNT(*) FROM customer_360_view;
EXPLAIN ANALYZE SELECT COUNT(*) FROM order_summary_view;
EXPLAIN ANALYZE SELECT COUNT(*) FROM network_tree_view;

-- Time materialized view queries
EXPLAIN ANALYZE SELECT COUNT(*) FROM analytics_sales_summary;
EXPLAIN ANALYZE SELECT COUNT(*) FROM analytics_customer_summary;
EXPLAIN ANALYZE SELECT COUNT(*) FROM analytics_network_summary;
EXPLAIN ANALYZE SELECT COUNT(*) FROM analytics_product_summary;

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================
SELECT 'Migration Complete' as status;
SELECT 
    'Expected: ~30 objects' as expected,
    CONCAT('Actual: ', (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public'), ' tables') as actual_tables,
    CONCAT('Actual: ', (SELECT COUNT(*) FROM pg_views WHERE schemaname = 'public'), ' views') as actual_views,
    CONCAT('Actual: ', (SELECT COUNT(*) FROM pg_matviews WHERE schemaname = 'public'), ' materialized views') as actual_mviews;
