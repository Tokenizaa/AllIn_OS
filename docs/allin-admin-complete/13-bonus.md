# Bônus

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Bonus/BonusUtilizados/listar
- **Título**: Administração | All-in life style
- **Objetivo**: Gerenciar bônus instalados no sistema

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com "Bônus" ativo

### Área Principal

#### Barra de Ações
- **Título**: "Bônus instalados em seu sistema"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )
- **Busca**: Campo de busca e filtros

#### Tabela de Bônus

**Colunas**:
1. **Imagem** - Imagem do bônus
2. **Sobre o bônus** - Detalhes do bônus

**Dados da Tabela**:

### Bônus Ativos

1. **Bônus de Loja Online Acumulado** (ID: 7)
   - **Descrição**: Paga bônus ao dono do link e mais o patrocinador do dono do link (caso o dono do link tenha o plano Afiliado). Os percentuais de ganhos e as gerações dependem do plano do dono do link. Recebe mesmo se estiver inativo.
   - **Versão**: v4.0
   - **Classe**: BonusLinearV4
   - **Ações**: [Habilitar/Desabilitar] [Mudar configuração] [Relatório] [Log] [Editar título e descrição]

2. **Bônus total recebidos geral - Diretos** (ID: 4)
   - **Descrição**: Paga bônus ao patrocinador toda vez que seu direto realiza compras.
   - **Versão**: v4.0
   - **Classe**: BonusLinearV4
   - **Ações**: [Habilitar/Desabilitar] [Mudar configuração] [Relatório] [Log] [Editar título e descrição]

3. **Bônus de Qualificação Mensal** (ID: 8)
   - **Descrição**: Paga bônus ao distribuidor baseado em sua qualificação mensal.
   - **Versão**: v3.0
   - **Classe**: BonusQualificacaoMensalV3
   - **Ações**: [Habilitar/Desabilitar] [Mudar configuração] [Relatório] [Log] [Previsão] [Executar Pagamento] [Editar título e descrição]

4. **Total de Bônus Recebidos - Indiretos** (ID: 6)
   - **Descrição**: Paga bônus para o distribuidor em 2 níveis de indiretos, advindos de compras de recompra e ativação mensal.
   - **Versão**: v4.0
   - **Classe**: BonusLinearV4
   - **Ações**: [Habilitar/Desabilitar] [Mudar configuração] [Relatório] [Log] [Editar título e descrição]

### Bônus Desabilitados

5. **Bônus de Consumo** (ID: 1)
   - **Descrição**: Paga bônus ao patrocinador toda vez que seu direto realiza compras de recompra e ativação mensal.
   - **Versão**: v4.0
   - **Classe**: BonusLinearV4
   - **Status**: Esse bônus foi desabilitado
   - **Ações**: [Relatório] [Log]

6. **Bônus de Consumo** (ID: 2)
   - **Descrição**: Paga bônus ao patrocinador toda vez que seu direto realiza compras de recompra e ativação mensal.
   - **Versão**: v3.0
   - **Classe**: BonusQualificacaoMensalV3
   - **Status**: Esse bônus foi desabilitado
   - **Ações**: [Relatório] [Log]

7. **Bônus de Consumo 2** (ID: 3)
   - **Descrição**: Paga bônus ao patrocinador toda vez que seu direto realiza compras de recompra e ativação mensal.
   - **Versão**: v3.0
   - **Classe**: BonusQualificacaoMensalV3
   - **Status**: Esse bônus foi desabilitado
   - **Ações**: [Relatório] [Log]

8. **Bônus de Loja Online acumulado** (ID: 5)
   - **Descrição**: Paga bônus para o consultor toda vez que ele indica seu link de loja virtual e alguém utiliza-o para realizar compras na loja externa.
   - **Versão**: v1.0
   - **Classe**: BonusLojaVirtualDoDistribuidorV1
   - **Status**: Esse bônus foi desabilitado
   - **Ações**: [Relatório] [Log]

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Bonus/BonusUtilizados/listar` - Listar bônus

### Ações por Bônus
- **Mudar configuração**: `/administracao/BonusLinearV4/Configuracao/principal/{id}`
- **Relatório**: `/administracao/BonusLinearV4/Relatorio/principal/{id}`
- **Log**: `/administracao/BonusLinearV4/Log/principal/{id}`
- **Editar título e descrição**: `/administracao/Bonus/BonusTituloDescricao/editar/{id}`
- **Previsão**: `/administracao/BonusQualificacaoMensalV3/Previsao/previsao/{id}`
- **Executar Pagamento**: `/administracao/BonusQualificacaoMensalV3/Cron/rodar/{id}`

### Classes de Bônus
- **BonusLinearV4**: Bônus lineares versão 4.0
- **BonusQualificacaoMensalV3**: Bônus de qualificação mensal versão 3.0
- **BonusLojaVirtualDoDistribuidorV1**: Bônus de loja virtual versão 1.0

## Entidades de Negócio Identificadas

### Bônus
- **ID**: Identificador único
- **Nome**: Nome do bônus
- **Descrição**: Descrição do funcionamento
- **Versão**: Versão do algoritmo (v1.0, v3.0, v4.0)
- **Classe**: Classe do algoritmo
- **Status**: Ativo/Desabilitado

### Tipos de Bônus

#### Bônus de Venda Direta
- **Bônus total recebidos geral - Diretos**: Pagamento ao patrocinador por compras de diretos

#### Bônus de Rede
- **Total de Bônus Recebidos - Indiretos**: Pagamento em 2 níveis de indiretos
- **Bônus de Loja Online Acumulado**: Pagamento por indicações de loja virtual

#### Bônus de Qualificação
- **Bônus de Qualificação Mensal**: Pagamento baseado em qualificação mensal

#### Bônus de Consumo (Desabilitados)
- **Bônus de Consumo**: Pagamento por recompra e ativação mensal
- **Bônus de Consumo 2**: Variação do bônus de consumo

## Padrões de UI/UX

### Tabela
- **Cards detalhados**: Cada bônus é um card com informações detalhadas
- **Imagens**: Cada bônus tem imagem representativa
- **Status visual**: "Esse bônus foi desabilitado" para bônus inativos
- **Ações contextuais**: Ações variam conforme status e tipo de bônus

### Ações
- **Mudar configuração**: Disponível apenas para bônus ativos
- **Executar Pagamento**: Disponível apenas para bônus de qualificação
- **Previsão**: Disponível apenas para bônus de qualificação
- **Relatório e Log**: Disponíveis para todos os bônus

## Observações Técnicas

### Sistema de Bônus
- **Múltiplas versões**: Sistema suporta múltiplas versões de algoritmos
- **Classes diferentes**: Diferentes classes para diferentes tipos de bônus
- **Habilitar/Desabilitar**: Possibilidade de ativar/desativar bônus sem remover
- **Execução manual**: Possibilidade de executar pagamentos manualmente

### Bônus Ativos vs Desabilitados
- **4 bônus ativos**: Loja Online, Diretos, Qualificação Mensal, Indiretos
- **4 bônus desabilitados**: 3 versões de Consumo, 1 versão de Loja Online antiga
- **Evolução de versões**: Sistema evoluiu de v1.0 para v4.0

### Tipos de Pagamento
- **Automático**: Bônus calculados automaticamente
- **Manual**: Execução manual via "Executar Pagamento"
- **Previsão**: Possibilidade de prever pagamentos antes de executar
