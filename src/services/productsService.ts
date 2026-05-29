import { Product, Category } from '@/types/products';
import { productsData as rawProductsData } from '@/utils/productsData';

// Converter produtos do formato do productsData para o formato esperado pelo Product
const convertProducts = (): Product[] => {
  return rawProductsData.map(product => ({
    linkProdutoHref: product.linkProduto,
    imgFluidSrc: product.imgSrc,
    imgFluidSrc2: product.imgSrc2,
    caption: product.caption,
    categorias: product.categorias,
    caption2: product.caption2,
    price: product.price,
    parcelasValor: product.parcelasValor,
    produtoTag: product.produtoTag
  }));
};

// Cache simples em memória para produtos processados
let productsCache: Product[] | null = null;
let categoriesCache: Category[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Função para obter produtos com cache
export const getProducts = async (): Promise<Product[]> => {
  const now = Date.now();

  // Verificar se temos dados em cache e se não expiraram
  if (productsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return productsCache;
  }

  try {
    // Usar dados locais em vez de carregar do CSV
    const products = convertProducts();

    // Embaralhar produtos para seleção aleatória
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);

    productsCache = shuffledProducts;
    lastFetchTime = now;

    return shuffledProducts;
  } catch (error) {
    // Se houver erro e temos cache antigo, usar cache
    if (productsCache) {
      console.warn('Erro ao carregar produtos, usando cache antigo:', error);
      return productsCache;
    }
    throw error;
  }
};

// Função para obter categorias com cache
export const getCategories = async (): Promise<Category[]> => {
  if (categoriesCache) {
    return categoriesCache;
  }

  try {
    const products = await getProducts();
    const categoryMap: { [key: string]: number } = {};

    products.forEach(product => {
      const category = product.categorias.trim();
      if (category && category !== '') {
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      }
    });

    const categories = Object.entries(categoryMap)
      .map(([name, count], index) => ({
        id: index + 1,
        name,
        productCount: count
      }))
      .filter(cat => cat.productCount > 0)
      .sort((a, b) => b.productCount - a.productCount);

    categoriesCache = categories;
    return categories;
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    throw error;
  }
};

// Função para obter produtos por categoria
export const getProductsByCategory = async (categoryName: string, limit: number = 4): Promise<Product[]> => {
  const products = await getProducts();

  return products
    .filter(product => product.categorias.trim().toLowerCase() === categoryName.toLowerCase())
    .slice(0, limit);
};

// Limpar cache (útil para desenvolvimento ou forçar refresh)
export const clearProductsCache = (): void => {
  productsCache = null;
  categoriesCache = null;
  lastFetchTime = 0;
};
