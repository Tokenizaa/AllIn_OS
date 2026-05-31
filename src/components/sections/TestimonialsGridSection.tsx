import { Star, Quote } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsGridSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Afiliada All-In",
      avatar: "MS",
      location: "São Paulo, SP",
      rating: 5,
      text: "Em 6 meses como afiliada All-In, já consegui uma renda extra de R$ 3.200/mês. Os produtos vendem sozinhos, a qualidade é excepcional e o suporte da empresa é fantástico!",
      highlight: "R$ 3.200/mês em 6 meses"
    },
    {
      name: "João Santos",
      role: "Afiliado All-In - Plano Avanço",
      avatar: "JS",
      location: "Rio de Janeiro, RJ",
      rating: 5,
      text: "Comecei como afiliado gratuito e depois migrei para o plano Avanço. Em 8 meses já construí uma rede com mais de 30 pessoas. Minha renda passiva faz toda diferença no meu orçamento familiar.",
      highlight: "Rede com +30 pessoas"
    },
    {
      name: "Ana Costa",
      role: "Afiliada All-In",
      avatar: "AC",
      location: "Belo Horizonte, MG",
      rating: 5,
      text: "Os tênis All-In mudaram minha vida! Além de usar e sentir os benefícios, consigo ajudar outras pessoas e ainda ganhar uma renda extra significativa. Recomendo de olhos fechados!",
      highlight: "Transformação pessoal e financeira"
    },
    {
      name: "Carlos Ferreira",
      role: "Afiliado All-In - Plano Excelência",
      avatar: "CF",
      location: "Porto Alegre, RS",
      rating: 5,
      text: "Trabalho com vendas há 15 anos e nunca vi produtos com tanta aceitação no mercado. No plano Excelência, ganho 38% de comissão direta e participei de uma viagem de incentivo para o exterior.",
      highlight: "15 anos de experiência em vendas"
    },
    {
      name: "Luciana Oliveira",
      role: "Afiliada All-In - Plano Avanço",
      avatar: "LO",
      location: "Brasília, DF",
      rating: 5,
      text: "Além dos ganhos financeiros, me sinto realizada ajudando pessoas a terem mais qualidade de vida. Os produtos realmente funcionam e os clientes sempre voltam! No plano Avanço ganho 38% de comissão.",
      highlight: "Realização pessoal e financeira"
    },
    {
      name: "Roberto Lima",
      role: "Afiliado All-In",
      avatar: "RL",
      location: "Salvador, BA",
      rating: 5,
      text: "Em 1 ano como afiliado, já consegui substituir minha renda secundária. A All-In me deu a oportunidade de ter mais tempo com a família e liberdade financeira. Comecei com 20% de comissão no plano gratuito.",
      highlight: "Substituiu renda secundária em 1 ano"
    }
  ];

  return (
    <section className="py-20 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Casos de <span className="text-allin-orange">sucesso</span>.
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
            Veja os depoimentos reais de afiliados que transformaram suas vidas com a oportunidade All-In.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 relative overflow-hidden group animate-slide-up glass-card" style={{animationDelay: `${0.1 * index}s`}}>
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
                    <div className="text-xs text-allin-dark/80 dark:text-allin-white/80">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGridSection;
