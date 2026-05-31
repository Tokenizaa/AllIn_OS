import { useState, useEffect } from 'react';
import { productsService } from '../services/productsService';
import { Product, Category } from '../types/products';

export const useProductsFromCSV = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productsService.getAllProducts();
      setProducts(productsData);
      
      // Extract categories from products
      const categoryMap = new Map<string, number>();
      productsData.forEach(product => {
        const categoryName = product.categorias;
        if (categoryName) {
          categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
        }
      });
      
      const categoriesData = Array.from(categoryMap.entries()).map(([name, count], index) => ({
        id: index + 1,
        name,
        productCount: count,
      }));
      
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getProductsByCategory = (categoryName: string): Product[] => {
    return products.filter(product => product.categorias === categoryName);
  };

  const refreshProducts = async () => {
    await loadProducts();
  };

  return {
    products,
    categories,
    loading,
    error,
    getProductsByCategory,
    refreshProducts,
  };
};
