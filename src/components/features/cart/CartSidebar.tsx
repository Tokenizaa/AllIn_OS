import React, { memo } from 'react';

import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/utils/priceFormatter';


// Componente memoizado para evitar re-renderizações desnecessárias
const CartSidebarComponent = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, isOpen, setIsOpen } = useCart();

  const { toast } = useToast();

  // Função para gerar mensagem do WhatsApp
  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';

    const message = items.map(item =>
      `Produto: ${item.name}
Tamanho: ${item.selectedSize}
Quantidade: ${item.quantity}
Imagem: ${item.imageUrl}
---`
    ).join('\n');

    const fullMessage = `Olá! Gostaria de finalizar a compra dos seguintes itens:

${message}

Total de itens: ${getTotalItems()}`;
    return encodeURIComponent(fullMessage);
  };

  // Obter o número do WhatsApp do contexto
  const { whatsapp } = useStoreSettings();

  // Calcular o valor total do carrinho
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price?.replace(/[^0-9,-]+/g, '').replace(',', '.')) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Fechar o carrinho ao clicar no overlay (fora do conteúdo)
  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent 
        className="w-full sm:max-w-md p-0 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 border-l border-allin-orange/40 flex flex-col"
        onPointerDownOutside={handleOverlayClick}
        onEscapeKeyDown={() => setIsOpen(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-allin-orange/20">
            <h2 className="text-xl font-bold text-allin-orange flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Meu Carrinho
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <ShoppingCart className="w-16 h-16 text-allin-dark/40 dark:text-allin-white/40 mb-4" />
                <p className="text-allin-dark/80 dark:text-allin-white/80 text-lg">Seu carrinho está vazio</p>
                <p className="text-sm text-allin-dark/60 dark:text-allin-white/60 mt-1">
                  Adicione produtos para começar!
                </p>
                <Button 
                  variant="vibrant" 
                  className="mt-6"
                  onClick={() => setIsOpen(false)}
                >
                  Continuar comprando
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4 p-4 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 rounded-lg border border-allin-orange/20">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border border-allin-orange/30"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/64x64?text=Imagem';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-allin-dark dark:text-allin-white line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-allin-dark/80 dark:text-allin-white/80">
                          Tamanho: {item.selectedSize}
                        </p>
                        <p className="text-sm text-allin-orange font-bold">
                          {formatPrice(item.price) || 'Preço não disponível'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-allin-orange/50"
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center text-allin-dark dark:text-allin-white">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-allin-orange/50"
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => removeItem(item.id, item.selectedSize)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-allin-orange/20 pt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-allin-dark/80 dark:text-allin-white/80">
                      <span>Subtotal ({getTotalItems()} itens):</span>
                      <span className="font-semibold">{formatPrice(calculateTotal().toFixed(2))}</span>
                    </div>
                    <div className="flex justify-between text-allin-dark/80 dark:text-allin-white/80">
                      <span>Frete:</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">A calcular</span>
                    </div>
                    <div className="border-t border-allin-orange/20 pt-2 mt-2 flex justify-between text-lg font-bold text-allin-orange">
                      <span>Total:</span>
                      <span>{formatPrice(calculateTotal().toFixed(2))}</span>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-allin-dark/60 dark:text-allin-white/60">
                    * O frete será calculado no fechamento do pedido
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      variant="vibrant"
                      className="w-full h-12 text-base font-semibold"
                      onClick={() => {
                        const message = generateWhatsAppMessage();
                        if (message) {
                          // Abre o WhatsApp
                          window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
                          
                          // Mostra confirmação
                          toast({
                            title: 'Pedido enviado!',
                            description: 'Agora é só finalizar seu pedido pelo WhatsApp.',
                            variant: 'default',
                            duration: 3000
                          });
                          
                          // Limpa o carrinho após um pequeno atraso
                          setTimeout(() => {
                            clearCart();
                            setIsOpen(false);
                          }, 1000);
                        }
                      }}
                      aria-label="Finalizar compra via WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Finalizar pedido
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full h-10 text-sm text-allin-dark/80 dark:text-allin-white/80 border-allin-orange/40 hover:bg-allin-orange/5"
                      onClick={() => setIsOpen(false)}
                    >
                      Continuar comprando
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full h-10 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                          clearCart();
                          toast({
                            title: 'Carrinho limpo',
                            description: 'Todos os itens foram removidos do carrinho.',
                            variant: 'default',
                          });
                        }
                      }}
                      aria-label="Limpar todos os itens do carrinho"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar carrinho
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Adicionar display name para facilitar debugging
CartSidebarComponent.displayName = 'CartSidebar';

// Exportar componente memoizado
const CartSidebar = memo(CartSidebarComponent);

export default CartSidebar;