import React, { useState } from 'react';

import { 
  Zap, Waves, Wind, ShoppingCart, Tag, Plus, Minus, Truck, 
  RotateCcw, Shield, Star, CheckCircle, UserPlus, DollarSign, TrendingUp, Award
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/utils/priceFormatter";

interface ProductInfoProps {
  product: {
    caption: string;
    caption2: string;
    price?: string;
    linkProdutoHref: string;
  };
  selectedSize: string;
  quantity: number;
  onSizeSelect: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

const ProductInfo = ({ 
  product, 
  selectedSize, 
  quantity, 
  onSizeSelect, 
  onQuantityChange,
  onAddToCart
}: ProductInfoProps) => {
  // Tamanhos padrão
  const sizes = [
    { size: "34", measure: "23,2" },
    { size: "35", measure: "23,9" },
    { size: "36", measure: "24,5" },
    { size: "37", measure: "25,2" },
    { size: "38", measure: "25,9" },
    { size: "39", measure: "26,5" },
    { size: "40", measure: "27,2" },
    { size: "41", measure: "27,9" },
    { size: "42", measure: "28,5" },
    { size: "43", measure: "29,2" },
    { size: "44", measure: "29,9" }
  ];

  // Incrementar quantidade
  const incrementQuantity = () => {
    onQuantityChange(quantity + 1);
  };

  // Decrementar quantidade
  const decrementQuantity = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };

  return (
    <div className="space-y-8">
      {/* Preço e Avaliações */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-4">
          <Tag className="w-6 h-6 text-allin-orange" />
          <span className="text-3xl md:text-4xl font-bold text-allin-orange">
            {formatPrice(product.price) || 'Preço não disponível'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex text-yellow-400">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
          <span className="text-lg font-medium">5.0</span>
          <span className="text-base md:text-lg text-allin-dark/80 dark:text-allin-white/80">(128 avaliações)</span>
        </div>
      </div>
      
      {/* Tecnologias em Destaque */}
      <div className="space-y-4">
        <h3 className="text-2xl md:text-xl font-bold text-allin-dark dark:text-allin-white">Tecnologias Exclusivas</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 rounded-lg bg-allin-orange/10 border border-allin-orange/20">
            <div className="w-12 h-12 bg-allin-orange rounded-full flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-allin-dark" />
            </div>
            <span className="text-lg md:text-sm font-medium text-center text-allin-dark dark:text-allin-white">Magnetoterapia</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-allin-orange/10 border border-allin-orange/20">
            <div className="w-12 h-12 bg-allin-orange rounded-full flex items-center justify-center mb-3">
              <Waves className="w-6 h-6 text-allin-dark" />
            </div>
            <span className="text-lg md:text-sm font-medium text-center text-allin-dark dark:text-allin-white">Infravermelho</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-allin-orange/10 border border-allin-orange/20">
            <div className="w-12 h-12 bg-allin-orange rounded-full flex items-center justify-center mb-3">
              <Wind className="w-6 h-6 text-allin-dark" />
            </div>
            <span className="text-lg md:text-sm font-medium text-center text-allin-dark dark:text-allin-white">Tecido Knit</span>
          </div>
        </div>
      </div>
      
      {/* Abas de Conteúdo */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description" className="text-lg md:text-sm py-3">Descrição</TabsTrigger>
          <TabsTrigger value="specifications" className="text-lg md:text-sm py-3">Especificações</TabsTrigger>
          <TabsTrigger value="benefits" className="text-lg md:text-sm py-3">Benefícios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <div className="space-y-4">
            <p className="text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed">
              O {product.caption} oferece a combinação perfeita de elegância, conforto e tecnologias terapêuticas. 
              Equipado com magnetoterapia e infravermelho longo, ele proporciona alívio de dores, melhora da circulação 
              e acelera a recuperação muscular, tudo isso em um design sofisticado e moderno, ideal para o seu dia a dia.
            </p>
            <p className="text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed">
              O {product.caption} traz um visual clean e atemporal, fácil de combinar com diferentes looks. Além de seu 
              design elegante, ele oferece todo o conforto que seus pés precisam, sendo perfeito para longos períodos de uso.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <div className="space-y-6">
            <h4 className="text-xl md:text-base font-semibold text-allin-orange">Design Sofisticado e Confortável</h4>
            <ul className="list-disc list-inside text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 space-y-3 pl-1">
              <li>Design minimalista: O tênis é versátil e combina com qualquer estilo.</li>
              <li>Conforto absoluto: Feito com materiais de alta qualidade para garantir o máximo de conforto durante todo o dia.</li>
              <li>Estilo sofisticado: Um design simples e elegante que eleva qualquer visual.</li>
            </ul>
            
            <h4 className="text-xl md:text-base font-semibold text-allin-orange mt-6">Tecnologia Terapêutica Avançada</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h5 className="text-lg md:text-sm font-medium text-allin-dark dark:text-allin-white">Tecnologia Knit</h5>
                <p className="text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed">
                  Proporciona flexibilidade e respirabilidade. O tecido se adapta aos seus pés, garantindo conforto e liberdade de movimento.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="text-lg md:text-sm font-medium text-allin-dark dark:text-allin-white">Magnetoterapia</h5>
                <p className="text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed">
                  Melhora a circulação sanguínea, alivia dores e reduz o cansaço nos pés.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="text-lg md:text-sm font-medium text-allin-dark dark:text-allin-white">Infravermelho Longo</h5>
                <p className="text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 leading-relaxed">
                  Age diretamente nas células musculares, promovendo recuperação e aliviando tensões.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="benefits" className="mt-6">
          <div className="space-y-6">
            <h4 className="text-xl md:text-base font-semibold text-allin-orange">Benefícios do {product.caption}</h4>
            <ul className="list-disc list-inside text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 space-y-4 pl-1">
              <li>Design atemporal: Um clássico que nunca sai de moda, combinando com qualquer visual.</li>
              <li>Conforto durante o dia inteiro: Seu material macio e respirável garante o máximo de conforto, mesmo após longas horas de uso.</li>
              <li>Tecnologias terapêuticas: Magnetoterapia e infravermelho longo para alívio de dores, recuperação muscular e melhora da circulação.</li>
              <li>Estilo e saúde: Conforto, elegância e bem-estar, tudo em um único produto.</li>
            </ul>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-allin-orange/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-allin-orange rounded-full"></div>
                </div>
                <span className="text-lg md:text-sm">Alívio de dores</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-allin-orange/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-allin-orange rounded-full"></div>
                </div>
                <span className="text-lg md:text-sm">Melhora da circulação</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-allin-orange/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-allin-orange rounded-full"></div>
                </div>
                <span className="text-lg md:text-sm">Recuperação muscular</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-allin-orange/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-allin-orange rounded-full"></div>
                </div>
                <span className="text-lg md:text-sm">Conforto 24h</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Observação Importante */}
      <div className="p-5 bg-allin-orange/10 rounded-lg border border-allin-orange/20">
        <h4 className="text-xl md:text-base font-bold text-allin-orange flex items-center gap-3">
          <CheckCircle className="w-6 h-6" />
          OBSERVAÇÃO IMPORTANTE
        </h4>
        <p className="text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 mt-3 leading-relaxed">
          Para garantir o melhor ajuste, recomendamos que escolha um número a menos do que normalmente usa. 
          O modelo tende a ser maior do que os modelos tradicionais.
        </p>
        <p className="text-lg md:text-sm text-allin-dark/90 dark:text-allin-white/90 mt-2 leading-relaxed">
          <strong>Exemplo:</strong> Se você usa o número 39, escolha o número 38.
        </p>
      </div>
      
      {/* Seção de Compra - Integrada ao fluxo normal */}
      <div className="border-t border-allin-orange/20 pt-6 mt-6">
        <div className="space-y-6">
          {/* Seleção de Tamanho */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-base font-bold text-allin-dark dark:text-allin-white">Tamanho</h3>
                <Badge variant="secondary" className="text-xs py-1">
                  Escolha um número a menos
                </Badge>
              </div>
              {selectedSize && (
                <div className="text-lg md:text-sm text-allin-dark/80 dark:text-allin-white/80">
                  Selecionado: <span className="font-semibold text-allin-orange">{selectedSize}</span>
                </div>
              )}
            </div>
            
            {/* Grade de tamanhos melhorada */}
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
              {sizes.map((size) => (
                <button
                  key={size.size}
                  onClick={() => onSizeSelect(size.size)}
                  className={`aspect-square rounded-md border-2 flex items-center justify-center text-lg md:text-sm font-medium transition-all duration-200 ${
                    selectedSize === size.size 
                      ? 'border-allin-orange bg-allin-orange text-allin-dark shadow-md scale-105' 
                      : 'border-allin-orange/30 hover:border-allin-orange hover:bg-allin-orange/10 text-allin-dark dark:text-allin-white'
                  }`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Controle de Quantidade e Preço/Compra - Layout Horizontal */}
          <div className="space-y-4">
            {/* Controle de Quantidade e Botão de Compra - Layout Horizontal Clean */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Controle de Quantidade */}
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl md:text-base font-bold text-allin-dark dark:text-allin-white mb-1">Quantidade</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="vibrantOutline" 
                      size="sm" 
                      className="w-9 h-9 p-0"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-xl md:text-lg font-semibold w-10 text-center">{quantity}</span>
                    
                    <Button 
                      variant="vibrantOutline" 
                      size="sm" 
                      className="w-9 h-9 p-0"
                      onClick={incrementQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-10 w-px bg-allin-orange/20 hidden sm:block"></div>
                
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-allin-orange" />
                  <div>
                    <div className="text-sm text-allin-dark/80 dark:text-allin-white/80">Preço Total</div>
                    <div className="text-2xl md:text-xl font-bold text-allin-orange">
                      {formatPrice(product.price ? (parseFloat(product.price.replace('R$', '').replace(',', '.')) * quantity).toString() : '0') || 'Preço não disponível'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="sm:ml-auto">
                <Button
                  variant="vibrant"
                  className="flex items-center justify-center gap-2 h-11 text-lg md:text-sm font-semibold px-4"
                  onClick={onAddToCart}
                  disabled={!selectedSize}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            </div>
            
            {!selectedSize && (
              <div className="text-center pt-1">
                <p className="text-lg md:text-sm text-allin-orange font-medium">
                  ⚠️ Por favor, selecione um tamanho para continuar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
