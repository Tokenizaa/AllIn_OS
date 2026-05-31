import { Award, Heart, Shield, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const AboutValuesSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Bem-estar",
      description: "Focamos na saúde e conforto dos nossos clientes através de tecnologia inovadora."
    },
    {
      icon: Shield,
      title: "Qualidade",
      description: "Produtos desenvolvidos com os mais altos padrões de qualidade e eficácia."
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Construímos uma rede forte de distribuidores comprometidos com o sucesso mútuo."
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Buscamos constantemente a excelência em produtos, atendimento e oportunidades."
    }
  ];

  const differentials = [
    {
      icon: Heart,
      title: "Tecnologia Exclusiva",
      description: "Magnetoterapia e infravermelho longo em cada produto."
    },
    {
      icon: Shield,
      title: "Qualidade Comprovada",
      description: "Certificações internacionais e testes rigorosos."
    },
    {
      icon: Users,
      title: "Rede de Sucesso",
      description: "Mais de 500 distribuidores satisfeitos em todo Brasil."
    },
    {
      icon: Award,
      title: "Inovação Constante",
      description: "Desenvolvimento contínuo de produtos e tecnologias."
    }
  ];

  return (
    <section className="py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-stretch mb-16">
          {/* Left - Differentials */}
          <div className="space-y-6 animate-slide-up glass-card p-8 rounded-2xl h-full">
            <h3 className="text-3xl font-bold text-allin-dark dark:text-allin-white">
              Nossos Diferenciais
            </h3>
            
            <div className="grid gap-6">
              {differentials.map((diff, index) => (
                <Card key={index} className="border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 group animate-slide-up glass-card" style={{animationDelay: `${0.1 * index}s`}}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-allin-orange rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <diff.icon className="w-6 h-6 text-allin-dark" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2 text-allin-dark dark:text-allin-white">{diff.title}</h4>
                        <p className="text-allin-dark/80 dark:text-allin-white/80 text-sm leading-relaxed">{diff.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right - Values */}
          <div className="space-y-6 animate-slide-up glass-card p-8 rounded-2xl h-full" style={{animationDelay: '0.2s'}}>
            <h3 className="text-3xl font-bold text-allin-dark dark:text-allin-white">
              Nossos Valores
            </h3>
            
            <div className="grid gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 group animate-slide-up glass-card" style={{animationDelay: `${0.1 * index}s`}}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-allin-orange rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <value.icon className="w-6 h-6 text-allin-dark" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2 text-allin-dark dark:text-allin-white">{value.title}</h4>
                        <p className="text-allin-dark/80 dark:text-allin-white/80 text-sm leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutValuesSection;