import React, { useState, useEffect } from 'react';

import { formatPrice } from '@/utils/priceFormatter';

// Ícones simples para os botões de fechar e quantidade
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"></path></svg>
);

const MinusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
);


const ProductDetailModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mock de tamanhos, já que não vem do CSV. Adapte se necessário.
  const availableSizes = product.categorias ? product.categorias.includes('Vestuário') ? ['P', 'M', 'G', 'GG'] : [] : [];

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  // Efeito para controlar a animação de entrada
  useEffect(() => {
    // Adiciona um pequeno delay para garantir que o componente esteja no DOM
    // antes de aplicar as classes de transição, permitindo a animação de entrada.
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Função para lidar com o fechamento, acionando a animação de saída
  const handleClose = () => {
    setIsVisible(false); // Inicia a animação de saída
    setTimeout(onClose, 300); // Espera a animação (300ms) e então fecha o modal
  };

  if (!product) return null;

  const formattedPrice = formatPrice(product.preco);

  return (
    <div 
      className={`fixed inset-0 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isVisible ? 'bg-black bg-opacity-60' : 'bg-transparent'}`} 
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
        onClick={(e) => e.stopPropagation()}>
        <div className="relative p-4">
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors">
            <CloseIcon />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Coluna da Imagem */}
            <div className="p-4 flex justify-center items-center">
              <img 
                src={product.imgFluidSrc || product.imgSrc} 
                alt={product.caption} 
                className="max-w-full h-auto max-h-96 object-contain rounded-md"
              />
            </div>

            {/* Coluna de Informações */}
            <div className="p-4 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{product.caption}</h2>
              
              <p className="text-3xl font-light text-blue-600 my-4">
                {formattedPrice || 'Preço sob consulta'}
              </p>

              {/* Sobre o Produto */}
              <div className="text-gray-600 text-sm mb-6">
                <h3 className="font-semibold text-gray-700 mb-1">Sobre o Produto</h3>
                <p>O {product.caption} combina elegância, conforto e tecnologias terapêuticas avançadas. Equipado com magnetoterapia e infravermelho longo, proporciona alívio de dores, melhora a circulação e acelera a recuperação muscular.</p>
              </div>

              {/* Seleção de Tamanho */}
              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Tamanho:</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seletor de Quantidade */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Quantidade:</h4>
                <div className="flex items-center border border-gray-300 rounded-md w-fit">
                  <button onClick={() => handleQuantityChange(-1)} className="p-2 text-gray-600 hover:bg-gray-100"><MinusIcon /></button>
                  <span className="px-4 text-lg font-medium">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} className="p-2 text-gray-600 hover:bg-gray-100"><PlusIcon /></button>
                </div>
              </div>

              {/* Botão de Ação */}
              <button className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors text-lg shadow-md">
                Adicionar ao Carrinho
              </button>
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="border-t mt-6 pt-6 px-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detalhes do Produto</h3>
            <div className="space-y-4 text-gray-700">
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
