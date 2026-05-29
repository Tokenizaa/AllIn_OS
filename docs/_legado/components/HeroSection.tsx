import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import Background from "./shared/Background";
import BenefitsList from "./shared/BenefitsList";

const HeroSection = () => {
  return (
    <Background className="pt-20">
      <div className="container relative z-10 mx-auto px-4 py-16 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-5 text-allin-dark dark:text-allin-white">
            Saúde nos seus pés começa aqui
            <span className="block text-allin-orange">
              Alívio imediato e duradouro
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-allin-dark/80 dark:text-allin-white/80 mb-6 max-w-3xl mx-auto leading-relaxed">
            Para quem convive com dores, cansaço ou problemas de circulação, a Allin oferece tecnologia para melhorar seu dia a dia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/#diseases">
              <Button variant="vibrant" size="lg" className="px-6 py-3 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Descubra como aliviar seus sintomas
              </Button>
            </Link>
            <Link to="/#testimonials">
              <Button variant="vibrantOutline" size="lg" className="px-6 py-3 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Ver depoimentos
              </Button>
            </Link>
          </div>
          
          <BenefitsList
            benefits={[
              { title: "Redução imediata da dor nos pés e calcanhar" },
              { title: "Proteção de pontos de pressão e prevenção de feridas" },
              { title: "Melhora da circulação e combate ao inchaço" }
            ]}
            variant="simple"
          />
        </div>
      </div>
    </Background>
  );
};

export default HeroSection;