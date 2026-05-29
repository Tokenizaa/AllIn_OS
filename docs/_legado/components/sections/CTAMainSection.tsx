import { ArrowRight, Clock, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSponsorLink } from "@/hooks/useSponsorLink";

const CTAMainSection = () => {
  const { handleCadastro } = useSponsorLink();

  const urgencyPoints = [
    {
      icon: Clock,
      text: "Vagas limitadas por região."
    },
    {
      icon: Users,
      text: "Mais de 500 afiliados ativos."
    },
    {
      icon: Zap,
      text: "Oportunidade única no mercado."
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-allin-orange">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-allin-dark/10 to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-allin-dark/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-allin-dark/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-allin-dark">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Pronto para <span className="text-allin-white">transformar</span><br />
            sua vida financeira?
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-allin-dark/90 leading-relaxed animate-slide-up">
            Não perca essa oportunidade única de fazer parte da revolução em 
            produtos terapêuticos. Cadastre-se agora gratuitamente e comece a construir seu futuro!
          </p>

          {/* Urgency Points */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {urgencyPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 bg-allin-dark/10 backdrop-blur-sm rounded-full px-4 py-2 glass-card">
                <point.icon className="w-5 h-5 text-allin-white" />
                <span className="text-sm font-medium text-allin-white">{point.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Button 
              variant="cta" 
              size="lg" 
              onClick={handleCadastro}
              className="group bg-allin-white text-allin-dark hover:bg-allin-white/90 text-xl px-12 py-6 font-bold shadow-2xl glass-button"
            >
              Cadastrar-se grátis.
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-allin-dark/10 border-allin-dark/30 text-allin-white hover:bg-allin-dark/20 text-xl px-8 py-6 glass-button"
            >
              Falar com especialista.
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAMainSection;