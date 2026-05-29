import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  quantity: number;
  sku: string | null;
  category: string | null;
  status: string;
  image_url: string | null;
  image_url2: string | null;
  product_link: string | null;
  tag: string | null;
  installments: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
}

export function ProductDetails({ product, onBack, onEdit }: ProductDetailsProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'out_of_stock': return 'Sem Estoque';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Detalhes do Produto</h1>
        <Button variant="vibrantOutline" onClick={onBack}>Voltar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>
            Detalhes completos do produto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <p className="mt-1 text-sm text-gray-900">{product.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Criação</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(product.created_at).toLocaleDateString('pt-BR')} às {new Date(product.created_at).toLocaleTimeString('pt-BR')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Última Atualização</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(product.updated_at).toLocaleDateString('pt-BR')} às {new Date(product.updated_at).toLocaleTimeString('pt-BR')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <p className="mt-1 text-sm text-gray-900">{product.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(product.status)}`}>
                {getStatusLabel(product.status)}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço</label>
              <p className="mt-1 text-sm text-gray-900">{formatCurrency(product.price)}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço Original</label>
              <p className="mt-1 text-sm text-gray-900">{formatCurrency(product.original_price)}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
              <p className="mt-1 text-sm text-gray-900">{product.quantity}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <p className="mt-1 text-sm text-gray-900">{product.sku || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <p className="mt-1 text-sm text-gray-900">{product.category || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tag</label>
              <p className="mt-1 text-sm text-gray-900">{product.tag || 'Não informado'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Parcelamento</label>
              <p className="mt-1 text-sm text-gray-900">{product.installments || 'Não informado'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {product.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{product.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.image_url ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Principal</label>
                <img 
                  src={product.image_url} 
                  alt="Imagem principal do produto" 
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/400x300?text=Imagem+Indisponível';
                  }}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma imagem principal cadastrada</p>
            )}
            
            {product.image_url2 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Secundária</label>
                <img 
                  src={product.image_url2} 
                  alt="Imagem secundária do produto" 
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/400x300?text=Imagem+Indisponível';
                  }}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma imagem secundária cadastrada</p>
            )}
          </div>
        </CardContent>
      </Card>

      {product.product_link && (
        <Card>
          <CardHeader>
            <CardTitle>Link do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href={product.product_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-allin-orange hover:underline"
            >
              {product.product_link}
            </a>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button variant="vibrant" onClick={onEdit}>
          Editar Produto
        </Button>
      </div>
    </div>
  );
}