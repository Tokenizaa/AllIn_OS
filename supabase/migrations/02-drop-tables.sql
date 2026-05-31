-- ============================================================================
-- PHASE 4: DROP TABLES
-- ============================================================================
-- This script drops all unnecessary tables
-- Execute this AFTER creating views and materialized views
-- ============================================================================

BEGIN;

-- Drop staging tables
DROP TABLE IF EXISTS staging_orders CASCADE;
DROP TABLE IF EXISTS staging_customers CASCADE;
DROP TABLE IF EXISTS staging_order_items CASCADE;
DROP TABLE IF EXISTS staging_orders_detalhado CASCADE;

-- Drop unused AI tables
DROP TABLE IF EXISTS customer_embeddings CASCADE;
DROP TABLE IF EXISTS product_embeddings CASCADE;
DROP TABLE IF EXISTS conversation_embeddings CASCADE;
DROP TABLE IF EXISTS insight_embeddings CASCADE;
DROP TABLE IF EXISTS ai_prompt_context CASCADE;

-- Drop wallet system
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS ledger CASCADE;
DROP TABLE IF EXISTS account_transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;

-- Drop complex payments
DROP TABLE IF EXISTS payment_attempts CASCADE;
DROP TABLE IF EXISTS payment_installments CASCADE;
DROP TABLE IF EXISTS installment_rules CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS gateways CASCADE;
DROP TABLE IF EXISTS gateway_webhooks CASCADE;
DROP TABLE IF EXISTS boleto_details CASCADE;
DROP TABLE IF EXISTS pix_details CASCADE;
DROP TABLE IF EXISTS chargebacks CASCADE;
DROP TABLE IF EXISTS delivery_payments CASCADE;
DROP TABLE IF EXISTS shipping_quotes CASCADE;

-- Drop excessive MLM
DROP TABLE IF EXISTS bonus_calculations CASCADE;
DROP TABLE IF EXISTS generation_bonuses CASCADE;
DROP TABLE IF EXISTS bonus_rules CASCADE;
DROP TABLE IF EXISTS network_nodes CASCADE;
DROP TABLE IF EXISTS plan_benefits CASCADE;
DROP TABLE IF EXISTS plan_versions CASCADE;
DROP TABLE IF EXISTS mlm_campaigns CASCADE;
DROP TABLE IF EXISTS mlm_campaign_plans CASCADE;
DROP TABLE IF EXISTS mlm_campaign_bonuses CASCADE;
DROP TABLE IF EXISTS customer_plans CASCADE;
DROP TABLE IF EXISTS user_qualifications CASCADE;

-- Drop unnecessary automation
DROP TABLE IF EXISTS bots CASCADE;
DROP TABLE IF EXISTS automations CASCADE;
DROP TABLE IF EXISTS macros CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS labels CASCADE;
DROP TABLE IF EXISTS customer_labels CASCADE;
DROP TABLE IF EXISTS customer_segments CASCADE;

-- Drop dead tables
DROP TABLE IF EXISTS virtual_store_orders CASCADE;
DROP TABLE IF EXISTS virtual_store_order_history CASCADE;
DROP TABLE IF EXISTS purchase_types CASCADE;

-- Drop additional empty tables
DROP TABLE IF EXISTS imports CASCADE;
DROP TABLE IF EXISTS import_rows CASCADE;
DROP TABLE IF EXISTS bonuses CASCADE;
DROP TABLE IF EXISTS verification_documents CASCADE;
DROP TABLE IF EXISTS approval_requests CASCADE;
DROP TABLE IF EXISTS sponsor_change_requests CASCADE;
DROP TABLE IF EXISTS link_analytics CASCADE;
DROP TABLE IF EXISTS shipping_events CASCADE;

COMMIT;

-- Verify remaining tables
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
