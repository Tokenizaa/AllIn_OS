import { useState, useEffect, useCallback } from 'react';

import { getProducts, getCategories, getProductsByCategory, clearProductsCache } from '@/services/productsService';
import { Product, Category } from '@/types/products';

interface UseProductsFromCSVReturn {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  getProductsByCategory: (categoryName: string, limit?: number) => Product[];
  refreshProducts: () => Promise<void>;
}

// Hook simplificado que utiliza o serviço centralizado
export const useProductsFromCSV = (): UseProductsFromCSVReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar produtos e categorias em paralelo
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      console.log('Produtos carregados:', productsData);
      console.log('Categorias carregadas:', categoriesData);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados';
      setError(errorMessage);
      console.error('Erro no useProductsFromCSV:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    clearProductsCache();
    await loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Função para obter produtos por categoria (utiliza cache)
  const getProductsByCategoryCached = useCallback((categoryName: string, limit: number = 4): Product[] => {
    return products
      .filter(product => product.categorias.trim().toLowerCase() === categoryName.toLowerCase())
      .slice(0, limit);
  }, [products]);

  return {
    products,
    categories,
    loading,
    error,
    getProductsByCategory: getProductsByCategoryCached,
    refreshProducts
  };
};