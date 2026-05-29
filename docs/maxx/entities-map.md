# Business Entities Map - All-in Life Style Dashboard

## Core Business Entities

### 1. Usuário (User)
**Description**: System user entity representing all types of users in the system

**Attributes**:
- **id**: Integer (Primary Key) - Unique user identifier
- **login**: String (Unique) - Username for authentication
- **nome**: String - Full name of the user
- **email**: String (Unique) - Email address
- **telefone**: String - Phone number
- **cpf_cnpj**: String - CPF for individuals or CNPJ for companies
- **rg**: String - RG (Identity document)
- **tipo_pessoa**: Enum - PF (Pessoa Física) or PJ (Pessoa Jurídica)
- **senha**: String (Encrypted) - Password
- **status**: Enum - Ativo, Inativo, Bloqueado
- **data_cadastro**: DateTime - Registration date
- **data_nascimento**: Date - Birth date
- **perfil**: Enum - Admin, Api, Distribuidor, Cliente

**Relationships**:
- One-to-Many with Pedidos (as customer)
- One-to-Many with Pedidos (as sponsor)
- One-to-Many with Rede (as network node)
- One-to-Many with Bônus (as recipient)
- One-to-Many with Solicitações de Saque (as requester)
- One-to-Many with Observações
- Many-to-One with Patrocinador (sponsor)

**Subtypes**:
- **Administrador**: System admin users
- **Distribuidor**: MLM distributors
- **Afiliado**: Affiliates
- **Cliente**: Regular customers
- **Api**: API service users

### 2. Cadastro (Registration)
**Description**: Extended user profile for MLM participants

**Attributes**:
- **id**: Integer (Primary Key) - Same as user ID
- **id_patrocinador**: Integer (Foreign Key) - Sponsor user ID
- **nivel**: String - User level in MLM hierarchy
- **status_ativacao**: Enum - Ativo, Inativo, Pendente
- **data_ativacao**: Date - Activation date
- **data_expiracao**: Date - Expiration date
- **pontos**: Decimal - Accumulated points
- **qualificacao**: String - Current qualification level
- **endereco**: Object - Address information
  - cep: String
  - estado: String
  - cidade: String
  - bairro: String
  - endereco: String
  - numero: String
  - complemento: String
- **dados_bancarios**: Object - Bank information
  - banco: String
  - agencia: String
  - conta: String
  - tipo_conta: String
  - pix: String

**Relationships**:
- One-to-One with Usuário
- Many-to-One with Patrocinador
- One-to-Many with Downlines
- One-to-Many with Pedidos
- One-to-Many with Bônus
- One-to-Many with Solicitações de Saque

**Business Rules**:
- Each user has one registration
- Sponsor relationship forms the MLM tree
- Points are calculated from purchases
- Qualification depends on network performance

### 3. Pedido (Order)
**Description**: Customer orders for products

**Attributes**:
- **id**: Integer (Primary Key) - Order number
- **id_usuario**: Integer (Foreign Key) - Customer user ID
- **id_loja**: Integer - Store identifier
- **data_emissao**: DateTime - Order creation date
- **data_baixa**: DateTime - Payment confirmation date
- **data_entrega**: DateTime - Delivery date
- **valor_total**: Decimal - Total order value
- **valor_frete**: Decimal - Shipping cost
- **valor_desconto**: Decimal - Discount amount
- **forma_pagamento**: String - Payment method
  - Transferência Bancária / PIX
  - Boleto em 3x
  - Parcelamento Pix em 5x
  - PagSeguro
- **situacao**: Enum - Aguardando, Pago, Cancelado, Estornado, Vencido
- **status_entrega**: String - Delivery status (e.g., "Preparando Pedido")
- **comprovante**: String - Proof of payment file path
- **observacoes**: Text - Order notes

**Relationships**:
- Many-to-One with Usuário (customer)
- One-to-Many with ItensPedido
- One-to-Many with Bônus (generated from order)
- One-to-Many with Faturas

**Business Rules**:
- Orders can be paid or pending
- Different payment methods available
- Orders generate bonuses for upline
- Orders contribute to qualification

### 4. Produto (Product)
**Description**: Products available in the catalog

**Attributes**:
- **id**: Integer (Primary Key) - Product ID
- **nome**: String - Product name
- **descricao**: Text - Product description
- **categoria**: String - Product category
  - Seja Distribuidor
  - Kits de Adesão
  - Roupas
  - Calçados
- **valor**: Decimal - Sale price
- **pontos**: Decimal - MLM points value
- **estoque**: Integer - Available quantity
- **ativo**: Boolean - Active status
- **recorrente**: Boolean - Recurring product
- **digital**: Boolean - Digital product
- **ativo_loja_externa**: Boolean - Available in external store
- **destaque**: Boolean - Featured product
- **imagem**: String - Product image path
- **peso**: Decimal - Weight for shipping
- **dimensoes**: Object - Dimensions for shipping

**Relationships**:
- Many-to-One with Categoria
- One-to-Many with ItensPedido
- Many-to-Many with Promocoes
- One-to-Many with Estoque

**Business Rules**:
- Products can be physical or digital
- Some products are MLM plans
- Points value affects bonus calculations
- Stock management for physical products

### 5. Categoria (Category)
**Description**: Product categories

**Attributes**:
- **id**: Integer (Primary Key)
- **nome**: String - Category name
- **descricao**: Text - Category description
- **ativo**: Boolean - Active status
- **ordem**: Integer - Display order

**Relationships**:
- One-to-Many with Produto

### 6. Bônus (Bonus)
**Description**: Commission bonuses earned by distributors

**Attributes**:
- **id**: Integer (Primary Key)
- **id_usuario**: Integer (Foreign Key) - Recipient user ID
- **id_pedido**: Integer (Foreign Key) - Source order ID
- **tipo_bonus**: Enum - Bonus type
  - Bônus de Indicação
  - Bônus de Rede
  - Bônus de Qualificação
  - Bônus de Carreira
- **valor**: Decimal - Bonus amount
- **pontos**: Decimal - Points earned
- **data_calculo**: DateTime - Calculation date
- **data_pagamento**: DateTime - Payment date
- **status**: Enum - Calculado, Pago, Pendente, Cancelado
- **origem**: String - Bonus origin description

**Relationships**:
- Many-to-One with Usuário (recipient)
- Many-to-One with Pedido (source)
- One-to-Many with Solicitações de Saque

**Business Rules**:
- Bonuses calculated from orders
- Different bonus types for different achievements
- Bonuses can be withdrawn
- Monthly closing process

### 7. Solicitação de Saque (Withdrawal Request)
**Description**: Requests to withdraw bonus funds

**Attributes**:
- **id**: Integer (Primary Key)
- **id_usuario**: Integer (Foreign Key) - Requester user ID
- **valor**: Decimal - Withdrawal amount
- **data_solicitacao**: DateTime - Request date
- **data_processamento**: DateTime - Processing date
- **status**: Enum - Pendente, Aprovado, Rejeitado, Processado
- **dados_bancarios**: Object - Destination bank account
  - banco: String
  - agencia: String
  - conta: String
  - tipo_conta: String
  - titular: String
  - cpf_cnpj: String
- **observacoes**: Text - Admin notes
- **comprovante**: String - Proof of transfer

**Relationships**:
- Many-to-One with Usuário
- Many-to-One with Bônus (source funds)

**Business Rules**:
- Must verify account ownership
- Minimum withdrawal amount
- Processing time
- Bank transfer only

### 8. Fatura (Invoice)
**Description**: Invoices for orders

**Attributes**:
- **id**: Integer (Primary Key)
- **id_pedido**: Integer (Foreign Key) - Related order
- **numero**: String - Invoice number
- **data_vencimento**: Date - Due date
- **data_pagamento**: Date - Payment date
- **valor**: Decimal - Invoice amount
- **status**: Enum - Pendente, Paga, Vencida, Cancelada
- **link_boleto**: String - Boleto payment link
- **codigo_transacao**: String - Transaction code

**Relationships**:
- One-to-One with Pedido

### 9. Rede (Network)
**Description**: MLM network structure

**Attributes**:
- **id**: Integer (Primary Key)
- **id_usuario**: Integer (Foreign Key) - User ID
- **id_patrocinador**: Integer (Foreign Key) - Sponsor user ID
- **nivel**: Integer - Level in hierarchy
- **posicao**: Integer - Position in level
- **data_entrada**: DateTime - Entry date in network
- **pontos_equipe**: Decimal - Team points
- **pontos_pessoais**: Decimal - Personal points
- **qualificacao**: String - Current qualification

**Relationships**:
- One-to-One with Usuário
- Many-to-One with Patrocinador
- One-to-Many with Downlines

**Business Rules**:
- Forms hierarchical tree structure
- Points calculated recursively
- Qualification based on team performance
- Linear network visualization

### 10. Crédito (Credit)
**Description**: User credits balance

**Attributes**:
- **id**: Integer (Primary Key)
- **id_usuario**: Integer (Foreign Key) - User ID
- **valor**: Decimal - Credit amount
- **tipo**: Enum - Crédito, Débito
- **origem**: String - Credit/debit origin
- **data**: DateTime - Transaction date
- **descricao**: Text - Description
- **saldo_anterior**: Decimal - Previous balance
- **saldo_posterior**: Decimal - New balance

**Relationships**:
- Many-to-One with Usuário

**Business Rules**:
- Credits can be positive or negative
- Used for internal transactions
- Can be converted to bonuses

### 11. Configuração (Configuration)
**Description**: System configuration settings

**Attributes**:
- **id**: Integer (Primary Key)
- **chave**: String - Configuration key
- **valor**: String - Configuration value
- **descricao**: Text - Description
- **tipo**: Enum - string, number, boolean, json
- **categoria**: String - Configuration category

**Configuration Categories**:
- **empresa**: Company information
- **sistema**: System settings
- **pagamento**: Payment configuration
- **bonus**: Bonus calculation rules
- **notificacao**: Notification settings
- **aparência**: UI customization

### 12. Banco (Bank)
**Description**: Bank information for payments

**Attributes**:
- **id**: Integer (Primary Key)
- **codigo**: String - Bank code
- **nome**: String - Bank name
- **ativo**: Boolean - Active status

### 13. Tipo Pagamento (Payment Type)
**Description**: Available payment methods

**Attributes**:
- **id**: Integer (Primary Key)
- **nome**: String - Payment type name
- **descricao**: Text - Description
- **ativo**: Boolean - Active status
- **configuracao**: JSON - Payment configuration

**Payment Types**:
- Transferência Bancária
- PIX
- Boleto
- Cartão de Crédito
- PagSeguro

### 14. Fabricante (Manufacturer)
**Description**: Product manufacturers

**Attributes**:
- **id**: Integer (Primary Key)
- **nome**: String - Manufacturer name
- **cnpj**: String - CNPJ
- **contato**: String - Contact information
- **ativo**: Boolean - Active status

### 15. Marca (Brand)
**Description**: Product brands

**Attributes**:
- **id**: Integer (Primary Key)
- **nome**: String - Brand name
- **descricao**: Text - Description
- **ativo**: Boolean - Active status

### 16. Estoque (Stock)
**Description**: Product inventory

**Attributes**:
- **id**: Integer (Primary Key)
- **id_produto**: Integer (Foreign Key)
- **quantidade**: Integer - Available quantity
- **quantidade_reservada**: Integer - Reserved quantity
- **quantidade_minima**: Integer - Minimum stock alert
- **localizacao**: String - Storage location
- **data_atualizacao**: DateTime - Last update

**Relationships**:
- Many-to-One with Produto

### 17. Banner (Banner)
**Description**: Promotional banners

**Attributes**:
- **id**: Integer (Primary Key)
- **titulo**: String - Banner title
- **imagem**: String - Image path
- **link**: String - Destination URL
- **posicao**: String - Display position
- **ativo**: Boolean - Active status
- **data_inicio**: Date - Start date
- **data_fim**: Date - End date

### 18. Conteúdo (Content)
**Description**: Site content pages

**Attributes**:
- **id**: Integer (Primary Key)
- **titulo**: String - Page title
- **slug**: String - URL slug
- **conteudo**: Text - Page content
- **ativo**: Boolean - Active status
- **data_atualizacao**: DateTime - Last update

### 19. Modelo Email (Email Template)
**Description**: Email templates

**Attributes**:
- **id**: Integer (Primary Key)
- **nome**: String - Template name
- **assunto**: String - Email subject
- **corpo**: Text - Email body
- **variaveis**: JSON - Available variables
- **ativo**: Boolean - Active status

### 20. Notificação (Notification)
**Description**: User notifications

**Attributes**:
- **id**: Integer (Primary Key)
- **id_usuario**: Integer (Foreign Key)
- **tipo**: Enum - info, warning, error, success
- **titulo**: String - Notification title
- **mensagem**: Text - Notification message
- **data**: DateTime - Creation date
- **lida**: Boolean - Read status
- **link**: String - Related link

**Relationships**:
- Many-to-One with Usuário

### 21. Fechamento (Closing)
**Description**: Monthly closing process

**Attributes**:
- **id**: Integer (Primary Key)
- **mes**: Integer - Month
- **ano**: Integer - Year
- **data_inicio**: DateTime - Start date
- **data_fim**: DateTime - End date
- **status**: Enum - Em andamento, Concluído, Cancelado
- **observacoes**: Text - Notes

**Relationships**:
- One-to-Many with Bônus
- One-to-Many with Créditos

### 22. Observação (Note)
**Description**: User/registration notes

**Attributes**:
- **id**: Integer (Primary Key)
- **id_cadastro**: Integer (Foreign Key)
- **observacao**: Text - Note content
- **data**: DateTime - Creation date
- **id_autor**: Integer (Foreign Key) - Author user ID

**Relationships**:
- Many-to-One with Cadastro
- Many-to-One with Usuário (author)

## Entity Relationships Diagram

```
Usuário (1) ----< (1) Cadastro
    |                    |
    |                    |< (1) Patrocinador
    |                    |
    |                    |< (N) Downlines (Rede)
    |                    |
    |                    |< (N) Pedidos
    |                    |
    |                    |< (N) Bônus
    |                    |
    |                    |< (N) Solicitações de Saque
    |
    |< (N) Pedidos (as customer)
    |
    |< (N) Notificações
    |
    |< (N) Observações (as author)

Pedido (1) ----< (N) ItensPedido
    |
    |---- (1) Fatura
    |
    |----> (N) Bônus (generated)

Produto (1) ----< (N) ItensPedido
    |
    |< (1) Categoria
    |
    |< (1) Fabricante
    |
    |< (1) Marca
    |
    |---- (1) Estoque

Bônus (N) ----> (1) Solicitação de Saque
```

## Business Rules Summary

### MLM Structure
- Linear network hierarchy
- Sponsor relationship required for registration
- Points calculated from personal and team purchases
- Qualification based on cumulative points
- Monthly closing process for bonuses

### Order Processing
- Orders can be paid or pending
- Multiple payment methods available
- Orders generate bonuses for upline
- Stock management for physical products
- Digital products delivered immediately

### Bonus Calculation
- Different bonus types for different achievements
- Bonuses calculated from order values
- Points system for qualification
- Monthly closing process
- Withdrawal requests require verification

### User Management
- Multiple user types (Admin, Distributor, Cliente, Api)
- Profile includes personal and bank information
- Address validation via CEP lookup
- Session-based authentication

### Product Management
- Products categorized by type
- Physical and digital products
- Stock management
- Featured products
- External store integration

## Data Integrity Constraints

### Unique Constraints
- Usuário.login
- Usuário.email
- Usuário.cpf_cnpj
- Pedido.numero
- Produto.nome (within category)

### Foreign Key Constraints
- All relationships maintain referential integrity
- Cascade delete for dependent records (where applicable)
- Soft delete for main entities (status field)

### Validation Rules
- CPF/CNPJ format validation
- Email format validation
- Phone number format validation
- CEP validation (via external service)
- Minimum withdrawal amount
- Stock cannot be negative

## Audit Trail

### Tracked Fields
- data_cadastro (creation timestamp)
- data_atualizacao (last update)
- id_autor (last modifier)
- status changes with timestamps

### Logging
- User login/logout
- Order status changes
- Bonus calculations
- Withdrawal requests
- Configuration changes

## Security Considerations

### Sensitive Data
- Senha (encrypted)
- CPF/CNPJ
- Dados bancários
- Cartão de crédito (if stored)

### Access Control
- Role-based permissions
- Admin-only operations
- API access restrictions
- Data visibility based on role

## Performance Considerations

### Indexing
- Primary keys on all tables
- Foreign keys indexed
- Search fields indexed (login, email, cpf_cnpj)
- Date fields indexed for reports

### Caching
- Dashboard data cached
- Product catalog cached
- Network tree cached
- Configuration cached

## Scalability

### Partitioning
- Orders by date range
- Bonus records by month/year
- Network data by level

### Archiving
- Old orders archived
- Historical bonus data archived
- Closed periods archived
