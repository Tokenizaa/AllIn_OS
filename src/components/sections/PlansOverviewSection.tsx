"use client";

import { useEffect, useState } from "react";

import { Check, Zap, Star, Users, Gem, Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSponsorLink } from "@/hooks/useSponsorLink";

// Definição da interface para os planos
interface Plan {
  name: string;
  price: string;
  popular: boolean;
  description: string;
  mainBenefits: string[];
  networkBonuses?: string[];
  extraBonuses?: string[];
  callToAction: string;
}

const PlansOverviewSection = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const { handleCadastro } = useSponsorLink();

  useEffect(() => {
    // Dados dos planos definidos diretamente
    const planData: Plan[] = [
      {
        name: "PLANO AFILIADO",
        price: "R$ 0,00",
        popular: false,
        description: "Qualquer pessoa que deseja revender produtos sem gastar nada.",
        mainBenefits: [
          "Link personalizado para compartilhar e vender online.",
          "Loja virtual para seus clientes fazerem compras.",
          "Ganho de 20% para cada venda feita através do seu link."
        ],
        callToAction: "COMEÇAR AGORA - GRÁTIS"
      },
      {
        name: "PLANO AVANÇO",
        price: "Consulte condições",
        popular: true,
        description: "Pessoas que desejam começar no mercado com baixo custo.",
        mainBenefits: [
          "1 par de tênis para testar o produto.",
          "Link personalizado para compartilhar e vender online.",
          "Acesso ao escritório virtual para gerenciar vendas e bonificações.",
          "Loja virtual para seus clientes fazerem compras.",
          "Valor de compra com 50% do valor de tabela.",
          "Ganho de 38% sobre a venda pelo link da loja."
        ],
        networkBonuses: [
          "5% na 1ª geração.",
          "3% na 2ª geração.",
          "2% na 3ª geração."
        ],
        callToAction: "BÔNUS EXCLUSIVO: Kit inicial + treinamento VIP"
      },
      {
        name: "PLANO EXCELÊNCIA",
        price: "Consulte condições",
        popular: false,
        description: "Distribuidores que querem começar com tudo e se destacar.",
        mainBenefits: [
          "Loja virtual e suporte avançado para estratégias de vendas.",
          "Valor de compra com 50% do valor de tabela.",
          "Ganho de 38% sobre a venda pelo link da loja."
        ],
        networkBonuses: [
          "5% na 1ª geração.",
          "3% na 2ª geração.",
          "2% na 3ª geração."
        ],
        extraBonuses: [
          "+2% (com 4 a 7 diretos ativos).",
          "+4% (com 8 ou mais diretos ativos)."
        ],
        callToAction: "TUDO INCLUSO: Kit completo + suporte premium"
      }
    ];

    setPlans(planData);
  }, []);


  return (
    <section id="planos" className="py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
            Escolha seu <span className="text-allin-orange">caminho para o sucesso.</span>
          </h2>
          <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
            Seja um distribuidor All-In e comece a ganhar dinheiro com produtos inovadores e de alta qualidade. Escolha o plano que melhor se adapta ao seu perfil e comece agora mesmo.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative shadow-xl hover:shadow-2xl transition-all duration-300 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 border border-allin-orange ${
                plan.popular ? 'scale-105 ring-2 ring-allin-orange ring-offset-4' : ''
              } animate-slide-up glass-card`}
              style={{animationDelay: `${0.1 * index}s`}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-allin-orange text-allin-dark px-4 py-1 text-sm font-semibold transition-all duration-300 hover:scale-105">
                  MAIS PROCURADO
                </Badge>
              </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-allin-dark dark:text-allin-white">{plan.name}.</CardTitle>
                {plan.popular && (
                  <Badge className="bg-allin-orange text-white text-xs py-1 px-2 ml-2">
                    POPULAR.
                  </Badge>
                )}
                <div className="text-4xl font-bold text-allin-orange mb-2">{plan.price}</div>
                <p className="text-allin-dark/90 dark:text-allin-white/90 text-sm font-medium">{plan.description.endsWith('.') ? plan.description : `${plan.description  }.`}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  {plan.mainBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-allin-dark/90 dark:text-allin-white/90">{benefit.endsWith('.') ? benefit : `${benefit  }.`}</span>
                    </li>
                  ))}
                  
                  {plan.networkBonuses && (
                    <>
                      <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Bônus de rede.
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {plan.networkBonuses.map((bonus, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-allin-dark/90 dark:text-allin-white/90">{bonus.endsWith('.') ? bonus : `${bonus  }.`}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {plan.extraBonuses && (
                    <>
                      <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" /> Bônus especiais.
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {plan.extraBonuses.map((bonus, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-allin-dark/90 dark:text-allin-white/90">{bonus.endsWith('.') ? bonus : `${bonus  }.`}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                
                <Button 
                  variant="vibrant"
                  className="w-full transition-all duration-300 hover:scale-105 glass-button"
                  onClick={handleCadastro}
                >
                  {plan.price === "R$ 0,00" ? "COMEÇAR AGORA - GRÁTIS" : "QUERO GARANTIR MINHA VAGA"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansOverviewSection;