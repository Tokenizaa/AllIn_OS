import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Interface para os itens de FAQ
interface FaqItem {
  question: string;
  answer: string;
}

// Interface para as categorias de FAQ
interface FaqCategory {
  category: string;
  items: FaqItem[];
}

// Dados estáticos das perguntas frequentes para distribuidores e afiliados
const faqData: FaqCategory[] = [
  {
    category: "💼 Oportunidade de Negócio",
    items: [
      {
        question: "Como funciona o programa de afiliados da All-in?",
        answer: "Nosso programa de afiliados é completamente gratuito! Você recebe um link personalizado para divulgar nossos produtos e ganha 20% de comissão sobre todas as vendas realizadas através do seu link. Não há investimento inicial nem taxa de manutenção."
      },
      {
        question: "Quais são os benefícios de ser um distribuidor All-in?",
        answer: "Como distribuidor, você tem acesso a descontos exclusivos (50% na compra dos produtos), pode revender com lucro de até 50%, ganha comissões em vendas online (38%) e constrói uma rede com bônus em até 3 níveis (5% + 3% + 2%). Além disso, recebe treinamento completo e suporte 24h."
      },
      {
        question: "Preciso ter experiência em vendas para ser distribuidor?",
        answer: "Não! Fornecemos treinamento completo, materiais prontos e estratégias comprovadas. Muitos de nossos distribuidores de maior sucesso começaram sem experiência nenhuma. O importante é ter disposição para aprender e seguir nosso sistema."
      },
      {
        question: "Quanto posso ganhar como distribuidor All-in?",
        answer: "Os ganhos variam conforme seu nível de dedicação. Distribuidores ativos ganham em média R$ 3.200/mês. Alguns chegam a R$ 15.000+ mensais com redes consolidadas. O céu é o limite quando você constrói uma equipe sólida!"
      }
    ]
  },
  {
    category: "📋 Processo de Cadastro",
    items: [
      {
        question: "Como me cadastro como distribuidor?",
        answer: "O cadastro é simples e gratuito! Clique em 'Cadastrar-se Agora', preencha seus dados básicos e escolha seu plano. Em até 24h você recebe seu link de afiliado e acesso à plataforma de treinamento. Não há taxa de inscrição no plano básico."
      },
      {
        question: "Quais documentos preciso para me cadastrar?",
        answer: "Você precisa apenas de CPF, RG, comprovante de endereço e dados bancários para recebimento das comissões. Não exigimos experiência prévia ou formação específica. Todo o processo é online e sem burocracia."
      },
      {
        question: "Quanto tempo leva para ser aprovado?",
        answer: "A aprovação é automática para o plano afiliado gratuito. Para planos pagos, nossa equipe analisa em até 24h. Você recebe seu kit de boas-vindas e acesso imediato à plataforma de treinamento assim que aprovado."
      },
      {
        question: "Posso começar como afiliado e depois migrar para distribuidor?",
        answer: "Sim! Muitos começam como afiliados gratuitos para conhecer o negócio e depois migram para planos pagos quando veem os resultados. A transição é simples e você mantém todas as suas comissões acumuladas."
      }
    ]
  },
  {
    category: "💰 Comissões e Pagamentos",
    items: [
      {
        question: "Como funcionam as comissões?",
        answer: "Como afiliado: 20% sobre vendas online. Como distribuidor: 50% lucro na revenda + 38% comissões online + bônus de rede (5% no 1º nível, 3% no 2º, 2% no 3º). Todas as comissões são pagas semanalmente, às terças-feiras."
      },
      {
        question: "Quando recebo minhas comissões?",
        answer: "Pagamentos são realizados toda terça-feira para comissões acumuladas na semana anterior. Você precisa ter pelo menos R$ 50 acumulados para receber. Transferimos diretamente para sua conta bancária sem taxas adicionais."
      },
      {
        question: "Há garantia de pagamento?",
        answer: "Sim! Somos uma empresa sólida com CNPJ ativo desde 2020. Todos os pagamentos são garantidos e realizados pontualmente. Mais de 500 distribuidores já receberam seus pagamentos sem problemas."
      },
      {
        question: "Como acompanhar minhas vendas e comissões?",
        answer: "Você tem acesso a um painel exclusivo onde acompanha vendas em tempo real, comissões acumuladas, sua rede de afiliados e relatórios detalhados. Tudo online e disponível 24h por dia."
      }
    ]
  },
  {
    category: "🎯 Suporte e Treinamento",
    items: [
      {
        question: "Que tipo de treinamento é oferecido?",
        answer: "Oferecemos treinamento completo incluindo: técnicas de vendas, marketing digital, gestão de redes sociais, atendimento ao cliente, estratégias de abordagem e muito mais. Tudo em formato de vídeo-aulas, PDFs e webinars ao vivo."
      },
      {
        question: "Como funciona o suporte aos distribuidores?",
        answer: "Você tem acesso a suporte especializado via WhatsApp, e-mail e nossa plataforma exclusiva. Além disso, temos uma IA disponível 24h para tirar dúvidas instantâneas sobre produtos, vendas e estratégias."
      },
      {
        question: "Há materiais de marketing prontos?",
        answer: "Sim! Fornecemos artes para redes sociais, textos prontos, vídeos promocionais, banners, flyers digitais e muito mais. Tudo profissional e otimizado para conversão, pronto para você usar."
      },
      {
        question: "Posso ter ajuda para construir minha rede?",
        answer: "Claro! Nossa equipe oferece acompanhamento personalizado, estratégias específicas para sua região e até ajuda na criação de conteúdo. Além disso, você participa de grupos exclusivos com outros distribuidores de sucesso."
      }
    ]
  }
];

const HomeFAQSection = () => {
  return (
    <section id="faq" className="py-20 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Dúvidas <span className="text-allin-orange">Frequentes</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
            Tudo o que você precisa saber para se tornar um distribuidor ou afiliado de sucesso na All-in
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* FAQ Accordion */}
          <div className="space-y-8">
            {faqData.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="text-2xl font-bold text-allin-orange mb-6 text-center">{category.category}</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.items.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`item-${catIndex}-${faqIndex}`} 
                      className="bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 rounded-lg border border-allin-orange/40 shadow-md glass-card animate-slide-up" 
                      style={{animationDelay: `${0.05 * (catIndex * 5 + faqIndex)}s`}}
                    >
                      <AccordionTrigger className="text-left font-semibold text-lg px-6 hover:no-underline text-allin-dark dark:text-allin-white hover:text-allin-orange transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-allin-dark/80 dark:text-allin-white/80 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQSection;