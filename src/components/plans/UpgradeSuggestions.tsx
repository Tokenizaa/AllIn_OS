import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertTriangle, TrendingUp, Zap, ArrowRight } from "lucide-react";

export function UpgradeSuggestions() {
  const suggestions = [
    {
      type: "opportunity",
      icon: TrendingUp,
      title: "Oportunidade de Upgrade",
      description: "3 distribuidores qualificados para upgrade para Avanço",
      action: "Ver Detalhes",
      color: "text-green-500",
    },
    {
      type: "risk",
      icon: AlertTriangle,
      title: "Risco de Churn",
      description: "5 distribuidores com atividade baixa no plano Afiliado",
      action: "Ver Lista",
      color: "text-yellow-500",
    },
    {
      type: "potential",
      icon: Zap,
      title: "Potencial de Liderança",
      description: "2 distribuidores com alto potencial de crescimento",
      action: "Ver Perfis",
      color: "text-blue-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Sugestões de IA</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <suggestion.icon className={`h-5 w-5 ${suggestion.color}`} />
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                </div>
                <Badge variant="outline">IA</Badge>
              </div>
              <CardDescription>{suggestion.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                {suggestion.action}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
