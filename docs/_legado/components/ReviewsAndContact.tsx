import React from 'react';

import ContactInfo from '@/components/ContactInfo';
import ReviewCard from '@/components/ReviewCard';
import { Review, StoreInfo } from '@/components/store-data';
import { Button } from '@/components/ui/button';
import { useSharedStyles } from '@/contexts/StyleContext';

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
  onInstagramClick,
}) => {
  const { sectionStyles, cardStyles } = useSharedStyles();
  return (
    <section className={`${sectionStyles} bg-allin-bg-light-2 dark:bg-allin-bg-dark-2`}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Avaliações */}
          <div className="space-y-6">
            <div className={cardStyles}>
              <h2 className="text-3xl font-bold mb-6 text-allin-dark dark:text-allin-white">
                O que dizem sobre <span className="text-allin-orange">nós</span>
              </h2>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              <div className="text-center mt-6">
                <Button variant="vibrantOutline" className="border-2 border-allin-orange text-allin-orange hover:bg-allin-orange/10 dark:hover:bg-allin-orange/20">
                  Ver Todas as Avaliações
                </Button>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-6">
            <div className={cardStyles}>
              <h2 className="text-3xl font-bold mb-6 text-allin-dark dark:text-allin-white">
                Entre em <span className="text-allin-orange">Contato</span>
              </h2>

              <ContactInfo contact={storeInfo.contact} onWhatsAppClick={onWhatsAppClick} onInstagramClick={onInstagramClick} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsAndContact;