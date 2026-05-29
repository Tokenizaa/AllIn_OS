# Distribuidores - Excluidos

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Distribuidor/DistribuidoresCadastroExcluido/listar
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Cadastro Excluido
- **Objetivo**: Gerenciar distribuidores excluídos do sistema com opção de restauração

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Distribuidores expandido, "Excluidos" ativo

### Breadcrumb
- Página inicial > Cadastro Excluido

### Área Principal

#### Barra de Ações
- **Título**: "Cadastro excluídos"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar Filtros** (ícone )
- **Busca e filtros**: Campo de busca e múltiplos filtros

#### Tabela de Distribuidores Excluídos

**Colunas**:
1. **Id** (ordenável) - ID do distribuidor
2. **Imagem** - Foto de perfil
3. **Usuário** - Nome de usuário (com sufixo "- Excluído")
4. **Nome** (ordenável) - Nome completo
5. **Patrocinador** - Nome do patrocinador
6. **Bairro** (ordenável) - Bairro de residência
7. **Cidade** (ordenável) - Cidade
8. **Estado** (ordenável) - UF do estado
9. **Telefones** - Número de telefone
10. **Data de Nascimento** (ordenável) - Data de nascimento
11. **Data da Exclusão** - Data em que foi excluído
12. **Ações** - Botão de restauração

**Dados da Tabela**:
- **Total de registros**: 340
- **Paginação**: 20 registros por página
- **Exemplos de Registros**:
  - 1282 | SilviaDega - Excluído | SILVIA REGINA DEGASPERI | belsonhare2020 | Centro | Lajeado | RS | (51) 99597-2169 | 20/07/1973 | 15/12/2025 | [Restaurar]
  - 1281 | SilviaDega - Excluído | SILVIA REGINA DEGASPERI | belsonhare2020 | Centro | Lajeado | RS | (51) 99597-2169 | 20/07/1973 | 15/12/2025 | [Restaurar]
  - 1275 | CONCOLATO - Excluído | MARIA LIZIENE CONCOLATO DA SILVA | FESTEJANDO | CENTRO | Espera Feliz | MG | (32) 98436-1002 | 27/03/1959 | 24/11/2025 | [Restaurar]
  - 1277 | Ale66 - Excluído | Alessandra Manoel Passos | Leall-in | Alto São Bento | Itapema | SC | (43) 99142-6000 | 03/06/1871 | 19/11/2025 | [Restaurar]

**Ações por Linha**:
- ** Restaurar** - Restaurar distribuidor excluído
  - URL: `/administracao/Distribuidor/DistribuidoresCadastroExcluido/reverter/{id}`
  - Provavelmente requer confirmação

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Distribuidor/DistribuidoresCadastroExcluido/listar` - Listar excluídos
- **GET** `/administracao/Distribuidor/DistribuidoresCadastroExcluido/listar?add_ordenacao_oldisrescadta238b65b9b7[campo]={campo}` - Ordenar por coluna
- **GET** `/administracao/Distribuidor/DistribuidoresCadastroExcluido/listar?per_page={n}` - Paginação

### Ações
- **GET** `/administracao/Distribuidor/DistribuidoresCadastroExcluido/reverter/{id}` - Restaurar distribuidor

## Entidades de Negócio Identificadas

### Distribuidor Excluído
- **ID**: Identificador único
- **Usuário**: Nome de usuário (modificado com sufixo "- Excluído")
- **Nome**: Nome completo
- **Patrocinador**: Nome do patrocinador
- **Bairro**: Bairro de residência
- **Cidade**: Cidade
- **Estado**: UF do estado
- **Telefones**: Número de telefone
- **Data de Nascimento**: Data de nascimento
- **Data da Exclusão**: Data em que foi excluído
- **Status**: Excluído (soft delete)

## Padrões de UI/UX

### Tabela
- **Estrutura similar**: Mesma estrutura que "A Rede" e "Pendentes"
- **Ordenação**: Colunas clicáveis com indicadores de ordenação
- **Usuário modificado**: Sufixo "- Excluído" adicionado ao nome de usuário
- **Ação única**: Apenas "Restaurar" por linha

### Workflow de Exclusão
- **Soft Delete**: Distribuidores não são excluídos permanentemente
- **Restauração**: Possível restaurar distribuidores excluídos
- **Rastreamento**: Data de exclusão registrada
- **Modificação de usuário**: Nome de usuário modificado para evitar conflitos

## Observações Técnicas

### Soft Delete
- **Não é exclusão permanente**: Distribuidores são marcados como excluídos
- **Dados preservados**: Todas as informações são mantidas
- **Restauração possível**: Administrador pode reverter a exclusão
- **Modificação de usuário**: Sufixo "- Excluído" adicionado para liberar o nome de usuário original

### Workflow de Exclusão
1. Distribuidor é excluído (por solicitação própria ou administrador)
2. Sistema adiciona sufixo "- Excluído" ao nome de usuário
3. Sistema registra data de exclusão
4. Distribuidor aparece na lista de excluídos
5. Administrador pode restaurar o distribuidor
6. Ao restaurar, nome de usuário original é recuperado

## Submenus de Distribuidores

1. **Contas Bancárias** - Gerenciar contas bancárias
2. **Verificação de Contas** - Verificar documentos de identificação
3. **Solicitação de saque** - Gerenciar solicitações de saque
4. **A Rede** - Listar todos os distribuidores
5. **Pendentes** - Distribuidores com cadastro pendente
6. **Relatório de indicados** - Relatório de indicações por patrocinador
7. **Excluidos** - Distribuidores excluídos do sistema (página atual)

## Resumo da Seção Distribuidores

A seção Distribuidores contém 7 submenus:
1. **A Rede** - Listagem completa de 977 distribuidores ativos
2. **Contas Bancárias** - Gerenciamento de contas bancárias para saques
3. **Verificação de Contas** - Aprovação de documentos de identificação
4. **Solicitação de saque** - Gestão de solicitações de saque via PIX com taxas de 7.5%
5. **Pendentes** - Cadastros aguardando aprovação (0 no momento)
6. **Relatório de indicados** - Estatísticas de rede por patrocinador (240 patrocinadores)
7. **Excluidos** - Distribuidores excluídos com opção de restauração (340 registros)
