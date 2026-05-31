import React from 'react';

import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface PlanCardProps {
  name: string;
  price: string;
  popular?: boolean;
  description: string;
  mainBenefits: string[];
  networkBonuses?: string[];
  extraBonuses?: string[];
  callToAction: string;
  onSignUp: () => void;
  className?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  name, 
  price, 
  popular = false, 
  description, 
  mainBenefits, 
  networkBonuses, 
  extraBonuses, 
  callToAction, 
  onSignUp,
  className = ''
}) => {
  return (
    <Card 
      className={`relative shadow-xl hover:shadow-2xl transition-all duration-300 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 border border-allin-orange ${
        popular ? 'scale-105 ring-2 ring-allin-orange ring-offset-4' : ''
      } animate-slide-up glass-card ${className}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-allin-orange text-allin-dark px-4 py-1 text-sm font-semibold transition-all duration-300 hover:scale-105">
            MAIS PROCURADO
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-allin-dark dark:text-allin-white">{name}</CardTitle>
        <div className="text-4xl font-bold text-allin-orange mb-2">{price}</div>
        <p className="text-allin-dark/90 dark:text-allin-white/90 text-sm font-medium">{description}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 mb-6">
          {mainBenefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-allin-dark/90 dark:text-allin-white/90">{benefit}</span>
            </li>
          ))}
          
          {networkBonuses && (
            <>
              <h4 className="font-semibold mt-4 mb-2">Bônus de rede</h4>
              <ul className="space-y-2 mb-4">
                {networkBonuses.map((bonus, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-allin-dark/90 dark:text-allin-white/90">{bonus}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {extraBonuses && (
            <>
              <h4 className="font-semibold mt-4 mb-2">Bônus especiais</h4>
              <ul className="space-y-2 mb-4">
                {extraBonuses.map((bonus, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-allin-dark/90 dark:text-allin-white/90">{bonus}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        
        <Button 
          variant="vibrant"
          className="w-full transition-all duration-300 hover:scale-105 glass-button"
          onClick={onSignUp}
        >
          {callToAction}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
