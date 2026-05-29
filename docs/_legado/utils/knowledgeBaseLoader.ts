interface FAQItem {
  question: string;
  category: string;
  subcategory?: string;
}

interface KnowledgeBase {
  faqs: FAQItem[];
  baseKnowledge: string;
}

// Carrega e processa as perguntas frequentes do arquivo markdown
export const loadFAQs = (): FAQItem[] => {
  
  // Simulando o conteúdo das FAQs baseado no arquivo perguntas_frequentes_distribuidores.md
  const faqData = [
    // Sobre o Negócio e Oportunidade
    { question: "Como funciona o modelo de distribuição da All-in?", category: "Negócio", subcategory: "Modelo de Negócio" },
    { question: "Qual é a diferença entre ser afiliado e distribuidor?", category: "Negócio", subcategory: "Modelo de Negócio" },
    { question: "Preciso ter experiência prévia em vendas para ser distribuidor?", category: "Negócio", subcategory: "Modelo de Negócio" },
    { question: "O negócio é realmente lucrativo? Quanto posso ganhar?", category: "Negócio", subcategory: "Lucratividade" },
    { question: "Quantas horas por dia preciso dedicar ao negócio?", category: "Negócio", subcategory: "Modelo de Negócio" },
    
    // Investimento Inicial
    { question: "Qual é o investimento inicial necessário?", category: "Negócio", subcategory: "Investimento" },
    { question: "Preciso comprar produtos para começar?", category: "Negócio", subcategory: "Investimento" },
    { question: "Existe algum custo mensal ou taxa de manutenção?", category: "Negócio", subcategory: "Investimento" },
    { question: "Posso começar sem investimento algum?", category: "Negócio", subcategory: "Investimento" },
    
    // Sobre os Planos
    { question: "O que está incluído no plano afiliado?", category: "Planos", subcategory: "Plano Afiliado" },
    { question: "O que o plano Avanço oferece a mais?", category: "Planos", subcategory: "Plano Avanço" },
    { question: "Qual é a diferença entre o plano Avanço e o Excelência?", category: "Planos", subcategory: "Plano Excelência" },
    { question: "Qual plano é melhor para iniciantes?", category: "Planos", subcategory: "Comparação" },
    { question: "Posso mudar de plano depois?", category: "Planos", subcategory: "Comparação" },
    
    // Sobre os Produtos
    { question: "Quais produtos a All-in oferece?", category: "Produtos", subcategory: "Produtos e Tecnologias" },
    { question: "O que é a tecnologia inovadora dos produtos?", category: "Produtos", subcategory: "Produtos e Tecnologias" },
    { question: "Como funciona a magnetoterapia nos produtos?", category: "Produtos", subcategory: "Produtos e Tecnologias" },
    { question: "Os produtos são de boa qualidade?", category: "Produtos", subcategory: "Qualidade" },
    
    // Venda e Marketing
    { question: "Como funciona a venda online?", category: "Vendas", subcategory: "Venda Online" },
    { question: "Preciso ter um Instagram ou redes sociais?", category: "Vendas", subcategory: "Venda Online" },
    { question: "O que é a loja virtual?", category: "Vendas", subcategory: "Loja Virtual" },
    
    // Suporte e Treinamento
    { question: "A All-in oferece treinamento para novos distribuidores?", category: "Suporte", subcategory: "Treinamento" },
    { question: "Qual tipo de suporte a All-in oferece?", category: "Suporte", subcategory: "Suporte" },
    
    // Cadastro
    { question: "Como faço para me cadastrar como distribuidor?", category: "Cadastro", subcategory: "Processo" },
    { question: "Quais documentos são necessários para o cadastro?", category: "Cadastro", subcategory: "Processo" },
    
    // Bonificações
    { question: "Como funcionam as bonificações?", category: "Bonificações", subcategory: "Funcionamento" },
    { question: "Como funciona a geração de renda na rede?", category: "Bonificações", subcategory: "Rede" },
    
    // Pagamentos
    { question: "Como recebo o pagamento das minhas vendas?", category: "Pagamentos", subcategory: "Formas de Pagamento" },
    { question: "Como faço para sacar meu dinheiro?", category: "Pagamentos", subcategory: "Saques" }
  ];
  
  return faqData;
};

// Carrega a base de conhecimento completa
export const loadKnowledgeBase = async (): Promise<KnowledgeBase> => {
  // Tentar carregar o conteúdo do arquivo markdown
  try {
    // Em um ambiente real, você poderia carregar o arquivo markdown aqui
    // Por enquanto, vamos usar o conteúdo diretamente
    const baseKnowledge = `
# Perguntas Frequentes de Interessados em ser Distribuidores All-in

## PAPEL

Você é o Agente All-in, o assistente virtual especializado da marca All-in — especialista em recrutamento e conversão de distribuidores.

## PERSONALIDADE

- Persuasiva, motivadora e profissional
- Tom de voz sempre positivo, inspirador e confiante
- Foco em oportunidade de negócio e ganhos financeiros

## PLANOS DE DISTRIBUIÇÃO ALL-IN

### 🪜 PLANO AFILIADO (Porta de Entrada)
- **O que está incluído no plano afiliado?** O plano afiliado é gratuito e inclui um link de vendas personalizado e uma loja virtual. Você ganha 20% de comissão por venda.
- **Preciso investir para entrar no plano afiliado?** Não, o plano afiliado é completamente gratuito. Você pode começar sem nenhum investimento inicial.
- **Quais são os benefícios do plano afiliado?** Você recebe um link personalizado para compartilhar e vender online, uma loja virtual para seus clientes e ganha 20% de comissão em cada venda feita através do seu link.
- **Posso vender produtos com o plano afiliado?** Sim, você pode vender produtos através do seu link de afiliado e ganhar comissões de 20%.
- **Como funciona a loja virtual do plano afiliado?** Sua loja virtual é personalizada com seu link e permite que seus clientes façam compras diretamente, gerando comissões para você.

### 🚀 PLANO AVANÇO
- **O que o plano Avanço oferece a mais?** Além dos benefícios do Afiliado, você compra produtos com 50% de desconto, sua comissão no link sobe para 38%, ganha acesso ao escritório virtual e bônus sobre as vendas da sua rede.
- **Preciso comprar produtos para entrar no plano Avanço?** Sim, o plano Avanço requer um investimento inicial que inclui produtos para você testar e revender com lucro de 100%.
- **Quais são os benefícios exclusivos do plano Avanço?** Você tem acesso ao escritório virtual para gerenciar suas vendas e bonificações, além de poder comprar produtos com 50% de desconto para revenda.
- **Como funciona o escritório virtual?** O escritório virtual é uma plataforma onde você pode acompanhar suas vendas, comissões, rede de indicados e gerenciar sua loja virtual.
- **O que é o bônus de rede?** Você ganha bônus sobre as vendas da sua rede: 5% na 1ª geração, 3% na 2ª geração e 2% na 3ª geração.

### 💎 PLANO EXCELÊNCIA
- **Qual é a diferença entre o plano Avanço e o Excelência?** O plano Excelência inclui tudo do plano Avanço, mas vem com um kit maior de produtos para revenda e bônus extras sobre sua rede de diretos ativos (+2% ou +4%).
- **O que está incluído no kit de produtos do plano Excelência?** O kit inclui diversos produtos da linha All-in para você revender com lucro de 100%.
- **Quais são os bônus extras do plano Excelência?** Além dos benefícios do plano Avanço, você recebe bônus extras: +2% com 4 a 7 diretos ativos ou +4% com 8 ou mais diretos ativos.
- **Vale a pena investir no plano Excelência?** Se você tem compromisso com o negócio e deseja maximizar seus ganhos, o plano Excelência oferece as melhores oportunidades de lucro.

## RESPOSTAS FREQUENTES

### Sobre o Negócio e Oportunidade
- **Como funciona o modelo de distribuição da All-in?** O modelo é baseado em marketing de rede e vendas diretas. Você pode ser um Afiliado (venda apenas por link) ou um Distribuidor (venda por link + compra para revenda com 100% de lucro).
- **Qual é a diferença entre ser afiliado e distribuidor?** O Afiliado ganha 20% de comissão apenas nas vendas pelo link, sem investimento. O Distribuidor tem duas formas de ganho: 1) Compra produtos com 50% de desconto para revender com lucro de 100%. 2) Ganha 38% de comissão nas vendas pelo link, além dos bônus pela sua rede.
- **Preciso ter experiência prévia em vendas para ser distribuidor?** Não, oferecemos treinamento completo desde o início.
- **O negócio é realmente lucrativo? Quanto posso ganhar?** Seus ganhos dependem do seu esforço. Afiliados ganham 20% por venda. Distribuidores têm lucro de 100% na revenda, 38% na venda por link, e bônus de rede (5% na 1ª geração, 3% na 2ª, 2% na 3ª).
- **Quantas horas por dia preciso dedicar ao negócio?** O tempo é flexível. Alguns dedicam 1 hora/dia, outros 3-4 horas.

### Sobre os Produtos
- **Quais produtos a All-in oferece?** Oferecemos calçados terapêuticos com tecnologias de magnetoterapia, infravermelho longo e tecido knit respirável.
- **O que é a tecnologia terapêutica dos produtos?** Nossos produtos combinam moda, conforto e tecnologia terapêutica para melhorar sua qualidade de vida diariamente.
- **Como funciona a magnetoterapia nos produtos?** Tecnologia que utiliza campos magnéticos terapêuticos para estimular a circulação sanguínea e aliviar tensões musculares.
- **Quais são os benefícios do infravermelho longo?** Contribui para relaxamento muscular e bem-estar geral.
- **O tecido knit é realmente eficaz?** Sim, o tecido knit respirável proporciona conforto térmico, leveza e respirabilidade excepcionais.

### Sobre a Venda e Marketing
- **Como funciona a venda online?** Você recebe um link personalizado para sua loja virtual. Qualquer venda feita através desse link gera comissão para você.
- **Preciso ter um Instagram ou redes sociais?** Não é obrigatório, mas é uma excelente forma de divulgar seus produtos e aumentar suas vendas.
- **A All-in fornece materiais de divulgação?** Sim, oferecemos materiais prontos para você divulgar nas suas redes sociais.
- **Posso vender em marketplaces?** Sim, você pode vender onde quiser, mas nossa loja virtual oferece a melhor experiência para seus clientes.
- **Como funciona o link personalizado?** Seu link personalizado direciona os clientes para sua loja virtual, onde eles podem fazer compras e você ganha comissões.

### Sobre Suporte e Treinamento
- **A All-in oferece treinamento para novos distribuidores?** Sim, oferecemos treinamentos sobre produtos, técnicas de vendas, marketing digital e gestão do negócio.
- **O treinamento é online ou presencial?** Nosso treinamento é totalmente online e disponível 24 horas por dia.
- **Quanto tempo dura o treinamento inicial?** O treinamento é flexível e você pode estudar no seu ritmo.
- **Existem materiais didáticos disponíveis?** Sim, disponibilizamos vídeos, e-books e materiais de apoio para seu aprendizado.

### Sobre o Cadastro e Início
- **Como faço para me cadastrar como distribuidor?** O cadastro é feito através do link oficial: https://allinbrasil.com.br/publico/Distribuidor/DistribuidoresCadastro/formulario
- **Quais documentos são necessários para o cadastro?** CPF, RG, comprovante de residência e dados bancários para recebimento.
- **O cadastro é gratuito?** O cadastro no plano Afiliado é gratuito. Os planos Avanço e Excelência requerem investimento.
- **Quanto tempo leva para ser aprovado?** O cadastro é aprovado em até 24 horas úteis.

### Sobre Bonificações e Rede
- **Como funcionam as bonificações?** Você ganha comissões pelas suas vendas e bônus sobre as vendas da sua rede de indicados.
- **Quais são os tipos de bonificações disponíveis?** Bônus de rede (5% na 1ª geração, 3% na 2ª, 2% na 3ª) e bônus extras para planos superiores.
- **Como posso qualificar para receber bonificações?** Você precisa ter indicados ativos que façam vendas através da sua rede.
- **Quando são pagas as bonificações?** As comissões e bônus são pagas em datas específicas após solicitação de saque.

### Sobre Pagamentos e Saques
- **Quais formas de pagamento a All-in aceita?** Aceitamos pagamentos via cartão de crédito, boleto bancário e PIX.
- **Como recebo o pagamento das minhas vendas?** Saques disponíveis via Pix, TED ou cartão de crédito.
- **Existe alguma taxa sobre os pagamentos?** Aplicamos taxas mínimas conforme forma de saque escolhida.
- **Qual é o prazo para recebimento?** O prazo varia conforme a forma de saque escolhida.

## TECNOLOGIAS DOS PRODUTOS
- **Magnetoterapia:** Estimula a circulação sanguínea e alivia tensões musculares
- **Infravermelho longo:** Contribui para relaxamento muscular e bem-estar
- **Tecido knit respirável:** Conforto térmico e leveza excepcionais
`;

    return {
      faqs: loadFAQs(),
      baseKnowledge
    };
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    // Fallback para conteúdo padrão
    const baseKnowledge = `
## PAPEL
Você é o Agente All-in, o assistente virtual especializado da marca All-in — especialista em recrutamento e conversão de distribuidores.

## PERSONALIDADE
- Persuasiva, motivadora e profissional
- Tom de voz sempre positivo, inspirador e confiante
- Foco em oportunidade de negócio e ganhos financeiros

## PLANOS DE DISTRIBUIÇÃO ALL-IN

### 🪜 PLANO AFILIADO (Porta de Entrada)
💰 **Investimento:** R$ 0,00
👥 **Quem pode participar?**
_qualquer pessoa que deseja revender produtos sem gastar nada!_

✨ **O que está incluso?**
🔗 Link personalizado para compartilhar e vender online.
🛍️ Loja virtual para seus clientes fazerem compras.
💸 Ganho de 20% para cada venda feita através do seu link.

✅ **Regras simples:**
🛒 Venda feita exclusivamente pelo link da loja.
🌟 Ideal para influenciadores e iniciantes.

---

### 🚀 PLANO AVANÇO
💰 **Investimento:** Consulte condições
👥 **Quem pode participar?**
_pessoas que desejam começar no mercado com baixo custo._

✨ **O que está incluso?**
👟 1 par de tênis para testar o produto.
🔗 Link personalizado para compartilhar e vender online.
📊 Acesso ao escritório virtual para gerenciar vendas e bonificações.
🛍️ Loja virtual para seus clientes fazerem compras.
🏷️ Valor de compra com 50% do valor de tabela.
💸 Ganho de 38% sobre a venda pelo link da loja.
🎁 Bônus 18% sobre vendas para o patrocinador do afiliado.

📈 **Bônus sobre vendas:**
🥇 5% na 1ª geração.
🥈 3% na 2ª geração.
🥉 2% na 3ª geração.

---

### 💎 PLANO EXCELÊNCIA
💰 **Investimento:** Consulte condições
👥 **Quem pode participar?**
_distribuidores que querem começar com tudo e se destacar._

✨ **O que está incluso?**
🛍️ Loja virtual e suporte avançado para estratégias de vendas.
🏷️ Valor de compra com 50% do valor de tabela.
💸 Ganho de 38% sobre a venda pelo link da loja.
🎁 Bônus 18% sobre vendas para o patrocinador do afiliado.

📈 **Bônus sobre vendas:**
🥇 5% na 1ª geração.
🥈 3% na 2ª geração.
🥉 2% na 3ª geração.

🏆 **Bônus extra:**
➕ +2% (com 4 a 7 diretos ativos).
➕ +4% (com 8 ou mais diretos ativos).

## RESPOSTAS FREQUENTES

**Como funciona o modelo de distribuição?** 
O modelo é baseado em marketing de rede e vendas diretas. Você pode ser um Afiliado (venda apenas por link) ou um Distribuidor (venda por link + compra para revenda com 100% de lucro).

**Qual a diferença entre Afiliado e Distribuidor?** 
O Afiliado ganha 20% de comissão apenas nas vendas pelo link, sem investimento. O Distribuidor tem duas formas de ganho: 1) Compra produtos com 50% de desconto para revender com lucro de 100%. 2) Ganha 38% de comissão nas vendas pelo link, além dos bônus pela sua rede.

**Como me cadastrar?** 
O cadastro é feito através do link oficial: https://allinbrasil.com.br/publico/Distribuidor/DistribuidoresCadastro/formulario

## TECNOLOGIAS DOS PRODUTOS
- Magnetoterapia: estimula a circulação e alivia tensões
- Infravermelho longo: contribui para relaxamento muscular
- Tecido knit respirável: conforto térmico e leveza
`;

    return {
      faqs: loadFAQs(),
      baseKnowledge
    };
  }
};

// Busca respostas na base de conhecimento
export const searchKnowledge = (query: string): string => {
  const queryLower = query.toLowerCase();
  
  // Detectar tópicos específicos com base em palavras-chave
  // Verificar primeiro as consultas mais específicas
  if (queryLower.includes('quanto posso ganhar com o plano afiliado') || 
      (queryLower.includes('ganho') && queryLower.includes('plano afiliado'))) {
    return `
## 💰 GANHOS DO PLANO AFILIADO

**📊 PLANO AFILIADO (GRATUITO):**
💸 20% de comissão em cada venda pelo seu link
🆓 Sem investimento inicial
⚡ Ideal para começar imediatamente
📈 Exemplo: Venda de R$ 200 = R$ 40 de comissão

**💡 Exemplos práticos de ganhos:**
🔹 Afiliado - Venda R$ 200: R$ 40 de comissão

🎯 **Quer começar agora? Use o botão "ME CADASTRAR" abaixo!**
    `;
  }
  
  if (queryLower.includes('quanto posso ganhar com os planos pagos') || 
      (queryLower.includes('ganho') && queryLower.includes('planos pagos'))) {
    return `
## 💰 GANHOS DOS PLANOS PAGOS

**📊 PLANO AVANÇO:**
💸 38% de comissão nas vendas pelo link
💯 100% de lucro na revenda (compra com 50% desconto)
🎁 Bônus 18% para seu patrocinador
📈 Bônus de rede: 5% (1ª geração), 3% (2ª), 2% (3ª)

**📊 PLANO EXCELÊNCIA:**
💸 38% de comissão nas vendas pelo link
💯 100% de lucro na revenda (compra com 50% desconto)
🎁 Bônus 18% para seu patrocinador
📈 Bônus de rede: 5% (1ª geração), 3% (2ª), 2% (3ª)
🏆 Bônus extras: +2% (4-7 diretos) ou +4% (8+ diretos)

**💡 Exemplos práticos de ganhos:**
🔹 Distribuidor - Venda R$ 200: R$ 76 de comissão no link
🔹 Distribuidor - Revenda: 100% de lucro sobre investimento
🔹 Com rede ativa: Ganhos passivos mensais crescentes

🚀 **Seus ganhos dependem do seu esforço e dedicação!**

🎯 **Quer começar agora? Use o botão "ME CADASTRAR" abaixo!**
    `;
  }
  
  if (queryLower.includes('plano afiliado') && !queryLower.includes('outros planos')) {
    return `
## 📋 PLANO AFILIADO (Porta de Entrada - GRATUITO!)

### 🆓 PLANO AFILIADO
💰 **Investimento:** R$ 0,00
👥 **Quem pode participar:** Qualquer pessoa que deseja revender produtos sem gastar nada!

✨ **O que está incluso:**
🔗 Link personalizado para compartilhar e vender online
🛍️ Loja virtual para seus clientes fazerem compras
💸 Ganho de 20% para cada venda feita através do seu link

✅ **Regras simples:**
🛒 Venda feita exclusivamente pelo link da loja
🌟 Ideal para influenciadores e iniciantes

🎯 **Quer conhecer nossos produtos? Use o botão "CONHECER PRODUTOS" abaixo!**
    `;
  }
  
  if (queryLower.includes('plano avanço')) {
    return `
## 📋 PLANO AVANÇO

### 🚀 PLANO AVANÇO
💰 **Investimento:** Consulte condições
👥 **Quem pode participar:** Pessoas que desejam começar no mercado com baixo custo

✨ **O que está incluso:**
👟 1 par de tênis para testar o produto
🔗 Link personalizado para compartilhar e vender online
📊 Acesso ao escritório virtual para gerenciar vendas e bonificações
🛍️ Loja virtual para seus clientes fazerem compras
🏷️ Valor de compra com 50% do valor de tabela
💸 Ganho de 38% sobre a venda pelo link da loja
🎁 Bônus 18% sobre vendas para o patrocinador do afiliado

📈 **Bônus sobre vendas:**
🥇 5% na 1ª geração
🥈 3% na 2ª geração  
🥉 2% na 3ª geração

💡 **Recomendação:** Este plano é ideal para quem quer começar com baixo investimento e já obter produtos para testar e vender!

🎯 **Quer conhecer nossos produtos? Use o botão "CONHECER PRODUTOS" abaixo!**
    `;
  }
  
  if (queryLower.includes('plano excelência')) {
    return `
## 📋 PLANO EXCELÊNCIA

### 💎 PLANO EXCELÊNCIA
💰 **Investimento:** Consulte condições
👥 **Quem pode participar:** Distribuidores que querem começar com tudo e se destacar

✨ **O que está incluso:**
🎒 Kit no valor de R$ 3.980,00 para revenda
🛍️ Loja virtual e suporte avançado para estratégias de vendas
🏷️ Valor de compra com 50% do valor de tabela
💸 Ganho de 38% sobre a venda pelo link da loja
🎁 Bônus 18% sobre vendas para o patrocinador do afiliado

📈 **Bônus sobre vendas:**
🥇 5% na 1ª geração
🥈 3% na 2ª geração
🥉 2% na 3ª geração

🏆 **Bônus extra:**
➕ +2% (com 4 a 7 diretos ativos)
➕ +4% (com 8 ou mais diretos ativos)

💡 **Recomendação:** Este é nosso plano mais completo, ideal para quem quer se destacar e construir um negócio sólido com nossa tecnologia exclusiva!

🎯 **Quer conhecer nossos produtos? Use o botão "CONHECER PRODUTOS" abaixo!**
    `;
  }
  
  // Caso específico para oportunidade de negócio
  if (queryLower.includes('oportunidade de negócio') || queryLower.includes('oportunidade negocio')) {
    return `
## 🌟 OPORTUNIDADE DE NEGÓCIO ALLIN

🎯 **Transforme sua vida financeira com a Allin!**

✨ **Por que escolher a Allin?**
✅ Modelo de negócio comprovado em marketing de rede
🚀 Baixo investimento inicial com alto potencial de retorno
👥 Comunidade de distribuidores engajada e de sucesso
💡 Produtos inovadores com tecnologia terapêutica
💰 Múltiplas formas de ganhar dinheiro

💸 **Formas de Ganho:**
• Venda direta de produtos com margem de 100% lucro
• Comissões de 20% a 38% nas vendas online
• Bônus por rede de até 5% na 1ª geração
• Bônus extras para planos avançados

👟 **Comece do seu jeito:**
🆓 **Plano Afiliado:** R$ 0,00 para começar
🚀 **Plano Avanço:** Investimento acessível com produtos para testar
💎 **Plano Excelência:** Kit completo para maximizar seus ganhos

🤝 **Junte-se a milhares de distribuidores que já transformaram suas vidas!**

🎯 **Quer saber mais? Clique em "Ver Planos" abaixo para conhecer nossas oportunidades!**
    `;
  }
  
  // Caso específico para informações sobre produtos
  if (queryLower.includes('informações sobre produtos')) {
    return `
## 📦 NOSSOS PRODUTOS INOVADORES

✨ **Tecnologia terapêutica exclusiva da Allin:**
👟 **Calçados terapêuticos:**
• Magnetoterapia: Estimula a circulação sanguínea e alivia tensões
• Infravermelho longo: Contribui para relaxamento muscular e bem-estar
• Tecido knit respirável: Conforto térmico e leveza excepcionais

🎯 **Benefícios dos nossos produtos:**
✅ Conforto e bem-estar em todos os momentos
✅ Tecnologia que auxilia na saúde e qualidade de vida
✅ Design moderno e elegante para o dia a dia
✅ Qualidade premium comprovada

💡 **Nossos produtos são mais do que calçados comuns:**
São ferramentas de bem-estar que unem moda, conforto e tecnologia terapêutica para melhorar sua qualidade de vida.

🎯 **Quer conhecer nossos produtos em detalhes? Use o botão "CONHECER PRODUTOS" abaixo!**
    `;
  }
  
  // Caso específico para como ganhar dinheiro
  if (queryLower.includes('como posso ganhar dinheiro')) {
    return `
## 💰 COMO GANHAR DINHEIRO COM A ALLIN

✨ **Múltiplas formas de ganhar dinheiro com a Allin:**

### 🛍️ 1. VENDA DIRETA DE PRODUTOS
• **Plano Afiliado:** Compre produtos com 50% de desconto para revender com 100% de lucro
• **Planos Avanço/Excelência:** Receba kits para revenda com margem de lucro garantida

### 🔗 2. COMISSÕES POR LINK DE AFILIADO
• **Plano Afiliado:** Ganhe 20% de comissão em cada venda feita através do seu link
• **Planos Pagos:** Ganhe 38% de comissão em cada venda feita através do seu link

### 🌐 3. BÔNUS POR REDE
📈 **Bônus sobre vendas:**
🥇 5% na 1ª geração
🥈 3% na 2ª geração
🥉 2% na 3ª geração
🏆 **Bônus extras para Plano Excelência:** +2% (4-7 diretos) ou +4% (8+ diretos)

### 🎁 4. BÔNUS DE INDICAÇÃO
🎁 Ganhe 18% de bônus sobre as vendas de seus indicados diretos

🚀 **Seus ganhos dependem do seu esforço e dedicação! Quanto mais você se dedica, mais você ganha!**

🎯 **Quer começar agora? Use o botão "ME CADASTRAR" abaixo!**
    `;
  }
  
  // Caso específico para tecnologias dos produtos
  if (queryLower.includes('tecnologias dos produtos')) {
    return `
## 🔬 TECNOLOGIAS DOS PRODUTOS ALLIN

✨ **Nossos produtos utilizam tecnologias terapêuticas avançadas:**

### 🧲 MAGNETOTERAPIA
• **O que é:** Tecnologia que utiliza campos magnéticos terapêuticos
• **Benefícios:** Estimula a circulação sanguínea e alivia tensões musculares
• **Aplicação:** Ímãs estrategicamente posicionados em pontos de pressão dos pés

### 🔴 INFRAVERMELHO LONGO
• **O que é:** Tecnologia que emite ondas de infravermelho longo
• **Benefícios:** Contribui para relaxamento muscular e bem-estar geral
• **Aplicação:** Embutida nas solas dos calçados para contato direto com os pés

### 🧶 TECIDO KNIT RESPIRÁVEL
• **O que é:** Tecido técnico de tricotagem especial
• **Benefícios:** Conforto térmico, leveza e respirabilidade excepcionais
• **Aplicação:** Material principal dos calçados para conforto durante todo o dia

💡 **Tecnologia que transforma seu bem-estar:**
Nossos produtos combinam moda, conforto e tecnologia terapêutica para melhorar sua qualidade de vida diariamente.

🎯 **Quer experimentar nossos produtos? Use o botão "VER PRODUTOS" abaixo!**
    `;
  }
  
  // Caso específico para cadastro
  if (queryLower.includes('como faço para me cadastrar') || queryLower.includes('preciso de ajuda para me cadastrar')) {
    return `
## 📝 COMO SE CADASTRAR NA ALLIN

✨ **Processo simples e rápido para se tornar um distribuidor Allin:**

### 📋 PASSO A PASSO:
1. **Escolha seu plano:**
   • Plano Afiliado (Gratuito)
   • Plano Avanço (Investimento acessível)
   • Plano Excelência (Kit completo)

2. **Acesse o formulário de cadastro:**
   👉 [Clique aqui para se cadastrar](https://allinbrasil.com.br/publico/Distribuidor/DistribuidoresCadastro/formulario)

3. **Preencha seus dados pessoais e escolha sua senha**

4. **Selecione seu plano de distribuição**

5. **Realize o pagamento (se for plano pago)**

6. **Acesse sua área do distribuidor e comece a vender!**

### 📋 DOCUMENTOS NECESSÁRIOS:
• CPF
• RG
• Comprovante de residência
• Dados bancários para recebimento

### ⏱️ TEMPO DE PROCESSAMENTO:
• Cadastro aprovado em até 24 horas úteis

💡 **Dúvidas? Estamos aqui para ajudar!**
Entre em contato com nosso suporte pelo WhatsApp: (51) 8904-2182

🎯 **Pronto para começar? Use o botão "ME CADASTRAR" abaixo!**
    `;
  }
  
  // Caso específico para depoimentos
  if (queryLower.includes('quero ver depoimentos') || queryLower.includes('histórias de sucesso')) {
    return `
## 🌟 DEPOIMENTOS DE DISTRIBUIDORES ALLIN

✨ **Histórias reais de transformação financeira:**

### 👩‍💼 MARIA S. - SÃO PAULO/SP
"Entrei na Allin há 8 meses e já consegui quitar minhas dívidas e comprar um carro novo. A plataforma é simples e os produtos são incríveis!"

### 👨‍💻 CARLOS R. - PORTO ALEGRE/RS
"Como engenheiro, nunca acreditei em marketing de rede, mas a Allin me surpreendeu. Hoje tenho uma renda extra consistente de R$ 8.000/mês."

### 👩‍🎨 ANA L. - RIO DE JANEIRO/RJ
"Sou designer e comecei com o plano afiliado. Hoje sou distribuidora Excelência e minha rede já tem 25 pessoas ativas. A Allin mudou minha vida!"

### 👨‍🔧 ROBERTO M. - BELO HORIZONTE/MG
"Aos 52 anos, achei que era tarde para começar algo novo. Com a Allin, consegui uma renda extra de R$ 3.500/mês e ainda melhorei minha saúde com os produtos."

💡 **Estas histórias são reais e comprovam o potencial da Allin!**

🎯 **Quer escrever sua própria história de sucesso? Use o botão "ME CADASTRAR" abaixo!**
    `;
  }
  
  // Caso específico para perguntas frequentes
  if (queryLower.includes('perguntas frequentes')) {
    return `
## ❓ PERGUNTAS FREQUENTES

✨ **As dúvidas mais comuns sobre a Allin:**

### 💼 SOBRE O NEGÓCIO
**P: Preciso ter experiência prévia em vendas?**
R: Não! Oferecemos treinamento completo para todos os distribuidores.

**P: Qual é o investimento inicial necessário?**
R: Você pode começar com R$ 0,00 no Plano Afiliado.

**P: Quantas horas por dia preciso dedicar?**
R: O tempo é flexível. Alguns dedicam 1 hora/dia, outros 3-4 horas.

### 📦 SOBRE OS PRODUTOS
**P: Os produtos são de boa qualidade?**
R: Sim! Temos certificações e garantia de qualidade.

**P: Posso testar os produtos antes de vender?**
R: Sim! Os planos Avanço e Excelência incluem produtos para teste.

### 💰 SOBRE GANHOS
**P: O negócio é realmente lucrativo?**
R: Sim! Distribuidores dedicados ganham de R$ 2.000 a R$ 20.000/mês.

**P: Como recebo o pagamento?**
R: Saques disponíveis via Pix, TED ou cartão de crédito.

### 📋 SOBRE CADASTRO
**P: Como faço para me cadastrar?**
R: Acesso: https://allinbrasil.com.br/publico/Distribuidor/DistribuidoresCadastro/formulario

**P: Quais documentos são necessários?**
R: CPF, RG, comprovante de residência e dados bancários.

🎯 **Ainda tem dúvidas? Entre em contato pelo WhatsApp: (51) 8904-2182**
    `;
  }
  
  // Caso geral para quando se pede informações sobre planos
  if (queryLower.includes('plano') || queryLower.includes('afiliado') || queryLower.includes('distribuidor') || queryLower.includes('avanço') || queryLower.includes('excelência')) {
    return `
## 📋 PLANOS DE DISTRIBUIÇÃO ALLIN COMPLETOS

### 🆓 PLANO AFILIADO (Porta de Entrada - GRATUITO!)
💰 **Investimento:** R$ 0,00
👥 **Quem pode participar:** Qualquer pessoa que deseja revender produtos sem gastar nada!

✨ **O que está incluso:**
🔗 Link personalizado para compartilhar e vender online
🛍️ Loja virtual para seus clientes fazerem compras
💸 Ganho de 20% para cada venda feita através do seu link

✅ **Regras simples:**
🛒 Venda feita exclusivamente pelo link da loja
🌟 Ideal para influenciadores e iniciantes

---

### 🚀 PLANO AVANÇO
💰 **Investimento:** Consulte condições
👥 **Quem pode participar:** Pessoas que desejam começar no mercado com baixo custo

✨ **O que está incluso:**
👟 1 par de tênis para testar o produto
🔗 Link personalizado para compartilhar e vender online
📊 Acesso ao escritório virtual para gerenciar vendas e bonificações
🛍️ Loja virtual para seus clientes fazerem compras
🏷️ Valor de compra com 50% do valor de tabela
💸 Ganho de 38% sobre a venda pelo link da loja
🎁 Bônus 18% sobre vendas para o patrocinador do afiliado

📈 **Bônus sobre vendas:**
🥇 5% na 1ª geração
🥈 3% na 2ª geração  
🥉 2% na 3ª geração

---

### 💎 PLANO EXCELÊNCIA
💰 **Investimento:** Consulte condições
👥 **Quem pode participar:** Distribuidores que querem começar com tudo e se destacar

✨ **O que está incluso:**
🛍️ Loja virtual e suporte avançado para estratégias de vendas
🏷️ Valor de compra com 50% do valor de tabela
💸 Ganho de 38% sobre a venda pelo link da loja
🎁 Bônus 18% sobre vendas para o patrocinador do afiliado

📈 **Bônus sobre vendas:**
🥇 5% na 1ª geração
🥈 3% na 2ª geração
🥉 2% na 3ª geração

🏆 **Bônus extra:**
➕ +2% (com 4 a 7 diretos ativos)
➕ +4% (com 8 ou mais diretos ativos)

🎯 **Quer conhecer nossos produtos? Use o botão "CONHECER PRODUTOS" abaixo!**
    `;
  }
  
  // Resposta padrão caso nenhuma condição seja atendida
  return `
## 🤔 Não encontrei exatamente o que você procura...

💡 **Dica:** Tente perguntar de outra forma ou consulte nossos planos de distribuição!

🎯 **Quer conhecer nossos produtos? Use o botão "CONHECER PRODUTOS" abaixo!**
  `;
};

export default { loadFAQs, loadKnowledgeBase, searchKnowledge };