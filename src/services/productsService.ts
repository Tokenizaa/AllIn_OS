import { productsData } from '../utils/productsData';
import { Product } from '../types/products';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

let cache: {
  data: Product[];
  timestamp: number;
} | null = null;

export const productsService = {
  /**
   * Get all products with caching
   */
  getAllProducts: async (): Promise<Product[]> => {
    const now = Date.now();
    
    // Return cached data if still valid
    if (cache && (now - cache.timestamp) < CACHE_DURATION) {
      return cache.data;
    }
    
    // Simulate async operation (in real app, this would be an API call)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Convert productsData to the expected format
    const products = productsData.map(product => ({
      id: product.id,
      linkProduto: product.linkProduto,
      imgSrc: product.imgSrc,
      imgSrc2: product.imgSrc2,
      caption: product.caption,
      categorias: product.categorias,
      caption2: product.caption2,
      price: product.price,
      promotion: product.promotion,
      parcelasValor: product.parcelasValor,
      produtoTag: product.produtoTag,
    }));
    
    // Update cache
    cache = {
      data: products,
      timestamp: now,
    };
    
    return products;
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (categoryName: string): Promise<Product[]> => {
    const allProducts = await productsService.getAllProducts();
    return allProducts.filter(product => product.categorias === categoryName);
  },

  /**
   * Get product by ID
   */
  getProductById: async (id: string): Promise<Product | undefined> => {
    const allProducts = await productsService.getAllProducts();
    return allProducts.find(product => product.id === id);
  },

  /**
   * Clear the cache
   */
  clearCache: () => {
    cache = null;
  },
};
