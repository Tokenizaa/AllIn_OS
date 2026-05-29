# User-Related Records Inventory

Generated from the live schema of project `isjsydhuqurneswstlyx` on `2026-05-29`.

## Public tables with ownership/user fields

- `admin_users.user_id`
- `audit_log.user_id`
- `audit_log_summary.user_id`
- `campaigns.user_id`
- `chatwoot_conversations.user_id`
- `chatwoot_messages.user_id`
- `customer_events.user_id`
- `customer_metrics.user_id`
- `customer_network_metrics.user_id`
- `customer_product_affinities.user_id`
- `customer_scores.user_id`
- `customers.user_id`
- `leads.user_id`
- `marketing_links.created_by`
- `network_relationships.user_id`
- `order_items.user_id`
- `order_items_normalized.user_id`
- `orders.user_id`
- `payments.user_id`
- `product_affinities.user_id`
- `product_metrics.user_id`
- `products.user_id`
- `profiles.user_id`
- `workspace_settings.user_id`

## Backup schema tables kept for reference

- `backup_2026_05_28.accounts.user_id`
- `backup_2026_05_28.automations.user_id`
- `backup_2026_05_28.bots.user_id`
- `backup_2026_05_28.delivery_payments.collector_user_id`
- `backup_2026_05_28.import_rows.user_id`
- `backup_2026_05_28.imports.user_id`
- `backup_2026_05_28.labels.user_id`
- `backup_2026_05_28.macros.user_id`
- `backup_2026_05_28.staging_customers.user_id`
- `backup_2026_05_28.staging_order_items.user_id`
- `backup_2026_05_28.staging_orders.user_id`
- `backup_2026_05_28.staging_orders_detalhado.user_id`
- `backup_2026_05_28.templates.user_id`
- `backup_2026_05_28.transactions.user_id`
- `backup_2026_05_28.user_qualifications.user_id`
- `backup_2026_05_28.wallets.user_id`

## Auth and storage ownership fields

- `analytics.ai_conversations.user_id`
- `auth.flow_state.user_id`
- `auth.identities.user_id`
- `auth.mfa_factors.user_id`
- `auth.oauth_authorizations.user_id`
- `auth.oauth_consents.user_id`
- `auth.one_time_tokens.user_id`
- `auth.refresh_tokens.user_id`
- `auth.sessions.user_id`
- `auth.webauthn_challenges.user_id`
- `auth.webauthn_credentials.user_id`
- `storage.buckets.owner`
- `storage.buckets.owner_id`
- `storage.objects.owner`
- `storage.objects.owner_id`
- `storage.s3_multipart_uploads.owner_id`
- `storage.s3_multipart_uploads_parts.owner_id`
- `supabase_migrations.schema_migrations.created_by`

