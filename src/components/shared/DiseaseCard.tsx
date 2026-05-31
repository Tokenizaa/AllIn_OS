import React from 'react';

import { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DiseaseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  details: string;
  className?: string;
}

const DiseaseCard: React.FC<DiseaseCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  image, 
  details,
  className = ''
}) => {
  return (
    <div 
      className={`group relative bg-white/15 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="overflow-hidden rounded-t-2xl h-48">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">{title}</CardTitle>
        </div>
        <p className="text-lg text-foreground mb-4 leading-relaxed">{description}</p>
        <div className="border-t border-white/20 pt-4 mt-4">
          <p className="text-base text-foreground leading-relaxed">
            {details}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiseaseCard;
