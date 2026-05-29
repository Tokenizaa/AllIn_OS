import React from 'react';

import { AgentProduct } from '@/types/agent';

const AgentProductList = ({ products }: { products: AgentProduct[] }) => {
  return (
    <div className="p-2 mb-2 bg-white border border-allin-orange/20 rounded-md space-y-2">
      <p className="text-[11px] text-allin-orange font-semibold tracking-wide">Produtos recomendados</p>
      <div className="space-y-1">
        {products.map((product, index) => (
          <a
            key={`${product.name}-${index}`}
            href={product.url || '#'}
            target="_blank"
            rel="noreferrer"
            className={`block p-2 rounded-md border ${product.url ? 'border-allin-orange/40 hover:border-allin-orange' : 'border-allin-orange/10'} bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 transition-colors`}
          >
            <div className="flex justify-between items-center text-[12px] font-semibold">
              <span>{product.name}</span>
              {product.url && <span className="text-xs text-allin-orange">ver</span>}
            </div>
            <p className="text-[11px] text-gray-700 dark:text-gray-200 mt-1">{product.summary}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AgentProductList;
