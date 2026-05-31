import { Users, Gem, Crown, LucideIcon } from "lucide-react";

export interface Plan {
  name: string;
  price: string;
  icon: LucideIcon;
  popular: boolean;
  description: string;
  mainBenefits: string[];
  networkBonuses?: string[];
  extraBonuses?: string[];
  callToAction: string;
}

export const parsePlan = (planName: string, markdownContent: string): Plan | null => {
  if (!markdownContent) return null;

  let name = "";
  let price = "";
  let description = "";
  let mainBenefits: string[] = [];
  let networkBonuses: string[] = [];
  let extraBonuses: string[] = [];

  // Extrair informações específicas para cada tipo de plano
  if (planName.toLowerCase().includes("afiliado")) {
    // Extrair informações do Plano Afiliado
    name = "PLANO AFILIADO";
    price = "R$ 0,00";
    description = "Qualquer pessoa que deseja revender produtos sem gastar nada!";
    
    // Extrair benefícios principais do Plano Afiliado
    const benefitsMatch = markdownContent.match(/### 🪜 PLANO AFILIADO \(Porta de Entrada\)\n💰 \*\*Investimento:\*\* R\$ 0,00\n👥 \*\*Quem pode participar\?\*\*\n_qualquer pessoa que deseja revender produtos sem gastar nada!_\n\n✨ \*\*O que está incluso\?\*\*\n([\s\S]*?)(?:\n✅|\n---|$)/);
    if (benefitsMatch) {
      mainBenefits = benefitsMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-🔗🛍️💸]\s*/, '').trim())
        .filter(line => line.length > 0)
        .filter((line, index, self) => self.indexOf(line) === index) // Remover duplicados
        .filter(item => {
          // Remover itens que parecem títulos de outros planos
          if (item.includes('PLANO AVANÇO') || item.includes('PLANO EXCELÊNCIA')) return false;
          // Remover itens que parecem descrições de outros planos
          if (item.includes('Investimento:') && !item.includes('R$ 0,00')) return false;
          // Remover títulos de seções
          if (item.includes('**O que está incluso?**') || item.includes('**Bônus sobre vendas:**') || item.includes('**Bônus extra:**')) return false;
          // Remover itens que começam com emojis ou caracteres especiais
          if (/^[#*📌📝🔍📊🚀💡💰👟🔗📊🛍️🏷️💸🎁🎒🥇🥈🥉➕]/.test(item)) return false;
          // Remover itens vazios ou apenas com espaços
          if (item.trim().length === 0) return false;
          return true;
        });
    }
  } else if (planName.toLowerCase().includes("avanço")) {
    // Extrair informações do Plano Avanço
    name = "PLANO AVANÇO";
    price = "Consulte condições";
    description = "Pessoas que desejam começar no mercado com baixo custo";
    
    // Extrair benefícios principais do Plano Avanço
    const benefitsMatch = markdownContent.match(/### 🚀 PLANO AVANÇO\n💰 \*\*Investimento:\*\* Consulte condições\n👥 \*\*Quem pode participar\?\*\*\n_pessoas que desejam começar no mercado com baixo custo\._\n\n✨ \*\*O que está incluso\?\*\*\n([\s\S]*?)(?:\n📈|\n---|$)/);
    if (benefitsMatch) {
      mainBenefits = benefitsMatch[1]
        .split('\n')
        .map(line => {
          // Corrigir comissão de 20% para 38% se necessário
          let cleanedLine = line.replace(/^[-👟🔗📊🛍️🏷️💸🎁]\s*/, '').trim();
          if (cleanedLine.includes('20%') && cleanedLine.includes('venda')) {
            cleanedLine = cleanedLine.replace('20%', '38%');
          }
          return cleanedLine;
        })
        .filter(line => line.length > 0)
        .filter((line, index, self) => self.indexOf(line) === index) // Remover duplicados
        .filter(item => {
          // Remover itens que parecem títulos de outros planos
          if (item.includes('PLANO AFILIADO') || item.includes('PLANO EXCELÊNCIA')) return false;
          // Remover itens que parecem descrições de outros planos
          if (item.includes('Investimento:') && !item.includes('Consulte condições')) return false;
          // Remover itens que são títulos de seções
          if (item.includes('**O que está incluso?**') || item.includes('**Bônus sobre vendas:**') || item.includes('**Bônus extra:**')) return false;
          // Remover itens que começam com emojis ou caracteres especiais indesejados
          if (/^[#*📌📝🔍📊🚀💡💰👟🔗📊🛍️🏷️💸🎁🎒🥇🥈🥉➕]/.test(item)) return false;
          // Remover itens vazios ou apenas com espaços
          if (item.trim().length === 0) return false;
          return true;
        });
    }
    
    // Extrair bônus de rede do Plano Avanço
    const networkMatch = markdownContent.match(/📈 \*\*Bônus sobre vendas:\*\*\n([\s\S]*?)(?:\n---|$)/);
    if (networkMatch) {
      networkBonuses = networkMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-🥇🥈🥉]\s*/, '').trim())
        .filter(line => line.length > 0)
        .filter((line, index, self) => self.indexOf(line) === index) // Remover duplicados
        .filter(item => {
          // Remover itens que parecem títulos de outros planos
          if (item.includes('PLANO AFILIADO') || item.includes('PLANO EXCELÊNCIA')) return false;
          // Remover itens que parecem descrições de outros planos
          if (item.includes('Investimento:') || item.includes('O que está incluso')) return false;
          // Remover títulos de seções
          if (item.includes('**Bônus sobre vendas:**') || item.includes('**Bônus extra:**')) return false;
          // Remover itens que começam com emojis ou caracteres especiais indesejados
          if (/^[#*📌📝🔍📊🚀💡💰👟🔗📊🛍️🏷️💸🎁🎒🥇🥈🥉➕]/.test(item)) return false;
          // Remover itens vazios ou apenas com espaços
          if (item.trim().length === 0) return false;
          return true;
        });
    }
  } else if (planName.toLowerCase().includes("excelência")) {
    // Extrair informações do Plano Excelência
    name = "PLANO EXCELÊNCIA";
    price = "Consulte condições";
    description = "Distribuidores que querem começar com tudo e se destacar";
    
    // Extrair benefícios principais do Plano Excelência
    const benefitsMatch = markdownContent.match(/### 💎 PLANO EXCELÊNCIA\n💰 \*\*Investimento:\*\* Consulte condições\n👥 \*\*Quem pode participar\?\*\*\n_distribuidores que querem começar com tudo e se destacar\._\n\n✨ \*\*O que está incluso\?\*\*\n([\s\S]*?)(?:\n📈|\n---|$)/);
    if (benefitsMatch) {
      mainBenefits = benefitsMatch[1]
        .split('\n')
        .map(line => {
          // Corrigir comissão de 20% para 38% se necessário
          let cleanedLine = line.replace(/^[-🛍️🏷️💸]\s*/, '').trim();
          if (cleanedLine.includes('20%') && cleanedLine.includes('venda')) {
            cleanedLine = cleanedLine.replace('20%', '38%');
          }
          return cleanedLine;
        })
        .filter(line => line.length > 0)
        .filter((line, index, self) => self.indexOf(line) === index) // Remover duplicados
        .filter(item => {
          // Remover itens que parecem títulos de outros planos
          if (item.includes('PLANO AFILIADO') || item.includes('PLANO AVANÇO')) return false;
          // Remover itens que parecem descrições de outros planos
          if (item.includes('Investimento:') && !item.includes('Consulte condições')) return false;
          // Remover itens que são títulos de seções
          if (item.includes('**O que está incluso?**') || item.includes('**Bônus sobre vendas:**') || item.includes('**Bônus extra:**')) return false;
          // Remover itens que começam com emojis ou caracteres especiais indesejados
          if (/^[#*📌📝🔍📊🚀💡💰👟🔗📊🛍️🏷️💸🎁🎒🥇🥈🥉➕]/.test(item)) return false;
          // Remover itens vazios ou apenas com espaços
          if (item.trim().length === 0) return false;
          return true;
        });
    }
    
    // Extrair bônus de rede do Plano Excelência
    const networkMatch = markdownContent.match(/📈 \*\*Bônus sobre vendas:\*\*\n([\s\S]*?)(?:\n🏆|\n---|$)/);
    if (networkMatch) {
      networkBonuses = networkMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-🥇🥈🥉]\s*/, '').trim())
        .filter(line => line.length > 0)
        .filter((line, index, self) => self.indexOf(line) === index) // Remover duplicados
        .filter(item => {
          // Remover itens que parecem títulos de outros planos
          if (item.includes('PLANO AFILIADO') || item.includes('PLANO AVANÇO')) return false;
          // Remover itens que parecem descrições de outros planos
          if (item.includes('Investimento:') || item.includes('O que está incluso')) return false;
          // Remover títulos de seções
          if (item.includes('**Bônus sobre vendas:**') || item.includes('**Bônus extra:**')) return false;
          // Remover itens que começam com emojis ou caracteres especiais indesejados
          if (/^[#*📌📝🔍📊🚀💡💰👟🔗📊🛍️🏷️💸🎁🎒🥇🥈🥉➕]/.test(item)) return false;
          // Remover itens vazios ou apenas com espaços
          if (item.trim().length === 0) return false;
          return true;
        });
    }
    
    // Extrair bônus extras do Plano Excelência
    const extraMatch = markdownContent.match(/🏆 \*\*Bônus extra:\*\*\n([\s\S]*?)(?:\n---|$)/);
    if (extraMatch) {
      extraBonuses = extraMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-➕]\s*/, '').trim())
        .filter(line => line.length > 0)
        .filter((line, index, self) => self.indexOf(line) === index) // Remover duplicados
        .filter(item => {
          // Remover itens que parecem títulos de outros planos
          if (item.includes('PLANO AFILIADO') || item.includes('PLANO AVANÇO')) return false;
          // Remover itens que parecem descrições de outros planos
          if (item.includes('Investimento:') || item.includes('O que está incluso')) return false;
          // Remover títulos de seções
          if (item.includes('**Bônus sobre vendas:**') || item.includes('**Bônus extra:**')) return false;
          // Remover itens que começam com emojis ou caracteres especiais indesejados
          if (/^[#*📌📝🔍📊🚀💡💰👟🔗📊🛍️🏷️💸🎁🎒🥇🥈🥉➕]/.test(item)) return false;
          // Remover itens vazios ou apenas com espaços
          if (item.trim().length === 0) return false;
          return true;
        });
    }
  }

  let icon: LucideIcon = Users;
  if (planName.toLowerCase().includes("avanço")) icon = Gem;
  if (planName.toLowerCase().includes("excelência")) icon = Crown;

  // Definir plano popular (Plano Avanço)
  const popular = planName.toLowerCase().includes("avanço");
  
  // Definir call to action apropriado
  let callToAction = "";
  if (planName.toLowerCase().includes("afiliado")) {
    callToAction = "COMECE AGORA: Sem taxas ou investimento!";
  } else if (planName.toLowerCase().includes("avanço")) {
    callToAction = "BÔNUS EXCLUSIVO: Kit inicial + treinamento VIP";
  } else {
    callToAction = "TUDO INCLUSO: Kit completo + suporte premium";
  }

  return {
    name: name || planName,
    price,
    icon,
    popular,
    description,
    mainBenefits,
    networkBonuses: networkBonuses.length > 0 ? networkBonuses : undefined,
    extraBonuses: extraBonuses.length > 0 ? extraBonuses : undefined,
    callToAction,
  };
};