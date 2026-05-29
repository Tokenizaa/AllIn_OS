# Endpoints Map - All-in Life Style Dashboard

## Base URL
- **Production**: https://allinbrasil.maxxmultinivel.com.br
- **Environment**: Homologação (Development)

## Authentication Endpoints

### Login
- **POST** `/login/processnew`
  - **Purpose**: User authentication
  - **Parameters**: login, senha, recaptcha_token
  - **Response**: Authentication session
  - **Status**: [200] OK

### Logout
- **GET** `/login/logout`
  - **Purpose**: User logout
  - **Response**: Session termination
  - **Status**: Redirect to login

## Dashboard Endpoints

### Dashboard Data
- **POST** `/administrador/relatorios/exibirinfosdashboard`
  - **Purpose**: Load dashboard KPIs and charts
  - **Response**: JSON with dashboard metrics
  - **Status**: [200] OK
  - **Data Returned**:
    - Total de Cadastros
    - Total de Pedidos
    - Total de Faturamento
    - Total de Créditos Gerados
    - Total de Bônus Gerados
    - Monthly statistics
    - Chart data for activations, activities, revenue

## User Management Endpoints

### Consultar Cadastros (Search Registrations)
- **POST** `/administrador/cadastro/consultarcadastros`
  - **Purpose**: Search and filter user registrations
  - **Parameters**:
    - id: User ID
    - palavra_chave: Search term (Login, Nome, Email, CPF/CNPJ)
    - status: Active status (Todos, Sim, Não)
    - nivel: User level
    - page: Page number for pagination
  - **Response**: JSON with user list
  - **Status**: [200] OK
  - **Pagination**: 15 records per page
  - **Total Records**: 976

### User Profile
- **GET** `/administrador/usuarios/index/id/{id}`
  - **Purpose**: View/edit user profile
  - **Parameters**: id (user ID)
  - **Response**: User profile page
  - **Status**: [200] OK

### Address Lookup
- **GET** `/backoffice/cadastro/retornaenderecoporcep?cep={cep}`
  - **Purpose**: Get address from CEP (Brazilian postal code)
  - **Parameters**: cep (postal code)
  - **Response**: JSON with address data
  - **Example**: `/backoffice/cadastro/retornaenderecoporcep?cep=94668-030`
  - **Status**: [200] OK

## Order Management Endpoints

### Consultar Faturas (Search Orders)
- **POST** `/administrador/faturasadmin/consultarfaturas`
  - **Purpose**: Search and filter orders/invoices
  - **Parameters**:
    - numero_pedido: Order number
    - id_login: User ID/Login
    - id_loja: Store ID
    - situacao: Order status (Estornado, Cancelado, Aguardando, Vencido, Pago)
    - page: Page number for pagination
  - **Response**: JSON with order list
  - **Status**: [200] OK
  - **Pagination**: 15 records per page
  - **Total Records**: 39 orders
  - **Total Value**: R$ 33.097,21

## Network/MLM Endpoints

### Rede Linear Data
- **POST** `/backoffice/rede/retornaredejson/mes/{mes}/ano/{ano}`
  - **Purpose**: Get network tree structure data
  - **Parameters**:
    - mes: Month (05 for May)
    - ano: Year (2026)
  - **Response**: JSON with network hierarchy
  - **Example**: `/backoffice/rede/retornaredejson/mes/05/ano/2026`
  - **Status**: [200] OK
  - **Data Structure**:
    - User nodes with ID, login, name
    - Parent-child relationships
    - Level indicators
    - Activation status

## Product Management Endpoints

### Consultar Produtos (Search Products)
- **POST** `/administrador/produtos/consultarprodutos`
  - **Purpose**: Search and filter products
  - **Parameters**:
    - nome: Product name
    - categoria: Product category
    - ativo: Active status
    - recorrente: Recurring status
    - digital: Digital status
    - ativo_loja_externa: External store status
    - page: Page number for pagination
  - **Response**: JSON with product list
  - **Status**: [200] OK
  - **Pagination**: 15 records per page
  - **Product Categories**: Seja Distribuidor, Kits de Adesão, Roupas, Calçados

### Product Import
- **GET** `/administrador/produtos/formimportacao`
  - **Purpose**: Product import form
  - **Response**: Import form page
  - **Status**: [200] OK

## Reports Endpoints

### Afiliados/Distribuidores Report
- **POST** `/administrador/relatorios/clientesgrid`
  - **Purpose**: Generate affiliates/distributors report
  - **Parameters**:
    - palavra_chave: Search term
    - situacao: Status
    - data_de: Start date
    - data_ate: End date
  - **Response**: JSON with report data
  - **Status**: [200] OK
  - **Export**: `/administrador/relatorios/clientesgrid/excel/1`

### Other Report Endpoints (to be documented)
- `/administrador/relatorios/aniversariantes` - Team information
- `/administrador/relatorios/clientesloja` - Store clients
- `/administrador/relatorios/downlines` - Downlines report
- `/administrador/relatorios/desempenhorede` - Network performance
- `/administrador/relatorios/historicoativacoes` - Activation history
- `/administrador/relatorios/pontosredelinear` - Linear network points
- `/administrador/relatorios/pontos` - Points report
- `/administrador/relatorios/gerencialbonus` - Bonus management
- `/administrador/relatorios/gerencialbonusconsolidado` - Consolidated bonus
- `/administrador/relatorios/creditos` - Credits
- `/administrador/relatorios/creditosconsolidado` - Consolidated credits
- `/administrador/relatorios/detalhamentocreditos` - Credits/debits details
- `/administrador/relatorios/solicitacoesbonus` - Withdrawal requests
- `/administrador/relatorios/faturamentorede` - Network revenue
- `/administrador/relatorios/fechamentos` - Closing history
- `/administrador/relatorios/vendaspagas` - Paid sales
- `/administrador/relatorios/vendasonline` - Online sales
- `/administrador/relatorios/vendasprodutos` - Product sales
- `/administrador/relatorios/vendaspordistribuidor` - Sales by distributor (consolidated)
- `/administrador/relatorios/vendaspordistribuidoranalitico` - Sales by distributor (analytical)
- `/administrador/relatorios/vendasporestado` - Sales by state
- `/administrador/relatorios/estoque` - Stock report

## Bonus Management Endpoints

### Consultar Solicitações de Saque
- **POST** `/administrador/bonus/consultarsolicitacoesbonus`
  - **Purpose**: Search withdrawal requests
  - **Parameters**:
    - id_cadastro: User ID
    - banco: Bank filter
    - mes: Month filter
    - ano: Year filter
    - situacao: Status filter
    - origem: Origin filter
  - **Response**: JSON with withdrawal requests
  - **Status**: [200] OK
  - **Warning**: Verify account ownership before processing

### Bonus Sub-modules
- `/administrador/bonus/bonusdiarios` - Daily bonuses
- `/administrador/bonus/bonusmensais` - Monthly bonuses
- `/administrador/bonus/fechamento` - Closing process

## User Administration Endpoints

### Consultar Usuários (Search Admin Users)
- **POST** `/administrador/usuarios/consultarusuarios`
  - **Purpose**: Search admin users
  - **Response**: JSON with admin user list
  - **Status**: [200] OK
  - **Total Users**: 2 (administrador, nettofariasapi)

### User Management
- **GET** `/administrador/usuarios/form` - New user form
- **POST** `/administrador/usuarios/salvar` - Save user (to be confirmed)
- **POST** `/administrador/usuarios/editarsenha` - Edit password (to be confirmed)
- **POST** `/administrador/usuarios/bloquear` - Block user (to be confirmed)

## Configuration Endpoints

### Consultar Fabricantes/Marcas
- **POST** `/administrador/configuracoes/consultarfabricantesmarcas`
  - **Purpose**: Get manufacturers/brands list
  - **Response**: JSON with manufacturers/brands
  - **Status**: [200] OK

### Consultar Modelo Email
- **POST** `/administrador/configuracoes/consultarmodeloemail`
  - **Purpose**: Get email templates
  - **Response**: JSON with email templates
  - **Status**: [200] OK

### Consultar Bancos
- **POST** `/administrador/configuracoes/consultarbancos`
  - **Purpose**: Get banks list
  - **Response**: JSON with banks
  - **Status**: [200] OK

### Consultar Dados Bancários
- **POST** `/administrador/configuracoes/consultardadosbancarios`
  - **Purpose**: Get bank account data
  - **Response**: JSON with bank details
  - **Status**: [200] OK

### Configurações Parcelamento
- **POST** `/administrador/configuracoesparcelamento/form`
  - **Purpose**: Get installment configuration form
  - **Response**: Form data
  - **Status**: [200] OK

### Consultar Configurações Parcelamento
- **POST** `/administrador/configuracoes/consultarconfiguracoesparcelamento`
  - **Purpose**: Get installment settings
  - **Response**: JSON with installment configuration
  - **Status**: [200] OK

### Consultar Tipo Pagamento
- **POST** `/administrador/configuracoes/consultartipopagamento`
  - **Purpose**: Get payment types
  - **Response**: JSON with payment methods
  - **Status**: [200] OK

### Consultar Bônus
- **POST** `/administrador/configuracoes/consultarbonus`
  - **Purpose**: Get bonus configuration
  - **Response**: JSON with bonus settings
  - **Status**: [200] OK

### Download System Images
- **GET** `/administrador/configuracoes/downloadarquivos`
  - **Purpose**: Download system images (logo, background, favicon)
  - **Response**: File download
  - **Status**: [200] OK

## Content Management Endpoints

### Banners
- **GET** `/administrador/gerenciarconteudo/banners` - Banner management
- **POST** `/administrador/gerenciarconteudo/salvarbanner` - Save banner (to be confirmed)
- **POST** `/administrador/gerenciarconteudo/excluirbanner` - Delete banner (to be confirmed)

### Content
- **GET** `/administrador/gerenciarconteudo` - Content management
- **POST** `/administrador/gerenciarconteudo/salvar` - Save content (to be confirmed)

## External Integrations

### Bling ERP
- **URL**: https://www.bling.com.br/login
- **Type**: External link
- **Purpose**: ERP system integration

### Support System
- **URL**: http://suporte.mercadons.com.br/login.php
- **Type**: External link
- **Purpose**: Ticket support system

## Store/E-commerce

### Shopping
- **GET** `/shopping` - Main store
- **GET** `/shopping/produtos/index/idc/{id}` - Products by category
- **GET** `/shopping/sobre` - About page
- **GET** `/shopping/termos-condicoes` - Terms and conditions
- **GET** `/shopping/politicas-de-privacidade` - Privacy policy
- **GET** `/shopping/informacoes-de-envio` - Shipping information
- **GET** `/shopping/contato` - Contact page
- **GET** `/cadastro/consumidor` - Consumer registration

## reCAPTCHA Integration

### Google reCAPTCHA
- **POST** `https://www.google.com/recaptcha/api2/reload`
  - **Purpose**: Reload reCAPTCHA
  - **Parameters**: k (site key)
  - **Status**: [200] OK

- **POST** `https://www.google.com/recaptcha/api2/clr`
  - **Purpose**: Clear reCAPTCHA
  - **Parameters**: k (site key)
  - **Status**: [200] OK

- **Site Key**: 6Lf7MJ4pAAAAAFpUQo1ycSoVxW67vZ5SvIpgw1LI

## Response Patterns

### Common Response Structure
```json
{
  "status": "success",
  "data": [],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 976,
    "last_page": 66
  }
}
```

### Error Response Structure
```json
{
  "status": "error",
  "message": "Error description",
  "errors": []
}
```

## Authentication Headers

All authenticated requests include:
- **Session Cookie**: PHPSESSID
- **CSRF Token**: (if applicable)
- **User Agent**: Browser user agent

## Request Methods

- **POST**: Used for form submissions, searches, and data retrieval
- **GET**: Used for page navigation, file downloads, and simple queries
- **PUT/DELETE**: Not yet observed (may exist for CRUD operations)

## Pagination Pattern

Most list endpoints support:
- `page`: Page number (default: 1)
- `per_page`: Records per page (default: 15, common values: 15, 30, 50, 100)
- Response includes pagination metadata

## Filter Patterns

Common filter parameters:
- Search terms (palavra_chave, nome, etc.)
- Status filters (ativo, situacao, etc.)
- Date ranges (data_de, data_ate)
- Category filters (categoria, nivel, etc.)
- ID filters (id, id_login, etc.)

## Rate Limiting

No rate limiting observed during documentation.
Standard throttling may apply in production.

## CORS

- All requests are same-origin (no CORS observed)
- External integrations use direct links (not API calls)

## SSL/TLS

- All endpoints use HTTPS
- Valid SSL certificate
- No mixed content observed

## API Versioning

- No explicit versioning in URLs
- System version: 3.6.0 (displayed in UI)
- Backward compatibility not guaranteed without versioning

## Error Handling

- HTTP 200: Success
- HTTP 302: Redirect (login, logout)
- HTTP 404: Not found (not observed)
- HTTP 500: Server error (not observed)

## Security Notes

1. **reCAPTCHA** on login form
2. **Session-based authentication**
3. **CSRF protection** likely (tokens not visible in network requests)
4. **SQL injection protection** (parameterized queries assumed)
5. **XSS protection** (input sanitization assumed)

## Performance Notes

- Most responses are fast (< 1 second)
- Dashboard data loading: ~500ms
- Search operations: ~300ms
- Network tree loading: ~200ms
- No lazy loading observed for main data

## Caching

No explicit caching headers observed.
Browser caching may apply for static assets.
