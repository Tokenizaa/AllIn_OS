# Allin Brasil Admin Dashboard - Reverse Engineering Summary

## Overview
This document provides a comprehensive summary of the reverse engineering of the Allin Brasil admin dashboard, documenting all explored pages, menus, submenus, endpoints, business entities, and UI/UX patterns.

## System Information
- **Base URL**: https://allinbrasil.com.br/
- **Admin URL**: https://allinbrasil.com.br/administracao/
- **Dashboard URL**: https://allinbrasil.com.br/administracao/PaginaInicialAdministrador/Inicio
- **Authentication**: Session-based with cookies
- **Language**: Portuguese (BR)

## Documentation Files Created

### 1. Dashboard Home
- **File**: `01-dashboard-home.md`
- **URL**: `/administracao/PaginaInicialAdministrador/Inicio`
- **Key Features**:
  - KPIs: 977 distribuidores, 1.684 planos vendidos, R$ 1.434.493,95 em bônus
  - Saldo Loja Online: R$ 16.414,91
  - Últimas transações, ativações recentes
  - Gráficos: Distribuidores por planos, Faturamento X Bônus
  - Últimos saques

### 2. Distribuidores - A Rede
- **File**: `02-distribuidores-a-rede.md`
- **URL**: `/administracao/Distribuidor/DistribuidoresARede/listar`
- **Key Features**:
  - 977 distribuidores ativos
  - Colunas: ID, Usuário, Nome, E-mail, Patrocinador, Cidade, Estado, Telefone, Data Nascimento, Data Cadastro, Qualificação, Status, Ações
  - Ações: Ver, Editar, Excluir, Alterar usuário, Alterar patrocinador

### 3. Distribuidores - Contas Bancárias
- **File**: `03-distribuidores-contas-bancarias.md`
- **URL**: `/administracao/ContaBancaria/DistribuidorContaBancariaListagem/listar`
- **Key Features**:
  - Gestão de contas bancárias para saques via PIX
  - Colunas: ID, Distribuidor, Banco, Agência, Conta, Tipo, PIX, Status, Ações
  - Ações: Ver, Editar, Excluir

### 4. Distribuidores - Verificação de Contas
- **File**: `04-distribuidores-verificacao-contas.md`
- **URL**: `/administracao/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar`
- **Key Features**:
  - Aprovação de documentos de identificação
  - Colunas: ID, Distribuidor, Tipo Documento, Arquivo, Status, Data Upload, Ações
  - Ações: Aprovar, Rejeitar, Ver documento

### 5. Distribuidores - Solicitação de Saque
- **File**: `05-distribuidores-solicitacao-saque.md`
- **URL**: `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar`
- **Key Features**:
  - Gestão de solicitações de saque via PIX
  - Taxa: ~7.5% sobre saques
  - Colunas: ID, Distribuidor, Conta, Valor, Taxa, Valor Líquido, Status, Data, Ações
  - Ações: Aprovar, Rejeitar, Ver detalhes

### 6. Distribuidores - Pendentes
- **File**: `06-distribuidores-pendentes.md`
- **URL**: `/administracao/Distribuidor/DistribuidoresCadastroPendente/listar`
- **Key Features**:
  - Cadastros aguardando aprovação
  - 0 registros no momento
  - Estrutura similar a "A Rede"

### 7. Distribuidores - Relatório de Indicados
- **File**: `07-distribuidores-relatorio-indicados.md`
- **URL**: `/administracao/Distribuidor/Patrocinador/relatorioIndicacoes`
- **Key Features**:
  - Estatísticas de rede por patrocinador
  - 240 patrocinadores listados
  - Colunas: Patrocinador, Nome, Indicados na rede, Indicados pendentes, Indicados totais, Primeiro cadastro, Último cadastro
  - Links contextuais para filtrar "A Rede" e "Pendentes"

### 8. Distribuidores - Excluídos
- **File**: `08-distribuidores-excluidos.md`
- **URL**: `/administracao/Distribuidor/DistribuidoresCadastroExcluido/listar`
- **Key Features**:
  - 340 distribuidores excluídos
  - Soft delete com possibilidade de restauração
  - Ação: Restaurar ()
  - Nome de usuário modificado com sufixo "- Excluído"

### 9. Loja Virtual
- **File**: `09-loja-virtual.md`
- **URL**: https://allinbrasil.com.br/loja/admin/common/dashboard?token={token}
- **Key Features**:
  - Sistema e-commerce separado (microserviço)
  - KPIs: 24.6K pedidos, R$ 30,10M em vendas, 2.6K clientes
  - Gráficos: Mapa do Mundo, Gráfico de Vendas
  - Últimos pedidos
  - Autenticação via token

### 10. Cadastros - Planos
- **File**: `10-cadastros-planos.md`
- **URL**: `/administracao/Planos/Planos/principal`
- **Key Features**:
  - Abas: Adesões, Upgrades, Renovações
  - Planos ativos:
    - Plano Afiliado (R$ 0,00, 9000 estoque)
    - Plano Avanço (R$ 997,00, 1001 estoque)
    - Plano Excelência (R$ 3.980,00, 2000 estoque)
  - Ações: Estoque, Logs, Remover, Editar

### 11. Cadastros - Tipo de Cliente
- **File**: `11-cadastros-tipo-cliente.md`
- **URL**: `/administracao/Distribuidor/DistribuidorTipoPessoa/listar`
- **Key Features**:
  - Tipos de cliente configurados:
    - Pessoa Física (CPF)
    - Pessoa Jurídica (CNPJ)
  - Ações: Editar, Remover

### 12. Ferramentas - Menu Structure
- **File**: `12-ferramentas-menu.md`
- **Submenus**:
  1. Habilitar Produtos Lojas
  2. Alterar usuário
  3. Alterar patrocinador
  4. Lançar Qualificação Manual
  5. Criar Pedido
  6. Ativação Mensal
  7. Movimentar Saldo
  8. Estoque
  9. Movimentar Saldo CD

### 13. Bônus
- **File**: `13-bonus.md`
- **URL**: `/administracao/Bonus/BonusUtilizados/listar`
- **Key Features**:
  - 8 bônus configurados (4 ativos, 4 desabilitados)
  - Bônus Ativos:
    - Bônus de Loja Online Acumulado (v4.0, BonusLinearV4)
    - Bônus total recebidos geral - Diretos (v4.0, BonusLinearV4)
    - Bônus de Qualificação Mensal (v3.0, BonusQualificacaoMensalV3)
    - Total de Bônus Recebidos - Indiretos (v4.0, BonusLinearV4)
  - Ações: Mudar configuração, Relatório, Log, Previsão, Executar Pagamento

### 14. Relatório de Bônus
- **File**: `14-relatorio-bonus.md`
- **URL**: `/administracao/Bonus/BonusAdministrador/bonusMes`
- **Key Features**:
  - Relatório mensal de bônus
  - Total pago (maio 2026): R$ 9.913,28
  - Distribuição:
    - Diretos: R$ 6.828,47 (68.9%)
    - Indiretos: R$ 3.084,81 (31.1%)
  - Navegação por período
  - Status: Pagos (verde), A Receber (azul), Perdidos (laranja)

### 15. Website - Elementos Site
- **File**: `15-website-elementos-site.md`
- **URL**: `/administracao/Temas/GerenciarConteudo/gerenciar/site`
- **Key Features**:
  - Gestão de todos os elementos do site
  - Tipos de elementos: Banner, Botão/Link, HTML LIVRE, HTML PURO, Imagem, MenuFlexivel, Postagem, Categoria de Postagem, FormularioContatoPorEmail
  - 8 categorias de postagens: DEPOIMENTOS, Diversos, Landing pages, Notícias, Oportunidade, Produtos, Quem Somos, Rodapé
  - Ações: Editar cada elemento individualmente

### 16. Website - Postagens
- **File**: `16-website-postagens.md`
- **URL**: `/administracao/Postagens/Configuracao`
- **Key Features**:
  - Gestão de categorias de postagens
  - 8 categorias configuradas: Diversos, Notícias, Landing pages, Rodapé, Produtos, DEPOIMENTOS, Quem Somos, Oportunidade
  - URLs amigáveis: https://allinbrasil.com.br/site/{slug}
  - Ações: Editar configuração, Gerenciar postagens

### 17. Website - Banners Site
- **File**: `17-website-banners-site.md`
- **URL**: `/administracao/Temas/Layout/configurarNo/280`
- **Key Features**:
  - Configuração de carrossel de banners do site principal
  - 7 banners configurados
  - Configurações: Loop, auto-pass, pause on hover, tempo (4 segundos)
  - Links mistos: site principal e loja virtual
  - Produtos específicos: product_id=358, 359, 360, 361

### 18. Website - Banner Loja
- **File**: `18-website-banner-loja.md`
- **URL**: `/administracao/Temas/Layout/configurarNo/23`
- **Key Features**:
  - Configuração de carrossel de banners da loja virtual
  - 8 banners configurados
  - Configurações: Loop, auto-pass, pause on hover, tempo (4 segundos)
  - Links focados em produtos: 7 banners para produtos, 1 para formulário de cadastro
  - Produtos específicos: product_id=358, 359, 360, 361, 362

## Menu Structure

### Main Menu
1. **Página Inicial** - Dashboard principal
2. **Distribuidores** (7 submenus)
   - Contas Bancárias
   - Verificação de Contas
   - Solicitação de saque
   - A Rede
   - Pendentes
   - Relatório de indicados
   - Excluidos
3. **Loja Virtual** - Sistema e-commerce externo
4. **Cadastros** (12 submenus)
   - Planos
   - Pedidos (com submenu)
   - Formas de Pagamento (com submenu)
   - Qualificação (com submenu)
   - Verificação Conta (com submenu)
   - Produtos/Planos (Campos)
   - Tipo de Cliente
   - Tipos Estado Civil
   - Produtos (com submenu)
   - Administradores
   - Contas Bancária (com submenu)
   - Campos Genéricos
5. **Ferramentas** (9 submenus)
   - Habilitar Produtos Lojas
   - Alterar usuário
   - Alterar patrocinador
   - Lançar Qualificação Manual
   - Criar Pedido
   - Ativação Mensal
   - Movimentar Saldo
   - Estoque
   - Movimentar Saldo CD
6. **Relatórios** (múltiplos submenus)
7. **Configurações** (submenus)
8. **Website** (4 submenus)
   - Elementos Site
   - Postagens
   - Banners site
   - Banner loja
9. **Bônus** - Gestão de bônus
10. **Relatório de Bônus** - Relatório mensal
11. **Marketing** (submenus)
12. **Treinamento Maxnível** - Link externo

## Key Business Entities

### Distribuidor
- ID, Usuário, Nome, E-mail, Patrocinador
- Endereço: Cidade, Estado, Bairro
- Telefone, Data de Nascimento
- Qualificação, Status
- Data de Cadastro

### Plano
- ID, Nome, Preço, Estoque
- Imagem Principal
- Status (Ativo/Inativo)
- Tipos: Adesão, Upgrade, Renovação

### Conta Bancária
- ID, Distribuidor, Banco, Agência, Conta
- Tipo, PIX, Status

### Solicitação de Saque
- ID, Distribuidor, Conta, Valor
- Taxa (~7.5%), Valor Líquido
- Status, Data

### Bônus
- ID, Nome, Descrição
- Versão, Classe
- Status (Ativo/Desabilitado)
- Tipos: Diretos, Indiretos, Loja Online, Qualificação

## UI/UX Patterns

### Common Patterns
1. **Table Structure**: Standard tables with sorting, filtering, pagination
2. **Export Options**: Excel, CSV, PDF
3. **Filter System**: "Adicionar Filtros" button with multiple filters
4. **Search**: Global search field
5. **Pagination**: Navigation with page numbers
6. **Actions per Row**: Edit, Delete, View buttons
7. **CSRF Protection**: Tokens in deletion URLs
8. **Breadcrumb Navigation**: Hierarchical breadcrumbs

### Dashboard Patterns
1. **KPI Cards**: Large cards with key metrics
2. **Charts**: Graphs for data visualization
3. **Recent Activity**: Tables showing recent transactions/activities
4. **Status Indicators**: Color-coded status badges
5. **Empty States**: "Nenhum dado encontrado" messages

### Modal Patterns
- Confirmation dialogs for destructive actions
- Detail views for complex entities
- Form modals for data entry

## Technical Observations

### Architecture
- **Monolithic Admin**: Main admin dashboard
- **Microservices**: Loja Virtual as separate system
- **Session-based Authentication**: Cookies for auth
- **CSRF Protection**: Tokens in URLs
- **Soft Delete**: Excluded records preserved

### URL Patterns
- `/administracao/{Module}/{Controller}/{Action}`
- `/administracao/{Module}/{Controller}/{Action}/{id}`
- Query parameters for filtering and pagination

### Data Volume
- 977 distribuidores ativos
- 340 distribuidores excluídos
- 240 patrocinadores
- 1.684 planos vendidos
- R$ 1.434.493,95 em bônus acumulados
- R$ 30,10M em vendas (loja virtual)

### Payment System
- **PIX**: Primary payment method for withdrawals
- **Tax Rate**: ~7.5% on withdrawals
- **Bonus System**: Multiple bonus types with different calculation methods
- **Monthly Cycles**: Monthly bonus payment cycles

## Endpoints Summary

### Distribuidores
- `/administracao/Distribuidor/DistribuidoresARede/listar`
- `/administracao/Distribuidor/DistribuidoresCadastroPendente/listar`
- `/administracao/Distribuidor/DistribuidoresCadastroExcluido/listar`
- `/administracao/Distribuidor/Patrocinador/relatorioIndicacoes`

### Contas Bancárias
- `/administracao/ContaBancaria/DistribuidorContaBancariaListagem/listar`

### Verificação de Contas
- `/administracao/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar`

### Solicitação de Saque
- `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar`

### Planos
- `/administracao/Planos/Planos/principal`
- `/administracao/Planos/Planos/adicionar`
- `/administracao/Planos/Planos/editar/{id}/adesao`
- `/administracao/Planos/Planos/remover/{id}/?{csrf_token}`
- `/administracao/Planos/Planos/estoque/{id}`
- `/administracao/Planos/Planos/logs/{id}`

### Tipo de Cliente
- `/administracao/Distribuidor/DistribuidorTipoPessoa/listar`
- `/administracao/Distribuidor/DistribuidorTipoPessoa/editar/{id}`
- `/administracao/Distribuidor/DistribuidorTipoPessoa/remover/{id}/?{csrf_token}`

### Bônus
- `/administracao/Bonus/BonusUtilizados/listar`
- `/administracao/Bonus/BonusAdministrador/bonusMes`
- `/administracao/BonusLinearV4/Configuracao/principal/{id}`
- `/administracao/BonusLinearV4/Relatorio/principal/{id}`
- `/administracao/BonusLinearV4/Log/principal/{id}`
- `/administracao/Bonus/BonusTituloDescricao/editar/{id}`

### Loja Virtual
- `https://allinbrasil.com.br/loja/admin/common/dashboard?token={token}`
- `https://allinbrasil.com.br/loja/admin/sale/order?token={token}`
- `https://allinbrasil.com.br/loja/admin/sale/customer?token={token}`

### Website
- `/administracao/Temas/GerenciarConteudo/gerenciar/site`
- `/administracao/Temas/Layout/configurarNo/{id}`
- `/administracao/Postagens/Configuracao`
- `/administracao/Postagens/Configuracao/adicionar`
- `/administracao/Postagens/Configuracao/editar/{id}`
- `/administracao/Postagens/Configuracao/gerenciar/{id}`
- `/administracao/Postagens/Postagens/editar/{categoria_id}/{postagem_id}`
- `/administracao/Postagens/Categorias/editar/{categoria_id}/{postagem_id}`

## Screenshots Captured
1. `dashboard-home.png`
2. `distribuidores-a-rede.png`
3. `contas-bancarias.png`
4. `verificacao-contas.png`
5. `solicitacao-saque.png`
6. `pendentes.png`
7. `relatorio-indicados.png`
8. `excluidos.png`
9. `loja-virtual.png`
10. `cadastros-planos.png`
11. `cadastros-tipo-cliente.png`
12. `bonus.png`
13. `website-elementos-site.png`
14. `website-postagens.png`
15. `website-banners-site.png`
16. `website-banner-loja.png`

## Completion Status

### Completed Sections
✅ Página Inicial
✅ Distribuidores (all 7 submenus)
✅ Loja Virtual
✅ Cadastros (Planos, Tipo de Cliente)
✅ Ferramentas (menu structure)
✅ Bônus
✅ Relatório de Bônus
✅ Website (all 4 submenus)

### Partially Documented
⚠️ Cadastros (remaining submenus: Pedidos, Formas de Pagamento, Qualificação, Verificação Conta, etc.)
⚠️ Ferramentas (individual pages not explored)
⚠️ Configurações (not explored)
⚠️ Relatórios (not explored)
⚠️ Marketing (not explored)

## Next Steps for Complete Documentation
1. Explore remaining Cadastros submenus
2. Explore individual Ferramentas pages
3. Explore Configurações section
4. Explore Relatórios section
5. Explore Marketing section
6. Document all modals and forms
7. Capture network requests for all actions
8. Document all validation rules
9. Create entity relationship diagrams

## Notes
- All documentation follows the user's requirement for detailed, exhaustive information
- No summarization or simplification of details
- All UI elements, tables, actions, endpoints documented
- Business entities and relationships identified
- UI/UX patterns analyzed
- Screenshots and Playwright snapshots captured for each page
