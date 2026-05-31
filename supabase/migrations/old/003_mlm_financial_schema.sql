-- =====================================================================
-- ALLIN MLM Intelligence — Sistema Financeiro e MLM
-- Tabelas para suportar planos, wallets, contas, transações e qualificações
-- =====================================================================

-- ---------------------------------------------------------------------
-- Planos de Distribuidor (Adicionar colunas à tabela existente)
-- ---------------------------------------------------------------------
alter table public.plans 
add column if not exists includes text[],
add column if not exists bonus_config jsonb default '{}'::jsonb;

-- Inserir planos iniciais (usando slug como código)
insert into public.plans (slug, name, description, price, includes, bonus_config, is_active, sort_order) 
select * from (values
  ('afiliado', 'Afiliado', 'Plano para revender produtos sem investimento', 0.00, 
   ARRAY['Link personalizado', 'Loja virtual', 'Ganho de 20% vendas diretas'],
   '{"direct_rate": 0.20, "sponsor_rate": 0.18, "generations": []}'::jsonb, true, 1),
  ('avanco', 'Avanço', 'Plano inicial para distribuidores', 997.00,
   ARRAY['1 par de tênis', 'Link personalizado', 'Escritório virtual', 'Loja virtual'],
   '{"direct_rate": 0.05, "generations": [{"level": 1, "rate": 0.05}, {"level": 2, "rate": 0.03}, {"level": 3, "rate": 0.02}]}'::jsonb, true, 2),
  ('excelencia', 'Excelência', 'Plano completo para distribuidores de alto nível', 3980.00,
   ARRAY['Kit completo R$ 3.980', 'Loja virtual', 'Suporte avançado'],
   '{"direct_rate": 0.05, "generations": [{"level": 1, "rate": 0.05}, {"level": 2, "rate": 0.03}, {"level": 3, "rate": 0.02}], "extra_bonus": {"4_7_directs": 0.02, "8_plus_directs": 0.04}}'::jsonb, true, 3)
) as t(slug, name, description, price, includes, bonus_config, is_active, sort_order)
where not exists (select 1 from public.plans where slug = t.slug);

-- ---------------------------------------------------------------------
-- Wallets (Sistema Legado)
-- ---------------------------------------------------------------------
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  saldo_sacavel numeric(14,2) default 0,
  saldo_nao_sacavel numeric(14,2) default 0,
  saldo_loja_online numeric(14,2) default 0,
  saldo_perdido numeric(14,2) default 0,
  saldo_a_receber numeric(14,2) default 0,
  saldo_para_compra numeric(14,2) default 0,
  total_recebido numeric(14,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(customer_id)
);

-- ---------------------------------------------------------------------
-- Accounts (Sistema V2)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'account_type' and typnamespace = 'public'::regnamespace) then
    create type public.account_type as enum (
      'SALDO_COMPRA',
      'SALDO_SACAVEL',
      'SALDO_NAO_SACAVEL',
      'SALDO_LOJA_ONLINE',
      'BONUS_DIRETOS',
      'BONUS_INDIRETOS'
    );
  end if;
end $$;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_type public.account_type not null,
  balance numeric(14,2) default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, account_type)
);

-- ---------------------------------------------------------------------
-- Account Transactions (Sistema V2)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'transaction_type' and typnamespace = 'public'::regnamespace) then
    create type public.transaction_type as enum (
      'CREDIT',
      'DEBIT',
      'BONUS_CREDIT',
      'WITHDRAWAL',
      'TRANSFER'
    );
  end if;
end $$;

create table if not exists public.account_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  transaction_type public.transaction_type not null,
  amount numeric(14,2) not null,
  balance_before numeric(14,2) not null,
  balance_after numeric(14,2) not null,
  description text,
  related_bonus_id text references public.bonuses(id),
  related_order_id uuid references public.orders(id),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Qualifications (Adicionar colunas à tabela existente)
-- ---------------------------------------------------------------------
alter table public.qualifications 
add column if not exists level integer,
add column if not exists benefits jsonb default '{}'::jsonb,
alter column plan_id drop not null;

-- Inserir qualificações iniciais (usando estrutura existente)
insert into public.qualifications (name, qualification_type, description, min_value, max_value, conditions, benefits, level, is_active) 
select * from (values
  ('Bronze', 'MLM', 'Qualificação Bronze - 1 direto, R$ 1.000 volume', 1000, 9999, 
   '{"directs": 1, "volume": 1000}'::jsonb, '{"bonus_multiplier": 1.0}'::jsonb, 1, true),
  ('Prata', 'MLM', 'Qualificação Prata - 3 diretos, R$ 5.000 volume', 5000, 14999, 
   '{"directs": 3, "volume": 5000}'::jsonb, '{"bonus_multiplier": 1.1}'::jsonb, 2, true),
  ('Ouro', 'MLM', 'Qualificação Ouro - 5 diretos, R$ 15.000 volume', 15000, 49999, 
   '{"directs": 5, "volume": 15000}'::jsonb, '{"bonus_multiplier": 1.2}'::jsonb, 3, true),
  ('Platina', 'MLM', 'Qualificação Platina - 8 diretos, R$ 50.000 volume', 50000, 99999, 
   '{"directs": 8, "volume": 50000}'::jsonb, '{"bonus_multiplier": 1.3}'::jsonb, 4, true),
  ('Diamante', 'MLM', 'Qualificação Diamante - 12 diretos, R$ 100.000 volume', 100000, null, 
   '{"directs": 12, "volume": 100000}'::jsonb, '{"bonus_multiplier": 1.5}'::jsonb, 5, true)
) as t(name, qualification_type, description, min_value, max_value, conditions, benefits, level, is_active)
where not exists (select 1 from public.qualifications where name = t.name);

-- ---------------------------------------------------------------------
-- User Qualifications
-- ---------------------------------------------------------------------
create table if not exists public.user_qualifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  qualification_id uuid not null references public.qualifications(id) on delete cascade,
  achieved_at timestamptz default now(),
  expires_at timestamptz,
  is_active boolean default true,
  unique(user_id, qualification_id)
);

-- ---------------------------------------------------------------------
-- Atualizar bonus_rules para incluir regras por plano
-- ---------------------------------------------------------------------
-- Regra para Afiliado: 20% vendas diretas, 18% para patrocinador
insert into public.bonus_rules (id, rule_type, rule_key, rule_value, description, is_active) 
select * from (values
  ('rule_affiliate_direct', 'DIRECT', 'affiliate_rate', 0.20, 'Afiliado: 20% vendas diretas', true),
  ('rule_affiliate_sponsor', 'DIRECT', 'affiliate_sponsor_rate', 0.18, 'Afiliado: 18% para patrocinador', true)
) as t(id, rule_type, rule_key, rule_value, description, is_active)
where not exists (select 1 from public.bonus_rules where id = t.id);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------
create index if not exists plans_slug_idx on public.plans(slug);
create index if not exists plans_is_active_idx on public.plans(is_active);
create index if not exists wallets_customer_id_idx on public.wallets(customer_id);
create index if not exists accounts_user_id_idx on public.accounts(user_id);
create index if not exists accounts_type_idx on public.accounts(account_type);
create index if not exists account_transactions_account_id_idx on public.account_transactions(account_id);
create index if not exists account_transactions_bonus_id_idx on public.account_transactions(related_bonus_id);
create index if not exists account_transactions_order_id_idx on public.account_transactions(related_order_id);
create index if not exists account_transactions_created_at_idx on public.account_transactions(created_at);
create index if not exists qualifications_level_idx on public.qualifications(level);
create index if not exists user_qualifications_user_id_idx on public.user_qualifications(user_id);
create index if not exists user_qualifications_qualification_id_idx on public.user_qualifications(qualification_id);
create index if not exists user_qualifications_active_idx on public.user_qualifications(is_active);

-- ---------------------------------------------------------------------
-- RLS Policies
-- ---------------------------------------------------------------------
alter table public.plans enable row level security;
alter table public.wallets enable row level security;
alter table public.accounts enable row level security;
alter table public.account_transactions enable row level security;
alter table public.qualifications enable row level security;
alter table public.user_qualifications enable row level security;

-- Plans: leitura pública, escrita apenas admin
create policy "Plans public read" on public.plans for select using (true);
create policy "Plans admin write" on public.plans for all using (auth.jwt() ->> 'role' = 'admin');

-- Wallets: leitura/escrita pelo próprio usuário
create policy "Wallets own read" on public.wallets for select using (
  customer_id in (select id from public.customers where user_id = auth.uid())
);
create policy "Wallets own write" on public.wallets for all using (
  customer_id in (select id from public.customers where user_id = auth.uid())
);

-- Accounts: leitura/escrita pelo próprio usuário
create policy "Accounts own read" on public.accounts for select using (user_id = auth.uid());
create policy "Accounts own write" on public.accounts for all using (user_id = auth.uid());

-- Account Transactions: leitura pelo próprio usuário
create policy "Account Transactions own read" on public.account_transactions for select using (
  account_id in (select id from public.accounts where user_id = auth.uid())
);

-- Qualifications: leitura pública
create policy "Qualifications public read" on public.qualifications for select using (true);

-- User Qualifications: leitura/escrita pelo próprio usuário
create policy "User Qualifications own read" on public.user_qualifications for select using (user_id = auth.uid());
create policy "User Qualifications own write" on public.user_qualifications for all using (user_id = auth.uid());
