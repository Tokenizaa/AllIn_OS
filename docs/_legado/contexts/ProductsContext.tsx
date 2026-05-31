import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

import { getProducts, getCategories, clearProductsCache } from '@/services/productsService';
import { Product, Category } from '@/types/products';

// Tipos para o contexto
interface ProductsContextType {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProductsByCategory: (categoryName: string, limit?: number) => Product[];
}

// Criar contexto
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider do contexto
export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar produtos e categorias
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar produtos e categorias em paralelo
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados';
      setError(errorMessage);
      console.error('Erro no ProductsProvider:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh dos produtos (limpa cache e recarrega)
  const refreshProducts = useCallback(async () => {
    clearProductsCache();
    await loadData();
  }, [loadData]);

  // Obter produtos por categoria
  const getProductsByCategory = useCallback((categoryName: string, limit: number = 4): Product[] => {
    const filteredProducts = products.filter(
      product => product.categorias.trim().toLowerCase() === categoryName.toLowerCase()
    );
    return limit ? filteredProducts.slice(0, limit) : filteredProducts;
  }, [products]);

  // Efeito para carregar dados na inicialização
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoizar o valor do contexto
  const contextValue = useMemo(() => ({
    products,
    categories,
    loading,
    error,
    refreshProducts,
    getProductsByCategory
  }), [products, categories, loading, error, refreshProducts, getProductsByCategory]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

// Hook para usar o contexto
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductsProvider');
  }
  return context;
};