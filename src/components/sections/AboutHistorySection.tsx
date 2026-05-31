import React from 'react';

import { Award, Target, Users } from 'lucide-react';

import { Card } from '@/components/ui/card';

const AboutHistorySection = () => {
  return (
    <section className="py-16 px-4 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Nossa História
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-3xl mx-auto">
            A All In Brasil nasceu da paixão por transformar vidas através de produtos terapêuticos de alta qualidade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Qualidade
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
              Produtos desenvolvidos com tecnologia avançada e materiais de primeira linha.
            </p>
          </Card>

          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Inovação
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
              Sempre buscando novas tecnologias para melhorar a qualidade de vida das pessoas.
            </p>
          </Card>

          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Comunidade
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
              Milhares de distribuidores satisfeitos fazendo parte da nossa família.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutHistorySection;
