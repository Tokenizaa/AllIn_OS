# Distribuidores - Verificação de Contas

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Verificação de conta
- **Objetivo**: Gerenciar verificação de documentos de identificação dos distribuidores

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Distribuidores expandido, "Verificação de Contas" ativo

### Breadcrumb
- Página inicial > Verificação de conta

### Área Principal

#### Barra de Ações
- **Título**: "Verificação de conta"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )
- **Busca**: Campo de busca (ícone )
- **Filtros de data**: Data inicial e Data final (ícone )

#### Tabela de Verificações

**Colunas**:
1. **Distribuidor** - Nome de usuário do distribuidor
2. **Customer** - Nome do cliente/distribuidor
3. **Data de Envio** - Data e hora de envio dos documentos
4. **Ações** - Botão Gerenciar

**Dados da Tabela**:
- **Exemplos de Registros**:
  - DIEGOPOSSO | DIEGO | 08/08/2024 15:25:10 | [Gerenciar]
  - araken | ARAKEN | 10/07/2023 15:03:22 | [Gerenciar]
  - diekirch | Angela | 08/05/2023 09:11:25 | [Gerenciar]
  - ewelynnato | DANIELLE | 28/02/2022 17:46:10 | [Gerenciar]
  - allinBrasil | All | 18/02/2022 10:54:16 | [Gerenciar]
  - Biro5527 | Eronildo | 07/10/2021 11:07:43 | [Gerenciar]

**Ações por Linha**:
- ** Gerenciar** - Gerenciar documentos de verificação
  - URL: `/administracao/VerificacaoConta/VerificacaoContaArquivosDistribuidor/principal/{id}`
  - Abre página para visualizar e aprovar/rejeitar documentos

## Endpoints Identificados

### Navegação
- **GET** `/administracao/VerificacaoConta/VerificacaoContaArquivosEmAnalise/listar` - Listar verificações pendentes
- **GET** `/administracao/VerificacaoConta/VerificacaoContaArquivosDistribuidor/principal/{id}` - Gerenciar verificação de um distribuidor

### Filtros
- **Filtro de data**: Data inicial e Data final
- **Busca**: Busca por nome de usuário ou nome

## Entidades de Negócio Identificadas

### Verificação de Conta
- **Distribuidor**: Nome de usuário
- **Customer**: Nome do cliente
- **Data de Envio**: Timestamp de envio dos documentos
- **Status**: Em análise, Aprovado, Rejeitado (presumido)
- **Documentos**: RG, CPF, CNH, Comprovante de Residência, etc. (presumido)

## Padrões de UI/UX

### Tabela
- **Simples**: Apenas 4 colunas
- **Ação única**: Apenas "Gerenciar" por linha
- **Filtros de data**: Range de datas para filtrar envios
- **Busca**: Campo de busca simples

### Workflow
- **Envio pelo distribuidor**: Distribuidor envia documentos
- **Lista de pendentes**: Administrador vê lista de verificações pendentes
- **Gerenciar**: Administrador clica para ver documentos e aprovar/rejeitar

## Observações Técnicas

### Workflow de Verificação
1. Distribuidor envia documentos (RG, CPF, etc.)
2. Sistema registra data de envio
3. Administrador vê lista de pendentes
4. Administrador clica em "Gerenciar"
5. Administrador visualiza documentos
6. Administrador aprova ou rejeita
7. Status atualizado no perfil do distribuidor

### Documentos Presumidos
- RG (Registro Geral)
- CPF (Cadastro de Pessoas Físicas)
- CNH (Carteira Nacional de Habilitação)
- Comprovante de Residência
- Selfie (foto do rosto)
- Outros documentos de identificação

## Submenus de Distribuidores

1. **Contas Bancárias** - Gerenciar contas bancárias
2. **Verificação de Contas** - Verificar documentos de identificação (página atual)
3. **Solicitação de saque** - Gerenciar solicitações de saque
4. **A Rede** - Listar todos os distribuidores
5. **Pendentes** - Distribuidores com cadastro pendente
6. **Relatório de indicados** - Relatório de indicações por patrocinador
7. **Excluidos** - Distribuidores excluídos do sistema
