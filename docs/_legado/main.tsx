import { Analytics } from '@vercel/analytics/react';
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'

// Configura o tema claro como padrão ao carregar a aplicação
const savedTheme = localStorage.getItem('theme');

// Se o tema não estiver salvo, define como 'light'
if (!savedTheme) {
  localStorage.setItem('theme', 'light');
}

// Aplica o tema - se estiver salvo como 'dark', usa dark, caso contrário sempre usa light
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Configurações do Analytics
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    {!isTest && (
      <Analytics 
        mode={isDevelopment ? 'development' : 'production'}
        debug={isDevelopment}
        beforeSend={(event) => {
          // Pode adicionar lógica adicional aqui para filtrar eventos
          // Por exemplo, remover informações sensíveis
          return event;
        }}
      />
    )}
  </>
);