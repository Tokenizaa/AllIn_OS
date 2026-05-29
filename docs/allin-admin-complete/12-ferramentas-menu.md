# Ferramentas - Estrutura do Menu

## Informações Gerais
- **Menu**: Ferramentas
- **Objetivo**: Ferramentas administrativas para gerenciamento de distribuidores, pedidos, estoque e saldos

## Submenus de Ferramentas

1. **Habilitar Produtos Lojas**
   - URL: `/administracao/Loja/HabilitarProdutosLoja/principal`
   - Ícone: 
   - Objetivo: Habilitar produtos para lojas virtuais

2. **Alterar usuário**
   - URL: `/administracao/Distribuidor/DistribuidoresAlterarUsuarioFerramenta/listar`
   - Ícone: 
   - Objetivo: Alterar dados de usuário de distribuidores

3. **Alterar patrocinador**
   - URL: `/administracao/Distribuidor/DistribuidoresAlterarPatrocinadorFerramenta/listar`
   - Ícone: 
   - Objetivo: Alterar patrocinador de distribuidores

4. **Lançar Qualificação Manual**
   - URL: `/administracao/Qualificacao/QualificacaoManual/relatorio`
   - Ícone: 
   - Objetivo: Lançar qualificações manualmente para distribuidores

5. **Criar Pedido**
   - URL: `/administracao/Compras/CriarCompra/principal`
   - Ícone: 
   - Objetivo: Criar pedidos manualmente

6. **Ativação Mensal**
   - URL: `/administracao/AtivacaoMensal/AtivacaoMensalTransacoes/listar`
   - Ícone: 
   - Objetivo: Gerenciar ativações mensais de distribuidores

7. **Movimentar Saldo**
   - URL: `/administracao/Contas/ContasTransacoesFerramenta/listar`
   - Ícone: 
   - Objetivo: Movimentar saldos de contas de distribuidores

8. **Estoque**
   - URL: `/administracao/Estoque/MovimentacaoEstoque/principal`
   - Ícone: 
   - Objetivo: Gerenciar movimentação de estoque

9. **Movimentar Saldo CD**
   - URL: `/administracao/ContasCd/ContasCdTransacoesFerramenta/listar`
   - Ícone: 
   - Objetivo: Movimentar saldos de contas de CDs (Centros de Distribuição)

## Observações

### Ferramentas de Gestão de Distribuidores
- **Alterar usuário**: Modificação de dados de login
- **Alterar patrocinador**: Mudança de patrocinador na rede
- **Lançar Qualificação Manual**: Qualificação manual de distribuidores

### Ferramentas de Pedidos e Estoque
- **Criar Pedido**: Criação manual de pedidos
- **Estoque**: Gestão de movimentação de estoque
- **Habilitar Produtos Lojas**: Ativação de produtos em lojas

### Ferramentas Financeiras
- **Movimentar Saldo**: Gestão de saldos de distribuidores
- **Movimentar Saldo CD**: Gestão de saldos de CDs
- **Ativação Mensal**: Gestão de ativações mensais

## Padrões de Navegação
- Todas as ferramentas seguem o padrão de URL: `/administracao/{modulo}/{controlador}/{acao}`
- Ferramentas de listagem geralmente terminam em `/listar`
- Ferramentas de ação geralmente terminam em `/principal` ou `/relatorio`
