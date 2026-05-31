import { ArrowRight, Clock, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSponsorLink } from "@/hooks/useSponsorLink";

const CTASection = () => {
  const { handleCadastro } = useSponsorLink();

  const urgencyPoints = [
    {
      icon: Clock,
      text: "Vagas limitadas por região"
    },
    {
      icon: Users,
      text: "Mais de 100 cadastros este mês"
    },
    {
      icon: Zap,
      text: "Oportunidade única no mercado"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-allin-orange"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-allin-dark/10 to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-allin-dark/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-allin-dark/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-allin-dark">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Pronto para <span className="text-on-orange-dark">Transformar</span><br />
            sua Vida Financeira?
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-allin-dark/90 leading-relaxed">
            Não perca essa oportunidade única de fazer parte da revolução em 
            produtos terapêuticos. Cadastre-se agora e comece a construir seu futuro!
          </p>

          {/* Urgency Points */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {urgencyPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 bg-allin-dark/10 backdrop-blur-sm rounded-full px-4 py-2">
                <point.icon className="w-5 h-5 text-on-orange-dark" />
                <span className="text-sm font-medium text-on-orange-dark">{point.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="vibrant" 
              size="lg" 
              onClick={handleCadastro}
              className="group text-xl px-12 py-6"
            >
              Cadastrar-se Agora
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="vibrantOutline" 
              size="lg" 
              className="text-on-orange-dark hover:bg-allin-dark/20 text-xl px-8 py-6"
            >
              Falar com Especialista
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-on-orange-dark mb-2">100%</div>
              <div className="text-sm text-on-orange-dark/80">Seguro e Confiável</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-on-orange-dark mb-2">0</div>
              <div className="text-sm text-on-orange-dark/80">Taxa de Inscrição*</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-on-orange-dark mb-2">24h</div>
              <div className="text-sm text-on-orange-dark/80">Suporte Disponível</div>
            </div>
          </div>

          <p className="text-xs text-on-orange-dark/60 mt-6">
            *Plano Afiliado gratuito disponível
          </p>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20 fill-allin-dark dark:fill-allin-bg-dark-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default CTASection;
