import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, Star, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPlanBonuses } from "../../lib/api/plans.functions";

interface PlanCardProps {
  plan: any;
}

export function PlanCard({ plan }: PlanCardProps) {
  const { data: bonuses } = useQuery({
    queryKey: ["plan-bonuses", plan.id],
    queryFn: () => getPlanBonuses({ planId: plan.id }),
  });

  const generationBonuses = bonuses?.filter((b: any) => b.bonus_type === "generation") || [];
  const directBonuses = bonuses?.filter((b: any) => b.bonus_type === "direct_bonus") || [];

  return (
    <Card className="relative overflow-hidden">
      {plan.is_affiliate && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-transparent w-32 h-32 opacity-20" />
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription className="mt-2">{plan.description}</CardDescription>
          </div>
          {plan.is_affiliate && (
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3" />
              Afiliado
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="text-3xl font-bold">
            {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toLocaleString("pt-BR")}`}
          </div>
          {plan.activation_fee > 0 && (
            <div className="text-sm text-muted-foreground">
              + R$ {plan.activation_fee.toLocaleString("pt-BR")} taxa de ativação
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-medium">Comissão Direta:</span>
            <span>{plan.direct_bonus_percentage}%</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Máximo de Gerações:</span>
            <span>{plan.max_generations}</span>
          </div>
        </div>

        {generationBonuses.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-sm">Bônus por Geração</h4>
            <div className="space-y-2">
              {generationBonuses.map((bonus: any) => (
                <div key={bonus.id} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Geração {bonus.generation}:</span>
                  <span className="font-semibold">{bonus.bonus_percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {directBonuses.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-sm">Bônus Extras por Diretos</h4>
            <div className="space-y-2">
              {directBonuses.map((bonus: any) => (
                <div key={bonus.id} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{bonus.required_directs}+ diretos:</span>
                  <span className="font-semibold">{bonus.bonus_percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button className="flex-1">Ver Detalhes</Button>
        <Button variant="outline">Editar</Button>
      </CardFooter>
    </Card>
  );
}
