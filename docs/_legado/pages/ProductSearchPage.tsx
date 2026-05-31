import React from 'react';

import ProductSearch from '../components/ProductSearch'; // Corrigido: removido .jsx e usando caminho correto

const ProductSearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Busca de Produtos</h1>
          <p className="text-gray-600">Encontre produtos usando filtros e busca avançada</p>
        </div>
      </header>
      <main>
        <ProductSearch />
      </main>
    </div>
  );
};

export default ProductSearchPage;