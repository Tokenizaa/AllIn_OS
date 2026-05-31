import React from 'react';

import { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  className = ''
}) => {
  return (
    <Card className={`text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 border border-allin-orange group animate-slide-up glass-card ${className}`}>
      <CardContent className="pt-6">
        <div className="w-16 h-16 bg-allin-orange rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-allin-dark" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-allin-dark dark:text-allin-white">{title}</h3>
        <p className="text-allin-dark/80 dark:text-allin-white/80 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
