import React from 'react';

import { Heart, Shield, Zap, TrendingUp, Clock, Award } from 'lucide-react';

import { Card } from '@/components/ui/card';

const AboutValuesSection = () => {
  return (
    <section className="py-16 px-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4">
            Nossos Valores
          </h2>
          <p className="text-lg text-allin-dark/70 dark:text-allin-white/70 max-w-3xl mx-auto">
            O que nos move e define quem somos como empresa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Paixão
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
              Amamos o que fazemos e nos dedicamos a transformar vidas.
            </p>
          </Card>

          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Integridade
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
              Atuamos com transparência e honestidade em todas as relações.
            </p>
          </Card>

          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Inovação
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
              Buscamos constantemente novas tecnologias e soluções.
            </p>
          </Card>

          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Crescimento
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
            Crescemos juntos com nossos distribuidores e clientes.
            </p>
          </Card>

          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Pontualidade
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
              Respeitamos prazos e compromissos com nossos parceiros.
            </p>
          </Card>

          <Card className="p-6 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-allin-orange/10 rounded-full flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-allin-orange" />
            </div>
            <h3 className="text-xl font-bold text-allin-dark dark:text-allin-white mb-2">
              Excelência
            </h3>
            <p className="text-allin-dark/70 dark:text-allin-white/70">
              Buscamos a qualidade em tudo o que fazemos.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutValuesSection;
