# PROMPT — MIGRAR PÁGINAS “INÍCIO”, “SEJA DISTRIBUIDOR” E “LOJA” ENTRE DOIS PROJETOS REACT SEM QUEBRAR APLICAÇÕES

Temos dois projetos React completos no mesmo diretório.

Objetivo:
copiar integralmente as páginas:

* Início
* Seja Distribuidor
* Loja

do diretorio @_legado para o projeto raiz.

A migração NÃO pode quebrar nenhum dos dois sistemas.

NÃO apenas copiar páginas visuais.

A LLM deve identificar AUTOMATICAMENTE toda dependência relacionada e migrar tudo corretamente.

---

# EXECUÇÃO OBRIGATÓRIA

## 1. IDENTIFICAR TODA A ÁRVORE DAS PÁGINAS

Mapear completamente:

* rotas
* layouts
* sublayouts
* wrappers
* templates
* providers
* hooks
* services
* stores
* contexts
* componentes
* assets
* imagens
* ícones
* fontes
* animações
* utilitários
* schemas
* types
* constants
* styles
* CSS
* Tailwind
* SCSS
* libs usadas

Identificar dependências diretas e indiretas.

---

# 2. COPIAR TODOS OS COMPONENTES RELACIONADOS

Migrar automaticamente:

* componentes compartilhados
* componentes específicos
* hero sections
* banners
* carrosséis
* menus
* headers
* footers
* cards
* produtos
* checkout widgets
* CTAs
* formulários
* modais
* animações
* loaders
* sliders
* grids
* sessões institucionais

Nada pode ficar faltando.

---

# 3. COPIAR LAYOUT COMPLETO

Migrar:

* layout principal
* containers
* navegação
* header
* footer
* menus
* mobile menu
* responsive behavior
* themes
* spacing
* typography
* grid system

Preservar:

* pixel perfect
* responsividade
* comportamento original

---

# 4. COPIAR ESTILIZAÇÃO COMPLETA

Migrar:

* Tailwind config
* tokens
* variáveis CSS
* SCSS
* themes
* animations
* keyframes
* design system
* breakpoints
* fonts
* dark mode
* classes utilitárias

Resolver:

* conflitos de classes
* conflitos de Tailwind
* conflitos globais
* CSS duplicado

---

# 5. IDENTIFICAR DEPENDÊNCIAS NPM

Detectar e instalar automaticamente:

* bibliotecas UI
* animações
* sliders
* charts
* ícones
* forms
* validação
* utilitários

Comparar package.json dos dois projetos.

Adicionar apenas dependências necessárias.

Evitar:

* duplicações
* versões incompatíveis
* conflitos

---

# 6. VALIDAR ROTAS

Criar/importar:

* rotas
* lazy loading
* code splitting
* route guards
* SEO routes
* dynamic params

Garantir:

* navegação funcionando
* breadcrumbs funcionando
* links funcionando
* menus funcionando

---

# 7. VALIDAR RESPONSIVIDADE

Testar:

* desktop
* tablet
* mobile

Corrigir:

* overflow
* grids quebrados
* imagens
* menus mobile
* sliders
* sections desalinhadas

---

# 8. VALIDAR PERFORMANCE

Garantir:

* lazy loading
* imports otimizados
* sem re-render desnecessário
* sem bundle gigante
* imagens otimizadas

---

# 9. VALIDAR INTEGRAÇÕES

Verificar:

* APIs
* queries
* hooks
* contextos
* auth
* stores
* analytics
* tracking
* SEO
* metadata

Corrigir adaptações necessárias no projeto destino.

---

# 10. NÃO QUEBRAR O SISTEMA EXISTENTE

Antes de alterar:

* analisar arquitetura dos dois projetos
* detectar conflitos
* detectar componentes iguais
* detectar rotas iguais
* detectar providers duplicados
* detectar contexts conflitantes

Migrar de forma isolada e segura.

---

# 11. PADRONIZAR ESTRUTURA

Após migração:

* reorganizar pastas
* remover duplicações
* padronizar imports
* padronizar aliases
* padronizar tipagens
* padronizar naming

---

# 12. VALIDAR FUNCIONAMENTO FINAL

Executar revisão completa:

* rotas
* console
* network
* renderização
* hydration
* hooks
* layouts
* mobile
* SEO
* acessibilidade

Corrigir automaticamente qualquer erro encontrado.

---

# RESULTADO ESPERADO

As páginas:

* Início
* Seja Distribuidor
* Loja

devem funcionar 100% no projeto destino com:

✅ layout completo
✅ responsividade
✅ componentes
✅ animações
✅ integrações
✅ estilos
✅ assets
✅ navegação
✅ SEO
✅ performance
✅ sem erros
✅ sem quebrar os dois sistemas

A migração deve ser inteligente, contextual e segura.
