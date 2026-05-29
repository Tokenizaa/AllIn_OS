import React from 'react';

import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface BenefitItem {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

interface BenefitsListProps {
  benefits: BenefitItem[];
  variant?: 'simple' | 'card';
  className?: string;
}

const BenefitsList: React.FC<BenefitsListProps> = ({ benefits, variant = 'simple', className = '' }) => {
  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index} className="border-allin-orange/20 bg-white/20 dark:bg-allin-bg-dark-2/30 backdrop-blur-lg">
              <CardContent className="p-6">
                {Icon && <Icon className="w-8 h-8 text-allin-orange mb-4" />}
                <h3 className="text-lg font-semibold text-allin-dark dark:text-allin-white mb-2">{benefit.title}</h3>
                {benefit.description && <p className="text-allin-dark/80 dark:text-allin-white/80">{benefit.description}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left ${className}`}>
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-start gap-2 p-3 bg-white/20 dark:bg-allin-bg-dark-2/30 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg">
          <span className="text-primary text-lg">✔</span>
          <span className="text-allin-dark dark:text-allin-white text-base">{benefit.title}</span>
        </div>
      ))}
    </div>
  );
};

export default BenefitsList;
