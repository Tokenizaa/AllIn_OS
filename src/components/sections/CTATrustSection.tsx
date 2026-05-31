import React from 'react';

import { Shield, Lock, HeadphonesIcon, CheckCircle } from 'lucide-react';

import { Card } from '@/components/ui/card';

const CTATrustSection = () => {
  const trustIndicators = [
    {
      icon: Shield,
      title: '100% Seguro',
      description: 'Seus dados protegidos com a mais alta segurança'
    },
    {
      icon: Lock,
      title: 'Sem Taxas Ocultas',
      description: 'Transparência total em todas as transações'
    },
    {
      icon: HeadphonesIcon,
      title: 'Suporte 24/7',
      description: 'Sempre disponíveis para ajudar você'
    },
    {
      icon: CheckCircle,
      title: 'Garantia de Satisfação',
      description: 'Satisfação garantida ou seu dinheiro de volta'
    }
  ];

  return (
    <section className="py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Por Que Confiar na All In Brasil?
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-3xl mx-auto">
            Milhares de distribuidores confiam em nós há anos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <Card 
                key={index} 
                className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-allin-orange" />
                </div>
                <h3 className="text-lg font-bold text-allin-dark dark:text-allin-white mb-2">
                  {indicator.title}
                </h3>
                <p className="text-allin-dark/70 dark:text-allin-white/70 text-sm">
                  {indicator.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CTATrustSection;
