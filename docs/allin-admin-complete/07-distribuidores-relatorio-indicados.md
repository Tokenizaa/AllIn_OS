# Distribuidores - Relatório de Indicados

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Distribuidor/Patrocinador/relatorioIndicacoes
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Relatório de Indicações
- **Objetivo**: Relatório de indicações por patrocinador com estatísticas de rede

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Distribuidores expandido, "Relatório de indicados" ativo

### Breadcrumb
- Página inicial > Relatório de Indicações

### Área Principal

#### Barra de Ações
- **Título**: "Relatório de indicações"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )
- **Busca e filtros**: Campo de busca e filtros de data

#### Tabela de Relatório de Indicações

**Colunas**:
1. **Patrocinador** - Nome de usuário do patrocinador
2. **Nome** - Nome completo do patrocinador
3. **Indicados na rede** - Número de indicados ativos na rede (clicável)
4. **Indicados pendentes** - Número de indicados pendentes (clicável)
5. **Indicados totais** - Total de indicados (ativos + pendentes)
6. **Primeiro cadastro do período** - Data/hora do primeiro cadastro no período
7. **Ultimo cadastro periodo** - Data/hora do último cadastro no período

**Dados da Tabela**:
- **Exemplos de Registros**:
  - allinBrasil | All in life style | 192 | 0 | 192 | 31/07/2020 17:20:35 | 18/05/2026 21:07:56
  - aguia | ELIANE RODRIGUES DE JESUS 39445640063 | 25 | 0 | 25 | 10/09/2020 13:17:46 | 10/07/2024 16:30:33
  - juniorind | Junior Padilha | 10 | 0 | 10 | 10/09/2021 15:51:20 | 04/03/2026 16:14:40
  - marcelofagundes | MARCELO ISMAEL DA SILVA FAGUNDES | 10 | 0 | 10 | 18/08/2020 21:57:04 | 10/01/2021 10:14:29
  - ewelynnato | DANIELLE FASSINA | 9 | 0 | 9 | 10/08/2020 14:04:08 | 17/11/2020 18:16:41

**Links Contextuais**:
- **Indicados na rede**: Clicável para filtrar "A Rede" por patrocinador
  - URL: `/administracao/Distribuidor/DistribuidoresARede/listar?limpar_farede17=farede17&farede17[di_ni_patrocinador][operador]==&farede17[di_ni_patrocinador][valor]={id}&farede17[di_data_cad][operador]=periodohr&farede17[di_data_cad][valor][inicio]={inicio}&farede17[di_data_cad][valor][final]={final}`
- **Indicados pendentes**: Clicável para filtrar "Pendentes" por patrocinador
  - URL: `/administracao/Distribuidor/DistribuidoresCadastroPendente/listar?limpar_farede17=farede17&farede17[di_ni_patrocinador][operador]==&farede17[di_ni_patrocinador][valor]={id}&farede17[di_data_cad][operador]=periodohr&farede17[di_data_cad][valor][inicio]={inicio}&farede17[di_data_cad][valor][final]={final}`

**Paginação**:
- **Navegação**: 1, 2, 3, 4, 5, 6, >, Última
- **Total**: 240 registros

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Distribuidor/Patrocinador/relatorioIndicacoes` - Listar relatório
- **GET** `/administracao/Distribuidor/Patrocinador/relatorioIndicacoes/?per_page={n}` - Paginação

### Filtros Contextuais
- **GET** `/administracao/Distribuidor/DistribuidoresARede/listar?...` - Filtrar "A Rede" por patrocinador
- **GET** `/administracao/Distribuidor/DistribuidoresCadastroPendente/listar?...` - Filtrar "Pendentes" por patrocinador

## Entidades de Negócio Identificadas

### Relatório de Indicações
- **Patrocinador**: Nome de usuário do patrocinador
- **Nome**: Nome completo do patrocinador
- **Indicados na rede**: Número de indicados ativos
- **Indicados pendentes**: Número de indicados pendentes de aprovação
- **Indicados totais**: Soma de indicados ativos e pendentes
- **Primeiro cadastro do período**: Data/hora do primeiro cadastro no período filtrado
- **Ultimo cadastro periodo**: Data/hora do último cadastro no período filtrado

### Métricas de Rede
- **Top patrocinadores**: allinBrasil (192 indicados), aguia (25 indicados), juniorind (10 indicados)
- **Período de análise**: Baseado em filtros de data aplicados
- **Taxa de conversão**: Indicados ativos vs totais (no exemplo, todos os pendentes são 0, indicando 100% de conversão)

## Padrões de UI/UX

### Tabela
- **Links contextuais**: Números clicáveis para filtrar em outras páginas
- **Filtros de período**: Data inicial e final para análise
- **Ordenação**: Não identificada no snapshot
- **Paginação**: Navegação por páginas

### Integração entre Páginas
- **Cross-page filtering**: Clicar em "Indicados na rede" filtra a página "A Rede"
- **Cross-page filtering**: Clicar em "Indicados pendentes" filtra a página "Pendentes"
- **Parâmetros de filtro**: Patrocinador ID e período de cadastro

## Observações Técnicas

### Análise de Rede
- **Estrutura multinível**: Sistema de patrocínio com múltiplos níveis
- **Rastreamento temporal**: Registro de data/hora de cada cadastro
- **Filtragem por período**: Possibilidade de analisar períodos específicos
- **Métricas de conversão**: Comparação entre indicados ativos e pendentes

### Parâmetros de Filtro
- **di_ni_patrocinador**: ID do patrocinador
- **di_data_cad**: Data de cadastro com operador "periodohr"
- **valor[inicio]**: Data/hora inicial do período
- **valor[final]**: Data/hora final do período

## Submenus de Distribuidores

1. **Contas Bancárias** - Gerenciar contas bancárias
2. **Verificação de Contas** - Verificar documentos de identificação
3. **Solicitação de saque** - Gerenciar solicitações de saque
4. **A Rede** - Listar todos os distribuidores
5. **Pendentes** - Distribuidores com cadastro pendente
6. **Relatório de indicados** - Relatório de indicações por patrocinador (página atual)
7. **Excluidos** - Distribuidores excluídos do sistema
