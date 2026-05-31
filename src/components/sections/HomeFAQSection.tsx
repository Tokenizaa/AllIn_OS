import React from 'react';

import { ChevronDown } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HomeFAQSection = () => {
  const faqCategories = [
    {
      category: 'Oportunidade de Negócio',
      questions: [
        {
          q: 'Como funciona o sistema de comissões?',
          a: 'Nossos distribuidores ganham comissões sobre cada venda realizada através do seu link de indicação. As comissões variam de 10% a 30% dependendo do plano escolhido.'
        },
        {
          q: 'Preciso investir dinheiro para começar?',
          a: 'Não! Você pode começar gratuitamente com nosso plano Iniciante. Planos pagos oferecem benefícios adicionais, mas não são obrigatórios.'
        },
        {
          q: 'Posso trabalhar de onde quiser?',
          a: 'Sim! Nosso sistema é 100% online, permitindo que você trabalhe de qualquer lugar e no horário que preferir.'
        }
      ]
    },
    {
      category: 'Processo de Cadastro',
      questions: [
        {
          q: 'Como me cadastro como distribuidor?',
          a: 'O cadastro é simples e rápido. Basta clicar no botão "Quero Me Tornar Distribuidor", preencher seus dados básicos e você já estará pronto para começar.'
        },
        {
          q: 'Quais documentos são necessários?',
          a: 'Para o cadastro inicial, apenas precisamos do seu nome completo e WhatsApp. Documentos adicionais podem ser solicitados quando você começar a receber pagamentos.'
        },
        {
          q: 'Quanto tempo demora para ativar minha conta?',
          a: 'A ativação é imediata! Assim que você completar o cadastro, já terá acesso ao painel de distribuidor.'
        }
      ]
    },
    {
      category: 'Comissões e Pagamentos',
      questions: [
        {
          q: 'Quando recebo minhas comissões?',
          a: 'As comissões são processadas mensalmente, até o dia 30 de cada mês, para vendas realizadas no mês anterior.'
        },
        {
          q: 'Como recebo meus pagamentos?',
          a: 'Os pagamentos são realizados via PIX ou transferência bancária, conforme sua preferência cadastrada no painel.'
        },
        {
          q: 'Existe valor mínimo para saque?',
          a: 'Sim, o valor mínimo para saque é de R$ 50,00.'
        }
      ]
    },
    {
      category: 'Suporte e Treinamento',
      questions: [
        {
          q: 'Que tipo de suporte oferecem?',
          a: 'Oferecemos suporte por email, WhatsApp e comunidade exclusiva. Planos pagos incluem suporte prioritário e consultoria personalizada.'
        },
        {
          q: 'Tenho acesso a treinamentos?',
          a: 'Sim! Todos os distribuidores têm acesso a treinamentos básicos. Planos Profissional e Empresário incluem treinamentos avançados e presenciais.'
        },
        {
          q: 'Posso participar de eventos presenciais?',
          a: 'Eventos presenciais estão disponíveis para distribuidores dos planos Profissional e Empresário.'
        }
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70">
            Tire suas dúvidas sobre como se tornar um distribuidor All In Brasil.
          </p>
        </div>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xl font-bold text-allin-orange mb-4">
                {category.category}
              </h3>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, questionIndex) => (
                  <AccordionItem 
                    key={questionIndex} 
                    value={`item-${categoryIndex}-${questionIndex}`}
                    className="bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 px-6"
                  >
                    <AccordionTrigger className="text-left text-allin-dark dark:text-allin-white hover:text-allin-orange">
                      {faq.q}
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </AccordionTrigger>
                    <AccordionContent className="text-allin-dark/70 dark:text-allin-white/70">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFAQSection;
