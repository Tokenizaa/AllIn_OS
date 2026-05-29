import { loadKnowledgeBase } from './knowledgeBaseLoader';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

/**
 * Parses the FAQ section from the knowledge base markdown content.
 * It groups questions and answers into categories.
 */
export const parseFaqMarkdown = async (): Promise<FaqCategory[]> => {
  try {
    const kb = await loadKnowledgeBase();
    const faqSection = kb.baseKnowledge || '';
    if (!faqSection) return [];

    const categories: FaqCategory[] = [];
    const lines = faqSection.split('\n').filter(line => line.trim() !== '');

    let currentCategory: FaqCategory | null = null;
    
    for (const line of lines) {
      // Verifica se é um cabeçalho de categoria (###)
      if (line.startsWith('### ')) {
        if (currentCategory) {
          categories.push(currentCategory);
        }
        currentCategory = {
          category: line.replace('### ', '').trim(),
          items: [],
        };
      } 
      // Verifica se é uma pergunta e resposta no formato - **Pergunta** Resposta
      else if (line.startsWith('- ') && currentCategory) {
        // Tenta extrair a pergunta e resposta
        const match = line.match(/- \*\*(.*?)\*\* (.*)/);
        if (match) {
          const [, question, answer] = match;
          currentCategory.items.push({ question, answer });
        } else {
          // Se não encontrar o padrão, tenta extrair apenas a pergunta
          const questionMatch = line.match(/- \*\*(.*?)\*\*/);
          if (questionMatch) {
            const question = questionMatch[1];
            currentCategory.items.push({ question, answer: "Informação adicional disponível ao se cadastrar." });
          }
        }
      }
    }
    
    // Adiciona a última categoria se existir
    if (currentCategory) {
      categories.push(currentCategory);
    }
    
    return categories;
  } catch (error) {
    console.error('Error parsing FAQ markdown:', error);
    return [];
  }
};