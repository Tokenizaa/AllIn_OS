# PROMPT — AUDITORIA COMPLETA ENTERPRISE DO PROJETO (FRONTEND + BACKEND + BANCO + ARQUITETURA)

Você deve executar uma AUDITORIA TÉCNICA COMPLETA do projeto atual.

NÃO apenas listar arquivos.

Você deve:
- analisar
- validar
- detectar problemas
- corrigir inconsistências
- identificar gargalos
- verificar integrações
- revisar arquitetura
- validar fluxos
- encontrar bugs
- detectar código morto
- detectar componentes quebrados
- detectar rotas órfãs
- validar banco de dados
- validar permissões
- validar autenticação
- validar responsividade
- validar performance
- validar integração frontend/backend
- validar integração Supabase
- validar sistema MLM
- validar regras de negócio
- validar Chatwoot
- validar gateways
- validar sistema de bônus
- validar sistema de frete
- validar distributor_office
- validar páginas públicas
- validar multi-tenant
- validar RBAC
- validar dashboards
- validar analytics
- validar loaders
- validar estados globais
- validar hooks
- validar queries
- validar cache
- validar APIs
- validar estrutura modular

---

# OBJETIVO

Gerar um diagnóstico REAL do estado atual do sistema.

E imediatamente:
- corrigir erros encontrados
- refatorar estruturas problemáticas
- remover redundâncias
- reorganizar arquitetura
- padronizar componentes
- estabilizar o sistema

NÃO apenas relatar.

CORRIGIR automaticamente tudo que for possível.

---

# ESCOPO COMPLETO DA AUDITORIA

# 1. FRONTEND AUDIT

Analisar completamente:

## Estrutura
- rotas
- layouts
- páginas
- componentes
- providers
- hooks
- contexts
- stores
- services
- utils
- lib
- themes
- assets

## Validar
- imports quebrados
- rotas inexistentes
- páginas órfãs
- componentes duplicados
- componentes não usados
- hooks inválidos
- estados inconsistentes
- erros TypeScript
- erros React
- erros hydration
- memory leaks
- loops de render
- props inválidas
- problemas de responsividade
- problemas de acessibilidade
- problemas de UX
- loaders inconsistentes
- navegação quebrada
- menus inválidos
- links quebrados
- dark mode
- performance
- lazy loading
- suspense
- SEO
- metadata
- breadcrumbs
- guards de autenticação
- guards de roles
- proteção de páginas

## Validar páginas:
- admin
- distributor_office
- loja virtual
- páginas públicas
- captura de leads
- cadastro
- checkout
- customer 360
- dashboards
- analytics
- financeiro
- rede MLM
- pedidos
- pagamentos
- frete
- produtos
- planos
- bônus
- downloads
- relatórios

---

# 2. BACKEND AUDIT

Analisar:
- arquitetura
- módulos
- controllers
- services
- repositories
- DTOs
- validações
- middlewares
- filas
- eventos
- webhooks
- integrações
- autenticação
- autorização
- logs
- cache
- APIs

## Validar
- endpoints quebrados
- rotas sem uso
- services duplicados
- regras de negócio inconsistentes
- queries pesadas
- problemas N+1
- ausência de índices
- erros de tipagem
- falhas de segurança
- validações ausentes
- permissões incorretas
- JWT
- refresh token
- RBAC
- multi-tenant
- upload de arquivos
- integração Chatwoot
- integração gateways
- cálculo MLM
- cálculo bônus
- sistema de pontos
- sistema de frete
- sistema de pagamentos
- sistema de saque

---

# 3. DATABASE AUDIT

Analisar:
- schema
- tabelas
- relacionamentos
- views
- materialized views
- índices
- constraints
- triggers
- functions
- policies
- performance

## Validar tabelas CORE:

- customers
- orders
- order_items
- products
- payments
- shipments
- plans
- bonus_rules
- network_relationships
- customer_metrics
- profiles
- workspace_settings

## Validar:
- relacionamentos quebrados
- colunas duplicadas
- tipos errados
- ausência de índices
- consultas lentas
- RLS
- foreign keys
- cascades
- consistência MLM
- customer 360
- analytics
- views
- materialized views
- dados órfãos
- duplicidade
- integridade financeira

---

# 4. AUTH + RBAC AUDIT

Validar completamente:

## Tipos de usuários
- admin_master
- gestão_admin
- financeiro
- suporte
- logística
- marketing
- analytics
- auditor
- operador
- distributor
- customer

## Verificar:
- permissões por rota
- permissões por módulo
- permissões por menu
- vazamento de acesso
- guards
- middleware
- roles
- policies
- tokens
- sessão
- refresh token
- recuperação de senha
- convite administrativo
- links mágicos
- cadastro via indicação

---

# 5. MLM AUDIT

Validar:
- rede linear
- patrocinador
- geração
- bônus
- planos
- upgrades
- pontos
- score
- customer 360
- vínculos de clientes
- afiliados
- distribuidores
- loja personalizada
- links compartilháveis
- rastreamento de indicação
- árvore MLM
- métricas da rede

---

# 6. E-COMMERCE AUDIT

Validar:
- catálogo
- produtos
- variantes
- checkout
- pagamentos
- frete
- PIX
- boleto
- pagamento entrega
- uso de bônus
- sistema de pontos
- descontos
- Belluno
- PagSeguro
- cálculo Correios
- cálculo de frete
- carrinho
- pedidos
- status
- rastreamento
- loja virtual do distribuidor

---

# 7. CHATWOOT AUDIT

Validar:
- integração
- conversas
- contatos
- sincronização
- automações
- webhooks
- atendimento
- customer context
- distributor context

---

# 8. UX + DESIGN SYSTEM AUDIT

Validar:
- design system
- componentização
- consistência visual
- sidebar
- header
- responsividade
- spacing
- typography
- acessibilidade
- padrões enterprise
- loading states
- empty states
- tables
- forms
- modals
- drawers
- dashboards

---

# 9. PERFORMANCE AUDIT

Validar:
- bundle size
- queries lentas
- renders excessivos
- cache
- lazy loading
- code splitting
- imagens
- assets
- materialized views
- SSR/CSR
- tempo de carregamento
- Lighthouse
- performance mobile

---

# EXECUÇÃO OBRIGATÓRIA

Para CADA problema encontrado:

1. Identificar causa
2. Corrigir automaticamente
3. Refatorar arquitetura se necessário
4. Atualizar tipagens
5. Atualizar integrações
6. Corrigir imports
7. Corrigir estados
8. Corrigir queries
9. Corrigir rotas
10. Corrigir permissões
11. Corrigir componentes
12. Corrigir layout
13. Corrigir inconsistências
14. Corrigir responsividade

---

# RESULTADO ESPERADO

Ao final da auditoria o sistema deve estar:

✅ estável  
✅ modular  
✅ escalável  
✅ tipado  
✅ performático  
✅ responsivo  
✅ sem componentes órfãos  
✅ sem rotas quebradas  
✅ sem imports inválidos  
✅ sem código morto  
✅ sem erros de integração  
✅ com RBAC funcional  
✅ com MLM funcional  
✅ com checkout funcional  
✅ com pagamentos funcionais  
✅ com frete funcional  
✅ com dashboards funcionais  
✅ com customer 360 funcional  
✅ com analytics funcionais  
✅ com Chatwoot funcional  
✅ com arquitetura enterprise moderna  

---

# IMPORTANTE

Você NÃO deve apenas gerar relatórios.

Você deve:
- corrigir
- refatorar
- reorganizar
- estabilizar
- otimizar
- padronizar

automaticamente durante a auditoria.

Prioridade máxima:
- estabilidade
- integridade financeira
- performance
- segurança
- escalabilidade
- UX enterprise moderna