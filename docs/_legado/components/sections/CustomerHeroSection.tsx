import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const CustomerHeroSection = () => {
  return (
    <section id="sobre" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-allin-bg-dark-1 to-allin-bg-dark-2 dark:from-allin-bg-dark-1 dark:to-allin-bg-dark-2 pt-20">
      {/* Elementos decorativos */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-allin-orange/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-allin-orange/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="container relative z-10 mx-auto px-4 py-16 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-5 text-allin-dark dark:text-allin-white">
            Saúde nos seus pés começa aqui.
            <span className="block text-allin-orange">
              Alívio imediato e duradouro.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-allin-dark/80 dark:text-allin-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Para quem convive com dores, cansaço ou problemas de circulação, a Allin oferece tecnologia para melhorar seu dia a dia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link to="/#problemas">
              <Button variant="vibrant" size="lg" className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Descubra como aliviar seus sintomas
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            {["Redução imediata da dor", "Proteção de pontos de pressão", "Melhora da circulação"].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white/20 dark:bg-allin-bg-dark-2/30 backdrop-blur-lg rounded-2xl border border-white/30 shadow-md">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-allin-dark dark:text-allin-white text-base">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerHeroSection;