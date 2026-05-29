# Relatório de Bônus

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Bonus/BonusAdministrador/bonusMes
- **Título**: Administração | All-in life style
- **Objetivo**: Relatório mensal de bônus pagos e a receber

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com "Relatório de Bônus" ativo

### Área Principal

#### Seção de Ajuda
- **Título**: "Como funciona este relatório?"
- **Descrição**: Este relatório apresenta todos os bônus referentes ao mês selecionado, organizados por tipo e status de pagamento.
- **Legendas**:
  - **Valores Pagos (Verde)**: Bônus já processados e creditados em sua conta
  - **Valores a Receber (Azul)**: Bônus que serão pagos no próximo ciclo de pagamento
  - **Valores Perdidos (Laranja)**: Bônus que não puderam ser pagos devido a regras específicas ou prazos
- **Nota Importante**: Os valores exibidos correspondem ao comissionamento gerado pelas compras realizadas no mês selecionado. Eles podem não coincidir exatamente com o valor creditado em seu saldo de bônus no mesmo período.
- **Dica**: Clique em "Ver transações" para visualizar todas as transações que compõem cada bônus. Use os botões de navegação ou o calendário para consultar outros meses.

#### Navegação por Período
- **Botão << Anterior**: Navegar para mês anterior
- **Seletor de Data**: maio de 2026 (com ícone de calendário)
- **Botão Próximo >>**: Navegar para mês seguinte

#### Resumo
- **TOTAL PAGO**: R$ 9.913,28

#### Tabela de Bônus por Tipo

**Colunas**:
1. **Nome** - Nome do tipo de bônus
2. **Valores** - Valor e status do bônus

**Dados da Tabela**:
- **Bônus total recebidos geral - Diretos**: R$ 6.828,47 pagos [Ver transações]
- **Total de Bônus Recebidos - Indiretos**: R$ 3.084,81 pagos [Ver transações]

**Ações**:
- **Ver transações** () - Visualizar transações detalhadas do bônus
  - URL: `javascript:void(0)` (provavelmente abre modal ou expande seção)

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Bonus/BonusAdministrador/bonusMes` - Relatório de bônus do mês atual
- **GET** `/administracao/Bonus/BonusAdministrador/bonusMes?{params}` - Relatório com filtros de período (presumido)

### Ações
- **Ver transações**: Provavelmente abre modal ou expande seção com detalhes

## Entidades de Negócio Identificadas

### Relatório de Bônus
- **Período**: Mês selecionado (maio de 2026)
- **Total Pago**: R$ 9.913,28
- **Bônus por Tipo**:
  - Diretos: R$ 6.828,47 (68.9% do total)
  - Indiretos: R$ 3.084,81 (31.1% do total)

### Status de Pagamento
- **Pagos**: Bônus já processados e creditados
- **A Receber**: Bônus pendentes de pagamento
- **Perdidos**: Bônus não pagos por regras ou prazos

## Padrões de UI/UX

### Navegação por Período
- **Botões de navegação**: Anterior/Próximo
- **Seletor de calendário**: Seleção de mês específico
- **Resumo destacado**: Total pago em destaque

### Visualização de Dados
- **Tabela simples**: Apenas nome e valores
- **Links contextuais**: "Ver transações" para detalhes
- **Cores por status**: Verde (pagos), Azul (a receber), Laranja (perdidos)

### Seção de Ajuda
- **Explicação clara**: Como funciona o relatório
- **Legendas visuais**: Cores por status
- **Dicas de uso**: Orientações para o usuário

## Observações Técnicas

### Cálculo de Bônus
- **Total**: R$ 9.913,28
- **Distribuição**:
  - Diretos: 68.9% (maior parte)
  - Indiretos: 31.1%
- **Período**: Maio de 2026

### Diferença entre Comissionamento e Crédito
- **Nota importante**: Valores de comissionamento podem não coincidir com valores creditados
- **Motivo**: Possível diferença temporal entre geração e crédito

### Navegação
- **Período mensal**: Relatório focado em mês específico
- **Navegação fácil**: Botões para avançar/recuar meses
- **Calendário**: Seleção direta de mês

## Comparação com Dashboard Inicial

No dashboard inicial (Página Inicial), foi observado:
- **Bônus total recebidos geral - Diretos**: R$ 1.434.493,95 (acumulado geral)
- **Relatório de Bônus**: R$ 9.913,28 (maio de 2026)

Isso indica que:
- Dashboard mostra valores acumulados/históricos
- Relatório de Bônus mostra valores mensais específicos
- Diferença significativa entre valores mensais e totais
