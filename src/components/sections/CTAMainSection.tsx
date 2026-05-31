import React from 'react';

import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSponsorLink } from '@/hooks/useSponsorLink';

const CTAMainSection = () => {
  const { handleCadastro } = useSponsorLink();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-allin-orange to-allin-orange/80 dark:from-allin-orange dark:to-allin-orange/90 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-medium text-white">Oportunidade Limitada</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Comece Sua Jornada Hoje
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Junte-se a milhares de distribuidores que já transformaram suas vidas com a All In Brasil.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
            <span className="text-white font-medium">Zero investimento inicial</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
            <span className="text-white font-medium">Suporte completo</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
            <span className="text-white font-medium">Comissões atrativas</span>
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleCadastro}
            className="bg-white text-allin-orange hover:bg-white/90 font-semibold px-8 py-4 shadow-lg group"
          >
            Quero Me Tornar Distribuidor
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTAMainSection;
