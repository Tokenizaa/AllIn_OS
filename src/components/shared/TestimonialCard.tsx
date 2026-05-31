import React, { memo } from 'react';

import { Star, Quote } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar?: string;
  location?: string;
  rating: number;
  text: string;
  highlight?: string;
  className?: string;
}

// Memoizar o componente para evitar re-renderizações desnecessárias
const TestimonialCardComponent: React.FC<TestimonialCardProps> = ({ 
  name, 
  role, 
  avatar, 
  location, 
  rating, 
  text, 
  highlight,
  className = ''
}) => {
  return (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-dark dark:bg-allin-bg-dark-3 border-allin-orange relative overflow-hidden group ${className}`}>
      <div className="absolute top-4 right-4 text-allin-orange/20 group-hover:text-allin-orange/40 transition-colors">
        <Quote className="w-8 h-8" />
      </div>
      
      <CardContent className="pt-6">
        {/* Rating */}
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-allin-orange fill-current' : 'text-gray-300'}`} />
          ))}
        </div>

        {/* Text */}
        <p className="text-allin-white/80 text-center mb-6 leading-relaxed italic">
          "{text}"
        </p>

        {/* Highlight */}
        {highlight && (
          <div className="bg-allin-orange text-allin-dark text-center text-sm font-semibold py-2 px-4 rounded-full mb-4">
            {highlight}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center justify-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-allin-orange text-allin-dark font-semibold">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="font-semibold text-allin-white">{name}</div>
            <div className="text-sm text-allin-orange font-medium">{role}</div>
            {location && <div className="text-xs text-allin-white/80">{location}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Adicionar display name para facilitar debugging
TestimonialCardComponent.displayName = 'TestimonialCard';

// Exportar componente memoizado
const TestimonialCard = memo(TestimonialCardComponent);

export default TestimonialCard;
