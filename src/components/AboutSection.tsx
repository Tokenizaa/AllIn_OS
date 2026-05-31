import { Award, Heart, Shield, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
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

  return (
    <section id="sobre" className="py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Sobre a <span className="text-allin-orange">All-in</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto leading-relaxed">
            Pioneira em tênis terapêuticos no Brasil, o Allin combina tecnologia avançada 
            com design moderno para revolucionar o mercado de calçados wellness.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-6 animate-slide-up glass-card">
            <h3 className="text-3xl font-bold text-allin-dark dark:text-allin-white">
              Nossa História
            </h3>
            <p className="text-lg text-allin-dark/80 dark:text-allin-white/80 leading-relaxed">
              Fundada com a missão de democratizar o acesso a produtos terapêuticos de alta qualidade, 
              a Allin nasceu da união entre inovação tecnológica e empreendedorismo sustentável.
            </p>
            <p className="text-lg text-allin-dark/80 dark:text-allin-white/80 leading-relaxed">
              Desenvolvemos tênis com tecnologias exclusivas como magnetoterapia e infravermelho longo, 
              proporcionando benefícios comprovados para a saúde dos pés e do corpo inteiro.
            </p>
            <div className="bg-allin-orange/15 p-6 rounded-lg glass-card-orange">
              <h4 className="text-xl font-semibold mb-2 text-allin-dark dark:text-allin-white">Nossa Missão</h4>
              <p className="text-allin-dark/80 dark:text-allin-white/80">
                Transformar vidas através de produtos inovadores e oportunidades de negócio 
                que geram impacto positivo na saúde e na renda das pessoas.
              </p>
            </div>
          </div>

          <div className="space-y-6 animate-slide-up glass-card" style={{animationDelay: '0.2s'}}>
            <h3 className="text-3xl font-bold text-allin-dark dark:text-allin-white">
              Nossos Diferenciais
            </h3>
            
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange/40 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card">
                <div className="w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Heart className="w-6 h-6 text-allin-dark" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white">Tecnologia Exclusiva</h4>
                  <p className="text-allin-dark/80 dark:text-allin-white/80">Magnetoterapia e infravermelho longo em cada produto.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange/40 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card">
                <div className="w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Shield className="w-6 h-6 text-allin-dark" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white">Qualidade Comprovada</h4>
                  <p className="text-allin-dark/80 dark:text-allin-white/80">Certificações internacionais e testes rigorosos.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange/40 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-card">
                <div className="w-12 h-12 bg-allin-orange rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <Users className="w-6 h-6 text-allin-dark" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1 text-allin-dark dark:text-allin-white">Rede de Sucesso</h4>
                  <p className="text-allin-dark/80 dark:text-allin-white/80">Mais de 500 distribuidores satisfeitos em todo Brasil.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center p-6 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border-allin-orange/40 border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up glass-card" style={{animationDelay: `${0.1 * index}s`}}>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110">
                  <value.icon className="w-8 h-8 text-allin-dark" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-allin-dark dark:text-allin-white">{value.title}</h3>
                <p className="text-allin-dark/80 dark:text-allin-white/80 text-sm leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
