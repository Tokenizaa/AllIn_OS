# Correct BD

Este documento consolida as correcoes de arquitetura de usuarios, ownership e relacionamento no banco atual do projeto.

## Objetivo

Separar corretamente:

- autenticacao
- RBAC
- ownership administrativo
- entidade comercial / MLM
- auditoria
- analytics
- integracoes

## Diretriz principal

O sistema usa `auth.users` como fonte de autenticacao, mas a maior parte das entidades de negocio usa campos de ownership como `user_id`, `created_by`, `owner` e similares para controle operacional.

Isso significa:

- nem todo `user_id` e uma FK explicita para `auth.users`
- nem todo campo de ownership representa autenticacao
- `customers` e a entidade central do dominio comercial
- `profiles` e a camada administrativa/RBAC

## Correcoes aplicadas

### 1. Tabelas centrais alinhadas

Os seguintes objetos foram identificados como centrais no modelo atual:

- `public.customers`
- `public.orders`
- `public.order_items`
- `public.order_items_normalized`
- `public.payments`
- `public.leads`
- `public.campaigns`
- `public.chatwoot_conversations`
- `public.chatwoot_messages`
- `public.customer_events`
- `public.customer_metrics`
- `public.customer_network_metrics`
- `public.customer_product_affinities`
- `public.customer_scores`
- `public.marketing_links`
- `public.network_relationships`
- `public.plan_bonuses`
- `public.product_affinities`
- `public.product_metrics`
- `public.product_variants`
- `public.products`
- `public.qualifications`
- `public.shipments`
- `public.workspace_settings`
- `public.admin_users`
- `public.audit_log`
- `public.audit_log_summary`
- `public.profiles`

### 2. Ownership e rastreabilidade

Campos relevantes encontrados:

- `user_id`
- `created_by`
- `owner`
- `owner_id`
- `collector_user_id`

Esses campos devem ser tratados como ownership operacional, nao como autenticacao pura.

### 3. Relacionamentos realmente uteis

Relacionamentos reais mais importantes do schema atual:

- `customers.sponsor_id -> customers.id`
- `chatwoot_conversations.campaign_id -> campaigns.id`
- `chatwoot_conversations.lead_id -> leads.id`
- `chatwoot_messages.conversation_id -> chatwoot_conversations.id`
- `customer_metrics.customer_id -> customers.id`
- `customer_network_metrics.customer_id -> customers.id`
- `customer_plans.customer_id -> customers.id`
- `customer_plans.plan_id -> plans.id`
- `customer_predictions.customer_id -> customers.id`
- `customer_product_affinities.customer_id -> customers.id`
- `customer_product_affinities.product_id -> products.id`
- `customer_scores.customer_id -> customers.id`
- `marketing_links.campaign_id -> campaigns.id`
- `marketing_links.distributor_id -> customers.id`
- `network_relationships.customer_id -> customers.id`
- `network_relationships.root_customer_id -> customers.id`
- `network_relationships.sponsor_customer_id -> customers.id`
- `order_items.import_id -> imports.id`
- `order_items.order_id -> orders.id`
- `order_items_normalized.order_id -> orders.id`
- `order_items_normalized.product_id -> products.id`
- `payments.customer_id -> customers.id`
- `payments.order_id -> orders.id`
- `plan_bonuses.plan_id -> plans.id`
- `product_affinities.product_a_id -> products.id`
- `product_affinities.product_b_id -> products.id`
- `product_metrics.product_id -> products.id`
- `product_variants.product_id -> products.id`
- `qualifications.plan_id -> plans.id`
- `qualifications.required_plan_id -> plans.id`
- `shipments.order_id -> orders.id`

## Ajustes de tipagem

Os tipos do Supabase foram aproximados do schema atual em:

- `supabase/types.ts`

Principais alinhamentos:

- `customers`
- `orders`
- `leads`
- `order_items_normalized`
- relacoes FK principais

## Backup documental

Foi criado um snapshot documental em:

- `supabase/migrations/20260529000001_backup_user_related_tables.sql`

E um inventario complementar em:

- `docs/user_related_records_2026_05_29.md`

## Observacoes importantes

- `imports` nao existe como tabela ativa em `public` no schema atual.
- O projeto usa `import_rows` e outras tabelas de importacao no legado/backup.
- Algumas tabelas possuem `user_id` sem FK explicita para `auth.users`.
- `profiles` continua sendo a camada administrativa/RBAC.
- `customers` continua sendo a camada comercial/MLM.

## Recomendacao

Manter esta separacao:

- `auth.users` para autenticacao
- `profiles` para RBAC/admin
- `customers` para negocio/MLM
- `user_id` apenas como ownership operacional onde fizer sentido

## Resultado esperado

- schema mais legivel
- menor ambiguidade semantica
- melhor base para RLS
- melhor base para joins e views
- melhor manutencao do backend e frontend

