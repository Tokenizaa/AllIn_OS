# Página Inicial - Dashboard Home

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/PaginaInicialAdministrador/Inicio
- **Título**: Administração | All-in life style
- **Breadcrumb**: Não aplicável (página raiz)
- **Objetivo**: Visão geral do administrador com KPIs e informações recentes

## Estrutura da Página

### Header
- Logo All-in (clicável, redireciona para /administracao)
- Menu hamburger
- Botão "Editar Gadgets"
- Seletor de idioma (Português BR)
- Menu de usuário (Junior Padilha) com dropdown

### Sidebar
Estrutura completa do menu lateral (documentado separadamente em 02-sidebar-map.md)

### Área Principal

#### Alerta de Faturas
- **Tipo**: Alerta/Warning
- **Conteúdo**: "Você tem as seguintes faturas que vencem em breve:"
- **Itens**:
  - Fatura 100092909 vence em 01/06/2026
  - Fatura 100092921 vence em 01/06/2026
- **Ações**:
  - "Ver detalhes" (link para /administracao/Sistema/FaturasMaxnivel/detalhe)
  - "Enviar comprovante" (link para /administracao/Sistema/FaturasMaxnivel/detalhe)
- **Nota**: "Pague as faturas antes do vencimento e evite a suspensão do serviço. O serviço será suspenso caso não ocorra a confirmação do pagamento."

#### Widget: Bem-vindo
- **Tipo**: Card informativo
- **Título**: "Bem vindo, Junior Padilha"
- **Subtítulo**: "Você desconhece sua verdadeira força, por isso lute para a descobrir!"
- **Ícone**: 

#### Widget: Distribuidores Na Rede
- **Tipo**: KPI Card
- **Valor**: 977
- **Label**: "Distribuidores Na Rede"
- **Ícone**: 
- **Link**: "Ver Distribuidores" → /administracao/Distribuidor/DistribuidoresARede/listar
- **Atualização**: Timestamp com data/hora da última atualização

#### Widget: Planos Vendidos
- **Tipo**: KPI Card
- **Valor**: 1.684
- **Label**: "Planos Vendidos"
- **Ícone**: 
- **Link**: "Relatório dos Planos" → /administracao/Planos/LojaOrderRelatorioAdesoes/listar
- **Atualização**: Timestamp com data/hora da última atualização

#### Widget: Bônus Total Recebidos
- **Tipo**: KPI Card
- **Valor**: R$ 1.434.493,95
- **Label**: "Bônus total recebidos geral - Diretos"
- **Ícone**: 
- **Atualização**: Timestamp com data/hora da última atualização
- **Botão**:  (provavelmente refresh/atualizar)

#### Widget: Saldos
- **Tipo**: Card com múltiplos KPIs
- **Ícone**: 
- **KPIs**:
  1. Saldo Loja Online: R$ 16.414,91
  2. Saldo Perdido: R$ 851.906,31
  3. Saldo a receber: R$ -2.097,14
  4. Saldo para Compra: R$ 9.761,62
- **Atualização**: Timestamp com data/hora da última atualização

#### Widget: Últimas Transações
- **Tipo**: Tabela
- **Título**: "Últimas Transações"
- **Ícone**: 
- **Colunas**:
  - Conta (ícone )
  - Descrição
  - Data Transação (ícone )
  - Valor (ícone )
  - (coluna vazia para ações)
- **Dados da Tabela**:
  - Conta: "Saldo para Compra"
  - Descrição: Formato "Bônus total recebidos geral - Diretos - Geração: X, Pedido: XXXXX, Comprador: XXXXXX, Percentual: X%, Montante: X,XX"
  - Data Transação: Formato DD/MM/YYYY
  - Valor: Formato +X,XX (positivo) ou vazio (zero)
- **Exemplos de dados**:
  - Geração: 1, Pedido: 25043, Comprador: TransformaVitta, Percentual: 5%, Montante: 494,00 → +24,70
  - Geração: 2, Pedido: 25043, Comprador: TransformaVitta, Percentual: 3%, Montante: 494,00 → +14,82
  - Geração: 1, Pedido: 25043, Comprador: TransformaVitta, Percentual: 0%, Montante: 494,00 → (vazio)
- **Padrão identificado**: Sistema de bônus multinível com gerações (1, 2, etc.) e percentuais variáveis

#### Widget: Últimas Ativações
- **Tipo**: Tabela
- **Título**: "Últimas Ativações"
- **Ícone**: 
- **Colunas**:
  - N° (ícone )
  - Distribuidor (ícone )
  - Informações
  - Data
- **Dados da Tabela**:
  - N°: Número do pedido (ex: 25047) ou 0 (para isentos)
  - Distribuidor: Nome completo do distribuidor
  - Informações: "Ativo com o pedido #XXXXX" ou "Isento de ativação enquanto possuir o plano Plano Afiliado"
  - Data: Formato DD/MM/YYYY
- **Exemplos**:
  - 25047 | Vanderleia Colares Gomes da Silva | Ativo com o pedido #25047 | 27/05/2026
  - 0 | Francieli Rychik | Isento de ativação enquanto possuir o plano Plano Afiliado | 18/05/2026

#### Widget: Distribuidores por Planos
- **Tipo**: Gráfico de pizza (Pie Chart)
- **Título**: "Distribuidores por Planos"
- **Ícone**: 
- **Dados do Gráfico**:
  1. Kit Inicial All-In Outros estados: 0.76% (7 distribuidores)
  2. Plano Afiliado: 18.57% (172 distribuidores)
  3. PLANO INICIAL ALL-IN: 0.11% (1 distribuidor)
  4. Plano Inicial para representantes que atingiram a meta de 100 pares vendidos: 0.43% (4 distribuidores)
  5. Plano Avanço: 14.04% (130 distribuidores)
  6. Plano Excelência: 66.09% (612 distribuidores)
- **Interatividade**: Clicável para filtrar/ver detalhes
- **Legenda**: Mostra nome do plano, percentual e quantidade

## Endpoints Identificados

### Gadgets (Widgets de Dashboard)
- **GET** `/administracao/Sistema/FaturasMaxnivel/paginaInicialEscritorio` - Carrega faturas pendentes
- **GET** `/publico/Gadgets/CarregamentoGadgets/getListaGadget/3` - Lista de gadgets disponíveis
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregaAjax/3/BemVindoAdministrador` - Widget de boas-vindas
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregaAjax/3/DistribuidoresNaRede` - KPI de distribuidores na rede
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregaAjax/3/PlanosVendidos` - KPI de planos vendidos
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregaAjax/3/BonusAdministrador` - KPI de bônus
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregaAjax/3/SaldoGeralEmConta` - KPI de saldos
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregarGadget/3/BonusAdministrador` - Renderização do widget de bônus
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregarGadget/3/SaldoGeralEmConta` - Renderização do widget de saldos
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregaAjax/3/UltimasTransacoes` - Tabela de transações
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregaAjax/3/UltimasAtivacoes` - Tabela de ativações
- **GET** `/publico/Gadgets/CarregamentoGadgets/carregaAjax/3/GraficoPlanosDistribuidor` - Gráfico de distribuidores por planos

### Recursos Estáticos
- **GET** `/src/Ferramentas/Layouts/Recursos/Plugins/counterup/countUp.js` - Biblioteca de animação de números
- **GET** `/src/Ferramentas/Layouts/Recursos/Plugins/amcharts/amcharts.js` - Biblioteca de gráficos
- **GET** `/src/Ferramentas/Layouts/Recursos/Plugins/amcharts/pie.js` - Plugin de gráfico de pizza
- **GET** `/src/Ferramentas/Layouts/Recursos/Plugins/amcharts/serial.js` - Plugin de gráficos seriais
- **GET** `/src/Ferramentas/Layouts/Recursos/Plugins/amcharts/themes/light.js` - Tema light para gráficos

## Entidades de Negócio Identificadas

### Distribuidores
- **ID**: Número de cadastro (ex: 25047)
- **Nome**: Nome completo
- **Status**: Ativo, Isento, etc.
- **Plano**: Plano Afiliado, Plano Avanço, Plano Excelência, etc.
- **Patrocinador**: Relacionamento hierárquico
- **Geração**: Nível na rede (1, 2, etc.)

### Transações Financeiras
- **Tipo**: Bônus diretos, indiretos
- **Geração**: Nível na rede (1, 2, etc.)
- **Pedido**: ID do pedido relacionado
- **Comprador**: Nome do comprador
- **Percentual**: Taxa de comissão (5%, 3%, 0%, etc.)
- **Montante**: Valor base do pedido
- **Valor**: Valor calculado do bônus

### Contas/Saldos
- **Saldo Loja Online**: Saldo disponível para compras na loja
- **Saldo Perdido**: Saldo expirado/perdido
- **Saldo a receber**: Saldo pendente de recebimento
- **Saldo para Compra**: Saldo disponível para compras

### Planos
- **Kit Inicial All-In Outros estados**
- **Plano Afiliado**
- **PLANO INICIAL ALL-IN**
- **Plano Inicial para representantes que atingiram a meta de 100 pares vendidos**
- **Plano Avanço**
- **Plano Excelência**

### Faturas
- **Número**: ID da fatura (ex: 100092909)
- **Vencimento**: Data de vencimento
- **Status**: Pendente, paga, etc.

## Padrões de UI/UX

### Layout
- **Grid system**: Cards organizados em grid responsivo
- **Sidebar fixa**: Menu lateral fixo à esquerda
- **Header fixo**: Cabeçalho fixo no topo
- **Área de conteúdo scrollável**: Conteúdo principal com scroll independente

### Componentes
- **KPI Cards**: Cards com ícone, valor, label e link
- **Tabelas**: Tabelas com headers, dados e paginação
- **Gráficos**: Gráficos interativos usando amCharts
- **Alertas**: Cards de alerta com ações
- **Widgets**: Componentes reutilizáveis carregados via AJAX

### Cores e Ícones
- **Ícones**: Font Awesome (, , , , , , , , etc.)
- **Cores**: Não identificadas no snapshot, mas provavelmente tema corporativo

### Interações
- **Hover**: Efeitos de hover em links e botões
- **Click**: Links navegáveis, botões com ações
- **Refresh**: Botões de refresh em widgets com timestamp
- **Filtros**: Gráficos clicáveis para filtrar dados

## Comportamentos

### Atualização de Dados
- **Timestamp**: Cada widget mostra data/hora da última atualização
- **Refresh**: Botão de refresh disponível em alguns widgets
- **Loading**: Indicador de loading durante carregamento de dados

### Navegação
- **Links**: Links para páginas detalhadas a partir de KPIs
- **Breadcrumb**: Não aplicável na página inicial

### Responsividade
- **Grid adaptativo**: Cards se reorganizam conforme tamanho da tela
- **Sidebar colapsável**: Menu hamburger para mobile

## Observações Técnicas

### Arquitetura
- **Server-side rendering**: Página renderizada no servidor
- **AJAX widgets**: Widgets carregados dinamicamente via AJAX
- **Componentização**: Sistema de gadgets/widgets reutilizáveis
- **Temas**: Sistema de temas configurável

### Performance
- **Lazy loading**: Widgets carregados sob demanda
- **Cache**: Possível cache de widgets
- **Otimização**: Scripts de animação (countUp.js) para melhor UX

### Segurança
- **Autenticação**: Sessão ativa requerida
- **Autorização**: Nível de administrador verificado
- **CSRF**: Tokens provavelmente implementados

## Próximos Passos

1. Navegar para **Distribuidores** e documentar submenus
2. Explorar **Loja Virtual**
3. Documentar **Cadastros** (Planos, Pedidos, Formas de Pagamento, Qualificação, Verificação Conta, Tipo de Cliente)
4. Explorar **Ferramentas** (Habilitar Produtos Lojas, Alterar usuário, Alterar patrocinador, Lançar Qualificação Manual, Criar Pedido, Ativação Mensal, Movimentar Saldo, Estoque)
5. Documentar **Configurações** (Permissão, Configuração geral)
6. Explorar **Bônus**
7. Documentar **Relatório de Bônus**
