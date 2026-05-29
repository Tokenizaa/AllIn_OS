# Website - Banners Site

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Temas/Layout/configurarNo/280
- **Título**: Administração | All-in life style
- **Objetivo**: Configurar banners do site principal (carrossel/slideshow)

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
   - Link: https://allinbrasil.com.br/site/home/#oportunidade
   - Imagem: (configurada)

2. **Banner 2** (Ordem: 7)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/TENIS%20ESSENCE%20PRETA%20TERAPEUTICO
   - Imagem: (configurada)

3. **Banner 3** (Ordem: 2)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=359
   - Imagem: (configurada)

4. **Banner 4** (Ordem: 3)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=358
   - Imagem: (configurada)

5. **Banner 5** (Ordem: 4)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=359
   - Imagem: (configurada)

6. **Banner 6** (Ordem: 5)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=360
   - Imagem: (configurada)

7. **Banner 7** (Ordem: 6)
   - Título: (vazio)
   - Link: https://allinbrasil.com.br/loja/index.php?route=product/product&product_id=361
   - Imagem: (configurada)

#### Botão de Ação
- **Salvar** - Salvar configurações dos banners

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Temas/Layout/configurarNo/280` - Configurar banners do site (ID 280)

### Ações
- **POST** `/administracao/Temas/Layout/configurarNo/280` - Salvar configurações (presumido)

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
- **Mistura de destinos**: Links para site principal e loja virtual
- **Produtos específicos**: Muitos links para produtos específicos da loja
- **Seções do site**: Link para seção #oportunidade do site
- **URLs codificadas**: URLs com encoding (%20 para espaços)

### Ordem dos Banners
- **Ordem não sequencial**: 2, 3, 4, 5, 6, 7, 8
- **Possível reordenação**: Banners podem ter sido reordenados
- **Banner 1 ausente**: Não há banner com ordem 1

### Integração com Loja Virtual
- **Links para produtos**: Vários banners direcionam para produtos específicos
- **IDs de produtos**: product_id=358, 359, 360, 361
- **URLs da loja**: https://allinbrasil.com.br/loja/...

## Submenus de Website

1. **Elementos Site** - Gestão de todos os elementos do site
2. **Postagens** - Gestão de categorias de postagens
3. **Banners site** - Configuração de banners do site principal (página atual)
4. **Banner loja** - Configuração de banners da loja virtual
