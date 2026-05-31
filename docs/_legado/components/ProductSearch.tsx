// src/components/ProductSearch.tsx
import React, { useState, useEffect } from 'react';

import { Search, Filter, X } from 'lucide-react';

import ProductGallery from '@/components/features/products/ProductGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProductsFromCSV } from '@/hooks/useProductsFromCSV';
import { Product } from '@/types/products';

interface ProductSearchProps {
  onProductSelect?: (product: Product) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onProductSelect }) => {
  const { products, loading, error } = useProductsFromCSV();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  // Extrair categorias únicas dos produtos
  useEffect(() => {
    if (products.length > 0) {
      const categories = Array.from(
        new Set(products.map(product => product.categorias.trim()))
      ).filter(Boolean);
      setUniqueCategories(categories);
      
      // Definir faixa de preço
      const prices = products
        .map(p => {
          const priceStr = p.price.replace('R$', '').replace(/\s/g, '').replace(',', '.');
          return parseFloat(priceStr) || 0;
        })
        .filter(price => !isNaN(price));
      
      if (prices.length > 0) {
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
    }
  }, [products]);

  // Filtrar e ordenar produtos
  useEffect(() => {
    let result = [...products];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.caption.toLowerCase().includes(term) ||
        product.caption2.toLowerCase().includes(term) ||
        product.categorias.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoria
    if (selectedCategory) {
      result = result.filter(product => 
        product.categorias.trim() === selectedCategory
      );
    }
    
    // Ordenar
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.caption.localeCompare(b.caption);
      } else if (sortBy === 'price') {
        const priceA = parseFloat(a.price.replace('R$', '').replace(/\s/g, '').replace(',', '.')) || 0;
        const priceB = parseFloat(b.price.replace('R$', '').replace(/\s/g, '').replace(',', '.')) || 0;
        comparison = priceA - priceB;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const formatPrice = (price: string): number => {
    const cleanPrice = price.replace('R$', '').replace(/\s/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erro: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Busca de Produtos</h1>
        <p className="text-gray-600">Encontre produtos usando filtros e busca avançada</p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Campo de busca */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro de categoria */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-allin-orange focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'name' | 'price');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-allin-orange focus:border-transparent"
            >
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="price-asc">Preço (Menor-Maior)</option>
              <option value="price-desc">Preço (Maior-Menor)</option>
            </select>
          </div>
        </div>

        {/* Filtros ativos */}
        {(searchTerm || selectedCategory) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <div className="flex items-center bg-allin-orange/10 text-allin-orange px-3 py-1 rounded-full">
                <span className="mr-2">Busca: {searchTerm}</span>
                <button onClick={() => setSearchTerm('')}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {selectedCategory && (
              <div className="flex items-center bg-allin-orange/10 text-allin-orange px-3 py-1 rounded-full">
                <span className="mr-2">Categoria: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('')}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="border-allin-orange text-allin-orange hover:bg-allin-orange/10"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Resultados */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredProducts.length} produtos encontrados
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <ProductGallery limit={filteredProducts.length} />
        )}
      </div>
    </div>
  );
};

export default ProductSearch;