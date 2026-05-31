import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useModal } from "@/hooks/useModal";

import AdditionalInfo from './product-modal/AdditionalInfo';
import ImageGallery from './product-modal/ImageGallery';
import ProductInfo from './product-modal/ProductInfo';

interface ProductModalProps {
  product: {
    caption: string;
    caption2: string;
    imgFluidSrc: string;
    imgFluidSrc2?: string;
    produtoTag?: string;
    linkProdutoHref: string;
    price?: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Componente ProductModal
 * 
 * Modal de produto que exibe informações detalhadas sobre um produto, incluindo:
 * - Galeria de imagens
 * - Informações do produto e especificações
 * - Opções de compra (tamanho, quantidade)
 * - Informações adicionais (revendedor, entrega)
 * 
 * Este componente é composto por três subcomponentes principais:
 * 1. ImageGallery - Exibe a galeria de imagens do produto
 * 2. ProductInfo - Mostra as informações do produto, abas e opções de compra
 * 3. AdditionalInfo - Exibe informações adicionais como seção de revendedor
 */
const ProductModal = ({ product, isOpen, onOpenChange }: ProductModalProps) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { isVisible, close } = useModal(isOpen);

  // Atualiza a imagem quando o produto ou o modal for aberto
  useEffect(() => {
    if (isOpen && product) {
      setSelectedImage(product.imgFluidSrc);
      setSelectedSize('');
      setQuantity(1);
    }
  }, [isOpen, product]);

  // Função para fechar o modal
  const handleClose = () => {
    close(() => onOpenChange(false));
  };

  /**
   * Função para adicionar o produto ao carrinho
   * 
   * Valida se um tamanho foi selecionado antes de adicionar ao carrinho.
   * Cria um objeto com as informações do produto e o adiciona ao contexto do carrinho.
   * Após adicionar, reseta as seleções e fecha o modal.
   */
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    
    addItem({
      id: product.caption.toLowerCase().replace(/\s+/g, '-'),
      name: product.caption,
      imageUrl: selectedImage,
      selectedSize,
      quantity,
      price: product.price
    });
    
    // Resetar seleção
    setSelectedSize('');
    setQuantity(1);
    onOpenChange(false);
  };

  /**
   * Função para selecionar uma imagem da galeria
   * 
   * Atualiza o estado da imagem selecionada para exibição na visualização principal.
   * 
   * @param imageSrc - URL da imagem selecionada
   */
  const handleImageSelect = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`w-full max-w-full h-[100dvh] md:max-w-6xl md:h-[95vh] overflow-y-auto p-0 rounded-none md:rounded-lg transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} aria-describedby="product-modal-description">
        {/* Header do Modal */}
        <DialogHeader className="p-4 md:p-6 pb-4 border-b border-allin-orange/20 mx-2 md:mx-0">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl md:text-3xl text-allin-orange font-bold leading-tight">{product.caption}</DialogTitle>
              <DialogDescription className="text-lg md:text-base text-allin-dark/80 dark:text-allin-white/80 mt-2 md:mt-1 leading-relaxed" id="product-modal-description">
                O {product.caption} combina design sofisticado com tecnologias terapêuticas avançadas
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 mx-4 md:mx-0">
          {/* Galeria de Imagens - Lado Esquerdo */}
          <ImageGallery 
            product={product} 
            selectedImage={selectedImage} 
            onImageSelect={handleImageSelect} 
          />
          
          {/* Informações do Produto e Compra - Lado Direito */}
          <ProductInfo 
            product={product}
            selectedSize={selectedSize}
            quantity={quantity}
            onSizeSelect={setSelectedSize}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
          />
        </div>
        
        {/* Detalhes do Produto */}
        <div className="border-t mt-6 pt-6 px-4 md:px-6 mx-4 md:mx-0 pb-6">
          <h3 className="text-xl font-bold text-allin-orange mb-4">Detalhes do Produto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-allin-dark/80 dark:text-allin-white/80">
            <div>
              <h4 className="font-semibold">Design Sofisticado e Confortável</h4>
              <p>O {product.caption} traz um visual clean e atemporal, fácil de combinar com diferentes looks. Seu design elegante oferece todo o conforto que seus pés precisam, sendo perfeito para longos períodos de uso.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><span className="font-semibold">Design minimalista:</span> versátil e combina com qualquer estilo.</li>
                <li><span className="font-semibold">Conforto absoluto:</span> materiais de alta qualidade.</li>
                <li><span className="font-semibold">Estilo sofisticado:</span> design simples e elegante.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Tecnologia Terapêutica Avançada</h4>
              <p>Equipado com tecnologias exclusivas que oferecem benefícios terapêuticos comprovados.</p>
              <h5 className="font-semibold mt-2">Benefícios:</h5>
              <ul className="list-disc list-inside space-y-1">
                <li>Melhora significativa da circulação sanguínea.</li>
                <li>Alívio eficaz de dores e inflamações.</li>
                <li>Redução do estresse e cansaço nos pés.</li>
                <li>Aceleração da recuperação muscular.</li>
                <li>Conforto excepcional para longos períodos de uso.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seção Separada - Venha Ser Revendedor */}
        <AdditionalInfo onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
