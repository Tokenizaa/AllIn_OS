import React from 'react';

import { Zap, Users, Shield, BarChart2, MessageSquare, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const SejaUmLojistaPage = () => {
  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-allin-orange" />,
      title: "Fácil de Usar",
      description: "Plataforma intuitiva que qualquer pessoa pode usar, sem necessidade de conhecimentos técnicos."
    },
    {
      icon: <Users className="w-8 h-8 text-allin-orange" />,
      title: "Alcance Mais Clientes",
      description: "Aumente suas vendas com nossa rede de distribuição e visibilidade online."
    },
    {
      icon: <Shield className="w-8 h-8 text-allin-orange" />,
      title: "Segurança Garantida",
      description: "Processos seguros de pagamento e proteção de dados para você e seus clientes."
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-allin-orange" />,
      title: "Gestão Simplificada",
      description: "Controle seu estoque, vendas e clientes em um único lugar."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-allin-orange" />,
      title: "Suporte Dedicado",
      description: "Equipe especializada pronta para te ajudar em todas as etapas."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-allin-orange" />,
      title: "Vendas pelo WhatsApp",
      description: "Integração direta com WhatsApp para fechar vendas de forma rápida e prática."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Cadastro Rápido",
      description: "Preencha o formulário com seus dados básicos e da sua loja."
    },
    {
      number: "2",
      title: "Personalização",
      description: "Configure sua loja com suas cores e informações de contato."
    },
    {
      number: "3",
      title: "Adicione Produtos",
      description: "Cadastre seus produtos com fotos e descrições atraentes."
    },
    {
      number: "4",
      title: "Comece a Vender",
      description: "Compartilhe o link da sua loja e comece a receber pedidos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-allin-bg-light-1 to-allin-bg-light-2 dark:from-allin-bg-dark-1 dark:to-allin-bg-dark-2">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-allin-primary to-allin-secondary">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-white uppercase bg-white/20 rounded-full">
              Para Empreendedores
            </span>
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              Tenha sua própria loja virtual em minutos
            </h1>
            <p className="mb-8 text-xl text-white/90 max-w-2xl">
              A plataforma perfeita para você vender mais, gerenciar seu negócio e crescer com a gente!
            </p>
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row">
              <Link to="/admin/cadastro-loja">
                <Button className="px-8 py-6 text-lg font-semibold text-white bg-allin-orange hover:bg-allin-orange/90">
                  Quero ser um lojista <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#vantagens">
                <Button variant="outline" className="px-8 py-6 text-lg font-semibold text-white border-2 border-white hover:bg-white/10">
                  Saiba mais
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10 backdrop-blur-sm"></div>
      </section>

      {/* Features Section */}
      <section id="vantagens" className="py-20 bg-white dark:bg-allin-bg-dark-3">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-allin-text-dark dark:text-white md:text-4xl">
              Tudo o que você precisa para vender mais
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Nossa plataforma foi desenvolvida para ajudar pequenos e médios empreendedores a venderem mais sem complicação.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-8 transition-all duration-300 bg-white rounded-lg shadow-md dark:bg-allin-bg-dark-2 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-allin-orange/10">
                  {benefit.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-center text-allin-text-dark dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-allin-bg-dark-4">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-allin-text-dark dark:text-white md:text-4xl">
              Como funciona
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Em poucos passos, você estará pronto para começar a vender
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative p-6 text-center bg-white rounded-lg shadow-md dark:bg-allin-bg-dark-2 group">
                <div className="absolute top-0 flex items-center justify-center w-12 h-12 -mt-6 text-2xl font-bold text-white rounded-full left-1/2 -translate-x-1/2 bg-gradient-to-r from-allin-primary to-allin-secondary">
                  {step.number}
                </div>
                <h3 className="mt-6 mb-3 text-xl font-semibold text-allin-text-dark dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-allin-primary to-allin-secondary">
        <div className="absolute inset-0 bg-gradient-to-r from-allin-primary/90 via-allin-primary/80 to-allin-secondary/90 opacity-90"></div>
        <div className="container relative px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Pronto para começar a vender?
            </h2>
            <p className="mb-8 text-xl text-white/90">
              Junte-se a milhares de empreendedores que já estão vendendo mais com nossa plataforma.
            </p>
            <Link to="/admin/cadastro-loja">
              <Button className="px-8 py-6 text-lg font-semibold text-white bg-allin-orange hover:bg-allin-orange/90">
                Quero ser um lojista agora! <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-white/80">
              Cadastro rápido, sem compromisso e sem custo inicial
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-allin-bg-dark-3">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-allin-text-dark dark:text-white md:text-4xl">
                Dúvidas frequentes
              </h2>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "Quanto custa para ter uma loja na plataforma?",
                  answer: "Oferecemos planos acessíveis que se adaptam ao tamanho do seu negócio. Entre em contato para conhecer as condições especiais para novos lojistas."
                },
                {
                  question: "Preciso ter conhecimento técnico para usar a plataforma?",
                  answer: "Não! Nossa plataforma foi projetada para ser intuitiva e fácil de usar, sem necessidade de conhecimentos técnicos."
                },
                {
                  question: "Como recebo os pagamentos das vendas?",
                  answer: "Você pode configurar sua conta em diversos meios de pagamento como Pix, cartão de crédito, boleto e transferência bancária."
                },
                {
                  question: "Posso personalizar o visual da minha loja?",
                  answer: "Sim! Você pode personalizar cores, logo, banners e muito mais para deixar sua loja com a sua cara."
                },
                {
                  question: "Como funciona o suporte ao lojista?",
                  answer: "Oferecemos suporte por WhatsApp, e-mail e chat em horário comercial para te ajudar com qualquer dúvida ou necessidade."
                }
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-lg bg-gray-50 dark:bg-allin-bg-dark-2">
                  <h3 className="text-lg font-semibold text-allin-text-dark dark:text-white">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Ainda tem dúvidas? Fale com nosso time de atendimento
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row">
                <a 
                  href="https://wa.me/5511999999999?text=Olá,%20tenho%20dúvidas%20sobre%20a%20plataforma" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  WhatsApp
                </a>
                <a 
                  href="mailto:suporte@allindistribuidores.com.br" 
                  className="flex items-center px-6 py-3 text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  E-mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 text-center bg-allin-orange/10 dark:bg-allin-bg-dark-4">
        <div className="container px-4 mx-auto">
          <h2 className="mb-6 text-2xl font-bold text-allin-text-dark dark:text-white md:text-3xl">
            Não perca mais tempo, comece agora mesmo!
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-600 dark:text-gray-300">
            Junte-se a milhares de empreendedores que estão vendendo mais com nossa plataforma.
          </p>
          <Link to="/admin/cadastro-loja">
            <Button className="px-8 py-6 text-lg font-semibold text-white bg-allin-orange hover:bg-allin-orange/90">
              Quero começar agora! <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SejaUmLojistaPage;
