````markdown
# AUDITORIA COMPLETA DE ROLES, PERMISSÕES E CONTROLE DE ACESSO (RBAC)

Precisamos realizar uma auditoria completa do sistema de autenticação, autorização, rotas, menus, páginas, APIs e banco de dados para garantir que todas as Roles estejam corretamente implementadas e aplicadas.

O objetivo NÃO é apenas gerar relatório.

O objetivo é:

- identificar falhas
- corrigir permissões incorretas
- remover acessos indevidos
- aplicar RBAC corretamente
- proteger frontend, backend e banco de dados
- garantir que cada usuário veja apenas o que deve ver

---

# ROLES OFICIAIS DO SISTEMA

## Backoffice

- admin_master
- gestão_admin
- financeiro
- suporte
- logística
- marketing
- analytics
- auditor
- operador

---

## Rede MLM

- distribuidor

---

## Comercial

- afiliado

---

## Clientes

- cliente_final

---

# REGRA PRINCIPAL

Permissões NÃO podem depender apenas de esconder menus.

Toda validação deve existir em:

✅ frontend

✅ backend

✅ APIs

✅ banco de dados (RLS)

---

# ETAPA 1 — INVENTÁRIO COMPLETO DE ROLES

Mapear:

## Frontend

- AuthContext
- UserContext
- ProtectedRoute
- Route Guards
- Menus
- Sidebar
- Header
- Navbar
- Componentes condicionais

---

## Backend

- Controllers
- Services
- Guards
- Middlewares
- Decorators
- JWT
- Claims

---

## Banco de Dados

- profiles
- customers
- auth.users
- RLS policies
- funções SQL
- views

---

Gerar matriz completa:

| Role | Existe | Implementada | Funcionando |
|--------|--------|--------|--------|

---

# ETAPA 2 — AUDITORIA DE USUÁRIOS

Mapear todas as tabelas relacionadas:

- auth.users
- profiles
- customers

Verificar:

- duplicidades
- inconsistências
- usuários sem role
- usuários com múltiplas roles
- usuários órfãos

Corrigir automaticamente.

---

# ETAPA 3 — PADRONIZAR MODELO DE USUÁRIO

Validar estrutura:

```ts
User {
  id
  email
  role
  customer_id
  distributor_id
  status
  created_at
}
```

---

# ETAPA 4 — AUDITORIA DE ROTAS

Mapear TODAS as rotas.

Exemplo:

```txt
/admin/*
```

```txt
/distributor-office/*
```

```txt
/dashboard/*
```

```txt
/:slug/*
```

---

Criar matriz:

| Rota | Roles Permitidas |
|--------|--------|

---

Validar se existe:

- rota sem proteção
- rota protegida incorretamente
- rota acessível por role errada

Corrigir imediatamente.

---

# ETAPA 5 — AUDITORIA DOS MENUS

Auditar:

## Sidebar Admin

Verificar cada item.

Exemplo:

Financeiro

Somente:

- admin_master
- gestão_admin
- financeiro

---

Marketing

Somente:

- admin_master
- marketing

---

Analytics

Somente:

- admin_master
- analytics

---

Auditor

Somente:

- admin_master
- auditor

---

Logística

Somente:

- admin_master
- logística

---

Nenhuma role deve visualizar menus que não lhe pertencem.

---

# ETAPA 6 — AUDITORIA DE PÁGINAS

Auditar todas as páginas.

Verificar:

- acesso correto
- redirecionamento correto
- proteção correta

Se uma role acessar página indevida:

```ts
navigate("/unauthorized")
```

---

# ETAPA 7 — AUDITORIA DE COMPONENTES

Verificar:

- botões
- ações
- cards
- widgets
- dashboards
- KPIs

Exemplo:

Botão:

```txt
Aprovar Saque
```

Somente:

- financeiro
- admin_master

---

Botão:

```txt
Editar Campanha
```

Somente:

- marketing
- admin_master

---

Botão:

```txt
Recalcular Bônus
```

Somente:

- gestão_admin
- admin_master

---

# ETAPA 8 — AUDITORIA DE APIs

Mapear:

- endpoints públicos
- endpoints privados

Validar:

```txt
GET
POST
PUT
PATCH
DELETE
```

---

Criar matriz:

| Endpoint | Roles Permitidas |
|----------|----------|

---

Bloquear acessos indevidos.

---

# ETAPA 9 — AUDITORIA DE RLS

Validar todas as policies do Supabase.

Especialmente:

## customers

## orders

## payments

## shipments

## network_relationships

## bonus_calculations

## profiles

---

Garantir:

### cliente_final

Só vê seus próprios dados.

---

### distribuidor

Só vê:

- sua rede
- seus pedidos
- seus clientes
- seus bônus

---

### financeiro

Não pode acessar marketing.

---

### marketing

Não pode acessar financeiro.

---

### auditor

Somente leitura.

Nenhuma escrita.

---

# ETAPA 10 — DISTRIBUIDORES

Validar:

Distribuidor acessa apenas:

```txt
/office/*
```

Menus permitidos:

- Dashboard
- Meu Plano
- Pedidos
- Loja Virtual
- Minha Rede
- Financeiro
- Relatórios
- Downloads
- Meus Dados

Nada além disso.

---

# ETAPA 11 — AFILIADOS

Validar:

Acesso limitado.

Permitido:

- Dashboard Afiliado
- Links
- Conversões
- Comissões

Não pode acessar:

- Rede MLM
- Qualificações
- Estrutura Genealógica

---

# ETAPA 12 — CLIENTE FINAL

Validar:

Permitido:

- Perfil
- Pedidos
- Endereços
- Pagamentos

Não pode acessar:

- Escritório
- Rede
- Bônus
- Administração

---

# ETAPA 13 — ADMIN MASTER

Validar acesso total.

Pode acessar:

- todos os módulos
- todas as páginas
- todos os usuários
- todas as configurações

---

# ETAPA 14 — TESTE AUTOMATIZADO

Simular login com cada role:

- admin_master
- gestão_admin
- financeiro
- suporte
- logística
- marketing
- analytics
- auditor
- operador
- distribuidor
- afiliado
- cliente_final

Executar:

- navegação
- menus
- páginas
- APIs
- ações

Validar:

- acesso permitido
- acesso negado
- redirecionamentos

---

# ETAPA 15 — CORRIGIR AUTOMATICAMENTE

Ao encontrar qualquer falha:

NÃO apenas reportar.

Corrigir:

- guards
- middlewares
- roles
- menus
- rotas
- policies
- APIs
- componentes

---

# RESULTADO ESPERADO

Ao final:

✅ RBAC totalmente implementado

✅ frontend protegido

✅ backend protegido

✅ Supabase protegido

✅ menus filtrados corretamente

✅ páginas protegidas

✅ APIs protegidas

✅ RLS funcionando

✅ distribuidor isolado

✅ afiliado isolado

✅ cliente_final isolado

✅ auditor somente leitura

✅ admin_master acesso total

✅ nenhuma rota exposta

✅ nenhuma permissão indevida

✅ sistema pronto para produção
````
