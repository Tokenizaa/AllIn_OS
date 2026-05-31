-- ============================================================================
-- PHASE 1: BACKUP TABLES
-- ============================================================================
-- This script creates backups of all tables that will be dropped
-- Execute this BEFORE dropping any tables
-- ============================================================================

-- Create backup schema
CREATE SCHEMA IF NOT EXISTS backup_2026_05_28;

-- Backup staging tables
CREATE TABLE backup_2026_05_28.staging_orders AS SELECT * FROM staging_orders;
CREATE TABLE backup_2026_05_28.staging_customers AS SELECT * FROM staging_customers;
CREATE TABLE backup_2026_05_28.staging_order_items AS SELECT * FROM staging_order_items;
CREATE TABLE backup_2026_05_28.staging_orders_detalhado AS SELECT * FROM staging_orders_detalhado;

-- Backup MLM tables
CREATE TABLE backup_2026_05_28.bonus_calculations AS SELECT * FROM bonus_calculations;
CREATE TABLE backup_2026_05_28.generation_bonuses AS SELECT * FROM generation_bonuses;
CREATE TABLE backup_2026_05_28.bonus_rules AS SELECT * FROM bonus_rules;
CREATE TABLE backup_2026_05_28.network_nodes AS SELECT * FROM network_nodes;
CREATE TABLE backup_2026_05_28.plan_benefits AS SELECT * FROM plan_benefits;
CREATE TABLE backup_2026_05_28.plan_versions AS SELECT * FROM plan_versions;
CREATE TABLE backup_2026_05_28.mlm_campaigns AS SELECT * FROM mlm_campaigns;
CREATE TABLE backup_2026_05_28.mlm_campaign_plans AS SELECT * FROM mlm_campaign_plans;
CREATE TABLE backup_2026_05_28.mlm_campaign_bonuses AS SELECT * FROM mlm_campaign_bonuses;
CREATE TABLE backup_2026_05_28.customer_plans AS SELECT * FROM customer_plans;
CREATE TABLE backup_2026_05_28.user_qualifications AS SELECT * FROM user_qualifications;

-- Backup automation tables
CREATE TABLE backup_2026_05_28.labels AS SELECT * FROM labels;
CREATE TABLE backup_2026_05_28.templates AS SELECT * FROM templates;
CREATE TABLE backup_2026_05_28.macros AS SELECT * FROM macros;
CREATE TABLE backup_2026_05_28.bots AS SELECT * FROM bots;
CREATE TABLE backup_2026_05_28.automations AS SELECT * FROM automations;
CREATE TABLE backup_2026_05_28.customer_labels AS SELECT * FROM customer_labels;
CREATE TABLE backup_2026_05_28.customer_segments AS SELECT * FROM customer_segments;

-- Backup wallet system
CREATE TABLE backup_2026_05_28.wallets AS SELECT * FROM wallets;
CREATE TABLE backup_2026_05_28.transactions AS SELECT * FROM transactions;
CREATE TABLE backup_2026_05_28.ledger AS SELECT * FROM ledger;
CREATE TABLE backup_2026_05_28.account_transactions AS SELECT * FROM account_transactions;
CREATE TABLE backup_2026_05_28.accounts AS SELECT * FROM accounts;

-- Backup complex payments
CREATE TABLE backup_2026_05_28.payment_attempts AS SELECT * FROM payment_attempts;
CREATE TABLE backup_2026_05_28.payment_installments AS SELECT * FROM payment_installments;
CREATE TABLE backup_2026_05_28.installment_rules AS SELECT * FROM installment_rules;
CREATE TABLE backup_2026_05_28.payment_methods AS SELECT * FROM payment_methods;
CREATE TABLE backup_2026_05_28.gateways AS SELECT * FROM gateways;
CREATE TABLE backup_2026_05_28.gateway_webhooks AS SELECT * FROM gateway_webhooks;
CREATE TABLE backup_2026_05_28.boleto_details AS SELECT * FROM boleto_details;
CREATE TABLE backup_2026_05_28.pix_details AS SELECT * FROM pix_details;
CREATE TABLE backup_2026_05_28.chargebacks AS SELECT * FROM chargebacks;
CREATE TABLE backup_2026_05_28.delivery_payments AS SELECT * FROM delivery_payments;
CREATE TABLE backup_2026_05_28.shipping_quotes AS SELECT * FROM shipping_quotes;

-- Backup unused AI
CREATE TABLE backup_2026_05_28.customer_embeddings AS SELECT * FROM customer_embeddings;
CREATE TABLE backup_2026_05_28.product_embeddings AS SELECT * FROM product_embeddings;
CREATE TABLE backup_2026_05_28.conversation_embeddings AS SELECT * FROM conversation_embeddings;
CREATE TABLE backup_2026_05_28.insight_embeddings AS SELECT * FROM insight_embeddings;
CREATE TABLE backup_2026_05_28.ai_prompt_context AS SELECT * FROM ai_prompt_context;

-- Backup dead tables
CREATE TABLE backup_2026_05_28.virtual_store_orders AS SELECT * FROM virtual_store_orders;
CREATE TABLE backup_2026_05_28.virtual_store_order_history AS SELECT * FROM virtual_store_order_history;
CREATE TABLE backup_2026_05_28.purchase_types AS SELECT * FROM purchase_types;

-- Backup additional empty tables
CREATE TABLE backup_2026_05_28.imports AS SELECT * FROM imports;
CREATE TABLE backup_2026_05_28.import_rows AS SELECT * FROM import_rows;
CREATE TABLE backup_2026_05_28.bonuses AS SELECT * FROM bonuses;
CREATE TABLE backup_2026_05_28.verification_documents AS SELECT * FROM verification_documents;
CREATE TABLE backup_2026_05_28.approval_requests AS SELECT * FROM approval_requests;
CREATE TABLE backup_2026_05_28.sponsor_change_requests AS SELECT * FROM sponsor_change_requests;
CREATE TABLE backup_2026_05_28.link_analytics AS SELECT * FROM link_analytics;
CREATE TABLE backup_2026_05_28.shipping_events AS SELECT * FROM shipping_events;

-- Verify backup
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'backup_2026_05_28'
ORDER BY tablename;
