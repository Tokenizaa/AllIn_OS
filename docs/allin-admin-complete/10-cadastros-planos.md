# Cadastros - Planos

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Planos/Planos/principal
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Planos
- **Objetivo**: Gerenciar planos de adesão, upgrades e renovações

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Cadastros expandido, "Planos" ativo

### Breadcrumb
- Página inicial > Planos

### Área Principal

#### Aviso
- **Mensagem**: "Muito cuidado ao remover um Plano, pois se este não estiver em uso por algum Distribuidor ou não possuir movimentação no estoque, o plano será removido permanentemente do sistema e não poderá ser recuperado."

#### Abas
- **Adesões** (ativa)
- **Upgrades**
- **Renovações**

#### Barra de Ações
- **Ver Lixeira** () - `/administracao/Planos/Planos/inativos`
- **Ver Logs** () - `/administracao/Planos/Planos/logs`
- **Adicionar** (✏) - `/administracao/Planos/Planos/adicionar`
- **Adicionar Filtros** ()
- **Busca**: Campo de busca e filtros

#### Tabela de Planos (Abas Adesões)

**Colunas**:
1. **ID** - Identificador do plano
2. **Imagem Principal** - Imagem do plano
3. **Nome** - Nome do plano
4. **Preço** - Preço do plano
5. **Estoque** - Quantidade em estoque
6. **Status** - Ativo/Inativo
7. **Ações** - Botões de ação

**Dados da Tabela**:
- **343** | Plano Afiliado | R$ 0,00 | 9000 | Sim | [Estoque] [Logs] [Remover] [Editar]
- **1** | Plano Avanço | R$ 997,00 | 1001 | Sim | [Estoque] [Logs] [Remover] [Editar]
- **313** | Plano Excelência | R$ 3.980,00 | 2000 | Sim | [Estoque] [Logs] [Remover] [Editar]

**Ações por Linha**:
- **+** - Gerenciar estoque
  - URL: `/administracao/Planos/Planos/estoque/{id}`
- **** - Ver logs do plano
  - URL: `/administracao/Planos/Planos/logs/{id}`
- **** - Remover plano (com CSRF token)
  - URL: `/administracao/Planos/Planos/remover/{id}/?{csrf_token}`
- **✏** - Editar plano
  - URL: `/administracao/Planos/Planos/editar/{id}/adesao`

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Planos/Planos/principal` - Listar planos (adesões)
- **GET** `/administracao/Planos/Planos/inativos` - Ver lixeira
- **GET** `/administracao/Planos/Planos/logs` - Ver logs de todos os planos
- **GET** `/administracao/Planos/Planos/adicionar` - Adicionar novo plano

### Ações
- **GET** `/administracao/Planos/Planos/estoque/{id}` - Gerenciar estoque
- **GET** `/administracao/Planos/Planos/logs/{id}` - Ver logs de um plano
- **GET** `/administracao/Planos/Planos/remover/{id}/?{csrf_token}` - Remover plano
- **GET** `/administracao/Planos/Planos/editar/{id}/adesao` - Editar plano (adesão)

### Abas
- **Adesões** - Planos de adesão inicial
- **Upgrades** - Planos de upgrade (presumido)
- **Renovações** - Planos de renovação (presumido)

## Entidades de Negócio Identificadas

### Plano
- **ID**: Identificador único
- **Imagem Principal**: Imagem do produto/plano
- **Nome**: Nome do plano
- **Preço**: Preço de venda
- **Estoque**: Quantidade disponível
- **Status**: Ativo/Inativo

### Planos Identificados
1. **Plano Afiliado** (ID: 343)
   - Preço: R$ 0,00 (gratuito)
   - Estoque: 9000
   - Status: Ativo

2. **Plano Avanço** (ID: 1)
   - Preço: R$ 997,00
   - Estoque: 1001
   - Status: Ativo

3. **Plano Excelência** (ID: 313)
   - Preço: R$ 3.980,00
   - Estoque: 2000
   - Status: Ativo

## Padrões de UI/UX

### Tabela
- **Imagens**: Cada plano tem imagem principal
- **Estoque**: Quantidade visível na tabela
- **Ações múltiplas**: 4 ações por linha (Estoque, Logs, Remover, Editar)
- **Status**: Sim/Não para ativo

### Abas
- **Categorização**: Planos divididos por tipo (Adesões, Upgrades, Renovações)
- **Navegação por abas**: Alternar entre tipos de planos

### Segurança
- **CSRF Token**: Token incluído na URL de exclusão
- **Aviso de exclusão**: Mensagem de alerta sobre exclusão permanente

## Observações Técnicas

### Gestão de Estoque
- **Controle de estoque**: Cada plano tem quantidade controlada
- **Gestão de estoque**: Botão "+" para gerenciar estoque
- **Estoque alto**: Planos têm estoque em milhares (9000, 1001, 2000)

### Preços
- **Plano gratuito**: Plano Afiliado é gratuito (R$ 0,00)
- **Faixa de preços**: R$ 0,00 a R$ 3.980,00
- **Estrutura de preços**: 3 níveis (Gratuito, Médio, Alto)

### Abas Presumidas
- **Adesões**: Planos para novos distribuidores
- **Upgrades**: Planos para upgrade de nível
- **Renovações**: Planos para renovação mensal/anual

## Submenus de Cadastros

1. **Planos** - Gerenciar planos de adesão, upgrades e renovações (página atual)
2. **Pedidos** - Gerenciar pedidos (com submenu)
3. **Formas de Pagamento** - Gerenciar formas de pagamento (com submenu)
4. **Qualificação** - Gerenciar qualificações (com submenu)
5. **Verificação Conta** - Gerenciar verificação de conta (com submenu)
6. **Produtos/Planos (Campos)** - Campos personalizados para produtos/planos
7. **Tipo de Cliente** - Tipos de cliente (Pessoa Física/Jurídica)
8. **Tipos Estado Civil** - Tipos de estado civil
9. **Produtos** - Gerenciar produtos (com submenu)
10. **Administradores** - Gerenciar administradores do sistema
11. **Contas Bancária** - Gerenciar contas bancárias (com submenu)
12. **Campos Genéricos** - Campos genéricos do sistema
