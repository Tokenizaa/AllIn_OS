# Tables Map - All-in Life Style Dashboard

## Overview
This document maps all data tables observed in the system, including their columns, filters, actions, and behaviors.

## 1. Cadastros Table (Registrations)

**Location**: `/administrador/cadastro`
**Logical Name**: Consulta de Cadastros
**Purpose**: Display and manage user registrations

### Columns
- **ID**: Integer - Unique user identifier
- **Login**: String - Username
- **Nome**: String - Full name (may include activation date)
- **Estado**: String - Brazilian state abbreviation (SP, AM, SC, etc.)
- **Nível**: String - User level (Cliente, Avanço, etc.)
- **Ações**: Action buttons

### Filters
- **ID**: Textbox - Search by user ID
- **Palavra Chave**: Textbox - Search by Login, Nome, Email, or CPF/CNPJ
- **Status**: Combobox - Filter by activation status (Todos, Sim, Não)
- **Nível**: Combobox - Filter by user level (Todos, etc.)

### Pagination
- **Records per page**: 15
- **Total records**: 976
- **Page navigation**: 1-10 pages visible, with next/prev buttons
- **URL pattern**: `/administrador/cadastro/consultarcadastros/page/{page}`

### Row Actions
- **Detalhes** (): View user details
- **Pedidos** (): View user's orders
- **Observações do Cadastro** (): View/add registration notes
- **Logar Como** (): Login as this user
- **Outras Ações** (dropdown): Additional actions (to be explored)

### Status Indicators
- Active users show: "Ativo até: DD/MM/YYYY"
- Inactive users show no date
- Level displayed in Nível column

### Sorting
- Default sort: ID descending
- Clickable headers for sorting (to be verified)

### Export
- Not visible on this table (may exist in reports)

### Bulk Actions
- Not visible on this table

---

## 2. Pedidos Table (Orders)

**Location**: `/administrador/faturasadmin`
**Logical Name**: Pedidos Encontrados
**Purpose**: Display and manage orders/invoices

### Columns
- **Número**: Integer - Order number
- **Usuário**: String - User login/ID (format: ID-login)
- **Emissão**: Date - Order creation date (DD/MM/YYYY)
- **Data Baixa**: Date - Payment confirmation date (DD/MM/YYYY)
- **Pagamento**: Composite - Amount and payment method
  - Value: R$ X.XXX,XX
  - Method: Transferência Bancária / PIX, Boleto em 3x, Parcelamento Pix em 5x, PagSeguro
- **Entrega**: String - Delivery status (e.g., "Preparando Pedido")
- **Ações**: Action buttons

### Filters
- **Nº Pedido**: Textbox - Search by order number
- **ID/Login**: Textbox - Search by user ID or login
- **ID Loja**: Textbox - Search by store ID
- **Mais Filtros**: Link - Expands additional filters (to be explored)

### Status Filters (Quick Filters)
- **Estornado**: Refunded orders
- **Cancelado**: Cancelled orders
- **Aguardando**: Pending orders
- **Vencido**: Overdue orders
- **Pago**: Paid orders

### Pagination
- **Records per page**: 15
- **Total records**: 39
- **Total value**: R$ 33.097,21
- **Page navigation**: 1-3 pages visible
- **URL pattern**: `/administrador/faturasadmin/consultarfaturas/page/{page}`

### Row Actions
- **Exibir Detalhes** (): View order details
- **Imprimir** (): Print order
- **Exibir Bônus** (): View generated bonuses
- **Upload comprovante** (): Upload payment proof
- **Nenhum comprovante anexado** (): Upload payment proof (when none attached)
- **Pagar Fatura** (): Mark invoice as paid (only for pending orders)
- **Outras Ações** (dropdown): Additional actions (to be explored)

### Sorting
- Clickable headers: Número, Usuário, Emissão, Data Baixa, Pagamento, Entrega
- Default sort: Número descending

### Export
- Not visible on this table

### Bulk Actions
- Not visible on this table

### Special Features
- Payment amount and method combined in one cell
- Delivery status displayed as text
- Conditional actions based on order status

---

## 3. Produtos Table (Products)

**Location**: `/administrador/produtos`
**Logical Name**: Produtos Encontrados
**Purpose**: Display and manage product catalog

### Columns
- **ID**: Integer - Product ID
- **Nome**: Composite - Product name and category
  - Product name
  - Category name (e.g., Seja Distribuidor, Kits de Adesão, Roupas, Calçados)
- **Valor**: Currency - Sale price (R$ X.XXX,XX)
- **Pontos**: Decimal - MLM points value (0.00 for non-qualifying products)
- **Estoque**: Integer - Available quantity (- for unlimited/digital)
- **Ações**: Action buttons

### Filters
- **Nome**: Textbox - Search by product name
- **Categoria**: Combobox - Filter by category (Todas, Seja Distribuidor, Kits de Adesão, Roupas, Calçados)
- **Ativo**: Combobox - Filter by active status (Todos, Ativo, Inativo)
- **Recorrente**: Combobox - Filter by recurring status (Todos, Sim, Não)
- **Digital**: Combobox - Filter by digital status (Todos, Sim, Não)
- **Ativo Loja Externa**: Combobox - Filter by external store status (Todos, Sim, Não)

### Legendas (Status Indicators)
- **Ativo**: Active product
- **Inativo**: Inactive product
- **Recorrente**: Recurring product
- **Digital**: Digital product

### Pagination
- **Records per page**: 15
- **Total pages**: 4
- **Page navigation**: 1-4 pages visible
- **URL pattern**: `/administrador/produtos/consultarprodutos/page/{page}`

### Row Actions
- **Editar Produto** (): Edit product details
- **Marcar como destaque** (): Mark as featured (for non-featured products)
- **Desmarcar destaque** (): Remove featured status (for featured products)
- **Excluir Produto** (): Delete product (not available for MLM plans)

### Sorting
- Default sort: ID ascending
- Clickable headers (to be verified)

### Export
- Not visible on this table

### Bulk Actions
- Not visible on this table

### Special Features
- Product name and category combined in one cell
- Points value empty for non-qualifying products
- Stock shows "-" for unlimited/digital products
- Delete action not available for core MLM plans (IDs 1-3)
- Featured status toggle (star icon)

---

## 4. Usuários Admin Table (Admin Users)

**Location**: `/administrador/usuarios`
**Logical Name**: Usuários Admin
**Purpose**: Display and manage admin users

### Columns
- **Login**: String - Username
- **Nome**: String - Full name
- **Email**: String - Email address
- **Telefone**: String - Phone number (---- if not provided)
- **Perfil**: String - User role (Admin, Api)
- **Status**: String - Account status (Ativo)
- **Ações**: Action buttons

### Filters
- No visible filters on this table

### Pagination
- No pagination (small dataset)
- **Total records**: 2

### Row Actions
- **Editar Senha** (): Edit user password
- **Bloquear Usuário** (): Block/unblock user

### Sorting
- No visible sorting

### Export
- Not visible on this table

### Bulk Actions
- Not visible on this table

### Special Features
- Very small dataset (admin users only)
- Profile column shows user role
- Status column shows active/blocked status
- Phone shows "----" if not provided

---

## 5. Relatório de Afiliados/Distribuidores Table

**Location**: `/administrador/relatorios/clientes`
**Logical Name**: Resultado
**Purpose**: Report of affiliates/distributors

### Columns
- **ID**: Integer - User ID
- **Nome**: String - Full name
- **Patrocinador**: String - Sponsor name
- **Cidade**: String - City name
- **Estado**: String - State abbreviation
- **PF / PJ**: String - Person type (PF or PJ)
- **CPF / CNPJ**: String - Tax ID
- **RG**: String - Identity document
- **Situação**: String - Status
- **Email**: String - Email address
- **Telefone**: String - Phone number

### Filters
- **Palavra Chave**: Textbox - Search term
- **Situação**: Combobox - Filter by status (Todos, etc.)
- **De**: Date - Start date (default: 01/05/2026)
- **Até**: Date - End date (default: 27/05/2026)

### Pagination
- **Records per page**: 15
- **Quantity selector**: Dropdown (15, 30, 50, 100)
- **Total records**: 0 (no data in current view)

### Row Actions
- No visible row actions (report table)

### Sorting
- Clickable headers (to be verified)

### Export
- **Excel Export** (): Export to Excel
- **URL**: `/administrador/relatorios/clientesgrid/excel/1`

### Bulk Actions
- Not visible on this table

### Special Features
- Report table (read-only)
- Date range filters default to current month
- Excel export available
- No row actions (report view)

---

## 6. Solicitações de Saque Table (Withdrawal Requests)

**Location**: `/administrador/bonus/solicitacoesbonus`
**Logical Name**: Solicitações Encontradas
**Purpose**: Display and manage withdrawal requests

### Columns
- **ID**: Integer - Request ID
- **Nome**: String - User name
- **CPF / CNPJ**: String - Tax ID
- **Dados Bancários**: Composite - Bank account information
- **Telefones**: String - Phone numbers
- **Valor**: Currency - Withdrawal amount
- **Data**: Date - Request date
- **Status**: String - Request status
- **Ações**: Action buttons

### Filters
- **ID Cadastro / ID CDR**: Textbox - Search by user ID
- **Banco**: Combobox - Filter by bank (Selecione, etc.)
- **Mês**: Combobox - Filter by month (Todos, etc.)
- **Ano**: Combobox - Filter by year (2026, etc.)
- **Situação**: Combobox - Filter by status (Todas, etc.)
- **Origem**: Combobox - Filter by origin (Todas, etc.)

### Pagination
- Not visible (no data in current view)

### Row Actions
- To be explored (no data visible)

### Sorting
- Clickable headers (to be verified)

### Export
- Not visible on this table

### Bulk Actions
- Not visible on this table

### Special Features
- Warning message: "Atenção administrador: Sempre verifique se a conta de destino possui a mesma titularidade do cadastro."
- Bank dropdown shows error (undefined variable - likely configuration issue)
- No data in current view

---

## 7. Dashboard Summary Tables

### Resumo Table (Summary)
**Location**: `/administrador` (Dashboard)
**Logical Name**: Resumo
**Purpose**: Display overall system statistics

#### Table 1: Registration & Order Summary
- **Total de Cadastros**: 976
- **Total de Pedidos**: 80
- **Total de Faturamento**: R$ 97.727,78
- **Total de Cortesias (quantidade)**: 0

#### Table 2: Financial Summary
- **Total de Créditos Gerados**: R$ 10.442,16
- **Total de Bônus Gerados**: R$ 10.192,16
- **Total do Movimento (sem frete)**: R$ 96.914,59
- **Total de Cortesias**: R$ 0,00

### Resumo Mensal Table (Monthly Summary)
**Location**: `/administrador` (Dashboard)
**Logical Name**: Resumo Mensal Maio/2026
**Purpose**: Display monthly statistics

#### Table 1: Monthly Registration Summary
- **Novos Cadastros**: 0
- **Adesões**: 0
- **Ativações no mês**: 0
- **Ativos no mês**: 0
- **Inativos no mês**: 976
- **Último ID cadastrado**: 1312
- **Total Cortesias**: R$ 0,00

#### Table 2: Monthly Financial Summary
- **Faturamento**: R$ 346,97
- **Total movimento (sem frete)**: R$ 235,59
- **Quantidade de faturas**: 2
- **Bônus gerados**: R$ 23,56
- **Créditos Gerados**: R$ 0,00
- **Solicitações de pagamento (Efetuadas)**: R$ 0,00
- **Quantidade de Cortesias**: 0

### Special Features
- Read-only summary tables
- Date selector for monthly summary (Maio/2026)
- Calendar icon () for date selection
- Dropdown icon () for month selection
- No pagination or filters
- Real-time data from dashboard endpoint

---

## Table Patterns and Behaviors

### Common Patterns

#### 1. Standard Data Table Structure
- Header row with column names
- Data rows with alternating colors (to be verified)
- Footer row with totals/count
- Pagination controls at bottom
- Filters above table
- Actions in last column

#### 2. Action Buttons Pattern
- Icons used for actions (, , , , , , , etc.)
- Tooltips on hover (to be verified)
- Dropdown for "Outras Ações" (More Actions)
- Conditional visibility based on row status

#### 3. Pagination Pattern
- "Quantidade" dropdown for records per page (15, 30, 50, 100)
- Page numbers (1, 2, 3, etc.)
- Previous/Next buttons (, )
- Total records displayed in footer
- URL-based pagination

#### 4. Filter Pattern
- Textbox for text search
- Combobox for dropdown filters
- Date range filters (De/Até)
- "Buscar" button to apply filters
- "Limpar Filtros" button to reset
- Quick filters (checkboxes or links)

#### 5. Status Indicators
- Text badges for status
- Color coding (to be verified)
- Icons for featured items (, )
- Date displays for time-sensitive status

#### 6. Export Pattern
- Excel export icon ()
- Export button in header
- URL-based export
- Filtered data export

### Table Behaviors

#### Loading States
- Loading spinner (to be observed)
- Skeleton screens (to be observed)
- "Nenhum registro encontrado" message for empty results

#### Empty States
- "Nenhum registro encontrado" message
- "Nenhuma solicitação encontrada" message
- No data placeholder (to be observed)

#### Error States
- Error messages for failed operations (to be observed)
- Validation error display (to be observed)

#### Sorting
- Clickable headers for sorting
- Sort indicators (to be verified)
- Multi-column sorting (to be verified)

#### Selection
- Checkbox selection (to be observed)
- Select all functionality (to be observed)
- Bulk actions based on selection (to be observed)

### Responsive Design
- Horizontal scroll for wide tables (to be verified)
- Collapsible columns on mobile (to be verified)
- Card view on mobile (to be verified)

### Accessibility
- ARIA labels (to be verified)
- Keyboard navigation (to be verified)
- Screen reader support (to be verified)

## Table Customization

### Column Visibility
- Column show/hide (to be observed)
- Custom column order (to be observed)
- Saved column preferences (to be observed)

### Table Views
- Table view (default)
- Grid view (to be observed)
- Card view (to be observed)

### Advanced Features
- Inline editing (to be observed)
- Row expansion (to be observed)
- Drag and drop (to be observed)
- Copy to clipboard (to be observed)

## Performance Considerations

### Lazy Loading
- Pagination for large datasets
- Infinite scroll (to be observed)
- Virtual scrolling (to be observed)

### Caching
- Client-side caching (to be verified)
- Server-side caching (to be verified)
- Cache invalidation (to be observed)

### Optimization
- Debounced search (to be verified)
- Optimized queries (to be verified)
- Indexed columns (to be verified)

## Security

### Data Masking
- Partial CPF/CNPJ display (to be verified)
- Masked sensitive data (to be verified)
- Role-based column visibility (to be verified)

### Row-Level Security
- User can only see their data (to be verified)
- Admin can see all data (confirmed)
- Data filtering based on permissions (to be verified)
