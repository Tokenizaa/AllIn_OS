import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

import CartSidebar from '@/components/features/cart/CartSidebar'
import { CartProvider } from '@/contexts/CartContext'
import { StoreSettingsProvider } from '@/contexts/StoreSettingsContext'

const CarrinhoPage = () => {
  return (
    <StoreSettingsProvider>
      <CartProvider>
        <div className="min-h-screen bg-allin-bg-light-1 dark:bg-allin-bg-dark-1">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-allin-orange mb-8">Meu Carrinho</h1>
            <CartSidebar />
          </div>
        </div>
      </CartProvider>
    </StoreSettingsProvider>
  );
};

export const Route = createFileRoute('/carrinho')({
  component: CarrinhoPage,
})
