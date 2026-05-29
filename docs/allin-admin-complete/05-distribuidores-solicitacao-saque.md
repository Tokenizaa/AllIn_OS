# Distribuidores - Solicitação de Saque

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Solicitaçao de Saque
- **Objetivo**: Gerenciar solicitações de saque de distribuidores

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Distribuidores expandido, "Solicitação de saque" ativo

### Breadcrumb
- Página inicial > Solicitaçao de Saque

### Área Principal

#### Barra de Ações
- **Título**: "Solicitaçao de Saque"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )
- **Busca e filtros**: Campo de busca e múltiplos filtros de data

#### Resumo de Status
- **A depositar**: R$ 90,46
- **Depositado**: R$ 4.561,95
- **Estornado**: R$ 5.221,22
- **Transferindo**: R$ 0,00
- **Erro Transfêrencia**: R$ 0,00

#### Tabela de Solicitações de Saque

**Colunas**:
1. **Nº Saque** - ID da solicitação de saque
2. **Nº Transação** - Número da transação (ordenável)
3. **Nome** - Nome do distribuidor
4. **CPF** - CPF do distribuidor
5. **CNPJ** - CNPJ (para Pessoa Jurídica)
6. **Status** - Status da solicitação
7. **Banco** - Banco ou aplicativo (Outros, pagseguro, etc.)
8. **Tipo Chave PIX** - Tipo de chave PIX
9. **Chave PIX** - Chave PIX para depósito
10. **Data Pedido** - Data do pedido
11. **Data Apuração** - Data de apuração/processamento
12. **Valor Solicitado** - Valor total solicitado
13. **Total Taxas** - Valor das taxas
14. **Valor Depósito** - Valor líquido a depositar
15. **Dados Aplicativo** - Dados do aplicativo bancário
16. **Ações** - Botões de ação

**Dados da Tabela**:
- **Exemplos de Registros**:
  - 26 | 40837 | Eduardo Casanova Valdez Pontel | 05112288051 | (vazio) | Solicitado | Outros | CPF ou CNPJ | 051.122.880-51 | 05/05/2026 | (vazio) | R$ 97,80 | R$ 7,34 | R$ 90,46 | (vazio) | [Visualizar] [Depositar]
  - 13 | 34223 | Eduardo Casanova Valdez Pontel | 05112288051 | (vazio) | Depositado | Outros | CPF ou CNPJ | 051.122.880-51 | 02/08/2025 | 11/08/2025 | R$ 103,80 | R$ 7,79 | R$ 96,01 | (vazio) | [Visualizar] [Reverter]
  - 11 | 34191 | Roselaine Bitencorte Oliveira | 71187561053 | (vazio) | Depositado | Outros | chave aleatória | 38414bd6-1a2e-413a-8508-b93375c8d291 | 01/08/2025 | 11/08/2025 | R$ 50,00 | R$ 3,75 | R$ 46,25 | (vazio) | [Visualizar] [Reverter]
  - 10 | 32876 | Osvaldo Netto | 51517884268 | (vazio) | Estornado | Outros | número de telefone celular | 92992828485 | 05/06/2025 | 11/06/2025 | R$ 1.000,00 | R$ 75,00 | R$ 925,00 | (vazio) | [Visualizar]

**Status Possíveis**:
- **Solicitado** - Aguardando processamento
- **Depositado** - Depósito realizado
- **Estornado** - Saque estornado/revertido
- **Transferindo** - Em transferência
- **Erro Transfêrencia** - Erro na transferência

**Tipos de Chave PIX**:
- **CPF ou CNPJ** - Documento como chave PIX
- **chave aleatória** - Chave aleatória gerada pelo banco
- **número de telefone celular** - Telefone como chave PIX
- **e-mail** - E-mail como chave PIX (presumido)

**Bancos/Aplicativos**:
- **Outros** - Outros bancos
- **pagseguro** - PagSeguro
- (outros bancos provavelmente suportados)

**Ações por Linha**:
- ** Visualizar** - Visualizar detalhes da solicitação
  - URL: `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/visualizar/{id}`
- ** Depositar** - Marcar como depositado (apenas para status "Solicitado")
  - URL: `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/status/{id}/3`
- ** Estornar** - Estornar saque (apenas para status "Solicitado")
  - URL: `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/status/{id}/2`
- ** Reverter** - Reverter depósito (apenas para status "Depositado")
  - URL: `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/status/{id}/1`

## Endpoints Identificados

### Navegação
- **GET** `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar` - Listar solicitações
- **GET** `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/listar?per_page={n}` - Paginação

### Ações
- **GET** `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/visualizar/{id}` - Visualizar solicitação
- **GET** `/administracao/SolicitacaoSaque/SolicitacaoSaqueTransacoesAdmin/status/{id}/{status_id}` - Alterar status
  - status_id = 1: Reverter/Estornado
  - status_id = 2: Estornar
  - status_id = 3: Depositar

## Entidades de Negócio Identificadas

### Solicitação de Saque
- **ID**: Identificador único
- **Nº Transação**: Número da transação
- **Distribuidor**: Nome do distribuidor
- **CPF/CNPJ**: Documento do distribuidor
- **Status**: Solicitado, Depositado, Estornado, Transferindo, Erro Transfêrencia
- **Banco**: Banco ou aplicativo para depósito
- **Tipo Chave PIX**: Tipo de chave PIX
- **Chave PIX**: Chave para depósito
- **Data Pedido**: Data da solicitação
- **Data Apuração**: Data de processamento
- **Valor Solicitado**: Valor bruto solicitado
- **Total Taxas**: Valor das taxas (provavelmente 7.5%)
- **Valor Depósito**: Valor líquido (Valor Solicitado - Total Taxas)
- **Dados Aplicativo**: Dados adicionais do aplicativo

### Cálculo de Taxas
- **Taxa padrão**: Aproximadamente 7.5% (baseado nos exemplos)
- **Exemplo**: R$ 97,80 - R$ 7,34 = R$ 90,46 (7.5%)
- **Exemplo**: R$ 103,80 - R$ 7,79 = R$ 96,01 (7.5%)
- **Exemplo**: R$ 50,00 - R$ 3,75 = R$ 46,25 (7.5%)
- **Exemplo**: R$ 1.000,00 - R$ 75,00 = R$ 925,00 (7.5%)
- **Exceção**: R$ 295,88 - R$ 0,00 = R$ 295,88 (0% - provavelmente isento)

## Padrões de UI/UX

### Tabela
- **Muitas colunas**: 16 colunas com informações detalhadas
- **Resumo de status**: Cards com totais por status
- **Ações contextuais**: Ações variam conforme status
- **Ordenação**: Coluna Nº Transação ordenável
- **Paginação**: Navegação por páginas

### Workflow
- **Solicitação**: Distribuidor solicita saque
- **Aguardando**: Status "Solicitado"
- **Processamento**: Administrador pode "Depositar" ou "Estornar"
- **Depositado**: Marca como depositado, data de apuração preenchida
- **Reversão**: Pode reverter depósitos já realizados

## Observações Técnicas

### Workflow de Saques
1. Distribuidor solicita saque via PIX
2. Sistema calcula taxas (7.5% padrão)
3. Administrador vê solicitações pendentes
4. Administrador visualiza detalhes
5. Administrador aprova (Depositar) ou rejeita (Estornar)
6. Sistema processa transferência PIX
7. Status atualizado
8. Em caso de erro, pode reverter

### Integração PIX
- **Chave PIX**: Suporta CPF/CNPJ, telefone, e-mail, chave aleatória
- **Bancos**: Múltiplos bancos suportados
- **Taxas**: Taxa fixa de 7.5% (configurável)
- **Isenção**: Alguns casos isentos de taxas

## Submenus de Distribuidores

1. **Contas Bancárias** - Gerenciar contas bancárias
2. **Verificação de Contas** - Verificar documentos de identificação
3. **Solicitação de saque** - Gerenciar solicitações de saque (página atual)
4. **A Rede** - Listar todos os distribuidores
5. **Pendentes** - Distribuidores com cadastro pendente
6. **Relatório de indicados** - Relatório de indicações por patrocinador
7. **Excluidos** - Distribuidores excluídos do sistema
