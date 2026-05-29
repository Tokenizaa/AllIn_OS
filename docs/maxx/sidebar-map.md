# Sidebar Menu Map - All-in Life Style Dashboard

## System Overview
- **System Name**: All-in Life Style
- **Version**: 3.6.0
- **Environment**: Homologação (Development)
- **Base URL**: https://allinbrasil.maxxmultinivel.com.br
- **Developer**: Maxx MLM

## Complete Sidebar Menu Hierarchy

### Main Navigation Structure

#### 1. Início (Dashboard)
- **URL**: `/administrador`
- **Icon**: 
- **Type**: Dashboard
- **Function**: Main dashboard with KPIs, charts, and summary tables
- **Permissions**: Admin access
- **Related Entities**: 
  - Cadastros (Users)
  - Pedidos (Orders)
  - Faturamento (Revenue)
  - Bônus (Bonuses)
  - Créditos (Credits)

**Dashboard Components**:
- Status Board with charts
- Ativações por Cadastro (Registration Activations Chart)
- Atividades (Activity Chart - Active/Inactive users)
- Faturamento Mensal (Monthly Revenue Chart)
- Resumo (Summary Table)
  - Total de Cadastros: 976
  - Total de Pedidos: 80
  - Total de Faturamento: R$ 97.727,78
  - Total de Cortesias (quantidade): 0
  - Total de Créditos Gerados: R$ 10.442,16
  - Total de Bônus Gerados: R$ 10.192,16
  - Total do Movimento (sem frete): R$ 96.914,59
  - Total de Cortesias: R$ 0,00
- Resumo Mensal (Monthly Summary)
  - Novos Cadastros: 0
  - Adesões: 0
  - Ativações no mês: 0
  - Ativos no mês: 0
  - Inativos no mês: 976
  - Último ID cadastrado: 1312
  - Total Cortesias: R$ 0,00
  - Faturamento: R$ 346,97
  - Total movimento (sem frete): R$ 235,59
  - Quantidade de faturas: 2
  - Bônus gerados: R$ 23,56
  - Créditos Gerados: R$ 0,00
  - Solicitações de pagamento (Efetuadas): R$ 0,00
  - Quantidade de Cortesias: 0

#### 2. Cadastros (Registrations)
- **URL**: `/administrador/cadastro`
- **Icon**: 
- **Type**: User Management
- **Function**: Manage user registrations and profiles
- **Permissions**: Admin access
- **Related Entities**: Users, Distribuidores, Afiliados, Clientes

**Page Structure**:
- **Title**: Consulta de Cadastros
- **Filters**:
  - ID (textbox)
  - Palavra Chave (textbox) - Busque por Login, Nome, Email ou CPF/CNPJ
  - Status (combobox) - Todos, Sim, Não
  - Nível (combobox) - Todos
- **Actions**:
  - Buscar (button)
  - Limpar Filtros (button)
- **Table**: Cadastros Encontrados
  - **Columns**: ID, Login, Nome, Estado, Nível, Ações
  - **Row Actions**:
    - Detalhes (view details)
    - Pedidos (view orders)
    - Observações do Cadastro (registration notes)
    - Logar Como (login as user)
    - Outras Ações (dropdown with additional actions)
  - **Pagination**: 15 records per page, total 976 records
  - **Status Indicators**: Ativo até: [date] for active users

**Endpoints**:
- POST `/administrador/cadastro/consultarcadastros` - Search registrations

#### 3. Pedidos (Orders)
- **URL**: `/administrador/faturasadmin`
- **Icon**: 
- **Type**: Order Management
- **Function**: Manage orders and invoices
- **Permissions**: Admin access
- **Related Entities**: Pedidos, Faturas, Produtos, Usuários

**Page Structure**:
- **Title**: Pedidos
- **Filters**:
  - Nº Pedido (textbox)
  - ID/Login (textbox) - ID Loja
  - ID Loja (textbox)
  - Mais Filtros (link) - expands additional filters
- **Actions**:
  - Buscar (button)
  - Limpar Filtros (button)
- **Table**: Pedidos Encontrados
  - **Columns**: Número, Usuário, Emissão, Data Baixa, Pagamento, Entrega, Ações
  - **Row Actions**:
    - Exibir Detalhes (view details)
    - Imprimir (print)
    - Exibir Bônus (view bonuses)
    - Upload comprovante (upload proof)
    - Pagar Fatura (pay invoice)
    - Outras Ações (dropdown)
  - **Status Filters**: Estornado, Cancelado, Aguardando, Vencido, Pago
  - **Pagination**: 15 records per page, total 39 orders
  - **Total Value**: R$ 33.097,21

**Endpoints**:
- POST `/administrador/faturasadmin/consultarfaturas` - Search orders

#### 4. Redes (Network)
- **URL**: `/administrador/rede`
- **Icon**: 
- **Type**: Network Visualization
- **Function**: View MLM network structure
- **Permissions**: Admin access
- **Related Entities**: Rede Linear, Distribuidores, Hierarquia

**Page Structure**:
- **Title**: Redes
- **Cards**:
  - Rede Linear
    - **URL**: `/backoffice/rede`
    - **Icon**: 
    - **Function**: Linear network tree visualization

**Rede Linear Page** (`/backoffice/rede`):
- **Title**: Rede Linear
- **Controls**:
  - Month selector (Maio 2026)
  - Tree view () / List view () toggle
  - Search: ID, Login ou Nome
- **Visualization**:
  - Tree structure with expandable nodes
  - User avatars with collapse/expand indicators
  - Level indicators (Nível 1, etc.)
  - Legend: CONSULTOR status icons
- **Endpoints**:
  - POST `/backoffice/rede/retornaredejson/mes/05/ano/2026` - Get network data

#### 5. Produtos (Products)
- **URL**: `/administrador/produtos`
- **Icon**: 
- **Type**: Product Management
- **Function**: Manage product catalog
- **Permissions**: Admin access
- **Related Entities**: Produtos, Categorias, Estoque

**Page Structure**:
- **Title**: Gerenciar Produtos
- **Actions**:
  - Opções (dropdown) - additional product options
  - Importação de produtos (link) - `/administrador/produtos/formimportacao`
- **Filters**:
  - Nome (textbox)
  - Categoria (combobox) - Todas
  - Ativo (combobox) - Todos
  - Recorrente (combobox) - Todos
  - Digital (combobox) - Todos
  - Ativo Loja Externa (combobox) - Todos
- **Actions**:
  - Buscar (button)
  - Limpar Filtros (button)
- **Table**: Produtos Encontrados
  - **Columns**: ID, Nome, Valor, Pontos, Estoque, Ações
  - **Row Actions**:
    - Editar Produto (edit product)
    - Marcar/Desmarcar destaque (toggle featured)
    - Excluir Produto (delete product)
  - **Legendas**: Ativo, Inativo, Recorrente, Digital
  - **Pagination**: 15 records per page, 4 pages
- **Product Categories**: Seja Distribuidor, Kits de Adesão, Roupas, Calçados
- **Product Types**: Plans (Plano Afiliado, Plano Avanço, Plano Excelência), Physical products

**Endpoints**:
- POST `/administrador/produtos/consultarprodutos` - Search products

#### 6. Relatórios (Reports)
- **URL**: `/administrador/relatorios`
- **Icon**: 
- **Type**: Reporting Module
- **Function**: Generate and view various reports
- **Permissions**: Admin access
- **Related Entities**: All system entities

**Report Categories**:

##### 6.1 Cadastrados (Registrations)
- **Afiliados / Distribuidores** (`/administrador/relatorios/clientes`)
  - **Filters**: Palavra Chave, Situação, De (date), Até (date)
  - **Table Columns**: ID, Nome, Patrocinador, Cidade, Estado, PF/PJ, CPF/CNPJ, RG, Situação, Email, Telefone
  - **Export**: Excel export available
  - **Endpoint**: POST `/administrador/relatorios/clientesgrid`

- **Informações da Equipe** (`/administrador/relatorios/aniversariantes`)
- **Clientes** (`/administrador/relatorios/clientesloja`)
- **Downlines** (`/administrador/relatorios/downlines`)
- **Desempenho da Rede** (`/administrador/relatorios/desempenhorede`)
- **Histórico de Ativações** (`/administrador/relatorios/historicoativacoes`)
- **Pontos Rede Linear** (`/administrador/relatorios/pontosredelinear`)
- **Pontos** (`/administrador/relatorios/pontos`)

##### 6.2 Bônus (Bonuses)
- **Gerencial de Bônus** (`/administrador/relatorios/gerencialbonus`)
- **Bônus Consolidado** (`/administrador/relatorios/gerencialbonusconsolidado`)

##### 6.3 Financeiro (Financial)
- **Créditos** (`/administrador/relatorios/creditos`)
- **Créditos Consolidado** (`/administrador/relatorios/creditosconsolidado`)
- **Créditos / Débitos** (`/administrador/relatorios/detalhamentocreditos`)
- **Solicitações de Saque** (`/administrador/relatorios/solicitacoesbonus`)
- **Faturamento Rede** (`/administrador/relatorios/faturamentorede`)
- **Histórico de Fechamento** (`/administrador/relatorios/fechamentos`)

##### 6.4 Vendas (Sales)
- **Vendas Pagas** (`/administrador/relatorios/vendaspagas`)
- **Vendas Loja** (`/administrador/relatorios/vendasonline`)
- **Vendas de Produtos** (`/administrador/relatorios/vendasprodutos`)
- **Vendas por Distribuidor - Consolidado** (`/administrador/relatorios/vendaspordistribuidor`)
- **Vendas por Distribuidor - Analítico** (`/administrador/relatorios/vendaspordistribuidoranalitico`)
- **Vendas por Estado** (`/administrador/relatorios/vendasporestado`)

##### 6.5 Produtos (Products)
- **Estoque** (`/administrador/relatorios/estoque`)

#### 7. Gerenciar Bônus (Manage Bonuses)
- **URL**: `/administrador/bonus`
- **Icon**: 
- **Type**: Bonus Management
- **Function**: Manage bonus calculations and payouts
- **Permissions**: Admin access
- **Related Entities**: Bônus, Saques, Fechamento

**Sub-modules**:
- **Solicitações de Saque** (`/administrador/bonus/solicitacoesbonus`)
  - **Title**: Solicitação de Saque
  - **Filters**:
    - ID Cadastro / ID CDR (textbox)
    - Banco (combobox) - Selecione
    - Mês (combobox) - Todos
    - Ano (combobox) - 2026
    - Situação (combobox) - Todas
    - Origem (combobox) - Todas
  - **Actions**: Buscar, Limpar Filtros
  - **Table**: Solicitações Encontradas
    - **Columns**: ID, Nome, CPF/CNPJ, Dados Bancários, Telefones, Valor, Data, Status, Ações
  - **Warning**: "Atenção administrador: Sempre verifique se a conta de destino possui a mesma titularidade do cadastro."
  - **Endpoint**: POST `/administrador/bonus/consultarsolicitacoesbonus`

- **Bônus Diários** (`/administrador/bonus/bonusdiarios`)
- **Bônus Mensais** (`/administrador/bonus/bonusmensais`)
- **Fechamento** (`/administrador/bonus/fechamento`)

#### 8. Gerenciar Banners (Manage Banners)
- **URL**: `/administrador/gerenciarconteudo/banners`
- **Icon**: 
- **Type**: Content Management
- **Function**: Manage promotional banners
- **Permissions**: Admin access
- **Related Entities**: Banners, Conteúdo

#### 9. Gerenciar Conteúdo (Manage Content)
- **URL**: `/administrador/gerenciarconteudo`
- **Icon**: 
- **Type**: Content Management
- **Function**: Manage site content
- **Permissions**: Admin access
- **Related Entities**: Conteúdo, Páginas

#### 10. Visitar Loja (Visit Store)
- **URL**: `/shopping`
- **Icon**: 
- **Type**: External Link
- **Function**: Navigate to e-commerce store
- **Permissions**: Public access
- **Related Entities**: Produtos, Carrinho, Pedidos

#### 11. Usuários (Users)
- **URL**: `/administrador/usuarios`
- **Icon**: 
- **Type**: User Administration
- **Function**: Manage admin users
- **Permissions**: Admin access
- **Related Entities**: Admin Users, Permissões

**Page Structure**:
- **Title**: Usuários Admin
- **Actions**: + Novo Usuário (link) - `/administrador/usuarios/form`
- **Table**:
  - **Columns**: Login, Nome, Email, Telefone, Perfil, Status, Ações
  - **Row Actions**:
    - Editar Senha (edit password)
    - Bloquear Usuário (block user)
  - **Total**: 2 users
  - **Users**:
    1. administrador - Administrador - administrador@mercadons.com.br - Admin - Ativo
    2. nettofariasapi - NettoFariasAPI - olfnetto@gmail.com - Api - Ativo

**Endpoints**:
- POST `/administrador/usuarios/consultarusuarios` - Search users

#### 12. Configurações (Settings)
- **URL**: `/administrador/configuracoes`
- **Icon**: 
- **Type**: System Configuration
- **Function**: Configure system settings
- **Permissions**: Admin access
- **Related Entities**: Empresa, Configurações, Pagamentos

**Configuration Sections**:

##### 12.1 Dados da Empresa (Company Data)
- **Fields**:
  - Titulo da Aplicação: All-in Life style
  - Nome da Empresa: All-in Life style
  - Razão Social: All In Brasil - Homologação
  - Email Comercial: contato@allinbrasil.com.br
  - CNPJ: 54.772.621/0001-12
  - Telefone Comercial: (51) 98904-2182
  - Email de suporte a chamados: suporte@allinbrasil.com.br

##### 12.2 Endereço da Sede (Headquarters Address)
- **Fields**:
  - CEP: 94668-030
  - Estado: Rio Grande do Sul
  - Cidade: Osório
  - Bairro: Porto Lacustre
  - Endereço: Rua da Igreja
  - Número: 346
  - Complemento: [empty]

##### 12.3 Endereço do Centro de Distribuição (Distribution Center Address)
- **Fields**:
  - Utilizar o mesmo da sede: Sim/Não toggle
  - Telefone Comercial: (51) 98904-2182

##### 12.4 Aparência do Sistema (System Appearance)
- **Fields**:
  - Logotipo (.png) - Upload functionality
  - Background do Login / Cadastro - Upload functionality
  - Logo na guia (Favicon) - Upload functionality
  - Cor do Sistema: #fdc838
- **Actions**:
  - Baixar imagens do sistema
  - Salvar

**Endpoints**:
- POST `/administrador/configuracoes/consultarfabricantesmarcas`
- POST `/administrador/configuracoes/consultarmodeloemail`
- POST `/administrador/configuracoes/consultarbancos`
- POST `/administrador/configuracoes/consultardadosbancarios`
- POST `/administrador/configuracoesparcelamento/form`
- POST `/administrador/configuracoes/consultarconfiguracoesparcelamento`
- POST `/administrador/configuracoes/consultartipopagamento`
- POST `/administrador/configuracoes/consultarbonus`
- GET `/backoffice/cadastro/retornaenderecoporcep?cep=94668-030`

#### 13. Bling
- **URL**: https://www.bling.com.br/login
- **Icon**: 
- **Type**: External Integration
- **Function**: Bling ERP integration
- **Permissions**: Admin access
- **Related Entities**: ERP Integration, Inventory

#### 14. Suporte de Tickets
- **URL**: http://suporte.mercadons.com.br/login.php
- **Icon**: 
- **Type**: External Support
- **Function**: Ticket support system
- **Permissions**: Admin access
- **Related Entities**: Suporte, Tickets

## Navigation Patterns

### User Profile
- **Location**: Top navigation bar
- **Display**: "Bem vindo(a), [User Name]"
- **Actions**: 
  - editar perfil - links to `/administrador/usuarios/index/id/[user_id]`
  - SAIR - links to `/login/logout`

### System Information
- **Version Display**: "Versão do sistema: 3.6.0"
- **Environment Indicator**: "Este é um servidor de homologação"

### Footer
- **Copyright**: © All-in Life style todos os direitos reservados.
- **Developer Credit**: Desenvolvido por Maxx MLM
- **Developer URL**: https://maxxmultinivel.com.br

## Menu Order and Grouping

### Primary Navigation (Top to Bottom)
1. Início (Dashboard)
2. Cadastros (User Management)
3. Pedidos (Order Management)
4. Redes (Network Visualization)
5. Produtos (Product Management)
6. Relatórios (Reports)
7. Gerenciar Bônus (Bonus Management)
8. Gerenciar Banners (Banner Management)
9. Gerenciar Conteúdo (Content Management)
10. Visitar Loja (Store)
11. Usuários (Admin Users)
12. Configurações (Settings)
13. Bling (External Integration)
14. Suporte de Tickets (Support)

### Logical Groupings
- **Core Operations**: Cadastros, Pedidos, Produtos
- **Network & MLM**: Redes, Gerenciar Bônus
- **Analytics**: Relatórios, Início
- **Administration**: Usuários, Configurações
- **Content**: Gerenciar Banners, Gerenciar Conteúdo
- **External**: Visitar Loja, Bling, Suporte de Tickets

## Permission Structure

### Admin Access
All menu items require admin access level. The system appears to have:
- **Admin role**: Full system access
- **Api role**: API access only (e.g., nettofariasapi)
- **User roles**: Regular distributor/affiliate access (backoffice)

### Apparent Permission Levels
1. **Administrator**: Full access to all admin modules
2. **API User**: Limited to API operations
3. **Distributor**: Access to backoffice and shopping
4. **Client**: Access to shopping only

## Icon Reference
- : Início/Home
- : Cadastros/Registrations
- : Pedidos/Orders
- : Redes/Network
- : Produtos/Products
- : Relatórios/Reports
- : Gerenciar Bônus/Manage Bonuses
- : Gerenciar Banners/Manage Banners
- : Gerenciar Conteúdo/Manage Content
- : Visitar Loja/Visit Store
- : Usuários/Users
- : Configurações/Settings
- : Bling (External)
- : Suporte de Tickets/Support

## Responsive Design
The sidebar appears to be a fixed navigation element that collapses on smaller screens (indicated by the  hamburger menu icon in the top navigation).
