import { Zap, Waves, Wind, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductsSection = () => {
  const technologies = [
    {
      icon: Zap,
      name: "Magnetoterapia",
      color: "gradient-primary",
      benefits: [
        "Melhora notável da circulação sanguínea.",
        "Alívio eficaz de dores e inflamações.",
        "Redução significativa do estresse e ansiedade.",
        "Aumento perceptível da energia e vitalidade."
      ]
    },
    {
      icon: Waves,
      name: "Infravermelho Longo",
      color: "gradient-primary",
      benefits: [
        "Aceleração comprovada da recuperação muscular.",
        "Relaxamento profundo e eficaz dos músculos.",
        "Melhora perceptível da circulação periférica.",
        "Redução substancial da fadiga e cansaço."
      ]
    },
    {
      icon: Wind,
      name: "Tecido Knit Respirável",
      color: "gradient-primary",
      benefits: [
        "Conforto excepcional e duradouro durante o uso.",
        "Adaptação precisa e perfeita ao formato do pé.",
        "Redução eficaz da fadiga dos pés.",
        "Durabilidade e resistência comprovadas."
      ]
    }
  ];

  return (
    <section id="produtos" className="py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Produtos e <span className="text-allin-orange">Tecnologias</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
            Tecnologias exclusivas que transformam cada passo em bem-estar.
          </p>
        </div>

        {/* Technologies Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-allin-dark dark:text-allin-white animate-slide-up">
            Tecnologias <span className="text-allin-orange">Exclusivas</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <Card key={index} className="relative overflow-hidden border border-allin-orange/40 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-allin-bg-light-1 dark:bg-allin-bg-dark-3 animate-slide-up glass-card" style={{animationDelay: `${0.1 * index}s`}}>
                <div className="absolute inset-0 bg-allin-orange opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow transition-transform duration-300 group-hover:scale-110">
                    <tech.icon className="w-10 h-10 text-allin-dark" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-allin-dark dark:text-allin-white">{tech.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tech.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <Star className="w-5 h-5 text-allin-orange mt-0.5 flex-shrink-0" />
                        <span className="text-allin-dark/80 dark:text-allin-white/80">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;