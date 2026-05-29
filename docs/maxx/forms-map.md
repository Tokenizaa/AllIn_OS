# Forms Map - All-in Life Style Dashboard

## Overview
This document maps all forms observed in the system, including their fields, validations, and behaviors.

## 1. Login Form

**Location**: `/shopping/login`
**Purpose**: User authentication

### Fields
- **Login** (textbox)
  - **Label**: "Login:"
  - **Type**: Text
  - **Required**: Yes
  - **Placeholder**: Not specified
  - **Validation**: Username exists, password matches
  - **Mask**: None

- **Senha** (textbox)
  - **Label**: "Senha:"
  - **Type**: Password
  - **Required**: Yes
  - **Placeholder**: Not specified
  - **Validation**: Password matches
  - **Mask**: None
  - **Toggle visibility**: Yes ( icon)

- **reCAPTCHA**
  - **Type**: Invisible reCAPTCHA
  - **Required**: Yes
  - **Site Key**: 6Lf7MJ4pAAAAAFpUQo1ycSoVxW67vZ5SvIpgw1LI
  - **Validation**: reCAPTCHA token validation

### Buttons
- **Entrar** (button)
  - **Type**: Submit
  - **Action**: POST to `/login/processnew`
  - **Loading state**: Not observed

- **Esqueci minha senha** (link)
  - **Action**: Navigate to password reset (href="#")
  - **Status**: Not implemented (href="#")

### Validation Messages
- Not observed (likely inline or toast notifications)

### Submit Flow
1. User enters login and password
2. reCAPTCHA validates
3. Form submits to `/login/processnew`
4. On success: Redirect to dashboard or backoffice
5. On failure: Display error message

### Error Handling
- Invalid credentials: Error message (to be observed)
- reCAPTCHA failure: Error message (to be observed)

---

## 2. Cadastros Search Form (Registration Search)

**Location**: `/administrador/cadastro`
**Purpose**: Search and filter user registrations

### Fields
- **ID** (textbox)
  - **Label**: "ID:"
  - **Type**: Number
  - **Required**: No
  - **Placeholder**: Not specified
  - **Validation**: Numeric value
  - **Mask**: None

- **Palavra Chave** (textbox)
  - **Label**: "Palavra Chave:"
  - **Type**: Text
  - **Required**: No
  - **Placeholder**: "Busque por Login, Nome, Email ou CPF/CNPJ"
  - **Validation**: None
  - **Mask**: None

- **Status** (combobox)
  - **Label**: "Status:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todos, Sim, Não
  - **Default**: Todos
  - **Validation**: None

- **Nível** (combobox)
  - **Label**: "Nível:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todos, [various levels]
  - **Default**: Todos
  - **Validation**: None

### Buttons
- **Buscar** (button)
  - **Type**: Submit
  - **Action**: POST to `/administrador/cadastro/consultarcadastros`
  - **Loading state**: Not observed

- **Limpar Filtros** (button)
  - **Type**: Reset
  - **Icon**: 
  - **Action**: Reset form to default values
  - **Loading state**: Not observed

### Validation Messages
- Not observed (likely inline validation)

### Submit Flow
1. User fills search criteria
2. Clicks "Buscar"
3. Form submits via AJAX
4. Table updates with results
5. Pagination resets to page 1

### Error Handling
- Invalid input: Inline error (to be observed)
- No results: "Nenhum registro encontrado" message

---

## 3. Pedidos Search Form (Orders Search)

**Location**: `/administrador/faturasadmin`
**Purpose**: Search and filter orders

### Fields
- **Nº Pedido** (textbox)
  - **Label**: "Nº Pedido:"
  - **Type**: Number
  - **Required**: No
  - **Placeholder**: "Nº Pedido:"
  - **Validation**: Numeric value
  - **Mask**: None

- **ID/Login** (textbox)
  - **Label**: "ID/Login:"
  - **Type**: Text
  - **Required**: No
  - **Placeholder**: "ID/Login: ID Loja:"
  - **Validation**: None
  - **Mask**: None

- **ID Loja** (textbox)
  - **Label**: "ID Loja:"
  - **Type**: Number
  - **Required**: No
  - **Placeholder**: Not specified
  - **Validation**: Numeric value
  - **Mask**: None

- **Mais Filtros** (link)
  - **Label**: "Mais Filtros"
  - **Icon**: 
  - **Action**: Expand additional filters (modal or accordion)
  - **Status**: To be explored

### Buttons
- **Buscar** (button)
  - **Type**: Submit
  - **Action**: POST to `/administrador/faturasadmin/consultarfaturas`
  - **Loading state**: Not observed

- **Limpar Filtros** (button)
  - **Type**: Reset
  - **Icon**: 
  - **Action**: Reset form to default values
  - **Loading state**: Not observed

### Quick Filters (Checkbox Links)
- **Estornado**: Filter by refunded orders
- **Cancelado**: Filter by cancelled orders
- **Aguardando**: Filter by pending orders
- **Vencido**: Filter by overdue orders
- **Pago**: Filter by paid orders

### Validation Messages
- Not observed (likely inline validation)

### Submit Flow
1. User fills search criteria
2. Clicks "Buscar" or quick filter
3. Form submits via AJAX
4. Table updates with results
5. Pagination resets to page 1

### Error Handling
- Invalid input: Inline error (to be observed)
- No results: "Nenhum registro encontrado" message

---

## 4. Produtos Search Form (Products Search)

**Location**: `/administrador/produtos`
**Purpose**: Search and filter products

### Fields
- **Nome** (textbox)
  - **Label**: "Nome:"
  - **Type**: Text
  - **Required**: No
  - **Placeholder**: "Nome:"
  - **Validation**: None
  - **Mask**: None

- **Categoria** (combobox)
  - **Label**: "Categoria:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todas, Seja Distribuidor, Kits de Adesão, Roupas, Calçados
  - **Default**: Todas
  - **Validation**: None

- **Ativo** (combobox)
  - **Label**: "Ativo:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todos, Sim, Não
  - **Default**: Todos
  - **Validation**: None

- **Recorrente** (combobox)
  - **Label**: "Recorrente:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todos, Sim, Não
  - **Default**: Todos
  - **Validation**: None

- **Digital** (combobox)
  - **Label**: "Digital:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todos, Sim, Não
  - **Default**: Todos
  - **Validation**: None

- **Ativo Loja Externa** (combobox)
  - **Label**: "Ativo Loja Externa:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todos, Sim, Não
  - **Default**: Todos
  - **Validation**: None

### Buttons
- **Buscar** (button)
  - **Type**: Submit
  - **Action**: POST to `/administrador/produtos/consultarprodutos`
  - **Loading state**: Not observed

- **Limpar Filtros** (button)
  - **Type**: Reset
  - **Icon**: 
  - **Action**: Reset form to default values
  - **Loading state**: Not observed

### Validation Messages
- Not observed (likely inline validation)

### Submit Flow
1. User fills search criteria
2. Clicks "Buscar"
3. Form submits via AJAX
4. Table updates with results
5. Pagination resets to page 1

### Error Handling
- Invalid input: Inline error (to be observed)
- No results: "Nenhum registro encontrado" message

---

## 5. Relatório de Afiliados/Distribuidores Form

**Location**: `/administrador/relatorios/clientes`
**Purpose**: Generate affiliates/distributors report

### Fields
- **Palavra Chave** (textbox)
  - **Label**: "Palavra Chave:"
  - **Type**: Text
  - **Required**: No
  - **Placeholder**: "Palavra Chave:"
  - **Validation**: None
  - **Mask**: None

- **Situação** (combobox)
  - **Label**: "Situação:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todos, [various statuses]
  - **Default**: Todos
  - **Validation**: None

- **De** (textbox - Date)
  - **Label**: "De:"
  - **Type**: Date
  - **Required**: No
  - **Default**: 01/05/2026
  - **Validation**: Valid date format
  - **Mask**: DD/MM/YYYY

- **Até** (textbox - Date)
  - **Label**: "Até:"
  - **Type**: Date
  - **Required**: No
  - **Default**: 27/05/2026
  - **Validation**: Valid date format
  - **Mask**: DD/MM/YYYY

### Buttons
- **Buscar** (button)
  - **Type**: Submit
  - **Action**: POST to `/administrador/relatorios/clientesgrid`
  - **Loading state**: Not observed

- **Limpar Filtros** (button)
  - **Type**: Reset
  - **Icon**: 
  - **Action**: Reset form to default values
  - **Loading state**: Not observed

### Export
- **Excel Export** ()
  - **Action**: GET `/administrador/relatorios/clientesgrid/excel/1`
  - **Format**: Excel file
  - **Filtered data**: Yes

### Validation Messages
- Not observed (likely inline validation)

### Submit Flow
1. User fills search criteria
2. Clicks "Buscar"
3. Form submits via AJAX
4. Table updates with results
5. Pagination resets to page 1

### Error Handling
- Invalid date: Inline error (to be observed)
- No results: "Nenhum registro encontrado" message

---

## 6. Solicitações de Saque Form (Withdrawal Requests)

**Location**: `/administrador/bonus/solicitacoesbonus`
**Purpose**: Search withdrawal requests

### Fields
- **ID Cadastro / ID CDR** (textbox)
  - **Label**: "ID Cadastro / ID CDR:"
  - **Type**: Number
  - **Required**: No
  - **Placeholder**: Not specified
  - **Validation**: Numeric value
  - **Mask**: None

- **Banco** (combobox)
  - **Label**: "Banco:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Selecione, [banks list]
  - **Default**: Selecione
  - **Validation**: None
  - **Error**: Undefined variable: banco (configuration issue)

- **Mês** (combobox)
  - **Label**: "Mês:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todos, [months]
  - **Default**: Todos
  - **Validation**: None
  - **Error**: Undefined variable: mes (configuration issue)

- **Ano** (combobox)
  - **Label**: "Ano:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: 2026, [other years]
  - **Default**: 2026
  - **Validation**: None

- **Situação** (combobox)
  - **Label**: "Situação:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todas, [statuses]
  - **Default**: Todas
  - **Validation**: None

- **Origem** (combobox)
  - **Label**: "Origem:"
  - **Type**: Dropdown
  - **Required**: No
  - **Options**: Todas, [origins]
  - **Default**: Todas
  - **Validation**: None

### Buttons
- **Buscar** (button)
  - **Type**: Submit
  - **Action**: POST to `/administrador/bonus/consultarsolicitacoesbonus`
  - **Loading state**: Not observed

- **Limpar Filtros** (button)
  - **Type**: Reset
  - **Icon**: 
  - **Action**: Reset form to default values
  - **Loading state**: Not observed

### Validation Messages
- Configuration errors visible (undefined variables)

### Submit Flow
1. User fills search criteria
2. Clicks "Buscar"
3. Form submits via AJAX
4. Table updates with results
5. Pagination resets to page 1

### Error Handling
- Configuration errors: Displayed inline
- No results: "Nenhuma solicitação encontrada" message

---

## 7. Configurações - Dados da Empresa Form

**Location**: `/administrador/configuracoes#!/geral`
**Purpose**: Configure company data

### Section: Dados da Empresa

#### Fields
- **Titulo da Aplicação** (textbox)
  - **Label**: "Titulo da Aplicação"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "All-in Life style"
  - **Help icon**:  (tooltip)
  - **Validation**: Not empty
  - **Mask**: None

- **Nome da Empresa** (textbox)
  - **Label**: "Nome da Empresa:"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "All-in Life style"
  - **Validation**: Not empty
  - **Mask**: None

- **Razão Social** (textbox)
  - **Label**: "Razão Social:"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "All In Brasil - Homologação"
  - **Validation**: Not empty
  - **Mask**: None

- **Email Comercial** (textbox)
  - **Label**: Email Comercial
  - **Type**: Email
  - **Required**: Yes
  - **Default**: "contato@allinbrasil.com.br"
  - **Validation**: Valid email format
  - **Mask**: None

- **CNPJ** (textbox)
  - **Label**: "CNPJ:"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "54.772.621/0001-12"
  - **Validation**: Valid CNPJ format
  - **Mask**: XX.XXX.XXX/XXXX-XX

- **Telefone Comercial** (textbox)
  - **Label**: Telefone Comercial
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "(51) 98904-2182"
  - **Validation**: Valid phone format
  - **Mask**: (XX) XXXXX-XXXX

- **Email de suporte a chamados** (textbox)
  - **Label**: "Email de suporte a chamados:"
  - **Type**: Email
  - **Required**: Yes
  - **Default**: "suporte@allinbrasil.com.br"
  - **Validation**: Valid email format
  - **Mask**: None

### Section: Endereço da Sede

#### Fields
- **CEP** (textbox)
  - **Label**: "CEP:"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "94668-030"
  - **Validation**: Valid CEP format
  - **Mask**: XXXXX-XXX
  - **Auto-fill**: Yes (via API call)

- **Estado** (combobox)
  - **Label**: "Estado:"
  - **Type**: Dropdown
  - **Required**: Yes
  - **Default**: "Rio Grande do Sul"
  - **Options**: [Brazilian states]
  - **Validation**: Valid state
  - **Auto-fill**: Yes (via CEP API)

- **Cidade** (textbox)
  - **Label**: "Cidade:"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "Osório"
  - **Validation**: Not empty
  - **Auto-fill**: Yes (via CEP API)

- **Bairro** (textbox)
  - **Label**: "Bairro:"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "Porto Lacustre"
  - **Validation**: Not empty
  - **Auto-fill**: Yes (via CEP API)

- **Endereço** (textbox)
  - **Label**: "Endereço:"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "Rua da Igreja"
  - **Validation**: Not empty
  - **Auto-fill**: Yes (via CEP API)

- **Número** (textbox)
  - **Label**: "Número:"
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "346"
  - **Validation**: Not empty
  - **Auto-fill**: No

- **Complemento** (textbox)
  - **Label**: "Complemento:"
  - **Type**: Text
  - **Required**: No
  - **Default**: Empty
  - **Validation**: None
  - **Auto-fill**: No

### Section: Endereço do Centro de Distribuição

#### Fields
- **Utilizar o mesmo da sede** (toggle)
  - **Label**: "Utilizar o mesmo da sede:"
  - **Type**: Radio/Toggle
  - **Options**: Sim, Não
  - **Default**: Sim
  - **Validation**: None
  - **Behavior**: When "Sim", copies headquarters address

- **Telefone Comercial** (textbox)
  - **Label**: Telefone Comercial
  - **Type**: Text
  - **Required**: Yes
  - **Default**: "(51) 98904-2182"
  - **Validation**: Valid phone format
  - **Mask**: (XX) XXXXX-XXXX

### Section: Aparência do Sistema

#### Fields
- **Logotipo (.png)** (file upload)
  - **Label**: "Logotipo (.png):"
  - **Type**: File
  - **Required**: No
  - **Accept**: .png
  - **Help icon**:  (tooltip)
  - **Validation**: PNG format, max size (to be verified)
  - **Current**: Displayed as image

- **Background do Login / Cadastro** (file upload)
  - **Label**: "Background do Login / Cadastro:"
  - **Type**: File
  - **Required**: No
  - **Accept**: [image formats]
  - **Help icon**:  (tooltip)
  - **Validation**: Valid image format, max size (to be verified)
  - **Current**: Displayed with delete button ()

- **Logo na guia** (file upload)
  - **Label**: "Logo na guia:"
  - **Type**: File
  - **Required**: No
  - **Accept**: [icon formats]
  - **Help icon**:  (tooltip)
  - **Validation**: Valid icon format, max size (to be verified)
  - **Current**: Displayed as favicon

- **Cor do Sistema** (color picker)
  - **Label**: "Cor do Sistema:"
  - **Type**: Color
  - **Required**: Yes
  - **Default**: "#fdc838"
  - **Validation**: Valid hex color
  - **Color picker**: Yes ( icon)

### Buttons
- **Adicionar Logotipo** (button)
  - **Icon**: 
  - **Action**: Open file picker
  - **Loading state**: Not observed

- **Adicionar Background** (button)
  - **Icon**: 
  - **Action**: Open file picker
  - **Loading state**: Not observed

- **Adicionar Favicon** (button)
  - **Icon**: 
  - **Action**: Open file picker
  - **Loading state**: Not observed

- **Baixar imagens do sistema** (link)
  - **Icon**: 
  - **Action**: Download system images
  - **URL**: `/administrador/configuracoes/downloadarquivos`

- **Salvar** (button)
  - **Type**: Submit
  - **Action**: Save configuration
  - **Loading state**: Not observed
  - **Success message**: To be observed

### Validation Messages
- Required field errors (to be observed)
- Format validation errors (to be observed)
- File upload errors (to be observed)

### Submit Flow
1. User fills configuration fields
2. Uploads images (optional)
3. Clicks "Salvar"
4. Form submits via AJAX
5. Configuration saved
6. Success message displayed

### Error Handling
- Invalid format: Inline error
- Required field: Inline error
- Upload failure: Error message
- Save failure: Error message

### Special Features
- CEP auto-fill via API: `/backoffice/cadastro/retornaenderecoporcep?cep={cep}`
- Toggle for same address
- Image preview
- Color picker with hex input
- Download system images

---

## Form Patterns and Behaviors

### Common Patterns

#### 1. Search Form Pattern
- Multiple filter fields
- "Buscar" (Search) button
- "Limpar Filtros" (Clear Filters) button with  icon
- AJAX submission
- Table updates without page reload
- Pagination reset on new search

#### 2. Configuration Form Pattern
- Grouped sections with headings
- Separator lines between sections
- Help icons () with tooltips
- File upload with preview
- Color picker for visual customization
- "Salvar" (Save) button
- AJAX submission
- Success/error feedback

#### 3. Date Range Pattern
- "De" (From) date field
- "Até" (To) date field
- Default to current month
- DD/MM/YYYY format
- Date picker (to be observed)

#### 4. Dropdown Pattern
- "Todos" (All) as default option
- Combobox with custom styling
- Searchable dropdown (to be verified)
- Multi-select (to be verified)

#### 5. File Upload Pattern
- File input with custom button
- File type restrictions
- File size limits (to be verified)
- Preview for images
- Delete button for existing files

### Validation Patterns

#### Required Fields
- Marked with required indicator (to be verified)
- Validation on submit
- Inline error messages
- Visual feedback (red border, etc.)

#### Format Validation
- Email format validation
- Phone format validation
- CPF/CNPJ format validation
- CEP format validation
- Date format validation

#### Custom Validation
- Business rule validation
- Cross-field validation
- Server-side validation
- AJAX validation (to be observed)

### Submit Patterns

#### AJAX Submission
- No page reload
- Loading indicator (to be observed)
- Success/error feedback
- Partial page updates

#### Traditional Submission
- Page reload
- Form data in POST body
- Server-side validation
- Redirect on success

### Error Handling Patterns

#### Inline Errors
- Error message below field
- Red border on field
- Error icon (to be observed)

#### Toast Notifications
- Success message (to be observed)
- Error message (to be observed)
- Auto-dismiss (to be observed)

#### Modal Errors
- Error modal (to be observed)
- Confirmation modal (to be observed)

### Loading States

#### Button Loading
- Spinner icon (to be observed)
- Disabled state
- Text change (to be observed)

#### Field Loading
- Loading indicator (to be observed)
- Disabled state
- Skeleton loading (to be observed)

### Accessibility

#### Labels
- All fields have labels
- Required fields marked (to be verified)
- Help text available

#### Keyboard Navigation
- Tab order (to be verified)
- Enter to submit (to be verified)
- Escape to cancel (to be verified)

#### Screen Readers
- ARIA labels (to be verified)
- Error announcements (to be verified)
- Status updates (to be verified)

### Responsive Design

#### Mobile Layout
- Stacked fields (to be observed)
- Full-width inputs (to be observed)
- Touch-friendly buttons (to be observed)

#### Tablet Layout
- Two-column layout (to be observed)
- Optimized spacing (to be observed)

#### Desktop Layout
- Multi-column layout
- Optimal use of space
- Hover effects

### Security

#### CSRF Protection
- CSRF token (to be verified)
- Token validation on submit

#### XSS Protection
- Input sanitization
- Output encoding
- Content Security Policy (to be verified)

#### SQL Injection Protection
- Parameterized queries
- Input validation
- Prepared statements

### Performance

#### Debouncing
- Debounced search (to be verified)
- Debounced validation (to be verified)

#### Lazy Loading
- Lazy load dropdown options (to be verified)
- Lazy load validation rules (to be verified)

#### Caching
- Client-side caching (to be verified)
- Server-side caching (to be verified)
