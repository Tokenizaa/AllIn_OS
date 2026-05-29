# Database Tables with Data - Sistema All-in

## Project Information
- **Project Name**: sistema-allin
- **Project ID**: isjsydhuqurneswstlyx
- **Organization**: dbxdctzlsyljmdspqjyp
- **Region**: sa-east-1
- **Status**: ACTIVE_HEALTHY
- **Database Version**: 17.6.1.121
- **Postgres Engine**: 17

## Tables with Data (27 tables)

### Core Business Tables

#### 1. orders
- **Rows**: 22,238
- **RLS Enabled**: Yes
- **Description**: Main orders table with transaction records
- **Comments**: None

#### 2. order_items
- **Rows**: 41,946
- **RLS Enabled**: Yes
- **Description**: Order items linked to orders
- **Comments**: Structured order items parsed from CSV - no raw text storage

#### 3. customers
- **Rows**: 1,631
- **RLS Enabled**: Yes
- **Description**: Customer/distributor records
- **Comments**: None

#### 4. products
- **Rows**: 112
- **RLS Enabled**: Yes
- **Description**: Product catalog
- **Comments**: None

#### 5. payments
- **Rows**: 43,717
- **RLS Enabled**: Yes
- **Description**: Payment transactions tracking
- **Comments**: Payment transactions tracking

#### 6. shipments
- **Rows**: 20,054
- **RLS Enabled**: Yes
- **Description**: Shipping/delivery records
- **Comments**: None

### Network and MLM Tables

#### 7. network_relationships
- **Rows**: 995
- **RLS Enabled**: Yes
- **Description**: Network hierarchy relationships (uplines/downlines)
- **Comments**: None

#### 8. customer_network_metrics
- **Rows**: 1,631
- **RLS Enabled**: Yes
- **Description**: Network metrics per customer
- **Comments**: None

#### 9. bonus_calculations
- **Rows**: 4,618
- **RLS Enabled**: Yes
- **Description**: Bonus calculation records
- **Comments**: None

#### 10. generation_bonuses
- **Rows**: 7
- **RLS Enabled**: Yes
- **Description**: Generation-based bonus rules
- **Comments**: None

#### 11. qualifications
- **Rows**: 11
- **RLS Enabled**: Yes
- **Description**: Qualification levels and rules
- **Comments**: None

#### 12. bonus_rules
- **Rows**: 19
- **RLS Enabled**: Yes
- **Description**: Bonus calculation rules
- **Comments**: None

### Analytics and Metrics Tables

#### 13. customer_metrics
- **Rows**: 1,000
- **RLS Enabled**: Yes
- **Description**: Customer performance metrics
- **Comments**: None

#### 14. customer_scores
- **Rows**: 1,000
- **RLS Enabled**: Yes
- **Description**: AI/customer scoring data
- **Comments**: None

#### 15. product_metrics
- **Rows**: 32
- **RLS Enabled**: Yes
- **Description**: Product performance metrics
- **Comments**: None

#### 16. product_affinities
- **Rows**: 260
- **RLS Enabled**: Yes
- **Description**: Product affinity relationships
- **Comments**: None

#### 17. customer_product_affinities
- **Rows**: 706
- **RLS Enabled**: Yes
- **Description**: Customer-product affinity scores
- **Comments**: None

#### 18. order_items_normalized
- **Rows**: 1,707
- **RLS Enabled**: Yes
- **Description**: Normalized order items for analytics
- **Comments**: None

### Configuration and Reference Tables

#### 19. plans
- **Rows**: 7
- **RLS Enabled**: Yes
- **Description**: MLM plan definitions
- **Comments**: None

#### 20. purchase_types
- **Rows**: 5
- **RLS Enabled**: Yes
- **Description**: Purchase type classifications
- **Comments**: None

#### 21. product_variants
- **Rows**: 7
- **RLS Enabled**: Yes
- **Description**: Product variant configurations
- **Comments**: None

#### 22. labels
- **Rows**: 24
- **RLS Enabled**: Yes
- **Description**: Customer labels/tags
- **Comments**: None

#### 23. templates
- **Rows**: 15
- **RLS Enabled**: Yes
- **Description**: Communication templates
- **Comments**: None

#### 24. macros
- **Rows**: 14
- **RLS Enabled**: Yes
- **Description**: Automation macros
- **Comments**: None

### Campaign and Marketing Tables

#### 25. campaigns
- **Rows**: 9
- **RLS Enabled**: Yes
- **Description**: Marketing campaigns
- **Comments**: None

### System and User Tables

#### 26. profiles
- **Rows**: 2
- **RLS Enabled**: Yes
- **Description**: User profiles
- **Comments**: None

#### 27. workspace_settings
- **Rows**: 2
- **RLS Enabled**: Yes
- **Description**: Workspace configuration
- **Comments**: None

### Staging Tables

#### 28. staging_orders
- **Rows**: 3,705
- **RLS Enabled**: Yes
- **Description**: Staging area for order imports
- **Comments**: None

## Tables Without Data (51 tables)

### Empty Tables
- leads (0 rows)
- imports (0 rows)
- import_rows (0 rows)
- chatwoot_conversations (0 rows)
- chatwoot_messages (0 rows)
- customer_events (0 rows)
- staging_customers (0 rows)
- staging_order_items (0 rows)
- staging_orders_detalhado (0 rows)
- bots (0 rows)
- automations (0 rows)
- customer_segments (0 rows)
- customer_labels (0 rows)
- customer_predictions (0 rows)
- campaign_intelligence (0 rows)
- ai_prompt_context (0 rows)
- wallets (0 rows) - Wallet balances for distributors
- transactions (0 rows) - Transaction history for wallets
- plan_benefits (0 rows)
- customer_plans (0 rows)
- plan_versions (0 rows)
- mlm_campaigns (0 rows)
- mlm_campaign_plans (0 rows)
- mlm_campaign_bonuses (0 rows)
- ledger (0 rows)
- payment_attempts (0 rows)
- payment_installments (0 rows)
- payment_methods (0 rows)
- gateways (0 rows)
- gateway_webhooks (0 rows)
- shipping_quotes (0 rows)
- shipping_events (0 rows)
- boleto_details (0 rows)
- pix_details (0 rows)
- chargebacks (0 rows)
- delivery_payments (0 rows)
- installment_rules (0 rows)
- audit_log (0 rows)
- bonuses (0 rows)
- network_nodes (0 rows)
- customer_embeddings (0 rows)
- product_embeddings (0 rows)
- conversation_embeddings (0 rows)
- insight_embeddings (0 rows)
- accounts (0 rows)
- account_transactions (0 rows)
- user_qualifications (0 rows)
- virtual_store_orders (0 rows)
- virtual_store_order_history (0 rows)
- verification_documents (0 rows)
- approval_requests (0 rows)
- admin_users (0 rows)
- marketing_links (0 rows)
- sponsor_change_requests (0 rows)
- link_analytics (0 rows)

## Summary Statistics

### Total Tables: 78
- **Tables with Data**: 27 (34.6%)
- **Tables Without Data**: 51 (65.4%)

### Data Distribution by Category

| Category | Tables with Data | Total Rows |
|----------|-----------------|------------|
| Core Business | 6 | 109,648 |
| Network/MLM | 5 | 6,636 |
| Analytics/Metrics | 5 | 3,298 |
| Configuration | 5 | 67 |
| Campaign/Marketing | 1 | 9 |
| System/User | 2 | 4 |
| Staging | 1 | 3,705 |

### Largest Tables by Row Count

1. **payments**: 43,717 rows
2. **order_items**: 41,946 rows
3. **orders**: 22,238 rows
4. **shipments**: 20,054 rows
5. **staging_orders**: 3,705 rows
6. **bonus_calculations**: 4,618 rows
7. **customers**: 1,631 rows
8. **customer_network_metrics**: 1,631 rows
9. **order_items_normalized**: 1,707 rows
10. **customer_metrics**: 1,000 rows
11. **customer_scores**: 1,000 rows

## Key Observations

### Active Data Areas
1. **Payment Processing**: High volume (43,717 payment records)
2. **Order Management**: Significant activity (22,238 orders, 41,946 items)
3. **Shipping**: Active logistics (20,054 shipments)
4. **Bonus Calculations**: MLM operations active (4,618 calculations)
5. **Customer Base**: 1,631 customers with network metrics

### Empty Tables Indicators
1. **AI Features**: All embedding tables are empty (customer_embeddings, product_embeddings, conversation_embeddings, insight_embeddings)
2. **Wallet System**: Wallet and transaction tables are empty
3. **Advanced Features**: Many advanced features not yet implemented (audit_log, virtual_store_orders, approval_requests)
4. **Marketing**: Limited marketing data (only campaigns have data, marketing_links empty)
5. **Integrations**: Gateway and webhook tables empty

### Data Quality Notes
- Staging tables have data (staging_orders: 3,705 rows) indicating active data import processes
- Normalized tables exist (order_items_normalized) suggesting data transformation pipelines
- Metrics tables have exactly 1,000 rows each, suggesting calculated/sampled data
- Network relationships (995 rows) less than total customers (1,631), indicating some customers may not have network connections

## Recommendations

### High Priority
1. **Activate AI Features**: Populate embedding tables for AI-powered features
2. **Implement Wallet System**: Activate wallet and transaction tables for financial operations
3. **Enable Audit Logging**: Populate audit_log table for compliance and security
4. **Complete Marketing**: Implement marketing_links and link_analytics for campaign tracking

### Medium Priority
1. **Virtual Store**: Implement virtual_store_orders for e-commerce integration
2. **Approval Workflows**: Activate approval_requests for document verification
3. **Admin Management**: Populate admin_users table for system administration
4. **Payment Methods**: Configure payment_methods and gateways for payment processing

### Low Priority
1. **Advanced Integrations**: Implement gateway_webhooks for external system integration
2. **Chargeback Management**: Activate chargebacks table for payment disputes
3. **Installment Plans**: Implement payment_installments and installment_rules
4. **Sponsor Changes**: Activate sponsor_change_requests for network modifications

## Database Schema Status

The database schema appears to be designed for a comprehensive MLM/e-commerce system with:
- Complete order and payment processing
- Network/MLM functionality
- Analytics and metrics
- Campaign management
- AI capabilities (infrastructure ready, not populated)

The system is actively processing orders, payments, and shipments, with bonus calculations running. However, many advanced features (AI, wallets, audit logging) have the schema but no data, indicating they are planned but not yet implemented.
