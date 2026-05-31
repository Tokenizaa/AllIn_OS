import React, { useState } from 'react';

import { Badge } from "@/components/ui/badge";

interface ImageGalleryProps {
  product: {
    caption: string;
    imgFluidSrc: string;
    imgFluidSrc2?: string;
    produtoTag?: string;
  };
  selectedImage: string;
  onImageSelect: (imageSrc: string) => void;
}

const ImageGallery = ({ product, selectedImage, onImageSelect }: ImageGalleryProps) => {
  return (
    <div className="space-y-6">
      {/* Imagem Principal */}
      <div className="relative overflow-hidden rounded-xl border border-allin-orange/30 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 aspect-square">
        <img 
          src={selectedImage} 
          alt={product.caption}
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/600x600?text=Imagem+Indisponível';
          }}
        />
        {product.produtoTag && (
          <Badge className="absolute top-4 right-4 bg-allin-orange text-allin-dark px-3 py-1 text-sm font-bold">
            {product.produtoTag}
          </Badge>
        )}
      </div>
      
      {/* Miniaturas */}
      <div className="flex gap-4">
        <div 
          className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${selectedImage === product.imgFluidSrc ? 'border-allin-orange' : 'border-allin-orange/20'}`}
          onClick={() => onImageSelect(product.imgFluidSrc)}
        >
          <img 
            src={product.imgFluidSrc} 
            alt={`${product.caption} - vista 1`}
            className="w-16 h-16 md:w-20 md:h-20 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/300x300?text=Imagem+Indisponível';
            }}
          />
        </div>
        
        {product.imgFluidSrc2 && (
          <div 
            className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${selectedImage === product.imgFluidSrc2 ? 'border-allin-orange' : 'border-allin-orange/20'}`}
            onClick={() => onImageSelect(product.imgFluidSrc2!)}
          >
            <img 
              src={product.imgFluidSrc2} 
              alt={`${product.caption} - vista 2`}
              className="w-16 h-16 md:w-20 md:h-20 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/300x300?text=Imagem+Indisponível';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
