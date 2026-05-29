# Cadastros - Tipo de Cliente

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Distribuidor/DistribuidorTipoPessoa/listar
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Tipo de cliente (física ou jurídica)
- **Objetivo**: Gerenciar tipos de cliente (Pessoa Física e Pessoa Jurídica)

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Cadastros expandido, "Tipo de Cliente" ativo

### Breadcrumb
- Página inicial > Tipo de cliente (física ou jurídica)

### Área Principal

#### Barra de Ações
- **Título**: "Tipo de cliente (física ou jurídica)"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )
- **Busca**: Campo de busca

#### Tabela de Tipos de Cliente

**Colunas**:
1. **Nome** - Nome do tipo de cliente
2. **Ativo** - Status (Sim/Não)
3. **Ações** - Botões de ação

**Dados da Tabela**:
- **Pessoa Física** | Sim | [Editar] [Remover]
- **Pessoa Jurídica** | Sim | [Editar] [Remover]

**Ações por Linha**:
- **✏ Editar** - Editar tipo de cliente
  - URL: `/administracao/Distribuidor/DistribuidorTipoPessoa/editar/{id}`
- ** Remover** - Remover tipo de cliente (com CSRF token)
  - URL: `/administracao/Distribuidor/DistribuidorTipoPessoa/remover/{id}/?{csrf_token}`

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Distribuidor/DistribuidorTipoPessoa/listar` - Listar tipos de cliente

### Ações
- **GET** `/administracao/Distribuidor/DistribuidorTipoPessoa/editar/{id}` - Editar tipo
- **GET** `/administracao/Distribuidor/DistribuidorTipoPessoa/remover/{id}/?{csrf_token}` - Remover tipo

## Entidades de Negócio Identificadas

### Tipo de Cliente
- **ID**: Identificador único
- **Nome**: Nome do tipo (Pessoa Física, Pessoa Jurídica)
- **Status**: Ativo/Inativo

### Tipos de Cliente Configurados
1. **Pessoa Física** (ID: 1)
   - Status: Ativo

2. **Pessoa Jurídica** (ID: 2)
   - Status: Ativo

## Padrões de UI/UX

### Tabela
- **Simples**: Apenas 3 colunas
- **Status binário**: Sim/Não
- **Ações padrão**: Editar e Remover

### Segurança
- **CSRF Token**: Token incluído na URL de exclusão

## Observações Técnicas

### Tipos de Pessoa
- **Pessoa Física**: Para indivíduos (CPF)
- **Pessoa Jurídica**: Para empresas (CNPJ)
- **Ambos ativos**: Ambos tipos estão configurados como ativos

### Validações Presumidas
- **CPF**: Validado para Pessoa Física
- **CNPJ**: Validado para Pessoa Jurídica
- **Documentos diferentes**: Cada tipo requer documentos específicos

## Submenus de Cadastros

1. **Planos** - Gerenciar planos de adesão, upgrades e renovações
2. **Pedidos** - Gerenciar pedidos (com submenu)
3. **Formas de Pagamento** - Gerenciar formas de pagamento (com submenu)
4. **Qualificação** - Gerenciar qualificações (com submenu)
5. **Verificação Conta** - Gerenciar verificação de conta (com submenu)
6. **Produtos/Planos (Campos)** - Campos personalizados para produtos/planos
7. **Tipo de Cliente** - Tipos de cliente (Pessoa Física/Jurídica) (página atual)
8. **Tipos Estado Civil** - Tipos de estado civil
9. **Produtos** - Gerenciar produtos (com submenu)
10. **Administradores** - Gerenciar administradores do sistema
11. **Contas Bancária** - Gerenciar contas bancárias (com submenu)
12. **Campos Genéricos** - Campos genéricos do sistema
