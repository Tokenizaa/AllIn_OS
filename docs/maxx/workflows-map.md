# Workflows Map - All-in Life Style Dashboard

## Overview
This document maps all workflows and business processes observed in the system.

## 1. Authentication Workflow

### Login Flow
```
1. User navigates to /shopping/login
2. User enters login (username)
3. User enters senha (password)
4. reCAPTCHA validates
5. User clicks "Entrar" button
6. POST request to /login/processnew
7. Server validates credentials
8. On success:
   - Session created
   - Redirect to /administrador (for admin users)
   - Redirect to /backoffice (for distributors)
   - Redirect to /shopping (for customers)
9. On failure:
   - Error message displayed
   - User remains on login page
```

### Logout Flow
```
1. User clicks "SAIR" link in header
2. GET request to /login/logout
3. Server destroys session
4. Redirect to /shopping/login
```

### Password Reset Flow
```
1. User clicks "Esqueci minha senha" link
2. Currently: Links to "#" (not implemented)
3. Expected: Password reset form
4. Expected: Email with reset link
5. Expected: New password form
6. Expected: Password updated
```

---

## 2. User Registration Workflow

### New User Registration
```
1. User navigates to /cadastro/consumidor
2. User fills registration form:
   - Personal information (name, email, phone)
   - Address (CEP auto-fill)
   - CPF/CNPJ validation
   - Password creation
3. User accepts terms and conditions
4. User submits form
5. Server validates data
6. On success:
   - User account created
   - Welcome email sent
   - Redirect to login or dashboard
7. On failure:
   - Validation errors displayed
   - User corrects and resubmits
```

### Distributor Registration
```
1. Existing user navigates to product catalog
2. User selects "Seja Distribuidor" plan
3. User completes distributor registration:
   - Sponsor selection (if applicable)
   - Additional MLM-specific fields
   - Bank information for payouts
4. User submits registration
5. Server validates and processes
6. On success:
   - Distributor account created
   - Network position assigned
   - Welcome email sent
   - Redirect to backoffice
7. On failure:
   - Validation errors displayed
   - User corrects and resubmits
```

---

## 3. Order Management Workflow

### Order Creation Flow
```
1. User (distributor or customer) browses products
2. User adds products to cart
3. User reviews cart
4. User proceeds to checkout
5. User selects payment method:
   - Transferência Bancária / PIX
   - Boleto
   - Cartão de Crédito
   - PagSeguro
6. User enters payment information
7. User confirms order
8. Order created with status "Aguardando"
9. Payment processing initiated
10. On payment success:
    - Order status changes to "Pago"
    - Inventory updated
    - Bonuses calculated for upline
    - Confirmation email sent
11. On payment failure:
    - Order status changes to "Vencido" or "Cancelado"
    - User notified
```

### Order Management Flow (Admin)
```
1. Admin navigates to /administrador/faturasadmin
2. Admin searches for orders (by number, user, date, status)
3. Admin views order details
4. Admin can perform actions:
   - View order details
   - Print order
   - View generated bonuses
   - Upload payment proof
   - Mark invoice as paid
   - Cancel order
   - Refund order
5. Admin performs action
6. System updates order status
7. Notification sent to user (if applicable)
```

### Order Status Transitions
```
Aguardando → Pago (payment confirmed)
Aguardando → Vencido (payment deadline passed)
Aguardando → Cancelado (user cancelled or admin cancelled)
Pago → Estornado (refund processed)
Pago → Entregue (delivery confirmed)
```

---

## 4. Network/MLM Workflow

### Network Building Flow
```
1. Existing distributor recruits new distributor
2. New distributor registers with sponsor
3. System assigns position in network tree
4. Network hierarchy updated
5. Sponsor's network points updated
6. Qualification levels recalculated
7. Bonuses calculated for sponsor and upline
```

### Network Visualization Flow
```
1. Admin or distributor navigates to network view
2. System loads network tree data:
   - POST to /backoffice/rede/retornaredejson/mes/{mes}/ano/{ano}
3. Network tree rendered:
   - Tree view (hierarchical)
   - List view (flat)
4. User can:
   - Expand/collapse nodes
   - Search by ID, login, or name
   - Filter by month/year
   - Navigate to user details
5. System updates view dynamically
```

### Bonus Calculation Flow
```
1. Order completed and paid
2. System triggers bonus calculation:
   - Identify sponsor and upline
   - Calculate points from order
   - Apply bonus rules based on qualification
   - Generate bonus records
3. Bonuses credited to user accounts
4. Users can view bonuses in reports
5. Users can request withdrawal
```

---

## 5. Bonus Management Workflow

### Bonus Calculation Workflow
```
1. Monthly closing process initiated
2. System processes all orders in the month:
   - Calculate points for each order
   - Apply bonus rules
   - Generate bonus records
   - Update user balances
3. System generates bonus reports
4. Admin reviews and approves bonuses
5. Bonuses become available for withdrawal
```

### Withdrawal Request Workflow
```
1. User navigates to withdrawal request
2. User enters withdrawal amount
3. User selects bank account
4. User confirms withdrawal request
5. System validates:
   - Sufficient balance
   - Bank account matches user profile
   - Minimum withdrawal amount
6. On validation success:
   - Withdrawal request created
   - Status set to "Pendente"
   - Notification sent to admin
7. On validation failure:
   - Error message displayed
   - User corrects and resubmits
```

### Withdrawal Processing Workflow (Admin)
```
1. Admin navigates to /administrador/bonus/solicitacoesbonus
2. Admin filters withdrawal requests
3. Admin reviews request details:
   - User information
   - Bank account details
   - Withdrawal amount
   - Request date
4. Admin verifies account ownership
5. Admin performs action:
   - Approve: Process bank transfer
   - Reject: Return funds to user balance
6. System updates request status
7. Notification sent to user
8. Transaction recorded
```

---

## 6. Product Management Workflow

### Product Creation Workflow
```
1. Admin navigates to /administrador/produtos
2. Admin clicks "Novo Produto" (to be verified)
3. Admin fills product form:
   - Product name
   - Description
   - Category
   - Price
   - Points value
   - Stock quantity
   - Images
   - Active status
4. Admin saves product
5. System validates data
6. On success:
   - Product created
   - Product visible in catalog
   - Inventory updated
7. On failure:
   - Validation errors displayed
   - Admin corrects and resubmits
```

### Product Edit Workflow
```
1. Admin navigates to /administrador/produtos
2. Admin searches for product
3. Admin clicks "Editar Produto" ()
4. Product form opens with existing data
5. Admin modifies product details
6. Admin saves changes
7. System validates and updates
8. On success:
   - Product updated
   - Changes reflected in catalog
9. On failure:
   - Validation errors displayed
```

### Product Deletion Workflow
```
1. Admin navigates to /administrador/produtos
2. Admin searches for product
3. Admin clicks "Excluir Produto" ()
4. Confirmation modal appears
5. Admin confirms deletion
6. System checks:
   - Product not in active orders
   - Product not a core MLM plan
7. On validation success:
   - Product deleted
   - Inventory updated
8. On validation failure:
   - Error message displayed
   - Deletion prevented
```

### Product Import Workflow
```
1. Admin navigates to /administrador/produtos
2. Admin clicks "Importação de produtos"
3. Admin navigates to /administrador/produtos/formimportacao
4. Admin uploads CSV or Excel file
5. System validates file format
6. System processes import:
   - Validates each row
   - Creates or updates products
   - Updates inventory
7. Import summary displayed
8. On success:
   - Products imported
   - Success message displayed
9. On failure:
   - Error report displayed
   - Partial import may have occurred
```

---

## 7. User Management Workflow

### Admin User Creation Workflow
```
1. Admin navigates to /administrador/usuarios
2. Admin clicks "+ Novo Usuário"
3. Admin navigates to /administrador/usuarios/form
4. Admin fills user form:
   - Login
   - Name
   - Email
   - Phone
   - Profile (Admin, Api)
   - Password
5. Admin saves user
6. System validates:
   - Unique login
   - Unique email
   - Valid email format
   - Strong password
7. On success:
   - User created
   - User can login
8. On failure:
   - Validation errors displayed
```

### Password Change Workflow
```
1. Admin navigates to /administrador/usuarios
2. Admin clicks "Editar Senha" () for user
3. Password form opens
4. Admin enters new password
5. Admin confirms password
6. System validates:
   - Passwords match
   - Strong password requirements
7. On success:
   - Password updated
   - User notified (email)
8. On failure:
   - Validation errors displayed
```

### User Blocking Workflow
```
1. Admin navigates to /administrador/usuarios
2. Admin clicks "Bloquear Usuário" ()
3. Confirmation modal appears
4. Admin confirms action
5. System updates user status to "Bloqueado"
6. User cannot login
7. User notified (email)
```

---

## 8. Configuration Workflow

### Company Configuration Workflow
```
1. Admin navigates to /administrador/configuracoes
2. Admin navigates to "Dados da Empresa" section
3. Admin modifies company information:
   - Company name
   - Legal name
   - CNPJ
   - Contact information
   - Address
4. Admin uploads images:
   - Logo
   - Background
   - Favicon
5. Admin selects system color
6. Admin clicks "Salvar"
7. System validates and saves
8. On success:
   - Configuration updated
   - Changes reflected immediately
   - Success message displayed
9. On failure:
   - Validation errors displayed
```

### Payment Configuration Workflow
```
1. Admin navigates to /administrador/configuracoes
2. Admin navigates to payment section (to be explored)
3. Admin configures:
   - Payment methods
   - Bank accounts
   - Installment rules
   - Bonus calculation rules
4. Admin saves configuration
5. System validates and saves
6. Changes applied to new orders
```

---

## 9. Reporting Workflow

### Report Generation Workflow
```
1. Admin navigates to /administrador/relatorios
2. Admin selects report category:
   - Cadastrados
   - Bônus
   - Financeiro
   - Vendas
   - Produtos
3. Admin selects specific report
4. Report form opens with filters
5. Admin sets filters:
   - Date range
   - Status
   - Categories
   - Search terms
6. Admin clicks "Buscar"
7. System generates report:
   - Queries database
   - Applies filters
   - Calculates aggregates
   - Formats data
8. Report displayed in table
9. Admin can:
   - Export to Excel
   - Print report
   - Drill down to details
```

### Export Workflow
```
1. Admin views report
2. Admin clicks export button ()
3. System generates file:
   - Applies current filters
   - Formats data
   - Creates Excel file
4. File download initiated
5. User saves file locally
```

---

## 10. Content Management Workflow

### Banner Creation Workflow
```
1. Admin navigates to /administrador/gerenciarconteudo/banners
2. Admin clicks "Novo Banner" (to be verified)
3. Admin fills banner form:
   - Title
   - Image upload
   - Link URL
   - Display position
   - Date range
4. Admin saves banner
5. System validates and saves
6. Banner displayed on site
```

### Content Page Workflow
```
1. Admin navigates to /administrador/gerenciarconteudo
2. Admin selects content page or creates new
3. Admin edits content:
   - Title
   - Slug (URL)
   - Body content
   - Active status
4. Admin saves content
5. System validates and saves
6. Content published to site
```

---

## 11. Network Tree Workflow

### Tree Navigation Workflow
```
1. User opens network view
2. System loads tree data
3. Tree rendered with expandable nodes
4. User can:
   - Click node to expand/collapse
   - Click user to view details
   - Use search to find user
   - Switch between tree/list view
5. System updates view dynamically
6. User can navigate to user profile
```

### Tree Search Workflow
```
1. User enters search term (ID, login, name)
2. System filters tree
3. Matching nodes highlighted
4. Tree expands to show matches
5. User can navigate to match
```

---

## 12. Notification Workflow

### System Notification Workflow
```
1. Event occurs (order, bonus, withdrawal, etc.)
2. System generates notification:
   - Type (info, warning, error, success)
   - Title
   - Message
   - Related link
3. Notification saved to database
4. User notified via:
   - In-app notification
   - Email (if configured)
5. User can view notifications
6. User can mark as read
7. User can click link to view details
```

---

## 13. Validation Workflows

### Form Validation Workflow
```
1. User submits form
2. Client-side validation:
   - Required fields
   - Format validation
   - Length validation
3. If client-side validation fails:
   - Inline errors displayed
   - Submission prevented
4. If client-side validation passes:
   - Form submitted to server
5. Server-side validation:
   - Business rules
   - Data integrity
   - Security checks
6. If server-side validation fails:
   - Error message returned
   - Form displayed with errors
7. If server-side validation passes:
   - Data processed
   - Success response returned
   - User redirected or notified
```

### CEP Validation Workflow
```
1. User enters CEP
2. System validates format (XXXXX-XXX)
3. If valid:
   - AJAX request to /backoffice/cadastro/retornaenderecoporcep?cep={cep}
   - Address data returned
   - Fields auto-filled:
     - Estado
     - Cidade
     - Bairro
     - Endereço
4. If invalid:
   - Error message displayed
   - Manual entry required
```

---

## 14. Error Handling Workflows

### API Error Workflow
```
1. API request fails
2. System catches error
3. Error logged
4. User-friendly message displayed:
   - Toast notification
   - Inline error
   - Error modal
5. User can retry or contact support
```

### Form Error Workflow
```
1. Form submission fails
2. Validation errors identified
3. Errors displayed:
   - Inline (below field)
   - Summary (top of form)
4. Fields with errors highlighted
5. User corrects errors
6. User resubmits
```

---

## 15. Pagination Workflow

### Table Pagination Workflow
```
1. User views table with pagination
2. System displays:
   - Current page
   - Total pages
   - Records per page selector
   - Previous/Next buttons
3. User changes page:
   - Clicks page number
   - Clicks Previous/Next
   - Changes records per page
4. System requests new data:
   - AJAX request with page parameter
   - Table updated without reload
5. URL updated with page parameter
6. User can share URL with specific page
```

---

## 16. Search Workflow

### Global Search Workflow
```
1. User enters search term
2. System searches across:
   - Users
   - Products
   - Orders
   - Network
3. Results displayed:
   - Categorized by type
   - Relevance ranked
4. User can:
   - Filter by category
   - Sort results
   - Click result to view details
```

### Filtered Search Workflow
```
1. User navigates to list page
2. User sets filters:
   - Text search
   - Dropdown filters
   - Date range
   - Status filters
3. User clicks "Buscar"
4. System applies filters
5. Results displayed
6. User can:
   - Clear filters
   - Modify filters
   - Save filter preset (to be verified)
```

---

## 17. Export/Import Workflows

### Data Export Workflow
```
1. User views data table
2. User clicks export button
3. System generates file:
   - Applies current filters
   - Formats data
   - Creates file (Excel, CSV, PDF)
4. File download initiated
5. User saves file locally
```

### Data Import Workflow
```
1. User navigates to import page
2. User uploads file
3. System validates file:
   - Format
   - Structure
   - Required columns
4. System processes import:
   - Validates each row
   - Creates/updates records
   - Handles errors
5. Import summary displayed:
   - Success count
   - Error count
   - Error details
6. User can review errors
7. User can retry failed rows
```

---

## 18. Approval Workflows

### Withdrawal Approval Workflow
```
1. User requests withdrawal
2. Request status: "Pendente"
3. Admin reviews request
4. Admin approves or rejects
5. If approved:
   - Bank transfer processed
   - Status: "Processado"
   - User notified
6. If rejected:
   - Funds returned to balance
   - Status: "Rejeitado"
   - User notified with reason
```

### Order Approval Workflow
```
1. User places order
2. Order status: "Aguardando"
3. Admin reviews order (if manual approval required)
4. Admin approves or rejects
5. If approved:
   - Payment processing initiated
   - Status: "Pago"
6. If rejected:
   - Order cancelled
   - Status: "Cancelado"
   - User notified
```

---

## 19. Closing Workflow

### Monthly Closing Workflow
```
1. Admin initiates monthly closing
2. System processes month's data:
   - All orders
   - All bonuses
   - All withdrawals
3. System calculates:
   - Total revenue
   - Total bonuses
   - Total withdrawals
   - Net profit
4. System generates closing report
5. Admin reviews and approves
6. Period closed
7. No further modifications allowed
8. Reports archived
```

---

## 20. Integration Workflows

### Bling Integration Workflow
```
1. Order placed in system
2. System sends order to Bling:
   - Customer data
   - Product data
   - Payment data
3. Bling processes order
4. Bling returns confirmation
5. System updates order status
6. Inventory synced with Bling
```

### Payment Gateway Workflow
```
1. User selects payment method
2. System redirects to payment gateway:
   - PagSeguro
   - Bank
   - PIX
3. User completes payment
4. Gateway returns confirmation
5. System updates order status
6. Bonuses calculated
7. Confirmation sent to user
```

---

## Workflow States

### Common States
- **Pending**: Awaiting action or approval
- **Processing**: Being processed
- **Completed**: Successfully finished
- **Cancelled**: Cancelled by user or system
- **Failed**: Failed with error
- **Approved**: Approved by admin
- **Rejected**: Rejected by admin
- **Active**: Currently active
- **Inactive**: Not active
- **Blocked**: Blocked by admin

### State Transitions
- Most workflows follow linear progression
- Some allow rollback (e.g., order refund)
- Some are irreversible (e.g., monthly closing)
- State changes trigger notifications
- State changes are logged

---

## Workflow Triggers

### Manual Triggers
- User actions (clicks, form submissions)
- Admin actions (approvals, rejections)
- Configuration changes

### Automatic Triggers
- Scheduled jobs (monthly closing)
- Event-based (order completion, payment)
- Time-based (expiry, deadlines)
- System events (errors, warnings)

### External Triggers
- Payment gateway callbacks
- Webhook notifications
- API calls from external systems
- Email links (password reset)

---

## Workflow Monitoring

### Logging
- All workflow steps logged
- Errors logged with details
- Performance metrics logged
- User actions logged

### Monitoring
- Active workflows tracked
- Failed workflows flagged
- Long-running workflows monitored
- Bottlenecks identified

### Alerts
- Failed workflow alerts
- Timeout alerts
- Performance alerts
- Error rate alerts

---

## Workflow Optimization

### Performance
- Parallel processing where possible
- Batch processing for bulk operations
- Caching of frequently accessed data
- Optimized database queries

### Reliability
- Retry mechanisms for transient failures
- Circuit breakers for external services
- Fallback mechanisms
- Data consistency checks

### Scalability
- Horizontal scaling for processing
- Queue-based processing for async operations
- Database sharding for large datasets
- CDN for static assets
