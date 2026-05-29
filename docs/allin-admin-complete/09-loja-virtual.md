# Loja Virtual

## Informações Gerais
- **URL**: https://allinbrasil.com.br/loja/admin/common/dashboard?token=0618f7520b48c891bda1d58a28a7b7aa
- **Título**: Painel de controle
- **Breadcrumb**: Principal / Painel de controle
- **Objetivo**: Painel de controle da loja virtual (sistema e-commerce separado)
- **Nota**: Este é um sistema externo integrado via link do admin principal

## Estrutura da Página

### Header
- **Logo**: "Sistema de gestão loja virtual"
- **Menu hamburger**: 
- **Botões de ação**:  (notificações), Sair 

### Sidebar Navigation
Ícones de navegação (sem labels visíveis no snapshot):
-  - Dashboard/Home
-  - (não identificado)
-  - (não identificado)
-  - Catálogo/Produtos
-  - Vendas/Pedidos
-  - Configurações
-  - (não identificado)
-  - Exportação
-  - (não identificado)

### Área Principal

#### KPIs
1. **Total de pedidos**: 24.6K
   - Link: "Ver mais..." → `/loja/admin/sale/order?token=...`
2. **Valor total de vendas**: 30,10M
   - Link: "Ver mais..." → `/loja/admin/sale/order?token=...`
3. **Total de clientes**: 2.6K
   - Link: "Ver mais..." → `/loja/admin/sale/customer?token=...`

#### Gráficos
1. **Mapa do Mundo** ()
   - Controles: + (zoom in), − (zoom out)
   - Mostra distribuição geográfica de vendas

2. **Gráfico de Vendas** ()
   - Gráfico de barras mostrando vendas por dia
   - Período: Últimos 30 dias (10 a 09)
   - Eixo Y: 0, 5, 10, 15, 20
   - Legenda: Pedidos, Clientes

#### Últimos Pedidos
**Colunas**:
- Pedido Nº
- Cliente
- Situação
- Data
- Total
- Ação

**Dados da Tabela**:
- 25054 | UNIVERSOL APOIO ADMINISTRATIVO LTDA | Pedido enviado para cliente | 27/05/2026 | R$259,50 | [Ver]
- 25053 | ÉRICA SOARES SILVEIRA CORRÊA | Pedido enviado para cliente | 27/05/2026 | R$1.257,00 | [Ver]
- 25052 | Graciliana Dos Santos Ribeiro | Pedido enviado para cliente | 27/05/2026 | R$293,90 | [Ver]
- 25050 | UNIVERSOL APOIO ADMINISTRATIVO LTDA | Pedido enviado para cliente | 27/05/2026 | R$1.486,00 | [Ver]
- 25049 | Ortopedia CHAPECOENSE | Pedido enviado para cliente | 26/05/2026 | R$4.998,00 | [Ver]

**Ações**:
- ** Ver** - Visualizar detalhes do pedido
  - URL: `/loja/admin/sale/order/info?token=...&order_id={id}`

## Endpoints Identificados

### Navegação
- **GET** `/loja/admin/common/dashboard?token={token}` - Dashboard da loja
- **GET** `/loja/admin/sale/order?token={token}` - Lista de pedidos
- **GET** `/loja/admin/sale/customer?token={token}` - Lista de clientes
- **GET** `/loja/admin/sale/order/info?token={token}&order_id={id}` - Detalhes do pedido
- **GET** `/loja/admin/catalog/exportacao?token={token}` - Exportação de catálogo
- **GET** `/loja/admin/common/logout?token={token}` - Logout

### Autenticação
- **Token-based**: Autenticação via token na URL
- **Token exemplo**: 0618f7520b48c891bda1d58a28a7b7aa

## Entidades de Negócio Identificadas

### Pedidos
- **ID**: Número do pedido (ex: 25054)
- **Cliente**: Nome do cliente
- **Situação**: Status do pedido (ex: "Pedido enviado para cliente")
- **Data**: Data do pedido
- **Total**: Valor total do pedido

### Métricas
- **Total de pedidos**: 24.6K pedidos
- **Valor total de vendas**: R$ 30,10 milhões
- **Total de clientes**: 2.6K clientes

## Padrões de UI/UX

### Layout
- **Dashboard moderno**: Layout de painel de controle estilo e-commerce
- **KPIs destacados**: Cards grandes com métricas principais
- **Gráficos interativos**: Mapa do mundo e gráfico de vendas
- **Tabela de pedidos**: Lista dos pedidos mais recentes

### Navegação
- **Sidebar fixa**: Menu lateral com ícones
- **Breadcrumb**: Navegação por breadcrumbs
- **Links contextuais**: Links "Ver mais..." nos KPIs

### Integração
- **Sistema separado**: Sistema de e-commerce independente do admin principal
- **Autenticação via token**: Integração SSO via token
- **Link externo**: Acessível via link do admin principal

## Observações Técnicas

### Arquitetura
- **Microserviços**: Sistema de loja virtual separado do admin principal
- **Integração SSO**: Single Sign-On via token
- **URL base**: https://allinbrasil.com.br/loja/admin/

### Dados
- **Volume**: 24.6K pedidos, 2.6K clientes
- **Faturamento**: R$ 30,10 milhões em vendas
- **Geografia**: Distribuição global de vendas (Mapa do Mundo)

## Próximos Passos

Voltar ao admin principal para continuar explorando:
1. **Cadastros** (Planos, Pedidos, Formas de Pagamento, Qualificação, Verificação Conta, Tipo de Cliente)
2. **Ferramentas** (Habilitar Produtos Lojas, Alterar usuário, Alterar patrocinador, Lançar Qualificação Manual, Criar Pedido, Ativação Mensal, Movimentar Saldo, Estoque)
3. **Configurações** (Permissão, Configuração geral)
4. **Bônus**
5. **Relatório de Bônus**
