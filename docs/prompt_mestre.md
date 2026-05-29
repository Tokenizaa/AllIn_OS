MODERNIZE E RECONSTRUA COMPLETAMENTE A PLATAFORMA ALLIN COMO UM SISTEMA OPERACIONAL ENTERPRISE IA-FIRST
Crie do zero uma plataforma administrativa enterprise moderna para MLM, e-commerce, analytics e operações inteligentes.
NÃO recrie o sistema legado.
Substitua completamente a arquitetura antiga por uma plataforma operacional moderna, modular, escalável e orientada a IA.
A nova plataforma deve ser:
IA-first
analytics-first
workflow-first
multi-tenant
event-driven
enterprise-grade
altamente escalável
operacional
contextual
action-driven
STACK OBRIGATÓRIA
Use:
React
TypeScript
Tailwind
Shadcn/UI
Supabase
PostgreSQL
Edge Functions
Realtime
Row Level Security
Component Architecture
Domain Driven Design
Clean Architecture
ARQUITETURA OBRIGATÓRIA
Separar o sistema em 4 camadas:
1. Executive Layer
Painéis executivos, analytics, KPIs, insights, previsões, alertas e inteligência operacional.
2. Operational Layer
Pedidos, distribuidores, produtos, financeiro, carteira, bônus, rede MLM e operação diária.
3. Intelligence Layer
Copiloto IA, scoring, previsões, recomendações, automações e análises inteligentes.
4. System Layer
Permissões, logs, integrações, feature flags, configurações e administração técnica.
OBJETIVO PRINCIPAL
Eliminar completamente:
CRUDs desnecessários
telas redundantes
menus profundos
grids antigas
excesso de relatórios
navegação fragmentada
UX administrativa legada
Substituir por:
dashboards inteligentes
Customer 360
timelines operacionais
quick actions
workflows contextuais
insights automáticos
IA integrada nativamente
UX enterprise moderna
CUSTOMER 360 OBRIGATÓRIO
O Customer 360 deve centralizar:
perfil
pedidos
rede MLM
carteira
bônus
financeiro
documentos
timeline operacional
métricas
score
insights IA
riscos
automações
ações rápidas
Tudo em uma experiência única e contextual.
SIDEBAR
A sidebar deve ser:
minimalista
rasa
contextual
moderna
orientada a domínio
sem submenus excessivos
Estrutura recomendada:
Executive
CRM
Rede MLM
Comercial
Financeiro
Marketing
Intelligence
Sistema
PÁGINAS OBRIGATÓRIAS
Criar:
Executive
Dashboard Executivo
Analytics
Insights
Relatórios Inteligentes
Alertas Operacionais
CRM
Distribuidores
Customer 360
Verificações
Aprovações
Rede MLM
Genealogia Inteligente
Comissões
Qualificações
Ativações
Rede Binária
Ciclos
Comercial
Pedidos
Produtos
Estoque
Loja Virtual
Cupons
Financeiro
Carteiras
Saques
Bônus
Transações
Operações Financeiras
Marketing
Campanhas
Links Inteligentes
Comunicação
Banners
Downloads
Intelligence
Copiloto IA
Insights IA
Anomalias
Recomendações
Scoring
Sistema
Usuários Admin
Permissões
Logs
Auditoria
Configurações
Integrações
TABELAS PRINCIPAIS
Use estas tabelas como núcleo do sistema:
customers
Sistema principal de distribuidores/clientes.
Campos importantes:
id
nome_completo
email
telefone
cpf
qualification
sponsor_id
plan_id
plan_name
total_compras
numero_pedidos
activation_date
status
metadata
orders
Sistema principal de pedidos.
Campos importantes:
id
customer_id
numero_pedido
status_pedido
valor_total_pedido
payment_status
payment_method
forma_pagamento
forma_entrega
pagamentos
purchase_type
payment_metadata
order_items
Itens dos pedidos.
Campos importantes:
order_id
product_id
product_name
quantity
unit_price
total_price
variant
category
products
Catálogo principal.
Campos importantes:
id
name
description
category
price
stock
sku
manufacturer
images
attributes
bonus_payment_percentage
product_variants
Variantes dos produtos.
Campos importantes:
product_id
name
sku
price
stock
attributes
REGRAS OBRIGATÓRIAS
NÃO criar CRUD tradicional
Tudo deve ser:
contextual
inline
orientado a ações
automatizado
inteligente
NÃO criar grids antigas
Substituir por:
widgets
insights
cards inteligentes
analytics
timelines
tabelas modernas com filtros avançados
IA NATIVA
A IA deve:
detectar anomalias
sugerir ações
prever churn
analisar rede MLM
gerar insights
interpretar métricas
detectar riscos
resumir operações
TIMELINE GLOBAL
Todas entidades críticas devem possuir timeline:
pedidos
pagamentos
bônus
verificações
ativações
alterações
eventos
automações
DESIGN SYSTEM
Criar:
component library
tokens
tabelas modernas
filtros globais
actions bars
widgets reutilizáveis
dark mode
responsive enterprise UI
BACKEND
Criar:
APIs modulares
services
repositories
DTOs
validação
RLS
eventos
observabilidade
auditoria
realtime
Arquitetura obrigatória:
Frontend → API → Services → Repository → Supabase/Postgres
NUNCA acessar tabelas diretamente pelo frontend.
ANALYTICS
Criar:
materialized views
KPIs
cohort analysis
sales analytics
customer metrics
network metrics
AI insights
executive dashboards
EXPERIÊNCIA
A plataforma deve parecer:
Salesforce
HubSpot
Notion
Linear
Stripe Dashboard
Vercel Dashboard
Misturando:
operação
analytics
IA
workflows
automação
RESULTADO FINAL
O sistema final deve ser:
moderno
premium
enterprise
operacional
inteligente
modular
contextual
escalável
AI-native
analytics-driven
workflow-oriented
E NÃO:
ERP legado
CRUD administrativo
dashboard antigo
sistema fragmentado
menu infinito
plataforma baseada apenas em tabelas
Inicie imediatamente a construção completa da plataforma, incluindo:
arquitetura
banco
APIs
frontend
design system
dashboards
IA
workflows
automações
analytics
timelines
Customer 360
módulos MLM
financeiro
marketing
intelligence layer
Não faça perguntas.
Tome decisões arquiteturais modernas automaticamente.
Utilize uma stack escalável com Next.js, PostgreSQL e Node.js via microserviços. e utilize containers Docker orquestrados por Kubernetes para garantir alta disponibilidade e escalabilidade. Adote CI/CD com GitHub Actions para entregas contínuas e seguras. Utilize Redis para cache de alta performance e monitore o ambiente com Prometheus e Grafana. Além disso, implemente autenticação robusta usando JWT e OAuth 2.0. e garanta testes automatizados com Jest para assegurar a estabilidade do sistema. Por fim, estruture o banco de dados utilizando PostgreSQL com Prisma ORM. para garantir um mapeamento de dados eficiente e consistente. Adicione uma camada de documentação com Swagger para facilitar a integração da API. por fim, assegure a conformidade com as diretrizes de acessibilidade WCAG. e utilize Docker para facilitar o ambiente de desenvolvimento e deploy em nuvem. além de implementar testes automatizados com Jest.