-- =====================================================================
-- ALLIN MLM Intelligence — Analytics Schema (Schema Real)
-- Baseado nas tabelas existentes: products, network_nodes, bonuses, staging_orders_detalhado, profiles
-- =====================================================================

-- ---------------------------------------------------------------------
-- Métricas por Produto (baseado em tabela products real)
-- ---------------------------------------------------------------------
drop materialized view if exists analytics.product_metrics cascade;
create materialized view analytics.product_metrics as
select
  p.id as product_id,
  p.name,
  p.category,
  p.price,
  p.cost_price,
  case when p.price > 0 then ((p.price - coalesce(p.cost_price, 0)) / p.price * 100)::numeric(6,2) else 0 end as margem_percentual,
  coalesce(p.stock, 0) as unidades_em_estoque,
  p.sku,
  p.manufacturer,
  p.is_active,
  p.created_at
from public.products p;
create index if not exists product_metrics_product_idx on analytics.product_metrics(product_id);
create index if not exists product_metrics_category_idx on analytics.product_metrics(category);

-- ---------------------------------------------------------------------
-- Métricas por Distribuidor (baseado em network_nodes)
-- ---------------------------------------------------------------------
drop materialized view if exists analytics.distributor_metrics cascade;
create materialized view analytics.distributor_metrics as
select
  nn.distributor_id,
  nn.sponsor_id,
  nn.position,
  nn.level,
  nn.left_leg_volume,
  nn.right_leg_volume,
  nn.total_volume,
  nn.active,
  nn.created_at,
  prof.display_name as distributor_name,
  prof.avatar_url
from public.network_nodes nn
left join public.profiles prof on prof.user_id::text = nn.distributor_id;
create index if not exists distributor_metrics_distributor_idx on analytics.distributor_metrics(distributor_id);
create index if not exists distributor_metrics_sponsor_idx on analytics.distributor_metrics(sponsor_id);

-- ---------------------------------------------------------------------
-- Métricas MLM (baseado em network_nodes + bonuses)
-- ---------------------------------------------------------------------
drop materialized view if exists analytics.mlm_metrics cascade;
create materialized view analytics.mlm_metrics as
with network_stats as (
  select
    nn.distributor_id as lider_id,
    count(distinct nn2.distributor_id) as tamanho_rede,
    count(distinct nn2.distributor_id) filter (where nn2.active = true) as ativos_rede,
    sum(nn2.total_volume) as volume_rede_total
  from public.network_nodes nn
  left join public.network_nodes nn2 on nn2.sponsor_id = nn.distributor_id
  group by nn.distributor_id
),
bonus_stats as (
  select
    b.distributor_id,
    coalesce(sum(b.amount) filter (where b.status = 'PAID'), 0)::numeric(14,2) as bonus_pago_total,
    count(distinct b.id) as eventos_bonus
  from public.bonuses b
  group by b.distributor_id
)
select
  ns.lider_id,
  coalesce(ns.tamanho_rede, 0) as tamanho_rede,
  coalesce(ns.ativos_rede, 0) as ativos_rede,
  coalesce(ns.volume_rede_total, 0) as volume_rede_total,
  coalesce(bs.bonus_pago_total, 0) as bonus_pago_total,
  coalesce(bs.eventos_bonus, 0) as eventos_bonus
from network_stats ns
left join bonus_stats bs on bs.distributor_id = ns.lider_id;
create index if not exists mlm_metrics_lider_idx on analytics.mlm_metrics(lider_id);

-- ---------------------------------------------------------------------
-- Métricas de Bônus (baseado em tabela bonuses)
-- ---------------------------------------------------------------------
drop materialized view if exists analytics.bonus_metrics cascade;
create materialized view analytics.bonus_metrics as
select
  b.id,
  b.distributor_id,
  b.type,
  b.amount,
  b.status,
  b.period,
  b.created_at,
  b.paid_at,
  extract(month from b.period) as mes,
  extract(year from b.period) as ano
from public.bonuses b;
create index if not exists bonus_metrics_distributor_idx on analytics.bonus_metrics(distributor_id);
create index if not exists bonus_metrics_status_idx on analytics.bonus_metrics(status);
create index if not exists bonus_metrics_period_idx on analytics.bonus_metrics(period);

-- ---------------------------------------------------------------------
-- Métricas de Pedidos (baseado em staging_orders_detalhado)
-- ---------------------------------------------------------------------
drop materialized view if exists analytics.order_metrics cascade;
create materialized view analytics.order_metrics as
select
  s.id as order_id,
  s.codigo_pedido,
  s.comprador,
  s.usuario,
  s.documento_cpf_cnpj,
  s.loja,
  s.grupos_consumo,
  s.data_criacao_pedido,
  s.hora_criacao_pedido,
  s.pedido_pago,
  s.data_pagamento_pedido,
  s.hora_pagamento_pedido,
  s.forma_pagamento,
  s.valor_total,
  s.custo_frete,
  s.status,
  s.created_at,
  s.normalized_data
from public.staging_orders_detalhado s
where s.status = 'validated';
create index if not exists order_metrics_order_idx on analytics.order_metrics(order_id);
create index if not exists order_metrics_comprador_idx on analytics.order_metrics(comprador);
create index if not exists order_metrics_status_idx on analytics.order_metrics(status);

-- ---------------------------------------------------------------------
-- Helper para refresh das views
-- ---------------------------------------------------------------------
create or replace function analytics.refresh_all()
returns void language plpgsql as $$
begin
  refresh materialized view analytics.product_metrics;
  refresh materialized view analytics.distributor_metrics;
  refresh materialized view analytics.mlm_metrics;
  refresh materialized view analytics.bonus_metrics;
  refresh materialized view analytics.order_metrics;
end;
$$;

-- Execute uma vez após criar:
-- select analytics.refresh_all();
