# Distribuidores - Pendentes

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresCadastroPendente/listar
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Cadastro Pendentes
- **Objetivo**: Gerenciar cadastros de distribuidores pendentes de aprovação

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Distribuidores expandido, "Pendentes" ativo

### Breadcrumb
- Página inicial > Cadastro Pendentes

### Área Principal

#### Barra de Ações
- **Título**: "Cadastros pendentes"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )
- **Busca e filtros**: Campo de busca e múltiplos filtros

#### Tabela de Cadastros Pendentes

**Colunas**:
1. **Nº** (ordenável) - ID do distribuidor
2. **Imagem** - Foto de perfil
3. **Usuário** (ordenável) - Nome de usuário
4. **Nome** (ordenável) - Nome completo
5. **E-mail** (ordenável) - Endereço de e-mail
6. **Patrocinador** - Nome do patrocinador
7. **Cidade** (ordenável) - Cidade do distribuidor
8. **Estado** (ordenável) - UF do estado
9. **telefones** - Número de telefone
10. **Doc. Aprovado?** - Status de aprovação de documentos
11. **Data de Nascimento** (ordenável) - Data de nascimento
12. **Data Cad.** (ordenável) - Data de cadastro
13. **Ações** - Botões de ação

**Dados da Tabela**:
- **Status atual**: "Nenhum dado encontrado"
- **Total de registros**: 0

**Observação**: Não há cadastros pendentes no momento.

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Distribuidor/DistribuidoresCadastroPendente/listar` - Listar cadastros pendentes
- **GET** `/administracao/Distribuidor/DistribuidoresCadastroPendente/listar?add_ordenacao_oarede17[campo]={campo}` - Ordenar por coluna

## Entidades de Negócio Identificadas

### Cadastro Pendente
- **ID**: Identificador único
- **Usuário**: Nome de usuário
- **Nome**: Nome completo
- **E-mail**: Endereço de e-mail
- **Patrocinador**: Nome do patrocinador
- **Cidade**: Cidade de residência
- **Estado**: UF do estado
- **Telefones**: Número de telefone
- **Status de Documentos**: Aprovado/Não aprovado
- **Data de Nascimento**: Data de nascimento
- **Data de Cadastro**: Data de cadastro no sistema

## Padrões de UI/UX

### Tabela
- **Estrutura similar**: Mesma estrutura que "A Rede"
- **Ordenação**: Colunas clicáveis com indicadores de ordenação
- **Empty state**: Mensagem "Nenhum dado encontrado" quando não há registros

### Workflow
- **Cadastro**: Usuário se cadastra no sistema
- **Pendente**: Cadastro fica em status pendente
- **Aprovação**: Administrador aprova ou rejeita cadastro
- **Ativo**: Após aprovação, distribuidor torna-se ativo

## Observações Técnicas

### Workflow de Aprovação
1. Usuário se cadastra no sistema
2. Sistema envia e-mail de confirmação (presumido)
3. Cadastro fica em status "Pendente"
4. Administrador vê lista de pendentes
5. Administrador aprova ou rejeita cadastro
6. Se aprovado, distribuidor torna-se ativo
7. Se rejeitado, distribuidor é notificado (presumido)

## Submenus de Distribuidores

1. **Contas Bancárias** - Gerenciar contas bancárias
2. **Verificação de Contas** - Verificar documentos de identificação
3. **Solicitação de saque** - Gerenciar solicitações de saque
4. **A Rede** - Listar todos os distribuidores
5. **Pendentes** - Distribuidores com cadastro pendente (página atual)
6. **Relatório de indicados** - Relatório de indicações por patrocinador
7. **Excluidos** - Distribuidores excluídos do sistema
