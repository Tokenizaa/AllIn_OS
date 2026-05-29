# Distribuidores - Contas Bancárias

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/ContaBancaria/DistribuidorContaBancariaListagem/listar
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Contas Bancárias
- **Objetivo**: Gerenciar contas bancárias dos distribuidores para saques e pagamentos

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Distribuidores expandido, "Contas Bancárias" ativo

### Breadcrumb
- Página inicial > Contas Bancárias

### Área Principal

#### Barra de Ações
- **Título**: "Contas Bancárias"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )

#### Tabela de Contas Bancárias

**Colunas**:
1. **ID** - Identificador da conta bancária
2. **Usuário** - Nome de usuário do distribuidor
3. **Banco** - Nome do banco (sicoob, Santander, Caixa Econômica Federal, pagseguro, sicredi, Itaú, etc.)
4. **Tipo** - Pessoa Física ou Pessoa Jurídica
5. **Nome/Titular** - Nome completo ou razão social
6. **CPF/CNPJ** - Documento do titular (apenas para Pessoa Física)
7. **Ações** - Editar (✏) e Excluir ()

**Dados da Tabela**:
- **Paginação**: 20 registros por página
- **Exemplos de Registros**:
  - 136 | mgcolchoes | sicoob | Pessoa Jurídica | MG COLCHOES LTDA | (vazio) | [Editar] [Excluir]
  - 105 | BARROS | Santander | Pessoa Jurídica | BARROS E LUPATINI COLCHÕES E TRANSPORTES LTDA | (vazio) | [Editar] [Excluir]
  - 111 | beatrizsantos | Caixa Econômica Federal | Pessoa Física | Beatriz Maria dos santos | 46410929072 | [Editar] [Excluir]
  - 22 | AnnyAcosta | pagseguro | Pessoa Física | Anelice Cortelini Acosta | 00860873048 | [Editar] [Excluir]

**Ações por Linha**:
- **✏ Editar** - Editar conta bancária
  - URL: `/administracao/ContaBancaria/DistribuidorContaBancaria/editar/{id}`
- ** Excluir** - Excluir conta bancária
  - URL: `/administracao/ContaBancaria/DistribuidorContaBancaria/remover/{id}/?{csrf_token}`
  - Inclui token CSRF para proteção

## Endpoints Identificados

### Navegação
- **GET** `/administracao/ContaBancaria/DistribuidorContaBancariaListagem/listar` - Listar contas bancárias
- **GET** `/administracao/ContaBancaria/DistribuidorContaBancariaListagem/listar?per_page={n}` - Paginação

### Ações
- **GET** `/administracao/ContaBancaria/DistribuidorContaBancaria/editar/{id}` - Editar conta
- **GET** `/administracao/ContaBancaria/DistribuidorContaBancaria/remover/{id}/?{csrf_token}` - Excluir conta

## Entidades de Negócio Identificadas

### Conta Bancária
- **ID**: Identificador único
- **Usuário**: Nome de usuário do distribuidor
- **Banco**: Nome do banco
- **Tipo**: Pessoa Física ou Pessoa Jurídica
- **Titular**: Nome completo ou razão social
- **CPF/CNPJ**: Documento do titular (obrigatório para PF)
- **Status**: Ativo/Inativo (presumido)

### Bancos Suportados
- sicoob
- Santander
- Caixa Econômica Federal
- pagseguro
- sicredi
- Itaú
- (outros bancos provavelmente suportados)

## Padrões de UI/UX

### Tabela
- **Paginação**: Navegação por páginas
- **Ações em linha**: Ícones de ação em cada linha
- **Diferenciação visual**: Tipo de pessoa (PF/PJ) claramente indicado
- **CPF/CNPJ condicional**: Mostrado apenas para Pessoa Física

### Segurança
- **CSRF Token**: Token incluído na URL de exclusão para proteção contra CSRF
- **Confirmação**: Provavelmente modal de confirmação antes de excluir

## Observações Técnicas

### Validações
- **CPF/CNPJ**: Validado conforme tipo de pessoa
- **Banco**: Provavelmente select com bancos pré-cadastrados
- **Tipo**: Determina se CPF ou CNPJ é obrigatório

### Integrações
- **Sistema de saques**: Contas bancárias usadas para processar saques
- **Sistema de pagamentos**: Contas usadas para pagamentos de comissões

## Submenus de Distribuidores

1. **Contas Bancárias** - Gerenciar contas bancárias (página atual)
2. **Verificação de Contas** - Verificar documentos de identificação
3. **Solicitação de saque** - Gerenciar solicitações de saque
4. **A Rede** - Listar todos os distribuidores
5. **Pendentes** - Distribuidores com cadastro pendente
6. **Relatório de indicados** - Relatório de indicações por patrocinador
7. **Excluidos** - Distribuidores excluídos do sistema
