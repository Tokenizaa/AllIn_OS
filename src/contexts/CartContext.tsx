import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';

// Tipo para item do carrinho
export type CartItem = {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  selectedSize: string;
  quantity: number;
};

// Tipo para o contexto do carrinho
type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

// Criar contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Chave para armazenar os itens do carrinho no localStorage
const CART_STORAGE_KEY = 'allin_cart_items';

// Provider do contexto
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Carregar itens do localStorage ao inicializar
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isOpen, setIsOpen] = useState(false);

  // Salvar itens no localStorage sempre que houver alterações
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  // Adicionar item ao carrinho
  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === newItem.id && item.selectedSize === newItem.selectedSize
      );
      
      const updatedItems = existingItem
        ? prevItems.map((item) =>
            item.id === newItem.id && item.selectedSize === newItem.selectedSize
              ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
              : item
          )
        : [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
      
      // Abre o carrinho ao adicionar item
      setIsOpen(true);
      
      // Fecha o carrinho após 3 segundos
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
      
      return updatedItems;
    });
  }, []);

  // Remover item do carrinho
  const removeItem = useCallback((id: string, size: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.selectedSize === size)));
  }, []);

  // Atualizar quantidade
  const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  // Limpar carrinho
  const clearCart = useCallback(() => setItems([]), []);

  // Calcular total de itens (memoizado)
  const totalItems = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  // Memoizar o valor do contexto
  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems: () => totalItems,
    isOpen,
    setIsOpen,
  }), [items, addItem, removeItem, updateQuantity, clearCart, totalItems, isOpen]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
