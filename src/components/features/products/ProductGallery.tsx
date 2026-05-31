import React, { useState, useEffect } from 'react';

import { ArrowRight, ShoppingCart } from "lucide-react";
import { useNavigate } from '@tanstack/react-router';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from '@/types/products';
import { formatPrice } from "@/utils/priceFormatter";
import ProductModal from "@/components/ProductModal";

interface ProductGalleryProps {
  limit?: number;
}

const ProductGalleryContent = ({ limit }: ProductGalleryProps) => {
  const { toast } = useToast();
  const { items: cart, addItem: addToCart, removeItem: removeFromCart, setIsOpen } = useCart();
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { products, loading, error } = useProducts();

  useEffect(() => {
    if (products.length > 0) {
      if (limit !== undefined) {
        setDisplayedProducts(products.slice(0, limit));
      } else {
        setDisplayedProducts(products);
      }
    }
  }, [products, limit]);

  if (loading && displayedProducts.length === 0) {
    return (
      <>
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: limit || 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (error && displayedProducts.length === 0) {
    return (
      <div className="text-center">
        <div className="text-red-500 text-xl">Erro: {error}</div>
        <div className="mt-4 text-allin-dark/80 dark:text-allin-white/80">
          Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-allin-dark dark:text-allin-white">
          Nossos <span className="text-allin-orange">Produtos</span>
        </h2>
        <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto">
          Conheça nossa linha completa de calçados terapêuticos com tecnologias exclusivas da Allin.
        </p>
      </div>

      <div className="hidden md:block fixed top-4 right-4 z-50">
        <Button
          variant="default"
          className="rounded-full w-14 h-14 shadow-lg bg-allin-orange hover:bg-allin-orange/90 text-allin-dark"
          onClick={() => {
            console.log('Botão clicado, abrindo carrinho...');
            setIsOpen(true);
          }}
          aria-label="Abrir carrinho"
        >
          <ShoppingCart className="w-6 h-6" />
        </Button>
      </div>

      {displayedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product, index) => (
              <Card 
                key={index} 
                className="overflow-hidden border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 group animate-slide-up glass-card h-full flex flex-col dark:dark:bg-allin-bg-dark-3 dark:dark:border-allin-bg-dark-2 cursor-pointer"
                style={{animationDelay: `${0.05 * index}s`}}
                onClick={() => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                }}
              >
                <div className="relative">
                  <img 
                    src={product.imgSrc} 
                    alt={product.caption} 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x400?text=Imagem+Indispon%C3%ADvel';
                    }}
                  />
                  {product.produtoTag && (
                    <div className="absolute top-2 right-2 bg-allin-orange text-allin-dark text-xs font-bold px-2 py-1 rounded-full">
                      {product.produtoTag}
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-bold text-allin-orange line-clamp-1">
                    {product.caption}
                  </CardTitle>
                  <p className="text-sm text-allin-dark/80 dark:text-allin-white/80 line-clamp-2">
                    {product.caption2.substring(0, 100)}...
                  </p>
                  <p className="text-xl font-bold text-allin-orange mt-2">
                    {formatPrice(product.price) || 'Preço não disponível'}
                  </p>
                </CardHeader>
                <CardContent className="p-4 mt-auto">
                  <Button 
                    variant="default"
                    className="w-full bg-allin-orange hover:bg-allin-orange/90 text-allin-dark"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {limit !== undefined && (
            <div className="text-center mt-12">
              <Button 
                variant="default"
                onClick={() => navigate({ to: '/loja' })}
                className="px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 gap-2 bg-allin-orange hover:bg-allin-orange/90 text-allin-dark"
              >
                Ver Mais Produtos
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-allin-dark/80 dark:text-allin-white/80">
            Nenhum produto disponível no momento.
          </p>
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={{
            caption: selectedProduct.caption,
            caption2: selectedProduct.caption2,
            imgFluidSrc: selectedProduct.imgSrc,
            imgFluidSrc2: selectedProduct.imgSrc2,
            produtoTag: selectedProduct.produtoTag,
            linkProdutoHref: selectedProduct.linkProdutoHref,
            price: selectedProduct.price
          }}
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
};

const ProductGallery = ({ limit }: ProductGalleryProps) => {
  return <ProductGalleryContent limit={limit} />;
};

export default ProductGallery;
