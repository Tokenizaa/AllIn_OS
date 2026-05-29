# Website - Postagens

## Informações Gerais
- **URL**: https://allinbrasil.com.br/administracao/Postagens/Configuracao
- **Título**: Administração | All-in life style
- **Breadcrumb**: Página inicial > Módulos > Postagens
- **Objetivo**: Gerenciar categorias de postagens do site

## Estrutura da Página

### Header
- Logo All-in, menu hamburger, seletor de idioma, menu de usuário

### Sidebar
Menu lateral com Website expandido, "Postagens" ativo

### Breadcrumb
- Página inicial > Módulos > Postagens

### Área Principal

#### Barra de Ações
- **Título**: "Tipos de Postagens"
- **Botão Exportar** (ícone )
- **Botões de exportação**:  Excel,  CSV,  PDF
- **Botão Adicionar** () - `/administracao/Postagens/Configuracao/adicionar`
- **Botão Adicionar Filtros** (ícone )
- **Busca**: Campo de busca e filtros

#### Tabela de Tipos de Postagens

**Colunas**:
1. **Título** - Nome da categoria de postagem
2. **Url** - URL da categoria no site
3. **Ativo** - Status (Sim/Não)
4. **Data de Cadastro** - Data de criação da categoria
5. **Ações** - Botões de ação

**Dados da Tabela**:
- **Diversos** | https://allinbrasil.com.br/site/diversos | Sim | 22/11/2024 14:24:08 | [Editar] [Gerenciar]
- **Notícias** | https://allinbrasil.com.br/site/noticias | Sim | 21/11/2024 14:50:38 | [Editar] [Gerenciar]
- **Landing pages** | https://allinbrasil.com.br/site/pages | Sim | 04/07/2023 13:20:47 | [Editar] [Gerenciar]
- **Rodapé** | https://allinbrasil.com.br/site/rodape | Sim | 04/07/2023 09:23:38 | [Editar] [Gerenciar]
- **Produtos** | https://allinbrasil.com.br/site/Produto | Sim | 04/07/2023 09:23:19 | [Editar] [Gerenciar]
- **DEPOIMENTOS** | https://allinbrasil.com.br/site/depoimentos | Sim | 04/07/2023 09:23:09 | [Editar] [Gerenciar]
- **Quem Somos** | https://allinbrasil.com.br/site/quem-somos | Sim | 04/07/2023 09:22:59 | [Editar] [Gerenciar]
- **Oportunidade** | https://allinbrasil.com.br/site/oportunidade | Sim | 04/07/2023 09:22:48 | [Editar] [Gerenciar]

**Ações por Linha**:
- **Editar (✏)** - Editar configuração da categoria
  - URL: `/administracao/Postagens/Configuracao/editar/{id}`
- **Gerenciar ()** - Gerenciar postagens dentro da categoria
  - URL: `/administracao/Postagens/Configuracao/gerenciar/{id}`

## Endpoints Identificados

### Navegação
- **GET** `/administracao/Postagens/Configuracao` - Listar tipos de postagens
- **GET** `/administracao/Postagens/Configuracao/adicionar` - Adicionar novo tipo de postagem

### Ações
- **GET** `/administracao/Postagens/Configuracao/editar/{id}` - Editar tipo de postagem
- **GET** `/administracao/Postagens/Configuracao/gerenciar/{id}` - Gerenciar postagens da categoria

## Entidades de Negócio Identificadas

### Tipo de Postagem (Categoria)
- **ID**: Identificador único
- **Título**: Nome da categoria
- **URL**: URL da categoria no site
- **Status**: Ativo/Inativo
- **Data de Cadastro**: Data de criação

### Categorias de Postagens Configuradas

1. **Diversos** (ID: 8)
   - URL: https://allinbrasil.com.br/site/diversos
   - Status: Ativo
   - Data: 22/11/2024 14:24:08

2. **Notícias** (ID: 7)
   - URL: https://allinbrasil.com.br/site/noticias
   - Status: Ativo
   - Data: 21/11/2024 14:50:38

3. **Landing pages** (ID: 6)
   - URL: https://allinbrasil.com.br/site/pages
   - Status: Ativo
   - Data: 04/07/2023 13:20:47

4. **Rodapé** (ID: 5)
   - URL: https://allinbrasil.com.br/site/rodape
   - Status: Ativo
   - Data: 04/07/2023 09:23:38

5. **Produtos** (ID: 4)
   - URL: https://allinbrasil.com.br/site/Produto
   - Status: Ativo
   - Data: 04/07/2023 09:23:19

6. **DEPOIMENTOS** (ID: 3)
   - URL: https://allinbrasil.com.br/site/depoimentos
   - Status: Ativo
   - Data: 04/07/2023 09:23:09

7. **Quem Somos** (ID: 2)
   - URL: https://allinbrasil.com.br/site/quem-somos
   - Status: Ativo
   - Data: 04/07/2023 09:22:59

8. **Oportunidade** (ID: 1)
   - URL: https://allinbrasil.com.br/site/oportunidade
   - Status: Ativo
   - Data: 04/07/2023 09:22:48

## Padrões de UI/UX

### Tabela
- **URLs amigáveis**: URLs legíveis e SEO-friendly
- **Status binário**: Sim/Não para ativo
- **Ações duplas**: Editar configuração e Gerenciar conteúdo
- **Data completa**: Inclui hora e minutos

### Navegação
- **Breadcrumb hierárquico**: Página inicial > Módulos > Postagens
- **Ações contextuais**: Editar vs Gerenciar (configuração vs conteúdo)
- **Exportação**: Opções de exportação padrão

## Observações Técnicas

### Sistema de Postagens
- **Categorização**: Postagens organizadas em categorias
- **URLs personalizáveis**: Cada categoria tem URL própria
- **Gestão separada**: Configuração da categoria vs conteúdo das postagens
- **Todas ativas**: Todas as 8 categorias estão ativas

### Estrutura de URLs
- **Padrão**: https://allinbrasil.com.br/site/{slug}
- **Slugs**: diversos, noticias, pages, rodape, Produto, depoimentos, quem-somos, oportunidade
- **Case sensitivity**: URLs em minúsculas com hífens

### Cronologia de Criação
- **Mais recente**: Diversos (22/11/2024), Notícias (21/11/2024)
- **Mais antigos**: Oportunidade, Quem Somos, DEPOIMENTOS, Produtos, Rodapé, Landing pages (04/07/2023)
- **Evolução**: Sistema criado em 2023, expandido em 2024

### Categorias Principais
- **Conteúdo institucional**: Quem Somos, Oportunidade
- **Conteúdo de marketing**: DEPOIMENTOS, Landing pages
- **Conteúdo informativo**: Notícias, Diversos
- **Elementos de layout**: Rodapé
- **Conteúdo comercial**: Produtos

## Submenus de Website

1. **Elementos Site** - Gestão de todos os elementos do site
2. **Postagens** - Gestão de categorias de postagens (página atual)
3. **Banners site** - Gestão de banners do site principal
4. **Banner loja** - Gestão de banners da loja virtual
