-- =====================================================================
-- ALLIN MLM Intelligence — Analytics Schema
-- Execute este SQL no SQL Editor do seu projeto Supabase existente.
-- NÃO altera nem deleta tabelas existentes. Apenas adiciona schema analytics.
-- =====================================================================

create schema if not exists analytics;

-- ---------------------------------------------------------------------
-- Materialized views (refresh manual ou via pg_cron)
-- ---------------------------------------------------------------------

-- Resumo de vendas por dia
drop materialized view if exists analytics.sales_summary cascade;
create materialized view analytics.sales_summary as
select
  date_trunc('day', data_criacao)::date as dia,
  count(*)                                 as pedidos,
  count(*) filter (where pago = true)      as pedidos_pagos,
  count(*) filter (where cancelado = true) as pedidos_cancelados,
  coalesce(sum(valor_total_pedido) filter (where pago = true), 0)::numeric(14,2) as faturamento,
  coalesce(avg(valor_total_pedido) filter (where pago = true), 0)::numeric(14,2) as ticket_medio
from public.orders
where data_criacao is not null
group by 1
order by 1 desc;
create index if not exists sales_summary_dia_idx on analytics.sales_summary(dia desc);

-- Métricas por cliente (LTV, recência, frequência, churn_score, segment)
drop materialized view if exists analytics.customer_metrics cascade;
create materialized view analytics.customer_metrics as
with base as (
  select
    o.customer_id,
    count(*) filter (where o.pago = true)             as pedidos_pagos,
    coalesce(sum(o.valor_total_pedido) filter (where o.pago = true), 0)::numeric(14,2) as ltv,
    max(o.data_pagamento) filter (where o.pago = true) as ultima_compra,
    min(o.data_pagamento) filter (where o.pago = true) as primeira_compra
  from public.orders o
  group by o.customer_id
)
select
  b.customer_id,
  b.pedidos_pagos,
  b.ltv,
  b.ultima_compra,
  b.primeira_compra,
  case when b.ultima_compra is null then null
       else extract(day from now() - b.ultima_compra)::int end as dias_desde_ultima_compra,
  -- churn_score 0-100: cresce com dias sem comprar
  case
    when b.ultima_compra is null then 100
    when extract(day from now() - b.ultima_compra) > 180 then 95
    when extract(day from now() - b.ultima_compra) > 120 then 80
    when extract(day from now() - b.ultima_compra) > 90  then 65
    when extract(day from now() - b.ultima_compra) > 60  then 45
    when extract(day from now() - b.ultima_compra) > 30  then 25
    else 5
  end::int as churn_score,
  case
    when b.ltv >= 5000 and extract(day from now() - b.ultima_compra) <= 60 then 'VIP'
    when extract(day from now() - b.ultima_compra) > 90 then 'Risco'
    when b.pedidos_pagos >= 5 then 'Recorrente'
    when b.pedidos_pagos >= 1 then 'Ativo'
    else 'Inativo'
  end as segment
from base b;
create index if not exists customer_metrics_customer_idx on analytics.customer_metrics(customer_id);
create index if not exists customer_metrics_segment_idx  on analytics.customer_metrics(segment);

-- Métricas por produto (margem, giro, ticket)
drop materialized view if exists analytics.product_metrics cascade;
create materialized view analytics.product_metrics as
select
  p.id as product_id,
  p.name,
  p.category,
  p.price,
  p.cost_price,
  case when p.price > 0 then ((p.price - coalesce(p.cost_price, 0)) / p.price * 100)::numeric(6,2) else 0 end as margem_percentual,
  coalesce(sum(oi.quantity), 0)::int as unidades_vendidas,
  coalesce(sum(oi.total_price), 0)::numeric(14,2) as receita_total
from public.products p
left join public.order_items oi on oi.product_id = p.id
left join public.orders o on o.id = oi.order_id and o.pago = true
group by p.id, p.name, p.category, p.price, p.cost_price;
create index if not exists product_metrics_product_idx on analytics.product_metrics(product_id);

-- Afinidade de produtos (pares comprados juntos)
drop materialized view if exists analytics.product_affinity cascade;
create materialized view analytics.product_affinity as
select
  a.product_id as produto_a,
  b.product_id as produto_b,
  a.product_name as nome_a,
  b.product_name as nome_b,
  count(*) as compras_juntas
from public.order_items a
join public.order_items b
  on a.order_id = b.order_id
 and a.product_id < b.product_id
group by 1,2,3,4
having count(*) >= 3
order by compras_juntas desc;

-- Métricas por região
drop materialized view if exists analytics.region_metrics cascade;
create materialized view analytics.region_metrics as
select
  estado,
  cidade,
  count(*) filter (where pago = true) as pedidos_pagos,
  coalesce(sum(valor_total_pedido) filter (where pago = true), 0)::numeric(14,2) as faturamento,
  coalesce(avg(valor_total_pedido) filter (where pago = true), 0)::numeric(14,2) as ticket_medio
from public.orders
where estado is not null
group by estado, cidade
order by faturamento desc;

-- Métricas MLM (produtividade rede + bônus)
drop materialized view if exists analytics.mlm_metrics cascade;
create materialized view analytics.mlm_metrics as
select
  nr.parent_id as lider_id,
  count(distinct nr.child_id) as tamanho_rede,
  coalesce(sum(bc.bonus_amount), 0)::numeric(14,2) as bonus_pago_total,
  count(distinct bc.id) as eventos_bonus
from public.network_relationships nr
left join public.bonus_calculations bc on bc.user_id = nr.parent_id
group by nr.parent_id;
create index if not exists mlm_metrics_lider_idx on analytics.mlm_metrics(lider_id);

-- ---------------------------------------------------------------------
-- Tabelas auxiliares para IA
-- ---------------------------------------------------------------------

create table if not exists analytics.ai_insights (
  id           uuid primary key default gen_random_uuid(),
  type         text not null,         -- churn, margin, region, mlm, recompra, ...
  severity     text not null,         -- info | warning | critical
  title        text not null,
  description  text not null,
  data         jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists ai_insights_created_idx on analytics.ai_insights(created_at desc);

create table if not exists analytics.ai_conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid,
  title       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists analytics.ai_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references analytics.ai_conversations(id) on delete cascade,
  role            text not null,   -- user | assistant | system
  content         text not null,
  sql_generated   text,
  result_rows     jsonb,
  chart_config    jsonb,
  created_at      timestamptz not null default now()
);
create index if not exists ai_messages_conv_idx on analytics.ai_messages(conversation_id, created_at);

-- ---------------------------------------------------------------------
-- Função segura para execução de SQL gerada por IA (SOMENTE SELECT)
-- ---------------------------------------------------------------------
create or replace function analytics.exec_safe_sql(query_text text)
returns jsonb
language plpgsql
security definer
set search_path = public, analytics
as $$
declare
  result jsonb;
  forbidden text[] := array['insert','update','delete','drop','truncate','alter','grant','revoke','create','comment','vacuum','copy'];
  word text;
  lower_q text;
begin
  lower_q := lower(query_text);

  -- Deve começar com SELECT ou WITH
  if not (lower_q ~ '^\s*(select|with)\s') then
    raise exception 'Apenas queries SELECT/WITH são permitidas';
  end if;

  -- Bloqueia múltiplos statements
  if position(';' in trim(trailing ';' from lower_q)) > 0 then
    raise exception 'Múltiplos statements não são permitidos';
  end if;

  -- Bloqueia palavras destrutivas como tokens isolados
  foreach word in array forbidden loop
    if lower_q ~ ('\m' || word || '\M') then
      raise exception 'Palavra reservada não permitida: %', word;
    end if;
  end loop;

  execute format('select coalesce(jsonb_agg(t), ''[]''::jsonb) from (%s limit 1000) t', rtrim(query_text, ';'))
    into result;
  return result;
end;
$$;

revoke all on function analytics.exec_safe_sql(text) from public;
grant execute on function analytics.exec_safe_sql(text) to service_role;

-- ---------------------------------------------------------------------
-- Helper para refresh
-- ---------------------------------------------------------------------
create or replace function analytics.refresh_all()
returns void language plpgsql as $$
begin
  refresh materialized view analytics.sales_summary;
  refresh materialized view analytics.customer_metrics;
  refresh materialized view analytics.product_metrics;
  refresh materialized view analytics.product_affinity;
  refresh materialized view analytics.region_metrics;
  refresh materialized view analytics.mlm_metrics;
end;
$$;

-- Execute uma vez após criar:
-- select analytics.refresh_all();
