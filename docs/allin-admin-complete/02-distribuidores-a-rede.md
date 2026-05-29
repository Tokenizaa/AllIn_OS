# Distribuidores - A Rede

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresARede/listar
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > A Rede
- **Objetivo**: Listar e gerenciar todos os distribuidores da rede

## Estrutura da Página

### Header
- Logo All-in (clicável, redireciona para /administracao)
- Menu hamburger
- Seletor de idioma (Português BR)
- Menu de usuário (Junior Padilha) com dropdown

### Sidebar
Menu lateral com Distribuidores expandido, mostrando:
- Contas Bancárias
- Verificação de Contas
- Solicitação de saque
- **A Rede** (ativo)
- Pendentes
- Relatório de indicados
- Excluidos

### Breadcrumb
- Página inicial > A Rede

### Área Principal

#### Barra de Ações
- **Título**: "A Rede"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )

#### Tabela de Distribuidores

**Colunas**:
1. **Nº** (ordenável) - ID do distribuidor
2. **Imagem** - Foto de perfil
3. **Usuário** (ordenável) - Nome de usuário
4. **Nome** (ordenável) - Nome completo
5. **E-mail** (ordenável) - Endereço de e-mail
6. **Patrocinador** - Nome do patrocinador
7. **Cidade** (ordenável) - Cidade do distribuidor
8. **Estado** (ordenável) - UF do estado
9. **Doc. Aprovado?** - Status de aprovação de documentos
10. **Data de Nascimento** (ordenável) - Data de nascimento
11. **Ativo?** (ordenável) - Status de ativação
12. **Data Cad.** (ordenável) - Data de cadastro
13. **Ações** - Botões de ação

**Dados da Tabela**:
- **Total de registros**: 977
- **Paginação**: 20 registros por página
- **Ordenação**: Colunas clicáveis com setas ( )

**Exemplos de Registros**:
- 1296 | juniorind | Junior Padilha | juniorind@allinbrasil.com.br | allinBrasil | Chapecó | SC |  | 25/11/1976 | Isento | 10/02/2026 | [Login] [Editar]
- 1294 | ElisaMartins | Isolene Schmitz | martins_elisa01@me.com | Jussaraavila | Balneário Camboriú | SC |  | 23/03/1964 | Inativo | 05/02/2026 | [Login] [Editar]
- 1293 | Wado | Osvaldo da Silva | wado.silva1739@gmail.com | allinBrasil | Terra de Areia | RS |  | 13/07/1970 | Inativo | 05/02/2026 | [Login] [Editar]

**Status de Documentos**:
- **** (X) - Documento não aprovado (clicável para verificação)
- Link para: `/administracao/VerificacaoConta/VerificacaoContaArquivosDistribuidor/principal/{id}`

**Status de Ativação**:
- **Isento** - Isento de ativação (provavelmente plano especial)
- **Inativo** - Distribuidor inativo
- **Ativo** - Distribuidor ativo

**Ações por Linha**:
- ** Login** - Login como o distribuidor
  - URL: `/administracao/Distribuidor/LoginPelaAdministracao/login/{id}`
- **✏ Editar** - Editar dados do distribuidor
  - URL: `/administracao/Distribuidor/DistribuidoresARede/editar/{id}`

#### Paginação
- **Navegação**: 1, 2, 3, 4, 5, 6, >, Última
- **URLs**: `?per_page=20`, `?per_page=40`, `?per_page=60`, etc.
- **Total**: 977 registros

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Distribuidor/DistribuidoresARede/listar` - Listar distribuidores
- **GET** `/administracao/Distribuidor/DistribuidoresARede/listar?add_ordenacao_oarede17[campo]={campo}` - Ordenar por coluna
- **GET** `/administracao/Distribuidor/DistribuidoresARede/listar?per_page={n}` - Paginação

### Ações
- **GET** `/administracao/VerificacaoConta/VerificacaoContaArquivosDistribuidor/principal/{id}` - Verificar documentos
- **GET** `/administracao/Distribuidor/LoginPelaAdministracao/login/{id}` - Login como distribuidor
- **GET** `/administracao/Distribuidor/DistribuidoresARede/editar/{id}` - Editar distribuidor

### Exportação (presumidos)
- **POST** `/administracao/Distribuidor/DistribuidoresARede/exportar/excel` - Exportar Excel
- **POST** `/administracao/Distribuidor/DistribuidoresARede/exportar/csv` - Exportar CSV
- **POST** `/administracao/Distribuidor/DistribuidoresARede/exportar/pdf` - Exportar PDF

## Entidades de Negócio Identificadas

### Distribuidor
- **ID** (di_id): Identificador único
- **Usuário** (di_usuario): Nome de usuário para login
- **Nome** (di_nome): Nome completo
- **E-mail** (di_email): Endereço de e-mail
- **Patrocinador**: Nome de usuário do patrocinador
- **Cidade** (di_cidade): Cidade de residência
- **Estado** (es_uf): UF do estado
- **Data de Nascimento**: Data de nascimento
- **Data de Cadastro**: Data de cadastro no sistema
- **Status de Ativação**: Ativo, Inativo, Isento
- **Status de Documentos**: Aprovado, Não aprovado
- **Imagem**: Foto de perfil

## Padrões de UI/UX

### Tabela
- **Ordenação**: Colunas clicáveis com indicadores de ordenação
- **Paginação**: Navegação por páginas com números
- **Ações em linha**: Ícones de ação em cada linha
- **Status badges**: Indicadores visuais de status
- **Links contextuais**: Links para ações relacionadas (verificação de documentos)

### Filtros
- **Botão de filtros**: Modal ou drawer para adicionar filtros
- **Filtros presumidos**: Por cidade, estado, status, patrocinador, data de cadastro, etc.

### Exportação
- **Múltiplos formatos**: Excel, CSV, PDF
- **Ícones claros**:  Excel,  CSV,  PDF

## Comportamentos

### Ordenação
- **Click em coluna**: Alterna entre ascendente/descendente
- **URL parameter**: `add_ordenacao_oarede17[campo]={campo}`
- **Indicadores**:  (ascendente),  (descendente)

### Paginação
- **Per page**: 20, 40, 60, 80, 100, 960 (última)
- **URL parameter**: `per_page={n}`
- **Total**: 977 registros

### Ações
- **Login como**: Permite ao administrador acessar a conta do distribuidor
- **Editar**: Abre formulário de edição do distribuidor
- **Verificar documentos**: Abre página de verificação de documentos

## Observações Técnicas

### Performance
- **Lazy loading**: Paginação para lidar com 977 registros
- **Ordenação server-side**: Ordenação feita no backend
- **Filtros server-side**: Filtros aplicados no backend

### Segurança
- **Login como administrador**: Funcionalidade de impersonação
- **Verificação de documentos**: Workflow de aprovação
- **Permissões**: Acesso restrito a administradores

## Submenus de Distribuidores

1. **Contas Bancárias** - Gerenciar contas bancárias dos distribuidores
2. **Verificação de Contas** - Verificar documentos de identificação
3. **Solicitação de saque** - Gerenciar solicitações de saque
4. **A Rede** - Listar todos os distribuidores (página atual)
5. **Pendentes** - Distribuidores com cadastro pendente
6. **Relatório de indicados** - Relatório de indicações por patrocinador
7. **Excluidos** - Distribuidores excluídos do sistema

## Próximos Passos

1. Explorar **Contas Bancárias**
2. Explorar **Verificação de Contas**
3. Explorar **Solicitação de saque**
4. Explorar **Pendentes**
5. Explorar **Relatório de indicados**
6. Explorar **Excluidos**
7. Continuar para **Loja Virtual**
