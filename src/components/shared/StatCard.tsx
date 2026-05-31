import React from 'react';

import { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  colorClass = "text-allin-orange",
  className = ''
}) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </p>
            
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-full bg-gray-50`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
