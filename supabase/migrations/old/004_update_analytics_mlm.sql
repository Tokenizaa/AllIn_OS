-- =====================================================================
-- ALLIN MLM Intelligence — Atualizar Views Analytics para Sistema MLM
-- Cálculos de bônus por geração, qualificações e métricas por plano
-- =====================================================================

-- ---------------------------------------------------------------------
-- Atualizar Métricas por Distribuidor com dados de planos e qualificações
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
  prof.avatar_url,
  -- Dados do plano
  c.plan_id,
  c.plan_name,
  c.qualification,
  -- Contagem de diretos (primeira geração)
  (select count(*) from public.network_nodes nn2 where nn2.sponsor_id = nn.distributor_id) as direct_count,
  -- Contagem de ativos na rede (todas gerações)
  (select count(*) from public.network_nodes nn3 where nn3.active = true and (nn3.sponsor_id = nn.distributor_id or nn3.sponsor_id in (
    select distributor_id from public.network_nodes where sponsor_id = nn.distributor_id
  ))) as active_downline_count
from public.network_nodes nn
left join public.profiles prof on prof.user_id::text = nn.distributor_id
left join public.customers c on c.id_comprador = nn.distributor_id;
create index if not exists distributor_metrics_distributor_idx on analytics.distributor_metrics(distributor_id);
create index if not exists distributor_metrics_sponsor_idx on analytics.distributor_metrics(sponsor_id);
create index if not exists distributor_metrics_plan_idx on analytics.distributor_metrics(plan_id);

-- ---------------------------------------------------------------------
-- Atualizar Métricas MLM com cálculos por geração e plano
-- ---------------------------------------------------------------------
drop materialized view if exists analytics.mlm_metrics cascade;
create materialized view analytics.mlm_metrics as
with network_stats as (
  select
    nn.distributor_id as lider_id,
    count(distinct nn2.distributor_id) as tamanho_rede,
    count(distinct case when nn2.active = true then nn2.distributor_id end) as ativos_rede,
    sum(nn2.total_volume) as volume_rede_total,
    -- Geração 1 (diretos)
    count(distinct case when nn2.sponsor_id = nn.distributor_id then nn2.distributor_id end) as g1_count,
    sum(case when nn2.sponsor_id = nn.distributor_id then nn2.total_volume else 0 end) as g1_volume,
    -- Geração 2
    count(distinct case when nn3.sponsor_id in (
      select distributor_id from public.network_nodes where sponsor_id = nn.distributor_id
    ) then nn3.distributor_id end) as g2_count,
    sum(case when nn3.sponsor_id in (
      select distributor_id from public.network_nodes where sponsor_id = nn.distributor_id
    ) then nn3.total_volume else 0 end) as g2_volume,
    -- Geração 3
    count(distinct case when nn4.sponsor_id in (
      select nn2.distributor_id from public.network_nodes nn2 
      where nn2.sponsor_id in (select distributor_id from public.network_nodes where sponsor_id = nn.distributor_id)
    ) then nn4.distributor_id end) as g3_count,
    sum(case when nn4.sponsor_id in (
      select nn2.distributor_id from public.network_nodes nn2 
      where nn2.sponsor_id in (select distributor_id from public.network_nodes where sponsor_id = nn.distributor_id)
    ) then nn4.total_volume else 0 end) as g3_volume
  from public.network_nodes nn
  left join public.network_nodes nn2 on nn2.sponsor_id = nn.distributor_id
  left join public.network_nodes nn3 on nn3.sponsor_id = nn2.distributor_id
  left join public.network_nodes nn4 on nn4.sponsor_id = nn3.distributor_id
  group by nn.distributor_id
),
bonus_stats as (
  select
    b.distributor_id,
    coalesce(sum(case when b.status = 'PAID' then b.amount else 0 end), 0)::numeric(14,2) as bonus_pago_total,
    coalesce(sum(case when b.status = 'PENDING' then b.amount else 0 end), 0)::numeric(14,2) as bonus_pendente_total,
    count(distinct case when b.status = 'PAID' then b.id end) as eventos_bonus_pagos,
    count(distinct case when b.status = 'PENDING' then b.id end) as eventos_bonus_pendentes,
    -- Bônus por tipo
    coalesce(sum(case when b.type = 'DIRECT' and b.status = 'PAID' then b.amount else 0 end), 0)::numeric(14,2) as bonus_direto_pago,
    coalesce(sum(case when b.type = 'UNILEVEL' and b.status = 'PAID' then b.amount else 0 end), 0)::numeric(14,2) as bonus_unilevel_pago
  from public.bonuses b
  group by b.distributor_id
),
plan_info as (
  select
    c.id_comprador as distributor_id,
    c.plan_id,
    c.plan_name,
    c.qualification,
    p.bonus_config
  from public.customers c
  left join public.plans p on p.slug = lower(c.plan_name)
)
select
  ns.lider_id,
  coalesce(ns.tamanho_rede, 0) as tamanho_rede,
  coalesce(ns.ativos_rede, 0) as ativos_rede,
  coalesce(ns.volume_rede_total, 0) as volume_rede_total,
  -- Métricas por geração
  coalesce(ns.g1_count, 0) as g1_count,
  coalesce(ns.g1_volume, 0) as g1_volume,
  coalesce(ns.g2_count, 0) as g2_count,
  coalesce(ns.g2_volume, 0) as g2_volume,
  coalesce(ns.g3_count, 0) as g3_count,
  coalesce(ns.g3_volume, 0) as g3_volume,
  -- Bônus
  coalesce(bs.bonus_pago_total, 0) as bonus_pago_total,
  coalesce(bs.bonus_pendente_total, 0) as bonus_pendente_total,
  coalesce(bs.eventos_bonus_pagos, 0) as eventos_bonus_pagos,
  coalesce(bs.eventos_bonus_pendentes, 0) as eventos_bonus_pendentes,
  coalesce(bs.bonus_direto_pago, 0) as bonus_direto_pago,
  coalesce(bs.bonus_unilevel_pago, 0) as bonus_unilevel_pago,
  -- Plano e qualificação
  pi.plan_id,
  pi.plan_name,
  pi.qualification,
  pi.bonus_config
from network_stats ns
left join bonus_stats bs on bs.distributor_id = ns.lider_id
left join plan_info pi on pi.distributor_id = ns.lider_id;
create index if not exists mlm_metrics_lider_idx on analytics.mlm_metrics(lider_id);
create index if not exists mlm_metrics_plan_idx on analytics.mlm_metrics(plan_id);

-- ---------------------------------------------------------------------
-- Atualizar Helper para refresh das views
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

-- Execute após aplicar:
-- select analytics.refresh_all();
