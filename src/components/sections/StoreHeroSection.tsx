import React from 'react';

import { MessageCircle, ShoppingBag, MapPin } from "lucide-react";

import AllInLogo from '@/components/AllInLogo';
import RatingDisplay from '@/components/RatingDisplay';
import { StoreInfo } from '@/components/store-data';
import { Button } from "@/components/ui/button";

interface StoreHeroSectionProps {
  storeInfo: StoreInfo;
  onWhatsAppClick: () => void;
  onProductsClick: () => void;
}

const StoreHeroSection = ({ 
  storeInfo, 
  onWhatsAppClick, 
  onProductsClick 
}: StoreHeroSectionProps) => {
  return (
    <section className="relative">
      <div className="relative h-80 bg-gradient-to-r from-allin-bg-light-1 to-allin-bg-light-2 dark:bg-allin-bg-dark-1">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4 max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <AllInLogo size="xl" className="border-4 border-white/50" />
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{storeInfo.name}</h1>
                <p className="text-xl text-white/90 mb-2">{storeInfo.category}</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{storeInfo.city}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <RatingDisplay rating={storeInfo.rating} reviewCount={storeInfo.reviewCount} />
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                onClick={onWhatsAppClick} 
                className="bg-green-500 hover:bg-green-600 text-white gap-2 px-6 py-3"
              >
                <MessageCircle className="w-5 h-5" /> Fale com o Lojista
              </Button>
              <Button 
                variant="outline" 
                onClick={onProductsClick} 
                className="border-white text-white hover:bg-white hover:text-allin-orange gap-2 px-6 py-3"
              >
                <ShoppingBag className="w-5 h-5" /> Ver Produtos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreHeroSection;
