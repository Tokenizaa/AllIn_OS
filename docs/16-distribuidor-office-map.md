# PROMPT — CRIAR PAINEL DO DISTRIBUIDOR ENTERPRISE MLM

Criar do zero um painel moderno de distribuidor MLM inspirado no modelo operacional da All-in Brasil, porém totalmente modernizado, desacoplado, IA-first e orientado a workflows.

NÃO clonar layout antigo.

O novo painel deve possuir UX moderna, dashboards inteligentes, experiência contextual e arquitetura modular enterprise.

---

# OBJETIVO

Construir um novo “Escritório do Distribuidor” completo integrado ao Supabase e ao backend principal da plataforma.

O painel deve centralizar:

* vendas
* pedidos
* bônus
* rede
* links de indicação
* financeiro
* documentos
* downloads
* analytics
* IA operacional
* timeline de atividades

Tudo em uma experiência única.

---

# STACK

Frontend:

* React
* TypeScript
* Tailwind
* shadcn/ui
* React Query
* Zustand
* Framer Motion
* Recharts

Backend:

* Supabase
* PostgreSQL
* Edge Functions
* Realtime

Arquitetura:

* componentizada
* modular
* domain-driven
* multi-tenant
* event-driven

---

# ESTRUTURA DO PAINEL

# 1. Dashboard Inicial

Criar dashboard operacional inteligente.

Componentes:

* Saudação personalizada
* KPIs principais
* Resumo financeiro
* Resumo da rede
* Últimos pedidos
* Timeline operacional
* Alertas importantes
* Insights IA
* Metas e progresso
* Quick actions

Cards:

* Cadastros diretos
* Comissão acumulada
* Saldo disponível
* Total vendido
* Pedidos do mês
* Crescimento da rede
* Qualificação atual

Widgets:

* gráfico de vendas
* gráfico de crescimento da rede
* ranking pessoal
* evolução de bônus
* produtos mais vendidos

Adicionar:

* ações rápidas
* copiar link
* compartilhar loja
* solicitar saque
* cadastrar distribuidor
* gerar convite

---

# 2. Meu Plano

Criar página moderna do plano do distribuidor.

Exibir:

* plano atual
* benefícios
* bônus do plano
* percentual por geração
* data de ativação
* status
* próximos upgrades

Adicionar:

* comparação entre planos
* botão upgrade
* histórico de upgrades
* IA recomendando upgrade ideal

Integrar com:

* plans
* customer_plans
* bonus_rules

---

# 3. Meus Pedidos

Criar central completa de pedidos.

Integrar:

* orders
* order_items
* payments
* shipments

Funcionalidades:

* listagem moderna
* filtros avançados
* status visual
* timeline do pedido
* rastreamento
* exportação
* reorder
* detalhes completos

Dashboard interno:

* ticket médio
* total comprado
* frequência
* status de entrega

---

# 4. Loja Virtual

Criar central da loja do distribuidor.

Funcionalidades:

* link personalizado
* compartilhamento social
* QRCode
* analytics da loja
* visitas
* conversões
* vendas por link

Adicionar:

* IA gerando textos de vendas
* campanhas prontas
* criativos automáticos

---

# 5. Meus Dados

Criar área completa do distribuidor.

Seções:

* perfil
* endereço
* documentos
* conta bancária
* PIX
* segurança
* preferências

Adicionar:

* upload de documentos
* avatar
* autenticação 2FA
* logs de acesso

Integrar:

* customers
* verification_documents

---

# 6. Verificação de Conta

Criar sistema de KYC moderno.

Funcionalidades:

* upload drag and drop
* preview
* validação automática
* status
* timeline de aprovação

Documentos:

* RG
* CPF
* comprovante
* contrato
* CNPJ

Adicionar:

* OCR
* IA antifraude
* análise automática

---

# 7. Financeiro

Criar wallet moderna.

Integrar:

* payments
* bonus_calculations
* transactions
* wallets

Funcionalidades:

* saldo disponível
* saldo bloqueado
* histórico financeiro
* extrato
* saque
* PIX
* bônus recebidos
* comissões

Dashboard:

* ganhos por período
* origem dos bônus
* previsões

Adicionar:

* forecast financeiro IA
* alertas financeiros

---

# 8. Relatórios

Criar analytics modernos.

NÃO criar tabelas antigas.

Criar:

* dashboards
* insights
* comparativos
* gráficos
* tendências

Relatórios:

* vendas
* bônus
* rede
* crescimento
* performance
* conversão
* retenção

Adicionar:

* exportação PDF/Excel
* IA interpretando métricas

---

# 9. Minha Rede

Criar Customer Network 360.

Integrar:

* customers
* network_relationships
* customer_network_metrics

Funcionalidades:

* árvore genealógica
* organograma
* rede linear
* mapa da rede
* métricas por geração
* crescimento
* qualificações

Adicionar:

* visualização interativa
* expansão dinâmica
* IA detectando líderes
* IA detectando risco de abandono

---

# 10. Downloads

Criar biblioteca inteligente.

Categorias:

* treinamentos
* campanhas
* PDFs
* vídeos
* materiais
* apresentações

Funcionalidades:

* busca
* filtros
* favoritos
* histórico
* recomendação IA

Adicionar:

* streaming de vídeos
* progresso de aprendizado

---

# SIDEBAR

Criar sidebar moderna minimalista.

Itens:

* Dashboard
* Meu Plano
* Pedidos
* Loja Virtual
* Financeiro
* Rede
* Relatórios
* Downloads
* Configurações

Requisitos:

* colapsável
* responsiva
* contextual
* ícones modernos
* sem submenus excessivos

---

# CUSTOMER 360

Toda informação do distribuidor deve ser centralizada.

Criar visão unificada contendo:

* perfil
* pedidos
* pagamentos
* rede
* bônus
* timeline
* documentos
* métricas
* score
* insights IA

---

# IA NATIVA

Adicionar IA como infraestrutura.

Funcionalidades:

* insights automáticos
* previsão de vendas
* previsão de bônus
* recomendação de ações
* risco de abandono
* sugestão de produtos
* geração de mensagens
* assistente operacional

Criar:

* Copiloto IA do distribuidor

---

# TIMELINE OPERACIONAL

Toda entidade deve possuir timeline.

Eventos:

* pedidos
* pagamentos
* bônus
* upgrades
* saques
* rede
* documentos
* login
* alterações

---

# DESIGN SYSTEM

Criar design enterprise moderno.

Requisitos:

* dark mode
* glassmorphism leve
* componentes reutilizáveis
* tabelas modernas
* skeleton loaders
* animações suaves
* responsividade total
* UX premium

---

# PERFORMANCE

Obrigatório:

* lazy loading
* code splitting
* cache inteligente
* realtime Supabase
* otimização de queries
* paginação server-side

---

# RESULTADO FINAL

O sistema deve parecer:

* HubSpot
* Stripe Dashboard
* Notion
* Linear
* ClickUp
* modern fintech dashboards

E NÃO:

* ERP legado
* CRUD antigo
* painel administrativo tradicional
* sistema baseado em tabelas

Criar toda estrutura:

* frontend
* rotas
* componentes
* hooks
* serviços
* integração Supabase
* stores globais
* dashboards
* analytics
* páginas
* schemas
* policies
* realtime
* loading states
* empty states
* error handling

Executar implementação completa sem perguntas.
