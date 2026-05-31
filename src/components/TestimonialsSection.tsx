import { Star, Quote } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Distribuidora Excelência",
      avatar: "MS",
      location: "São Paulo, SP",
      rating: 5,
      text: "Em 6 meses como distribuidora Allin, já consegui uma renda extra de R$ 4.500/mês. Os produtos vendem sozinhos, a qualidade é excepcional e o suporte da empresa é fantástico!",
      highlight: "R$ 4.500/mês em 6 meses"
    },
    {
      name: "João Santos",
      role: "Distribuidor Avanço",
      avatar: "JS",
      location: "Rio de Janeiro, RJ",
      rating: 5,
      text: "Comecei como afiliado gratuito e em 8 meses já migrei para o plano Excelência. Minha rede tem mais de 50 pessoas e os ganhos residuais fazem toda diferença.",
      highlight: "Rede com +50 pessoas"
    },
    {
      name: "Ana Costa",
      role: "Distribuidora Avanço",
      avatar: "AC",
      location: "Belo Horizonte, MG",
      rating: 5,
      text: "Os tênis Allin mudaram minha vida! Além de usar e sentir os benefícios, consigo ajudar outras pessoas e ainda ganhar uma renda extra significativa. Recomendo de olhos fechados!",
      highlight: "Transformação pessoal e profissional"
    },
    {
      name: "Carlos Ferreira",
      role: "Distribuidor Excelência",
      avatar: "CF",
      location: "Porto Alegre, RS",
      rating: 5,
      text: "Trabalho com vendas há 15 anos e nunca vi produtos com tanta aceitação no mercado. A Allin oferece treinamento completo e ferramentas que facilitam muito as vendas.",
      highlight: "15 anos de experiência em vendas"
    },
    {
      name: "Luciana Oliveira",
      role: "Distribuidora Avanço",
      avatar: "LO",
      location: "Brasília, DF",
      rating: 5,
      text: "Além dos ganhos financeiros, me sinto realizada ajudando pessoas a terem mais qualidade de vida. Os produtos realmente funcionam e os clientes sempre voltam!",
      highlight: "Realização pessoal e financeira"
    },
    {
      name: "Roberto Lima",
      role: "Distribuidor Excelência",
      avatar: "RL",
      location: "Salvador, BA",
      rating: 5,
      text: "Em 1 ano como distribuidor, já consegui substituir minha renda principal. A Allin me deu a oportunidade de ter mais tempo com a família e liberdade financeira.",
      highlight: "Substituiu renda principal em 1 ano"
    }
  ];

  return (
    <section className="py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Casos de <span className="text-allin-orange">Sucesso</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
            Veja os depoimentos reais de distribuidores que transformaram suas vidas 
            com a oportunidade Allin
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-allin-bg-dark-3 border border-allin-orange/20 relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-allin-orange/20 group-hover:text-allin-orange/40 transition-colors">
                <Quote className="w-8 h-8" />
              </div>
              
              <CardContent className="pt-6">
                {/* Rating */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-allin-orange fill-current" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-allin-dark/80 dark:text-allin-white/80 text-center mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Highlight */}
                <div className="bg-allin-orange text-allin-dark text-center text-sm font-semibold py-2 px-4 rounded-full mb-4">
                  {testimonial.highlight}
                </div>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-allin-orange text-allin-dark font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <div className="font-semibold text-allin-dark dark:text-allin-white">{testimonial.name}</div>
                    <div className="text-sm text-allin-orange font-medium">{testimonial.role}</div>
                    <div className="text-xs text-allin-dark/60 dark:text-allin-white/60">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center bg-allin-orange rounded-2xl p-8 text-allin-dark">
          <h3 className="text-2xl font-bold mb-4 text-allin-dark">
            Junte-se a Mais de 500 Distribuidores de Sucesso
          </h3>
          <p className="text-lg mb-6 text-allin-dark/90">
            Faça parte de uma comunidade que está transformando vidas através 
            de produtos inovadores e oportunidades reais de crescimento.
          </p>
          
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-allin-dark">95%</div>
              <div className="text-sm text-allin-dark/80">Satisfação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-allin-dark">4.8/5</div>
              <div className="text-sm text-allin-dark/80">Avaliação Média</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-allin-dark">89%</div>
              <div className="text-sm text-allin-dark/80">Taxa de Retenção</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
