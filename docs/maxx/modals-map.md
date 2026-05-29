# Modals Map - All-in Life Style Dashboard

## Overview
This document maps all modals observed in the system, including their structure, triggers, fields, and behaviors.

## 1. User Details Modal (Detalhes)

**Location**: `/administrador/cadastro` - Click "Detalhes" () action in Cadastros table
**Trigger**: Click on "Detalhes" icon in the Ações column of the Cadastros table
**Objective**: View comprehensive user information including personal data, network structure, and bonuses

### Modal Structure

#### Header
- **Close Button**: × (top right)
- **Title**: "Detalhes - {login}" (e.g., "Detalhes - murilo")

#### Tabs
1. **Resumo** (Summary)
2. **Dados Pessoais** (Personal Data)
3. **Uplines** (Sponsors)
4. **Downlines** (Team)
5. **Bônus** (Bonuses)

### Tab 1: Resumo (Summary)

#### User Summary Table
**Columns**:
- Login
- Loja
- Data Cadastro
- Saldo de Créditos
- Saldo de Pontos

**Example Data**:
- Login: murilo
- Loja: BRUNO ROSA DE CASTILHOS
- Data Cadastro: 06/04/2026 09:16:54
- Saldo de Créditos: 0,00
- Saldo de Pontos: 0,00

#### Network Indicators Section
**Title**: "Indicadores Rede Linear"

**Activities Table**:
- **Columns**: Atividades da Rede, Ativos, Inativos, Total
- **Rows**:
  - Diretos: 0 (Ativos), 0 (Inativos), 0 (Total)
  - Indiretos: 0 (Ativos), 0 (Inativos), 0 (Total)

**Points Table**:
- **Title**: "Pontuação Maio/2026" with calendar () and dropdown () icons
- **Columns**: Pontuação, Maio/2026  
- **Rows**:
  - PK : 0,00
  - PR : 0,00
  - PR-L : 0,00
  - TOTAL: 0,00
- **Sub-rows**:
  - VP : 0,00, 0,00, 0,00, 0,00
  - VG : 0,00, 0,00, 0,00, 0,00
  - Total : 0,00, 0,00, 0,00, 0,00

**Help Icons**:  (tooltip) on PK, PR, PR-L, VP, VG, Total

### Tab 2: Dados Pessoais (Personal Data)

#### Personal Information Table
**Columns**: Field Name, Value

**Fields**:
- Data de Cadastro: 06/04/2026 09:16:54
- Data Ativação: [empty]
- Nome Completo: Murilo Fontes
- Data de Nascimento: 20/03/1992
- CPF: 575.899.358-16
- Sexo: Não declarado
- Nacionalidade: Brasil

#### Address Table
**Fields**:
- CEP: 03951-020
- Estado: SP
- Cidade: São Paulo
- Bairro: Jardim Nove de Julho
- Endereço: Rua Tavares Guerreiro
- Número: 881
- Complemento: [empty]

#### Contact Table
**Fields**:
- Email: murilo.fontes@teste.com
- Telefone: [empty]
- Celular: (11) 90000-0000

### Tab 3: Uplines (Sponsors)

#### Uplines Table
**Title**: "Uplines Encontrados"

**Columns**:
- ID
- Login
- Nome
- Nível
- Ativo
- Ativo até

**Example Data**:
- 55 | 55 | BRUNO ROSA DE CASTILHOS | Excelência | Não | -
- 44 | 44 | BRUNA GOMES DA SILVA | Avanço | Não | 31/03/2026
- 34 | 34 | Andreia Casarim | Avanço | Não | 31/01/2026
- 2 | 2 | EMERSON COSTA DE ARAUJO | Excelência | Não | -
- 1 | allin | ALL IN BRASIL | Excelência | Sim | 28/02/2031

**Total**: 5 uplines

### Tab 4: Downlines (Team)

#### Downlines Report Section
**Title**: "Relatório de Downlines"

**Filters**:
- Login: (textbox)
- Nível: (combobox) - Selecione
- Rede: (combobox) - Rede Linear
- Buscar: (button)

#### Current User Table
**Columns**:
- ID
- Login
- Nome
- CPF
- Nível
- Ativo
- Qtd. Direitos
- Data Cadastro
- Última Ativação

**Example Data**:
- 1312 | murilo | Murilo Fontes | 575.899.358-16 | Cliente | Não | 0 | 06/04/2026 | [empty]

#### Downlines Table
**Title**: "Downlines" with Excel export ()

**Columns**:
- ID
- Login
- Nome
- Nível
- Quali.
- Geração
- Ativo
- Qtd. Direitos
- Data Cadastro
- Última Ativação

**Pagination**:
- Quantidade: 15 (dropdown)
- Total: 0 records

**Export**: `/backoffice/relatorios/downlinesgrid/id/1312/excel/1`

### Tab 5: Bônus (Bonuses)

#### Bonus Extract Section
**Title**: "Extrato de Bônus"

**Filters**:
- Tipo: (combobox) - Todos
- a partir de: (textbox) - appears to have "* Login:" prefix (likely a bug)
- até: (textbox)
- Buscar: (button)

#### Summary Section
**Title**: "Resumo"

**Pagination**:
- Quantidade: 15 (dropdown)

#### Summary Table
**Columns**:
- Bônus
- Valor

**Data**: "Nenhum bônus encontrado."
**Total**: R$ 0,00

#### Bonus Details Table
**Title**: "Bônus Encontrados"

**Columns**:
- Data
- Origem
- Tipo
- Pontos
- Geração
- Valor
- Saldo

**Data**: "Nenhum bônus encontrado."

### Modal Behavior

#### Opening
- Trigger: Click "Detalhes" () icon in Cadastros table
- Animation: Fade in
- Overlay: Semi-transparent background
- Position: Centered on screen
- Size: Large (approximately 800px width)

#### Closing
- Trigger: Click × button in header
- Animation: Fade out
- Background page: Remains visible

#### Tab Navigation
- Click tab name to switch
- Active tab highlighted
- Content updates without page reload
- Tab state preserved during modal session

#### Export
- Excel export available on Downlines tab
- URL: `/backoffice/relatorios/downlinesgrid/id/{user_id}/excel/1`
- Downloads filtered data

### Network Requests
- No specific network requests observed during modal opening
- Data likely loaded via AJAX when modal opens
- Tab content likely loaded on demand

### Fields and Validations

#### Read-Only Fields
- All fields in the modal are read-only
- No editing capabilities in this modal
- Separate modals likely exist for editing

#### Date Formats
- Data de Cadastro: DD/MM/YYYY HH:MM:SS
- Data de Nascimento: DD/MM/YYYY
- Ativo até: DD/MM/YYYY

#### Number Formats
- Saldo de Créditos: 0,00 (comma decimal separator)
- Saldo de Pontos: 0,00 (comma decimal separator)
- Currency: R$ X.XXX,XX

### Special Features

#### Help Icons
-  icons on PK, PR, PR-L, VP, VG, Total
- Likely show tooltips with explanations
- Not clicked during exploration

#### Date Picker
- Calendar icon () on Pontuação header
- Dropdown icon () on Pontuação header
- Likely allows date range selection for points

#### Export
- Excel export on Downlines tab
- Icon: 
- Downloads filtered data to Excel

### Empty States

#### No Data Messages
- "Nenhum bônus encontrado." (Bonus tab)
- "Nenhum registro encontrado." (Downlines table)
- Total: 0 (various tables)

#### Zero Values
- Saldo de Créditos: 0,00
- Saldo de Pontos: 0,00
- Ativos: 0
- Inativos: 0
- Total: 0

### Responsive Design
- Modal likely responsive (not tested on mobile)
- Tables likely scrollable on small screens
- Tabs likely stack on mobile

---

## 2. Other Modals (To Be Documented)

The following modals were identified but not yet explored:

### Product Edit Modal
- **Trigger**: Click "Editar Produto" () in Produtos table
- **Objective**: Edit product details
- **Fields**: To be documented
- **Validations**: To be documented

### Product Delete Confirmation Modal
- **Trigger**: Click "Excluir Produto" () in Produtos table
- **Objective**: Confirm product deletion
- **Fields**: Confirmation message
- **Actions**: Confirm, Cancel

### Order Details Modal
- **Trigger**: Click "Exibir Detalhes" () in Pedidos table
- **Objective**: View order details
- **Fields**: Order information, items, payment details
- **Actions**: Print, view bonuses, etc.

### Order Payment Modal
- **Trigger**: Click "Pagar Fatura" in Pedidos table
- **Objective**: Mark invoice as paid
- **Fields**: Payment information
- **Actions**: Confirm, Cancel

### Bonus Details Modal
- **Trigger**: Click "Exibir Bônus" () in Pedidos table
- **Objective**: View bonus details for order
- **Fields**: Bonus breakdown
- **Actions**: Close

### Upload Proof Modal
- **Trigger**: Click "Upload comprovante" or "Nenhum comprovante anexado"
- **Objective**: Upload payment proof
- **Fields**: File upload
- **Actions**: Upload, Cancel

### User Password Edit Modal
- **Trigger**: Click "Editar Senha" () in Usuários table
- **Objective**: Change user password
- **Fields**: New password, confirm password
- **Validations**: Password strength, match
- **Actions**: Save, Cancel

### User Block Confirmation Modal
- **Trigger**: Click "Bloquear Usuário" () in Usuários table
- **Objective**: Confirm user blocking
- **Fields**: Confirmation message
- **Actions**: Confirm, Cancel

### New User Modal
- **Trigger**: Click "+ Novo Usuário" in Usuários page
- **Objective**: Create new admin user
- **Fields**: Login, name, email, phone, profile, password
- **Validations**: Unique login, unique email, valid email, strong password
- **Actions**: Save, Cancel

### Registration Notes Modal
- **Trigger**: Click "Observações do Cadastro" () in Cadastros table
- **Objective**: View/add registration notes
- **Fields**: Notes list, new note input
- **Actions**: Add note, delete note, close

### "Outras Ações" Dropdown Modal
- **Trigger**: Click "Outras Ações" dropdown in Cadastros table
- **Objective**: Additional user actions
- **Options**: To be documented
- **Actions**: Various (to be documented)

### Configuration Save Confirmation Modal
- **Trigger**: Click "Salvar" in Configurações page
- **Objective**: Confirm configuration changes
- **Fields**: Summary of changes
- **Actions**: Confirm, Cancel

### Image Upload Modal
- **Trigger**: Click "Adicionar Logotipo", "Adicionar Background", or "Adicionar Favicon"
- **Objective**: Upload system images
- **Fields**: File upload, preview
- **Validations**: File type, file size
- **Actions**: Upload, Cancel, Delete (if existing)

---

## Modal Patterns

### Common Modal Structure

#### Header
- Close button (×) in top right
- Title indicating modal purpose
- Optional subtitle or description

#### Body
- Tabbed interface (for complex modals)
- Form fields (for input modals)
- Tables (for data display modals)
- Sections with headings and separators

#### Footer
- Action buttons (Save, Cancel, Confirm, etc.)
- Right-aligned buttons
- Primary action on right
- Secondary action on left

### Modal Types

#### View-Only Modals
- User Details Modal
- Order Details Modal
- Bonus Details Modal
- Registration Notes Modal

**Characteristics**:
- Read-only data display
- No editing capabilities
- Export functionality
- Tabbed navigation

#### Edit Modals
- Product Edit Modal
- User Password Edit Modal
- Configuration Edit Modal

**Characteristics**:
- Form fields for editing
- Validation on submit
- Save/Cancel actions
- Error handling

#### Confirmation Modals
- Product Delete Confirmation
- User Block Confirmation
- Configuration Save Confirmation

**Characteristics**:
- Warning message
- Confirm/Cancel actions
- No form fields
- Destructive action warning

#### Upload Modals
- Image Upload Modal
- Proof Upload Modal

**Characteristics**:
- File upload field
- Preview for images
- File type validation
- File size validation
- Upload/Cancel actions

### Modal Behaviors

#### Opening
- Triggered by button click or action
- Fade-in animation
- Overlay background
- Centered positioning
- Responsive sizing

#### Closing
- Triggered by close button, cancel button, or escape key
- Fade-out animation
- Overlay removal
- Return to previous state

#### Tab Navigation
- Click tab to switch content
- Active tab highlighted
- Content updates without reload
- Tab state preserved

#### Form Submission
- Client-side validation
- AJAX submission
- Loading indicator
- Success/error feedback
- Modal close on success

### Validation Patterns

#### Client-Side Validation
- Required field validation
- Format validation (email, phone, CPF/CNPJ)
- Length validation
- Match validation (password confirmation)

#### Server-Side Validation
- Business rule validation
- Data integrity validation
- Security validation
- Error message display

### Error Handling

#### Inline Errors
- Error message below field
- Red border on field
- Error icon (if applicable)

#### Modal-Level Errors
- Error message at top of modal
- Summary of errors
- Highlighted fields

#### Network Errors
- Error message displayed
- Retry option
- Modal remains open

### Responsive Design

#### Mobile Adaptations
- Full-width modals
- Stacked fields
- Touch-friendly buttons
- Scrollable content

#### Tablet Adaptations
- Optimized width
- Two-column layouts
- Touch-friendly controls

#### Desktop Optimizations
- Fixed width (typically 600-800px)
- Multi-column layouts
- Hover effects

### Accessibility

#### Keyboard Navigation
- Tab through modal elements
- Enter to submit
- Escape to close
- Focus trap within modal

#### Screen Reader Support
- ARIA labels
- Role attributes
- Live regions for errors
- Focus announcements

#### Focus Management
- Focus on first element when opened
- Focus return to trigger when closed
- Visible focus indicators

### Loading States

#### Button Loading
- Spinner icon
- Disabled state
- Text change

#### Content Loading
- Loading spinner
- Skeleton loading
- Progress indicator

---

## Modal Triggers

### Table Action Buttons
- Detalhes () - View details modal
- Editar () - Edit modal
- Excluir () - Delete confirmation modal
- Exibir Detalhes () - View details modal
- Exibir Bônus () - Bonus details modal
- Editar Senha () - Password edit modal
- Bloquear () - Block confirmation modal

### Page-Level Buttons
- + Novo Usuário - New user modal
- + Novo Produto - New product modal
- Importação de produtos - Import modal
- Adicionar Logotipo - Image upload modal
- Adicionar Background - Image upload modal
- Adicionar Favicon - Image upload modal

### Dropdown Actions
- Outras Ações - Additional actions modal
- Mais Filtros - Advanced filters modal

---

## Modal Data Loading

### AJAX Loading
- Data loaded when modal opens
- Tab content loaded on demand
- No page reload
- Loading indicators

### Pre-loaded Data
- Some data pre-loaded in page
- Modal displays cached data
- Refresh button available (if applicable)

### Lazy Loading
- Large datasets loaded in chunks
- Pagination within modal
- Load more on scroll (if applicable)

---

## Modal Export Functionality

### Excel Export
- Export icon ()
- URL-based export
- Filtered data export
- Downloads file to browser

### Print Functionality
- Print icon ()
- Browser print dialog
- Optimized print layout

---

## Modal Security

### CSRF Protection
- CSRF token in forms
- Token validation on submit

### Permission Checks
- User permissions verified
- Admin-only modals
- Role-based access

### Data Validation
- Server-side validation
- Input sanitization
- SQL injection prevention

---

## Modal Performance

### Optimization
- Lazy loading of content
- Caching of data
- Debounced search (if applicable)
- Virtual scrolling for large lists

### Monitoring
- Modal open/close events tracked
- Form submission events tracked
- Error rates monitored
- Performance metrics collected

---

## Notes

- Only User Details Modal has been fully documented
- Other modals identified but not yet explored
- Modal patterns consistent across system
- All modals follow similar structure and behavior
- Additional modals to be documented in future exploration
