# Plano de Auditoria e Correção

Plano executivo derivado da auditoria completa. Ordem pensada por risco real e impacto no sistema.

## Prioridade 1: Fechamento de Segurança

1. Completar policies de `public.audit_log` e `public.campaign_intelligence`.
2. Revisar `analytics.refresh_all` e funções de analytics com `search_path` mutável.
3. Revisar e, se possível, mover a extensão `vector` para fora de `public`.
4. Habilitar leaked password protection no Supabase Auth.
5. Conferir se todas as materialized views analíticas continuam bloqueadas para `anon` e `authenticated`.

## Prioridade 2: Consistência do Modelo de Identidade

1. Manter `auth.users` como identidade.
2. Manter `profiles` como RBAC administrativo.
3. Manter `customers` como entidade comercial/MLM.
4. Evitar introduzir novos usos de `user_id` como se fossem identidade universal.
5. Padronizar novas policies usando ownership real, nunca apenas `auth.role()`.

## Prioridade 3: Integridade do Backend

1. Revisar services que ainda assumem um único papel de usuário.
2. Garantir que filtros por `customer_id` tenham paginação/contagem corretas.
3. Manter `orders`, `payments` e `plans` como domínio comercial, não como auth.
4. Validar que as integrações externas usam config do ambiente, não credenciais hardcoded.

## Prioridade 4: Frontend

1. Preservar a normalização de roles no `auth-context`.
2. Manter guards coerentes com `admin`, `operator`, `distributor` e `customer`.
3. Evitar duplicar papéis antigos como fonte principal.
4. Rever telas administrativas para depender de `profiles`, não de um `user` genérico.

## Prioridade 5: Documentação e Governança

1. Manter `docs/correct_bd.md` como referência estrutural do modelo.
2. Manter `docs/audit_comp.md` como diagnóstico executivo.
3. Manter snapshots e migrations criadas durante a auditoria.
4. Revisar periodicamente o advisor do Supabase após mudanças de schema ou policies.

## Critério de Conclusão

A auditoria pode ser considerada fechada quando:

- o advisor não apontar riscos críticos abertos
- o modelo de autenticação e RBAC estiver consistente no frontend, backend e banco
- não houver policies legadas concorrendo com as novas
- não houver exposição indevida em views, funções ou materialized views

