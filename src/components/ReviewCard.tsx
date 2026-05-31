import React from 'react';

import { Star } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Review } from '@/components/store-data';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, className = '' }) => {
  return (
    <div className={`flex gap-4 p-4 bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10 ${className}`}>
      <Avatar className="w-12 h-12 border-2 border-allin-orange">
        <AvatarImage src={review.avatar} alt={review.name} />
        <AvatarFallback className="bg-allin-orange text-allin-dark font-bold">
          {review.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-bold text-allin-dark dark:text-allin-white">{review.name}</h4>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-allin-dark/80 dark:text-allin-white/80 text-sm leading-relaxed">
          {review.comment}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
