import React from 'react';

import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showText && (
        <>
          <span className={`ml-2 font-bold ${textSizeClasses[size]}`}>
            {rating}
          </span>
          {reviewCount && (
            <span className={`ml-1 ${textSizeClasses[size]} opacity-80`}>
              ({reviewCount} avaliações)
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default RatingDisplay;
