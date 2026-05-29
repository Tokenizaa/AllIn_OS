# Mapeamento do Sistema de Pedidos - Loja Virtual AllinBrasil

**Data:** 27/05/2026  
**Status:** Em andamento  
**URL Base:** https://allinbrasil.com.br/loja/admin

---

## 📋 Sumário

- [Fluxo de Acesso](#fluxo-de-acesso)
- [Lista de Pedidos](#lista-de-pedidos)
- [Página de Detalhes do Pedido](#página-de-detalhes-do-pedido)
- [Abas do Modal](#abas-do-modal)
- [Seletores CSS](#seletores-css)
- [Estrutura de Dados](#estrutura-de-dados)
- [Workflows](#workflows)

---

## Fluxo de Acesso

### 1. Login no Sistema Admin
- **URL:** https://allinbrasil.com.br/publico
- **Campos:**
  - Usuário: `input[name="login"]`
  - Senha: `input[name="senha"]`
- **Botão:** `button:has-text("Entrar")`
- **URL após login:** https://allinbrasil.com.br/administracao/PaginaInicialAdministrador/Inicio/principal

### 2. Acesso à Loja Virtual
- **Link:** `/administracao/LinkExterno/LojaVirtual/administrar`
- **Redireciona para:** https://allinbrasil.com.br/loja/admin/common/dashboard?token={token}
- **Token:** Parâmetro de autenticação passado na URL

### 3. Navegação para Lista de Pedidos
- **URL:** https://allinbrasil.com.br/loja/admin/sale/order?token={token}
- **Link:** "Ver mais..." na seção de estatísticas do dashboard

---

## Lista de Pedidos

### URL
```
https://allinbrasil.com.br/loja/admin/sale/order?token={token}
```

### Estrutura da Tabela

#### Colunas
1. **Nº** - ID do pedido
2. **Primeiro Nome** - Nome do cliente (com detalhes expandidos)
3. **Valor** - Valor total do pedido
4. **Forma de pagamento** - Método de pagamento
5. **Status** - Situação atual do pedido
6. **Pago** - Status de pagamento
7. **Ações** - Botões de ação

#### Informações Expandidas no Nome do Cliente
- **Distribuidor:** Nome de usuário do distribuidor
- **Tipo de Cliente:** Categoria (ex: Distribuidor, Consumo inteligente)
- **Patrocinador:** Nome do patrocinador
- **Data Criação:** Data/hora de criação do pedido
- **Data pag:** Data/hora de pagamento

#### Botões de Ação
- **Ver ():** Link para `/loja/admin/sale/order/info?token={token}&order_id={id}`
- **Fatura ():** Link para `/loja/admin/sale/order/invoice?token={token}&order_id={id}`
- **Ações (Dropdown):** Menu com opções adicionais

### Paginação
- **Páginas numeradas:** 1, 2, 3, etc.
- **Itens por página:** 15, 30, 45, 60, 75
- **URL:** `?route=sale/order&token={token}&per_page={n}`

### Filtros
- **Busca:** Campo de texto para busca
- **Filtro por status:** Seleção de status
- **Filtro por período:** Data inicial e final

---

## Página de Detalhes do Pedido

### URL
```
https://allinbrasil.com.br/loja/admin/sale/order/info?token={token}&order_id={order_id}
```

### Botões Superiores
- **Comanda ():** `/loja/admin/sale/order/comanda?token={token}&order_id={id}`
- **Fatura ():** `/loja/admin/sale/order/invoice?token={token}&order_id={id}`
- **Envio ():** `/loja/admin/sale/order/shipping?token={token}&order_id={id}`
- **Voltar ():** `/loja/admin/sale/order?token={token}`

---

## Abas do Modal

### 1. Detalhes do Pedido (#tab-order)

#### Campos da Tabela
- **Pedido nº:** ID do pedido
- **Fatura nº:** Botão "Gerar" para gerar fatura
- **Loja:** Nome da loja (All-in life style)
- **URL da loja:** Link para https://allinbrasil.com.br/loja/
- **Cliente:** Nome do cliente (link para edição)
- **Patrocinador:** Usuário e Nome do patrocinador
- **Tipo de cliente:** Categoria do cliente
- **E-mail:** Email do cliente
- **Telefone:** Telefone do cliente
- **CNPJ:** CNPJ do cliente
- **Tipo de pessoa:** Jurídica/Física
- **Total:** Valor total do pedido
- **Situação do pedido:** Status atual
- **Endereço IP:** IP do cliente
- **Navegador:** User agent do navegador
- **Idioma:** Idioma aceito
- **Cadastro:** Data/hora de criação
- **Modificação:** Data/hora de modificação
- **Usuário que finalizou:** Nome do usuário

#### Campos Personalizados
- Tabela com campos customizados
- Botão "Editar" para modificar

---

### 2. Detalhes do Distribuidor (#tab-distribuidor)

#### Nota
"Essa é um compra própria para o distribuidor {nome}"

#### Campos da Tabela
- **Nome:** Nome completo
- **Patrocinador:** Usuário e Nome
- **Data Nascimento:** Data de nascimento
- **E-mail:** Email
- **Endereço:** Rua
- **Cidade / Estado:** Cidade
- **CNPJ:** CNPJ
- **IE:** Inscrição Estadual
- **Razão Social:** Razão social
- **Nome Fantasia:** Nome fantasia

---

### 3. Detalhes do Pagamento (#tab-payment)

#### Nota
"As informações apresentadas dizem respeito ao pagador da transação."

#### Campos da Tabela
- **Nome:** Primeiro nome
- **Sobrenome:** Sobrenome
- **Empresa:** Nome da empresa
- **Endereço:** Rua
- **Número:** Número
- **Bairro:** Bairro
- **Cidade:** Cidade
- **CEP:** CEP
- **Estado:** Estado completo
- **UF:** Sigla do estado
- **País:** País
- **Complemento:** Complemento

---

### 4. Detalhes de Envio (#tab-shipping)

#### Nota
"As informações apresentadas dizem respeito ao destinatário e ao endereço de entrega do pedido"

#### Campos da Tabela
- **Nome:** Primeiro nome
- **Sobrenome:** Sobrenome
- **Telefone:** Telefone
- **Empresa:** Nome da empresa
- **Número:** Número
- **Endereço:** Rua
- **Bairro:** Bairro
- **Cidade:** Cidade
- **CEP:** CEP
- **Estado:** Estado completo
- **UF:** Sigla do estado
- **País:** País
- **Frete:** Tipo de frete (ex: Frete Grátis regra distribuidor)
- **Complemento:** Complemento

---

### 5. Produtos (#tab-product)

#### Colunas da Tabela
- **Produto:** Nome do produto (link para edição) + Tamanho
- **Modelo:** Código do modelo
- **SKU:** SKU do produto
- **Quantidade:** Quantidade
- **Valor:** Valor unitário
- **Total:** Valor total (quantidade × valor)

#### Linhas de Resumo
- **Sub-total por categoria:** Agrupamento por categoria
- **Sub-total:** Valor total antes de descontos
- **Desconto Distribuidor 50%:** Valor do desconto
- **Frete Grátis regra distribuidor:** Valor do frete
- **Total:** Valor final do pedido

---

### 6. Pagamento (#tab-pagamento)

#### Resumo de Pagamento
- **Valor total:** Valor total do pedido
- **Valor confirmado:** Valor confirmado do pagamento

#### Tabela de Pagamentos
- **Nº Pagamento:** ID do pagamento
- **Forma:** Método de pagamento (ex: Boleto 20 dias...)
- **Método:** Método adicional
- **Valor:** Valor pago
- **Confirmado:** Sim/Não
- **Data pagamento:** Data/hora do pagamento
- **Ações:** Botões de ação

---

### 7. Histórico (#tab-history)

#### Colunas da Tabela
- **Cadastro:** Data/hora do evento
- **Comentário:** Descrição do evento
- **Situação:** Status após o evento
- **Cliente notificado:** Sim/Não

#### Tipos de Eventos Comuns
- "Aguardando Liberação na All-in" - Pedido Realizado
- "Status alterado pelo administrador {nome}" - Impresso
- "COMPRA PAGA! Administrador: {nome} IP: {ip} Navegador: {ua} URL: {url} Data: {data} OBS: Executado utilizando o gatilho PagarCompra" - Pedido Pago
- "Status alterado pelo administrador {nome}" - Pedido enviado para cliente

#### Formulário de Adicionar Histórico
- **Situação do pedido:** Combobox com opções:
  - Aguardando Envio do Boleto
  - Aguardando pagamento
  - Ajuste de Sistema
  - baixa automatica
  - Cancelado pela Operadora
  - Cancelamento Revertido
  - Despachado
  - Em analise Financeira
  - Entregue
  - Estornado
  - Impresso
  - liberado impressao
  - Não Aprovado
  - Negado
  - Pedido Cancelado
  - Pedido concluido
  - Pedido em Feira
  - Pedido enviado para cliente
  - Pedido Pago
  - Pedido Realizado
  - Pendente
  - Pré Venda
  - Processando Pedido
  - TESTE JUNIOR

- **Cliente notificado:** Radio Sim/Não
- **Comentário:** Textbox para comentário
- **Botão:** "Adicionar histórico"

---

## Seletores CSS

### Login
- **Usuário:** `input[name="login"]`
- **Senha:** `input[name="senha"]`
- **Botão Entrar:** `button:has-text("Entrar")`

### Lista de Pedidos
- **Tabela:** `table`
- **Linha do pedido:** `tr:has(td)`
- **Link ver:** `a[title="Ver"]` ou `a:has-text("")`
- **Link fatura:** `a[title="Fatura"]` ou `a:has-text("")`
- **Paginação:** `.pagination a`

### Detalhes do Pedido
- **Abas:** `.nav-tabs a`
- **Conteúdo da aba:** `.tab-content`
- **Botão salvar:** `button:has-text("Salvar")`
- **Botão adicionar histórico:** `button:has-text("Adicionar histórico")`

---

## Estrutura de Dados

### Objeto Pedido
```json
{
  "id": "12345",
  "cliente": {
    "nome": "Nome do Cliente",
    "email": "cliente@email.com",
    "telefone": "(11) 99999-9999",
    "tipo_pessoa": "Jurídica",
    "cnpj": "00.000.000/0000-00"
  },
  "distribuidor": {
    "usuario": "usuario",
    "nome": "Nome do Distribuidor",
    "tipo_cliente": "Distribuidor",
    "patrocinador": "Nome do Patrocinador"
  },
  "pagamento": {
    "forma": "Boleto 20 dias",
    "valor": 100.00,
    "confirmado": true,
    "data_pagamento": "2026-04-29 10:00:00"
  },
  "envio": {
    "nome": "Nome do Destinatário",
    "endereco": "Rua Exemplo",
    "numero": "123",
    "bairro": "Bairro",
    "cidade": "Cidade",
    "estado": "SP",
    "cep": "00000-000",
    "frete": "Frete Grátis regra distribuidor"
  },
  "produtos": [
    {
      "nome": "Nome do Produto",
      "modelo": "MOD-001",
      "sku": "SKU-001",
      "quantidade": 2,
      "valor": 50.00,
      "total": 100.00
    }
  ],
  "resumo": {
    "subtotal": 100.00,
    "desconto": 50.00,
    "frete": 0.00,
    "total": 50.00
  },
  "status": "Pedido Pago",
  "data_criacao": "2026-04-29 09:00:00",
  "data_modificacao": "2026-04-29 10:00:00",
  "ip": "192.168.0.1",
  "navegador": "Mozilla/5.0...",
  "historico": [
    {
      "data": "2026-04-29 09:00:00",
      "comentario": "Aguardando Liberação na All-in",
      "situacao": "Pedido Realizado",
      "cliente_notificado": false
    }
  ]
}
```

---

## Workflows

### Workflow de Extração de Pedidos
1. Login no sistema admin
2. Navegar para loja virtual
3. Acessar lista de pedidos
4. Iterar por todas as páginas
5. Para cada pedido:
   - Clicar em "Ver"
   - Extrair dados de todas as abas
   - Salvar dados estruturados
6. Retornar para lista
7. Próximo pedido

### Workflow de Atualização de Status
1. Acessar detalhes do pedido
2. Navegar para aba "Histórico"
3. Selecionar novo status
4. Adicionar comentário
5. Marcar se cliente foi notificado
6. Clicar em "Adicionar histórico"

---

## Próximos Passos

1. Implementar crawler automatizado
2. Testar extração de dados
3. Implementar atualização de status
4. Documentar endpoints de API (se existirem)
5. Criar scripts de automação

---

**Última Atualização:** 27/05/2026 05:52  
**Status:** Mapeamento em andamento
