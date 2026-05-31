import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

const faqData: FaqCategory[] = [
  {
    category: "📦 Produtos",
    items: [
      {
        question: "Quais são os benefícios dos calçados All-In?",
        answer: "Nossos calçados são projetados com tecnologia inovadora que proporciona conforto, suporte e bem-estar. Eles ajudam a aliviar dores nos pés, melhoram a postura e oferecem amortecimento superior."
      },
      {
        question: "Como escolher o tamanho correto?",
        answer: "Recomendamos consultar nossa tabela de medidas para garantir o melhor ajuste. Se estiver entre dois tamanhos, sugerimos escolher o maior. Todos os nossos produtos possuem troca facilitada."
      },
      {
        question: "Os produtos têm garantia?",
        answer: "Sim, todos os nossos produtos possuem garantia contra defeitos de fabricação. Em caso de qualquer problema, entre em contato com nosso suporte para orientações sobre a garantia."
      },
      {
        question: "Como faço para limpar meus calçados?",
        answer: "Recomendamos limpeza com pano úmido e sabão neutro. Evite máquina de lavar e secar, pois podem danificar os materiais e comprometer a tecnologia do calçado."
      },
      {
        question: "Quanto tempo dura o frete?",
        answer: "O prazo de entrega varia conforme a região, mas geralmente é de 3 a 10 dias úteis após a confirmação do pagamento. Enviamos atualizações por e-mail com o código de rastreamento."
      }
    ]
  },
  {
    category: "💳 Pagamento e Entrega",
    items: [
      {
        question: "Quais são as formas de pagamento?",
        answer: "Aceitamos todas as bandeiras de cartão de crédito, PIX, boleto bancário e parcelamento em até 12x no cartão (com juros conforme política da operadora)."
      },
      {
        question: "Como faço para rastrear meu pedido?",
        answer: "Assim que seu pedido for enviado, você receberá um e-mail com o código de rastreamento dos Correios. Você pode acompanhar a entrega diretamente no site dos Correios com este código."
      },
      {
        question: "Qual é a política de troca e devolução?",
        answer: "Você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução, desde que o produto esteja em perfeito estado, com etiqueta e embalagem originais. Consulte nossa política completa na página de Trocas e Devoluções."
      },
      {
        question: "Posso alterar meu pedido após a compra?",
        answer: "Se o pedido ainda não foi aprovado para envio, é possível fazer alterações. Entre em contato imediatamente com nosso atendimento pelo WhatsApp ou e-mail para verificar a possibilidade."
      },
      {
        question: "Vocês enviam para todo o Brasil?",
        answer: "Sim, enviamos para todo o território nacional. O frete é calculado automaticamente no fechamento do pedido de acordo com o CEP de entrega."
      }
    ]
  },
  {
    category: "❓ Dúvidas Gerais",
    items: [
      {
        question: "Os calçados são adequados para quem tem problemas nos pés?",
        answer: "Sim, nossos calçados são projetados para oferecer suporte e conforto, sendo ideais para quem sofre com dores nos pés, fascite plantar, esporão de calcâneo e outros problemas comuns. No entanto, recomendamos consultar um especialista para casos específicos."
      },
      {
        question: "Posso usar os calçados para praticar esportes?",
        answer: "Nossos calçados são projetados para uso cotidiano e caminhadas leves. Para atividades físicas de alto impacto, recomendamos calçados específicos para esportes."
      },
      {
        question: "Como sei se o calçado é original All-In?",
        answer: "Todos os nossos produtos possuem etiqueta de autenticidade e código de rastreamento. Compre apenas em nossa loja oficial ou revendedores autorizados para evitar produtos falsificados."
      },
      {
        question: "Vocês oferecem desconto para compras em grande quantidade?",
        answer: "Sim, temos condições especiais para compras em grande volume. Entre em contato com nosso time comercial através do WhatsApp ou e-mail para saber mais sobre nossas condições especiais."
      },
      {
        question: "Como posso me tornar um revendedor All-In?",
        answer: "Se você tem interesse em revender nossos produtos, entre em contato com nosso setor de relacionamento com revendedores pelo WhatsApp (11) 98888-7777 ou pelo e-mail revendedores@allin.com.br. Nossa equipe terá prazer em fornecer todas as informações necessárias."
      },
      {
        question: "Como posso entrar em contato com o suporte?",
        answer: "Você pode entrar em contato através do nosso WhatsApp (11) 99999-9999, e-mail suporte@allin.com.br ou pelo chat online em nosso site. Nosso horário de atendimento é de segunda a sexta, das 9h às 18h."
      }
    ]
  }
];

const FAQAccordionSection = () => {
  return (
    <section id="faq" className="py-20 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Dúvidas <span className="text-allin-orange">Frequentes</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
            Tudo o que você precisa saber para tomar a <strong>melhor decisão</strong> e 
            começar sua jornada de sucesso com a Allin hoje mesmo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
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

export default FAQAccordionSection;
