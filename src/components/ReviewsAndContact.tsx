import React from 'react';

import ContactInfo from '@/components/ContactInfo';
import ReviewCard from '@/components/ReviewCard';
import { Review, StoreInfo } from '@/components/store-data';

interface ReviewsAndContactProps {
  reviews: Review[];
  storeInfo: StoreInfo;
  onWhatsAppClick: () => void;
  onInstagramClick: () => void;
}

const ReviewsAndContact: React.FC<ReviewsAndContactProps> = ({
  reviews,
  storeInfo,
  onWhatsAppClick,
  onInstagramClick
}) => {
  return (
    <section className="py-16 px-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Reviews Section */}
          <div>
            <h2 className="text-3xl font-bold text-allin-dark dark:text-allin-white mb-6">
              O que nossos clientes dizem
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-3xl font-bold text-allin-dark dark:text-allin-white mb-6">
              Entre em contato
            </h2>
            <ContactInfo
              contact={storeInfo.contact}
              onWhatsAppClick={onWhatsAppClick}
              onInstagramClick={onInstagramClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsAndContact;
