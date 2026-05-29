# Website - Elementos Site

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Temas/GerenciarConteudo/gerenciar/site
- **Título**: Administração | All-in life style | Editar Temas
- **Breadcrumb**: Página inicial > Editar conteúdo(site)
- **Objetivo**: Gerenciar todos os elementos de conteúdo do site principal

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Website expandido, "Elementos Site" ativo

### Breadcrumb
- Página inicial > Editar conteúdo(site)

### Área Principal

#### Título
- **Heading**: "EDITAR CONTEÚDO(site)"

#### Filtro
- **Campo de filtro**: Textbox para filtrar elementos
- **Botão Filtrar**: Aplicar filtro

#### Tabela de Elementos do Site

**Colunas**:
1. **Nome do Elemento** - Tipo e nome do elemento (clicável)
2. **Editar** - Link para edição

**Dados da Tabela** (organizados por tipo):

### Banners
- **Banner: Banner site** - `/administracao/Temas/Layout/configurarNo/280`

### Botões/Links
- **Botão/Link: Seja revendedor** - `/administracao/Temas/Layout/configurarNo/339`

### Categorias de Postagem
- **Categoria de Postagem: teste** - `/administracao/Postagens/Categorias/editar/6/1`

### Formulários
- **FormularioContatoPorEmail: Form site** - `/administracao/Temas/Layout/configurarNo/304`

### HTML LIVRE (Elementos HTML personalizáveis)
- **HTML LIVRE: Frete gratis** - `/administracao/Temas/Layout/configurarNo/326`
- **HTML LIVRE: Menu rodape** - `/administracao/Temas/Layout/configurarNo/340`
- **HTML LIVRE: QSomos infra** - `/administracao/Temas/Layout/configurarNo/335`
- **HTML LIVRE: QSomos magnoterapia** - `/administracao/Temas/Layout/configurarNo/336`
- **HTML LIVRE: QSomos magnopulse** - `/administracao/Temas/Layout/configurarNo/337`
- **HTML LIVRE: QSomos magnopulse infra** - `/administracao/Temas/Layout/configurarNo/338`
- **HTML LIVRE: Site - Página em manutenção** - `/administracao/Temas/Layout/configurarNo/248`
- **HTML LIVRE: botao login site** - `/administracao/Temas/Layout/configurarNo/327`

### HTML PURO (Elementos HTML puros)
- **HTML PURO: Botao Whats** - `/administracao/Temas/Layout/configurarNo/328`

### Imagens
- **Imagem: Logo site** - `/administracao/Temas/Layout/configurarNo/276`
- **Imagem: oport_img_right** - `/administracao/Temas/Layout/configurarNo/298`

### Menus
- **MenuFlexivel: Menu site** - `/administracao/Temas/Layout/configurarNo/277`

### Postagens Individuais
- **Postagem: Copy rodape** - `/administracao/Postagens/Postagens/editar/5/4`
- **Postagem: Fale Conosco** - `/administracao/Postagens/Postagens/editar/5/1`
- **Postagem: Logo Maxnivel** - `/administracao/Postagens/Postagens/editar/5/5`
- **Postagem: Onde Estamos** - `/administracao/Postagens/Postagens/editar/5/2`
- **Postagem: Redes Sociais** - `/administracao/Postagens/Postagens/editar/5/3`
- **Postagem: Seja Revendedor** - `/administracao/Postagens/Postagens/editar/1/8`

### Categorias de Postagens (Coleções)
- **Postagens: DEPOIMENTOS** - `/administracao/Postagens/Configuracao/gerenciar/3`
- **Postagens: Diversos** - `/administracao/Postagens/Configuracao/gerenciar/8`
- **Postagens: Landing pages** - `/administracao/Postagens/Configuracao/gerenciar/6`
- **Postagens: Notícias** - `/administracao/Postagens/Configuracao/gerenciar/7`
- **Postagens: Oportunidade** - `/administracao/Postagens/Configuracao/gerenciar/1`
- **Postagens: Produtos** - `/administracao/Postagens/Configuracao/gerenciar/4`
- **Postagens: Quem Somos** - `/administracao/Postagens/Configuracao/gerenciar/2`
- **Postagens: Rodapé** - `/administracao/Postagens/Configuracao/gerenciar/5`

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Temas/GerenciarConteudo/gerenciar/site` - Listar elementos do site

### Edição de Elementos
- **GET** `/administracao/Temas/Layout/configurarNo/{id}` - Editar elemento de layout (banner, HTML, imagem, menu, etc.)
- **GET** `/administracao/Postagens/Postagens/editar/{categoria_id}/{postagem_id}` - Editar postagem individual
- **GET** `/administracao/Postagens/Categorias/editar/{categoria_id}/{postagem_id}` - Editar categoria de postagem
- **GET** `/administracao/Postagens/Configuracao/gerenciar/{categoria_id}` - Gerenciar categoria de postagens

## Entidades de Negócio Identificadas

### Elemento de Site
- **Tipo**: Banner, Botão/Link, HTML LIVRE, HTML PURO, Imagem, MenuFlexivel, Postagem, Categoria de Postagem, FormularioContatoPorEmail
- **Nome**: Nome descritivo do elemento
- **ID**: Identificador único para edição

### Tipos de Elementos

#### Elementos Visuais
- **Banner**: Imagens de banner
- **Imagem**: Imagens do site (logo, etc.)
- **HTML LIVRE**: Blocos de HTML personalizáveis
- **HTML PURO**: HTML puro sem formatação

#### Elementos de Navegação
- **MenuFlexivel**: Menus configuráveis
- **Botão/Link**: Botões e links de ação

#### Elementos de Conteúdo
- **Postagem**: Conteúdo textual individual
- **Postagens**: Coleções de postagens por categoria
- **Categoria de Postagem**: Categorias para organização

#### Elementos de Interação
- **FormularioContatoPorEmail**: Formulários de contato

### Categorias de Postagens Identificadas
1. **DEPOIMENTOS** (ID: 3)
2. **Diversos** (ID: 8)
3. **Landing pages** (ID: 6)
4. **Notícias** (ID: 7)
5. **Oportunidade** (ID: 1)
6. **Produtos** (ID: 4)
7. **Quem Somos** (ID: 2)
8. **Rodapé** (ID: 5)

## Padrões de UI/UX

### Tabela
- **Organização por tipo**: Elementos agrupados por tipo (Banner, HTML, Imagem, etc.)
- **Nome descritivo**: Cada elemento tem nome claro e descritivo
- **Link duplo**: Nome e botão Editar ambos levam à mesma página
- **Filtro**: Campo de busca para filtrar elementos

### Navegação
- **Breadcrumb**: Navegação hierárquica clara
- **Links diretos**: Cada elemento tem link direto para edição
- **URLs consistentes**: Padrão de URL por tipo de elemento

## Observações Técnicas

### Sistema de Gestão de Conteúdo (CMS)
- **CMS integrado**: Sistema próprio de gestão de conteúdo
- **Elementos tipados**: Diferentes tipos de elementos com editores específicos
- **Categorização**: Postagens organizadas em categorias
- **Flexibilidade**: HTML LIVRE permite personalização avançada

### Estrutura do Site
- **Modular**: Site composto por elementos independentes
- **Editável**: Todos os elementos são editáveis via admin
- **Categorização de conteúdo**: Postagens organizadas por categorias
- **Elementos reutilizáveis**: HTML LIVRE pode ser reutilizado

### URLs de Edição
- **Layout**: `/administracao/Temas/Layout/configurarNo/{id}`
- **Postagens individuais**: `/administracao/Postagens/Postagens/editar/{categoria_id}/{postagem_id}`
- **Categorias**: `/administracao/Postagens/Configuracao/gerenciar/{categoria_id}`

### Conteúdo do Site
- **Seções principais**: Quem Somos, Oportunidade, Produtos, Notícias, Depoimentos
- **Elementos de rodapé**: Copy rodape, Menu rodape, Redes Sociais
- **Elementos de contato**: Fale Conosco, Onde Estamos
- **Elementos de conversão**: Seja Revendedor, Botao Whats
- **Elementos informativos**: Logo Maxnivel, Logo site

## Submenus de Website

1. **Elementos Site** - Gestão de todos os elementos do site (página atual)
2. **Postagens** - Gestão de postagens e categorias
3. **Banners site** - Gestão de banners do site principal
4. **Banner loja** - Gestão de banners da loja virtual
