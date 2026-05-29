# Mapeamento do Escritório do Distribuidor - All-in Brasil

**Data:** 27/05/2026  
**Status:** Em andamento  
**URL Base:** https://allinbrasil.com.br/distribuidor  
**Distribuidor:** Guilherme Colussi

---

## 📋 Sumário

- [Menu Principal](#menu-principal)
- [Página Inicial](#página-inicial)
- [Meu Plano](#meu-plano)
- [Meus Pedidos](#meus-pedidos)
- [Loja Virtual](#loja-virtual)
- [Meus Dados](#meus-dados)
- [Verificação de Conta](#verificação-de-conta)
- [Financeiro](#financeiro)
- [Relatórios](#relatórios)
- [Minha Rede](#minha-rede)
- [Downloads](#downloads)

---

## Menu Principal

### Estrutura do Menu Lateral
- **Logo:** Link para página inicial do distribuidor
- **Menu de idioma:** Português BR (com dropdown)
- **Avatar do usuário:** Guilherme Colussi (com dropdown)
- **Itens do menu:**
  - Página Inicial
  - Meu Plano
  - Meus Pedidos
  - Loja Virtual (submenu)
  - Meus Dados (submenu)
  - Verificação de conta
  - Financeiro (submenu)
  - Relatórios (submenu)
  - Minha Rede (submenu)
  - Downloads

---

## Página Inicial

### URL
```
https://allinbrasil.com.br/distribuidor/PaginaInicialDistribuidor/Inicio/principal
```

### Componentes
- **Mensagem de boas-vindas:** "Bem vindo, Guilherme Colussi"
- **Frase motivacional:** "Às vezes o sucesso tarda a chegar, mas sempre aparece para quem vive lutando por ele."

### Cards de Informações
1. **Cadastros Diretos**
   - Valor: 0
   - Link: "Ver Distribuidores" → `/distribuidor/RedeLinear/RedeLinear`

2. **Saldo Loja Online**
   - Valor: R$ 0,00
   - Ícone: 

3. **Saldo para Compra**
   - Valor: R$ 0,00
   - Ícone: 

### Bônus
- **TOTAL DE BÔNUS JÁ RECEBIDOS**
  - Bônus total recebidos geral - Diretos: R$ 0,00
  - Total de Bônus Recebidos - Indiretos: R$ 0,00
  - Bônus de Loja Online Acumulado: R$ 0,00
  - Total de Bônus Extra: R$ 0,00

### Links de Indicação
- **Link da sua loja virtual:** `http://allinbrasil.com.br/loja/Colussi`
  - Botões: Copiar, Acessar
- **Link de patrocínio:** `http://allinbrasil.com.br/cadastro/Colussi`
  - Botões: Copiar, Acessar

### Cadastros Pendentes
- Link: "Visualizar Todos" → `/distribuidor/Planos/CadastrosPendentes`
- Tabela: ID, Imagem, Usuário, Nome, E-mail, Cidade / Estado, Data Cadastro
- Status: Nenhum dado encontrado

### Downloads
- Valor: 25
- Link: "Ver Downloads" → `/distribuidor/Download/DownloadsDistribuidor/listar`

---

## Meu Plano

### URL
```
https://allinbrasil.com.br/distribuidor/Planos/MeuPlano
```

### Informações do Plano
- **Nome:** Plano Avanço
- **Kit:** Kit mostruário 01
- **Descrição:**
  - UM PAR DE TÊNIS
  - LINK DE VENDA (realizar vendas à distância sem sair do conforto do seu lar, e com despesa zero para efetivar a entrega e cobrança.)
  - ESCRITÓRIO VIRTUAL (para controle de suas movimentações e bonificações, pedidos, cadastros, etc...)
  - MINICURSO DE VENDAS
  - E FRETE GRÁTIS NO PRIMEIRO PEDIDO JUNTO COM O KIT INICIAL
- **Data de aquisição:** 04/02/2026 17:13:19
- **Botão:** "Fazer Upgrade" → `/distribuidor/Planos/EscolherPlano/upgrades`

---

## Meus Pedidos

### URL
```
https://allinbrasil.com.br/distribuidor/LinkExterno/LojaVirtual/acessar?rota=account/order&customer_group_id=2020
```

### Redirecionamento
- Redireciona para: `https://allinbrasil.com.br/loja/index.php?language=pt_BR&route=account%2Forder&customer_group_id=2020`
- Abre em nova aba

### Componentes da Página de Pedidos (Loja Virtual)
- **Título:** Histórico de pedidos
- **Botão Exportar:**  Exportar
- **Filtros:** Adicionar Filtros
- **Card de Pedido:**
  - Data da compra: 04/02/2026
  - Total: R$997,00
  - Pedido nº: 24405
  - Pago: Pago
  - Status: Pedido enviado para cliente
  - Botões: Ver (), Reorder (), Menu ()
- **Produto:**
  - Imagem
  - Nome: Plano Avanço
  - Quantidade: 1 unidade - R$997,00 cada
- **Botão:** Comprar novamente

---

## Loja Virtual

### Submenu
- **Compra padrão**
  - URL: `/distribuidor/LinkExterno/LojaVirtual/acessar`
  - Redireciona para loja virtual

---

## Meus Dados

### Submenu
1. **Contas Bancárias**
   - URL: `/distribuidor/ContaBancaria/DistribuidorContaBancaria/listar`
   - Título: Contas Bancárias
   - Botões: Exportar, Adicionar
   - Filtros: Adicionar Filtros
   - Tabela: ID, Nome, Banco, Tipo Chave Pix, Tipo, Chave Pix, Ações
   - Status: Nenhum dado encontrado

2. **Editar Dados Distribuidor**
   - URL: `/distribuidor/Distribuidor/DistribuidoresEditarDados/formulario`
   - Formulário de edição de dados do distribuidor

---

## Verificação de Conta

### URL
```
https://allinbrasil.com.br/distribuidor/VerificacaoConta/DistribuidorEnviarArquivo/formulario
```

### Título
- "Verificação de Conta :: Enviar Arquivos"

### Componentes
- **Botão Salvar:**  Salvar (no topo e no rodapé)
- **Filtro:** "Filtrar pelo nome do documento"
- **Botão Limpar:**  Limpar

### Tabela de Documentos
- **Colunas:** Documento, Situação/Ações, Tipos Permitidos

#### Documentos Disponíveis
1. **Contrato do Distribuidor**
   - Descrição: Contrato do distribuidor para ser assinado e enviado.
   - Tipos permitidos: jpg,png,pdf,doc,docx
   - Ações: Remover arquivo, Buscar, Choose File

2. **CNPJ**
   - Descrição: Cadastro nacional de pessoas jurídicas
   - Tipos permitidos: pdf
   - Ações: Remover arquivo, Buscar, Choose File

---

## Financeiro

### Submenu
1. **Solicitar saque**
   - URL: `/distribuidor/SolicitacaoSaque/Transacao/adicionar`
   - Redireciona para: `/distribuidor/ContaBancaria/DistribuidorContaBancaria/listar`
   - Provavelmente requer conta bancária cadastrada

2. **Transações**
   - URL: `/distribuidor/Contas/ContasTransacoesDistribuidor/listar`
   - Lista de transações do distribuidor

---

## Relatórios

### Submenu
1. **Relatório Pedidos Clientes Finais**
   - URL: `/distribuidor/Compras/LojaOrderRelatorioComprasClientesFinais/listar`
   - Relatório de pedidos de clientes finais

2. **Relatório Bonificação Mensal**
   - URL: `/distribuidor/Bonus/RelatorioBonificacaoMensal/listarPorBonusDistribuidor`
   - Relatório de bonificação mensal por bônus

---

## Minha Rede

### Submenu
1. **Minha Equipe**
   - URL: `/distribuidor/RedeLinear/RedeLinear`
   - Lista de distribuidores na rede

2. **Rede Linear - Organograma**
   - URL: `/distribuidor/RedeLinear/Organograma`
   - Visualização em organograma da rede

3. **Cadastros Pendentes**
   - URL: `/distribuidor/Planos/CadastrosPendentes`
   - Lista de cadastros pendentes de aprovação

---

## Downloads

### URL
```
https://allinbrasil.com.br/distribuidor/Download/DownloadsDistribuidor/listar
```

### Título
- Downloads

### Componentes
- **Botão Exportar:**  Exportar
- **Filtros:** Adicionar Filtros
- **Tabela:** Descrição, Categoria, Ação

### Categorias de Downloads
- Contratos
- Treinamentos
- Premiações
- Campanhas
- Videos all-in

### Downloads Disponíveis
1. Politica de troca oficial (Contratos)
2. Contrato distribuidor allin (Contratos)
3. Treinamento: Como Vender Todos os Dias pelo WhatsApp (Treinamentos)
4. 3 passos para obter seus links (para distribuidores) (Treinamentos)
5. TREINAMENTO PRÁTICO DE VENDAS - PROSPECÇÃO | ABORDAGEM | SUPERAÇÃO DE OBJEÇÕES (Treinamentos)
6. 5 passos para ampliar sua rede (para distribuidores) (Treinamentos)
7. Live- Melhores do Trimestre - 1º trimestre 2025 (Premiações)
8. passo a passo completo do Escritório Virtual (Treinamentos)
9. Campanha de Crescimento All-In (Campanhas)
10. Live - Treinamento Escritório Virtual + Campanha de cresciemnto All-In (Treinamentos)
11. Live - Treinamento de vendas (Treinamentos)
12. PDF - Treinamento de vendas (Treinamentos)
13. PDF-Treinamento Virando a Chave para um Segundo Semestre Extraordinário (Treinamentos)
14. pdf - Como Comprar na loja virtual distribuidor (Treinamentos)
15. PDF- terapias All-In (Treinamentos)
16. PDF - IA no Instagram: Seu novo vendedor 24h (Treinamentos)
17. Vídeo-IA no Instagram: Seu novo vendedor 24h (Treinamentos)
18. Textos-IA no Instagram: Seu novo vendedor 24h (Treinamentos)
19. PDF - O Primeiro Passo da Venda (Treinamentos)
20. Vídeo- Live Motivação 2.0 (Videos all-in)

### Paginação
- Páginas numeradas (1, 2, ...)
- Parâmetro: `?per_page=20`

---

## Padrões Identificados

### URL Patterns
- **Base:** `/distribuidor`
- **Páginas:** `/distribuidor/{Modulo}/{Entidade}/{Ação}`
- **Submenus:** Expansíveis com indicador (/)
- **Links externos:** Redirecionam para loja virtual

### UI Patterns
- **Cards:** Informações resumidas com ícones
- **Tabelas:** Com filtros, exportação e paginação
- **Botões:** Ícones + texto
- **Links:** Com ícones indicativos
- **Status:** "Distribuidor Inativo" no rodapé

### Ícones Comuns
-  Página Inicial
-  Meu Plano
-  Meus Pedidos
-  Loja Virtual
-  Meus Dados
-  Verificação de conta
-  Financeiro
-  Relatórios
-  Minha Rede
-  Downloads

---

## Próximos Passos

1. Navegar para páginas específicas de cada submenu
2. Capturar detalhes de formulários
3. Documentar endpoints de API
4. Mapear workflows de cada funcionalidade
5. Documentar validações e regras de negócio

---

**Última Atualização:** 27/05/2026 06:10  
**Status:** Mapeamento em andamento (menu principal e páginas principais documentadas)
