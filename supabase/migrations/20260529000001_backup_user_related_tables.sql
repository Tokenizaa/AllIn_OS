-- ============================================================================
-- BACKUP: USER-RELATED TABLES SNAPSHOT
-- ============================================================================
-- Snapshot of tables and ownership-related records for 2026-05-29.
-- This mirrors the existing backup pattern used in the repository.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS backup_2026_05_29;

-- Public tables with user/ownership fields
CREATE TABLE IF NOT EXISTS backup_2026_05_29.admin_users AS SELECT * FROM public.admin_users;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.audit_log AS SELECT * FROM public.audit_log;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.audit_log_summary AS SELECT * FROM public.audit_log_summary;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.campaigns AS SELECT * FROM public.campaigns;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.chatwoot_conversations AS SELECT * FROM public.chatwoot_conversations;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.chatwoot_messages AS SELECT * FROM public.chatwoot_messages;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.customer_events AS SELECT * FROM public.customer_events;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.customer_metrics AS SELECT * FROM public.customer_metrics;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.customer_network_metrics AS SELECT * FROM public.customer_network_metrics;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.customer_product_affinities AS SELECT * FROM public.customer_product_affinities;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.customer_scores AS SELECT * FROM public.customer_scores;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.customers AS SELECT * FROM public.customers;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.leads AS SELECT * FROM public.leads;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.marketing_links AS SELECT * FROM public.marketing_links;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.network_relationships AS SELECT * FROM public.network_relationships;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.order_items AS SELECT * FROM public.order_items;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.order_items_normalized AS SELECT * FROM public.order_items_normalized;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.orders AS SELECT * FROM public.orders;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.payments AS SELECT * FROM public.payments;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.product_affinities AS SELECT * FROM public.product_affinities;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.product_metrics AS SELECT * FROM public.product_metrics;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.products AS SELECT * FROM public.products;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.profiles AS SELECT * FROM public.profiles;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.workspace_settings AS SELECT * FROM public.workspace_settings;

-- Backup automation/import tables that still rely on user ownership
CREATE TABLE IF NOT EXISTS backup_2026_05_29.import_rows AS SELECT * FROM backup_2026_05_28.import_rows;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.imports AS SELECT * FROM backup_2026_05_28.imports;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.labels AS SELECT * FROM backup_2026_05_28.labels;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.macros AS SELECT * FROM backup_2026_05_28.macros;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.templates AS SELECT * FROM backup_2026_05_28.templates;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.automations AS SELECT * FROM backup_2026_05_28.automations;
CREATE TABLE IF NOT EXISTS backup_2026_05_29.bots AS SELECT * FROM backup_2026_05_28.bots;

-- Backup analytics / supporting tables
CREATE TABLE IF NOT EXISTS backup_2026_05_29.ai_conversations AS SELECT * FROM analytics.ai_conversations;

