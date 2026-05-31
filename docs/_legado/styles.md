# Guia de Estilos - Design System

## 1. Glassmorphism
**Descrição:** Efeito de vidro com transparência, bordas suaves e cores vibrantes.

### Uso:
```tsx
// Componente com Glassmorphism
<div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg">
  <h3 className="text-xl font-semibold text-white">Título</h3>
  <p className="text-white/80">Conteúdo com efeito de vidro</p>
</div>
```

### Propriedades Principais:
- `bg-white/[0.05-0.2]` - Fundo com transparência
- `backdrop-blur-[4px-12px]` - Efeito de desfoque
- `border border-white/10` - Borda sutil
- `shadow-lg` - Sombra para profundidade

---

## 2. Dark Mode Elegante
**Descrição:** Esquema de cores escuras com destaques vibrantes.

### Cores Recomendadas:
```ts
// tailwind.config.js
theme: {
  extend: {
    colors: {
      dark: {
        primary: '#6D28D9',
        secondary: '#7C3AED',
        background: '#0F172A',
        surface: '#1E293B',
        'surface-light': '#334155',
      }
    }
  }
}
```

### Uso:
```tsx
<div className="min-h-screen bg-dark-background text-gray-100">
  <header className="bg-dark-surface p-6 border-b border-dark-surface-light">
    <h1 className="text-2xl font-bold text-white">Aplicação</h1>
  </header>
  <main className="p-6">
    <button className="bg-dark-primary hover:bg-dark-secondary px-6 py-2 rounded-lg transition-colors">
      Ação Principal
    </button>
  </main>
</div>
```

---

## 3. Landing Page com Hero
**Descrição:** Layout de destaque com chamada para ação.

### Estrutura Base:
```tsx
<section className="relative min-h-screen overflow-hidden">
  {/* Background com gradiente */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30" />
  
  {/* Conteúdo */}
  <div className="relative z-10 container mx-auto px-6 py-20">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Título Impactante
        <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Destaque Especial
        </span>
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Descrição clara e objetiva do seu produto ou serviço.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
          Começar Agora
        </button>
        <button className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
          Saber Mais
        </button>
      </div>
    </div>
  </div>
</section>
```

---

## 4. Cards com Efeito Hover
**Descrição:** Componentes interativos com feedback visual.

### Exemplo de Card:
```tsx
<div className="group relative bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  {/* Imagem */}
  <div className="h-48 bg-gray-100 dark:bg-dark-surface-light overflow-hidden">
    <img 
      src="/imagem.jpg" 
      alt="Descrição" 
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  </div>
  
  {/* Conteúdo */}
  <div className="p-6">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Título do Card</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">
      Descrição breve do conteúdo do card com algumas palavras a mais.
    </p>
    <button className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
      Ver mais →
    </button>
  </div>
</div>
```

---

## 5. Tema SaaS Moderno
**Descrição:** Design limpo e profissional para aplicações SaaS.

### Características:
- Gradientes suaves
- Espaçamento generoso
- Tipografia clara
- Componentes arredondados

### Exemplo de Botão Primário:
```tsx
<button className="relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
  <span className="relative z-10">Comece Agora</span>
  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
</button>
```

### Exemplo de Seção:
```tsx
<section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
  <div className="container mx-auto px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Recursos Poderosos
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
        Tudo que você precisa para ter sucesso em um só lugar.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              {/* Ícone */}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

## 6. Animações e Transições

### Animações Básicas:
```tsx
// Fade In
<div className="animate-fade-in opacity-0">Conteúdo</div>

// Slide Up
<div className="animate-slide-up opacity-0">Conteúdo</div>

// Hover Scale
<button className="hover:scale-105 transition-transform duration-300">
  Botão Interativo
</button>
```

### Adicionando Animações Personalizadas:
```ts
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
      },
    },
  },
}
```

---

## 7. Responsividade

### Breakpoints Padrão:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Exemplo de Layout Responsivo:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Itens do grid */}
</div>
```

### Classes Condicionais:
```tsx
<div className="text-base md:text-lg lg:text-xl">
  Tamanho de texto responsivo
</div>
```

---

## 8. Componentes de Formulário

### Input Estilizado:
```tsx
<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
  Nome
</label>
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
  placeholder="Digite seu nome"
/>
```

### Botão de Envio com Estado de Carregamento:
```tsx
<button
  type="submit"
  disabled={isSubmitting}
  className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
  }`}
>
  {isSubmitting ? (
    <span className="flex items-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Enviando...
    </span>
  ) : (
    'Enviar Mensagem'
  )}
</button>
```

---

## 9. Feedback Visual

### Toast de Notificação:
```tsx
<div className="fixed bottom-4 right-4 z-50">
  <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span>Operação realizada com sucesso!</span>
  </div>
</div>
```

### Esqueleto de Carregamento:
```tsx
<div className="animate-pulse">
  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
</div>
```

---

## 10. Personalização com Variáveis CSS

### Definindo Variáveis no CSS Global:
```css
:root {
  --primary: 99 102 241;  /* indigo-500 */
  --primary-hover: 79 70 229;  /* indigo-600 */
  --background: 249 250 251;  /* gray-50 */
  --foreground: 17 24 39;  /* gray-900 */
}

.dark {
  --primary: 129 140 248;  /* indigo-400 */
  --primary-hover: 167 139 250;  /* purple-400 */
  --background: 17 24 39;  /* gray-900 */
  --foreground: 243 244 246;  /* gray-100 */
}
```

### Usando as Variáveis no Tailwind:
```tsx
<div className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
  <button className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] px-4 py-2 rounded">
    Botão Primário
  </button>
</div>
```

---

## Conclusão

Este guia de estilos fornece uma base sólida para manter a consistência visual em todo o projeto. Sinta-se à vontade para estender e adaptar esses padrões conforme necessário para atender aos requisitos específicos do seu projeto.

Lembre-se de sempre priorizar a acessibilidade, desempenho e experiência do usuário ao implementar esses estilos.
