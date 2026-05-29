# New Database Structure - Sistema ALLIN Refactored

## Overview

This document describes the final database structure after refactoring from 78 tables to 29 objects (22 core tables + 3 views + 4 materialized views).

**Refactoring Goals**:
- MLM enterprise
- Native AI
- Customer 360
- Analytics
- Chatwoot integration
- Event-driven
- No legacy junk
- No dead tables
- No redundancy

---

## Core Tables (22 tables)

### Core Commercial (7 tables)

#### customers
- **Purpose**: Main entity of the system
- **Rows**: 1,631
- **RLS**: Enabled
- **Key Fields**: id, nome_completo, email, cpf_cnpj, nivel, status, data_cadastro

#### orders
- **Purpose**: Financial/commercial core
- **Rows**: 22,238
- **RLS**: Enabled
- **Key Fields**: id, numero_pedido, customer_id, status_pedido, valor_total_pedido, data_pedido

#### order_items
- **Purpose**: Order composition
- **Rows**: 41,946
- **RLS**: Enabled
- **Key Fields**: id, order_id, product_id, quantidade, valor_unitario, valor_total

#### products
- **Purpose**: Product catalog
- **Rows**: 112
- **RLS**: Enabled
- **Key Fields**: id, nome, categoria, valor, pontos, estoque, ativo

#### product_variants
- **Purpose**: Product variants
- **Rows**: 7
- **RLS**: Enabled
- **Key Fields**: id, product_id, variant_name, variant_value, sku

#### payments
- **Purpose**: Payments
- **Rows**: 43,717
- **RLS**: Enabled
- **Key Fields**: id, order_id, customer_id, valor, status, metodo, data_pagamento

#### shipments
- **Purpose**: Logistics
- **Rows**: 20,054
- **RLS**: Enabled
- **Key Fields**: id, order_id, status, metodo_envio, data_envio, data_entrega

### Core MLM (4 tables)

#### network_relationships
- **Purpose**: MLM tree
- **Rows**: 995
- **RLS**: Enabled
- **Key Fields**: id, sponsor_id, downline_id, generation, created_at

#### customer_network_metrics
- **Purpose**: Network metrics
- **Rows**: 1,631
- **RLS**: Enabled
- **Key Fields**: customer_id, total_downlines, active_downlines, network_depth, network_width

#### qualifications
- **Purpose**: Qualifications
- **Rows**: 11
- **RLS**: Enabled
- **Key Fields**: codigo, nome, descricao, requisitos, beneficios

#### plans
- **Purpose**: MLM plans
- **Rows**: 7
- **RLS**: Enabled
- **Key Fields**: id, nome, descricao, valor, pontos, ativo

### Core Analytics (5 tables)

#### customer_metrics
- **Purpose**: Customer metrics
- **Rows**: 1,000
- **RLS**: Enabled
- **Key Fields**: customer_id, ltv, frequency, recency, avg_order_value, total_orders

#### customer_scores
- **Purpose**: AI scoring
- **Rows**: 1,000
- **RLS**: Enabled
- **Key Fields**: customer_id, score, risk_level, prediction, confidence

#### product_metrics
- **Purpose**: Product metrics
- **Rows**: 32
- **RLS**: Enabled
- **Key Fields**: product_id, popularity_score, trend_score, conversion_rate, avg_rating

#### product_affinities
- **Purpose**: Product affinity
- **Rows**: 260
- **RLS**: Enabled
- **Key Fields**: product_id_1, product_id_2, affinity_score, co_purchase_count

#### customer_product_affinities
- **Purpose**: AI recommendation
- **Rows**: 706
- **RLS**: Enabled
- **Key Fields**: customer_id, product_id, category, affinity_score, purchase_count

### Core Marketing (2 tables)

#### campaigns
- **Purpose**: Campaigns
- **Rows**: 9
- **RLS**: Enabled
- **Key Fields**: id, nome, tipo, status, data_inicio, data_fim, budget

#### marketing_links
- **Purpose**: Marketing tracking
- **Rows**: 0
- **RLS**: Enabled
- **Key Fields**: id, campaign_id, url, slug, clicks, conversions

### Core System (4 tables)

#### profiles
- **Purpose**: Users/admin
- **Rows**: 2
- **RLS**: Enabled
- **Key Fields**: id, user_id, nome, email, role, avatar_url

#### workspace_settings
- **Purpose**: Global configs
- **Rows**: 2
- **RLS**: Enabled
- **Key Fields**: key, value, description, updated_at

#### audit_log
- **Purpose**: Compliance
- **Rows**: 0
- **RLS**: Enabled
- **Key Fields**: id, actor, action, entity, entity_id, timestamp, metadata

#### admin_users
- **Purpose**: Administration
- **Rows**: 0
- **RLS**: Enabled
- **Key Fields**: id, nome, email, role, permissions, active

### Chatwoot Integration (3 tables)

#### chatwoot_conversations
- **Purpose**: Chatwoot conversations
- **Rows**: 0
- **RLS**: Enabled
- **Key Fields**: id, customer_id, conversation_id, status, created_at

#### chatwoot_messages
- **Purpose**: Chatwoot messages
- **Rows**: 0
- **RLS**: Enabled
- **Key Fields**: id, conversation_id, message_id, sender, content, created_at

#### customer_events
- **Purpose**: Customer events
- **Rows**: 0
- **RLS**: Enabled
- **Key Fields**: id, customer_id, event_type, metadata, created_at

---

## Views (3 views)

### customer_360_view
- **Purpose**: Comprehensive customer view
- **Base Tables**: customers, orders, payments, shipments, customer_network_metrics, customer_metrics, customer_scores, customer_product_affinities
- **Columns**: All customer data + order metrics + payment metrics + shipment metrics + network metrics + AI metrics + product affinities
- **Use Case**: Customer 360 dashboard, customer analytics

### order_summary_view
- **Purpose**: Comprehensive order view
- **Base Tables**: orders, customers, order_items, payments, shipments, network_relationships
- **Columns**: All order data + customer info + items summary + payment summary + shipment summary + network context
- **Use Case**: Order management, order analytics

### network_tree_view
- **Purpose**: Hierarchical network view
- **Base Tables**: customers, network_relationships, customer_network_metrics, qualifications
- **Columns**: Network hierarchy with generation, depth, path, metrics, qualifications
- **Use Case**: Network visualization, genealogy tree

---

## Materialized Views (4 views)

### analytics_sales_summary
- **Purpose**: Sales analytics
- **Base Table**: orders
- **Granularity**: Monthly
- **Columns**: month, total_orders, total_revenue, avg_order_value, unique_customers, paid_orders, paid_revenue
- **Refresh**: Hourly
- **Use Case**: Sales dashboard, revenue tracking

### analytics_customer_summary
- **Purpose**: Customer acquisition analytics
- **Base Table**: customers
- **Granularity**: Monthly
- **Columns**: month, new_customers, active_customers, customers, affiliates, advancement, excellence
- **Refresh**: Hourly
- **Use Case**: Growth metrics, customer acquisition

### analytics_network_summary
- **Purpose**: Network performance analytics
- **Base Table**: customer_network_metrics
- **Granularity**: Monthly
- **Columns**: month, total_downlines, active_downlines, avg_network_depth, avg_network_width, active_distributors
- **Refresh**: Hourly
- **Use Case**: Network health, MLM performance

### analytics_product_summary
- **Purpose**: Product performance analytics
- **Base Tables**: products, order_items, product_metrics
- **Granularity**: Product-level
- **Columns**: id, nome, categoria, total_sold, total_quantity, total_revenue, avg_price, popularity_score, trend_score
- **Refresh**: Hourly
- **Use Case**: Product analytics, inventory planning

---

## Entity Relationships

### Core Commercial Flow

```
customers (1,631)
  ├── orders (22,238)
  │    ├── order_items (41,946)
  │    ├── payments (43,717)
  │    └── shipments (20,054)
  │
  ├── customer_metrics (1,000)
  ├── customer_scores (1,000)
  └── customer_product_affinities (706)
```

### Products Flow

```
products (112)
  ├── product_variants (7)
  ├── product_metrics (32)
  └── product_affinities (260)
```

### MLM Flow

```
customers (1,631)
  ├── network_relationships (995)
  ├── customer_network_metrics (1,631)
  ├── qualifications (11)
  └── plans (7)
```

### Marketing Flow

```
campaigns (9)
  └── marketing_links (0)
```

### Chatwoot Integration Flow

```
customers (1,631)
  ├── customer_events (0)
  ├── chatwoot_conversations (0)
  └── chatwoot_messages (0)
```

---

## Data Volume Summary

### Total Rows by Category

| Category | Tables | Total Rows |
|----------|--------|------------|
| Core Commercial | 7 | 128,651 |
| Core MLM | 4 | 2,644 |
| Core Analytics | 5 | 2,998 |
| Core Marketing | 2 | 9 |
| Core System | 4 | 4 |
| Chatwoot Integration | 3 | 0 |
| **Total** | **25** | **134,306** |

### Largest Tables

1. payments: 43,717 rows
2. order_items: 41,946 rows
3. orders: 22,238 rows
4. shipments: 20,054 rows
5. customers: 1,631 rows
6. customer_network_metrics: 1,631 rows
7. customer_metrics: 1,000 rows
8. customer_scores: 1,000 rows
9. order_items_normalized: 1,707 rows
10. network_relationships: 995 rows

---

## Index Strategy

### Core Tables Indexes

#### customers
- PRIMARY KEY: id
- INDEX: email
- INDEX: cpf_cnpj
- INDEX: nivel
- INDEX: status
- INDEX: data_cadastro

#### orders
- PRIMARY KEY: id
- INDEX: customer_id
- INDEX: numero_pedido
- INDEX: status_pedido
- INDEX: data_pedido
- INDEX: (customer_id, status_pedido)

#### order_items
- PRIMARY KEY: id
- INDEX: order_id
- INDEX: product_id
- INDEX: (order_id, product_id)

#### products
- PRIMARY KEY: id
- INDEX: nome
- INDEX: categoria
- INDEX: sku
- INDEX: ativo

#### payments
- PRIMARY KEY: id
- INDEX: order_id
- INDEX: customer_id
- INDEX: status
- INDEX: data_pagamento
- INDEX: (order_id, status)

#### shipments
- PRIMARY KEY: id
- INDEX: order_id
- INDEX: status
- INDEX: data_envio

#### network_relationships
- PRIMARY KEY: id
- INDEX: sponsor_id
- INDEX: downline_id
- INDEX: generation
- UNIQUE: (sponsor_id, downline_id)

### Materialized Views Indexes

#### analytics_sales_summary
- INDEX: month

#### analytics_customer_summary
- INDEX: month

#### analytics_network_summary
- INDEX: month

#### analytics_product_summary
- INDEX: id
- INDEX: categoria

---

## Security and Access Control

### Row Level Security (RLS)

All core tables have RLS enabled. Policies should be configured based on:

- **Admin Users**: Full access to all data
- **Distributors**: Access to own data + downlines
- **Support**: Read access to customer data
- **Analytics**: Read access to aggregated data

### Suggested RLS Policies

```sql
-- Example RLS policy for customers
CREATE POLICY "Distributors can see their own data"
ON customers FOR SELECT
USING (
    id = current_user_id()
    OR id IN (
        SELECT downline_id FROM network_relationships
        WHERE sponsor_id = current_user_id()
    )
);

-- Example RLS policy for orders
CREATE POLICY "Distributors can see their own orders"
ON orders FOR SELECT
USING (
    customer_id = current_user_id()
    OR customer_id IN (
        SELECT downline_id FROM network_relationships
        WHERE sponsor_id = current_user_id()
    )
);
```

---

## Performance Considerations

### Query Optimization

1. **Views**: Use for complex joins, monitor performance
2. **Materialized Views**: Use for analytics, refresh hourly
3. **Indexes**: Ensure proper indexing on foreign keys and frequently queried columns
4. **Partitioning**: Consider partitioning orders by date for large datasets

### Caching Strategy

1. **Application Level**: Cache frequently accessed customer data
2. **Database Level**: Use materialized views for analytics
3. **CDN**: Cache product catalog and static data

### Monitoring

1. **Slow Query Log**: Monitor queries > 100ms
2. **View Performance**: Monitor view query times
3. **Materialized View Refresh**: Monitor refresh times
4. **Index Usage**: Monitor index efficiency

---

## Migration Path

### Phase 1: Backup
- Execute `01-backup-tables.sql`
- Verify backup integrity

### Phase 2: Create Views
- Execute `03-create-views.sql`
- Verify views work correctly

### Phase 3: Create Materialized Views
- Execute `04-create-materialized-views.sql`
- Verify materialized views have data

### Phase 4: Drop Tables
- Execute `02-drop-tables.sql`
- Verify tables are dropped

### Phase 5: Refresh Materialized Views
- Execute `05-refresh-materialized-views.sql`
- Verify data is current

### Phase 6: Set Up Refresh Schedule
- Execute `06-create-refresh-function.sql`
- Configure cron schedule

### Phase 7: Validate
- Execute `07-validate-migration.sql`
- Verify all checks pass

---

## Application Changes Required

### Code Updates

1. **Replace direct table queries** with view queries where applicable
2. **Update ORM models** to use views instead of dropped tables
3. **Remove references** to dropped tables
4. **Update analytics queries** to use materialized views
5. **Implement audit logging** in application layer

### API Changes

1. **Update endpoints** to use new view structures
2. **Add audit logging** to critical operations
3. **Implement Chatwoot integration** for customer events
4. **Update customer 360** endpoint to use customer_360_view

### Frontend Changes

1. **Update dashboards** to use materialized views for analytics
2. **Implement network tree** using network_tree_view
3. **Update order management** to use order_summary_view
4. **Add audit log viewer** for compliance

---

## Rollback Plan

If migration fails:

1. **Restore from backup**:
   ```sql
   DROP SCHEMA IF EXISTS backup_2026_05_28 CASCADE;
   -- Tables are already backed up
   ```

2. **Drop views and materialized views**:
   ```sql
   DROP VIEW IF EXISTS customer_360_view CASCADE;
   DROP VIEW IF EXISTS order_summary_view CASCADE;
   DROP VIEW IF EXISTS network_tree_view CASCADE;
   DROP MATERIALIZED VIEW IF EXISTS analytics_sales_summary CASCADE;
   DROP MATERIALIZED VIEW IF EXISTS analytics_customer_summary CASCADE;
   DROP MATERIALIZED VIEW IF EXISTS analytics_network_summary CASCADE;
   DROP MATERIALIZED VIEW IF EXISTS analytics_product_summary CASCADE;
   ```

3. **Restore dropped tables** from backup schema

---

## Maintenance

### Regular Tasks

1. **Refresh materialized views** (hourly)
2. **Monitor view performance** (daily)
3. **Check index usage** (weekly)
4. **Audit log cleanup** (monthly)
5. **Backup verification** (monthly)

### Monitoring

1. **Query performance**: Monitor slow queries
2. **View performance**: Monitor view query times
3. **Materialized view freshness**: Monitor refresh times
4. **Data integrity**: Regular validation queries
5. **Security**: Monitor access patterns

---

## Conclusion

The refactored database structure provides:

✅ **Clean Architecture**: 29 objects vs 78 tables
✅ **Customer 360**: Comprehensive customer views
✅ **Analytics**: Materialized views for fast analytics
✅ **MLM Support**: Core MLM tables preserved
✅ **AI Ready**: Metrics and scores tables for AI
✅ **Chatwoot Integration**: Tables for conversational hub
✅ **Event-Driven**: Customer events table
✅ **Compliance**: Audit log table
✅ **Scalability**: Materialized views for performance
✅ **Maintainability**: Simple, focused structure

The new structure is ready for:
- MLM enterprise operations
- Native AI integration
- Customer 360 analytics
- Real-time dashboards
- Chatwoot integration
- Event-driven architecture
