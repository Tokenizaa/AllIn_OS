# Website - Banner Loja

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Temas/Layout/configurarNo/23
- **Título**: Administração | All-in life style
- **Objetivo**: Configurar banners da loja virtual (carrossel/slideshow)

## Estrutura da Página

### Área Principal

#### Configurações do Carrossel

**Opções de Comportamento**:

1. **Ativar loop nos banners**
   - Radio: Sim (checked) / Não
   - Configuração se os banners devem repetir em loop

2. **Ativar passagem automática nos banners**
   - Radio: Sim (checked) / Não
   - Configuração se os banners devem trocar automaticamente

3. **Pausar ao passar o mouse sobre o banner**
   - Radio: Sim (checked) / Não
   - Configuração se o slideshow deve pausar ao passar o mouse
   - Nota: "Se o banner for muito grande e indicado desligar essa função"

4. **Tempo em segundos que será mostrado cada banner?**
   - Spinbutton: 4 segundos
   - Configuração do tempo de exibição de cada banner

#### Abas de Idioma
- **Aba**: Português BR (selecionada)

#### Lista de Banners

**Campos por Banner**:
1. **Título** - Textbox para título do banner
2. **Link** - Textbox para URL de destino
3. **Imagem** - Upload/seleção de imagem com botão de upload ()
4. **Ordem** - Spinbutton para ordem de exibição
5. **Remover** - Botão () para remover banner

**Banners Configurados**:

1. **Banner 1** (Ordem: 8)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/publico/Distribuidor/DistribuidoresCadastro/formulario
   - Imagem: (configurada)
   - Destino: Formulário de cadastro de distribuidor

2. **Banner 2** (Ordem: 7)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/TENIS%20ESSENCE%20PRETA%20TERAPEUTICO
   - Imagem: (configurada)
   - Destino: Produto específico (Tênis Essence Preta Terapêutico)

3. **Banner 3** (Ordem: 2)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=359
   - Imagem: (configurada)
   - Destino: Produto ID 359

4. **Banner 4** (Ordem: 3)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=358
   - Imagem: (configurada)
   - Destino: Produto ID 358

5. **Banner 5** (Ordem: 4)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=359
   - Imagem: (configurada)
   - Destino: Produto ID 359

6. **Banner 6** (Ordem: 5)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=360
   - Imagem: (configurada)
   - Destino: Produto ID 360

7. **Banner 7** (Ordem: 6)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=361
   - Imagem: (configurada)
   - Destino: Produto ID 361

8. **Banner 8** (Ordem: 1)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=362
   - Imagem: (configurada)
   - Destino: Produto ID 362

#### Botão de Ação
- **Salvar** - Salvar configurações dos banners

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Temas/Layout/configurarNo/23` - Configurar banners da loja (ID 23)

### Ações
- **POST** `/administracao/Temas/Layout/configurarNo/23` - Salvar configurações (presumido)

## Entidades de Negócio Identificadas

### Configuração de Carrossel
- **Loop**: Ativar/desativar loop infinito
- **Auto-pass**: Ativar/desativar troca automática
- **Pause on hover**: Pausar ao passar o mouse
- **Tempo**: Tempo de exibição em segundos

### Banner
- **Título**: Título descritivo (opcional)
- **Link**: URL de destino ao clicar
- **Imagem**: Imagem do banner
- **Ordem**: Ordem de exibição no carrossel

## Padrões de UI/UX

### Formulário
- **Radio buttons**: Para opções binárias (Sim/Não)
- **Spinbutton**: Para valores numéricos (tempo, ordem)
- **Textbox**: Para texto e URLs
- **Upload de imagem**: Botão dedicado para upload
- **Botão remover**: Para excluir banners

### Organização
- **Agrupamento lógico**: Configurações separadas de lista de banners
- **Abas por idioma**: Suporte a múltiplos idiomas
- **Ordem numérica**: Spinbutton para ordenação

## Observações Técnicas

### Comportamento do Carrossel
- **Loop ativo**: Banners repetem infinitamente
- **Auto-pass ativo**: Troca automática habilitada
- **Pause on hover ativo**: Melhora UX ao permitir interação
- **Tempo**: 4 segundos por banner

### Links dos Banners
- **Foco em produtos**: 7 de 8 banners direcionam para produtos
- **Formulário de cadastro**: 1 banner direciona para formulário de cadastro
- **Produtos específicos**: IDs 358, 359, 360, 361, 362
- **URLs da loja**: Todos os links direcionam para a loja virtual

### Ordem dos Banners
- **Ordem completa**: 1, 2, 3, 4, 5, 6, 7, 8
- **Banner de cadastro**: Ordem 8 (último)
- **Produtos**: Ordens 1-7

### Comparação com Banners Site
- **Mesma estrutura**: Interface idêntica aos banners do site
- **Mesmas configurações**: Loop, auto-pass, pause on hover, tempo
- **Diferente conteúdo**: Links focados em produtos vs mistura site/loja
- **Mais banners**: 8 banners na loja vs 7 no site

### Integração com Loja Virtual
- **Links para produtos**: 7 banners direcionam para produtos específicos
- **IDs de produtos**: product_id=358, 359, 360, 361, 362
- **URLs da loja**: https://allinbrasil.com.br/loja/...
- **Formulário de cadastro**: Banner direciona para captura de novos distribuidores

### Estratégia de Marketing
- **Conversão**: Banners focados em produtos para gerar vendas
- **Aquisição**: Banner para cadastro de novos distribuidores
- **Produtos em destaque**: Múltiplos banners para produtos específicos
- **Carrossel completo**: 8 banners para maximizar exposição

## Submenus de Website

1. **Elementos Site** - Gestão de todos os elementos do site
2. **Postagens** - Gestão de categorias de postagens
3. **Banners site** - Configuração de banners do site principal
4. **Banner loja** - Configuração de banners da loja virtual (página atual)
