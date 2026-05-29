import React from 'react';

import { Package, AlertTriangle, TrendingDown, TrendingUp, ShoppingCart, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  reserved: number;
  minStock: number;
  price: number;
  lastUpdated: Date;
}

interface CategoryStock {
  name: string;
  value: number;
  color: string;
}

const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Tênis Esportivo A',
    category: 'Calçados',
    stock: 25,
    reserved: 5,
    minStock: 10,
    price: 299.90,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: '2',
    name: 'Tênis Esportivo B',
    category: 'Calçados',
    stock: 8,
    reserved: 2,
    minStock: 15,
    price: 349.90,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 2))
  },
  {
    id: '3',
    name: 'Camiseta Esportiva',
    category: 'Vestuário',
    stock: 42,
    reserved: 8,
    minStock: 20,
    price: 89.90,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: '4',
    name: 'Calça Esportiva',
    category: 'Vestuário',
    stock: 15,
    reserved: 3,
    minStock: 10,
    price: 149.90,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 3))
  },
  {
    id: '5',
    name: 'Mochila Esportiva',
    category: 'Acessórios',
    stock: 30,
    reserved: 5,
    minStock: 15,
    price: 199.90,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: '6',
    name: 'Garrafa Térmica',
    category: 'Acessórios',
    stock: 5,
    reserved: 1,
    minStock: 10,
    price: 79.90,
    lastUpdated: new Date(new Date().setDate(new Date().getDate() - 2))
  }
];

const categoryStock: CategoryStock[] = [
  { name: 'Calçados', value: 33, color: '#F2A801' },
  { name: 'Vestuário', value: 57, color: '#10B981' },
  { name: 'Acessórios', value: 35, color: '#3B82F6' }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export function InventorySummary() {
  // Calcular métricas
  const totalItems = inventoryItems.length;
  const totalStock = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const reservedStock = inventoryItems.reduce((sum, item) => sum + item.reserved, 0);
  const availableStock = totalStock - reservedStock;
  const lowStockItems = inventoryItems.filter(item => item.stock <= item.minStock).length;
  const outOfStockItems = inventoryItems.filter(item => item.stock === 0).length;
  
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.stock * item.price), 0);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Resumo de Inventário
        </CardTitle>
        <CardDescription>
          Gestão de estoque e produtos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Total de Itens</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalItems}</p>
            <p className="text-xs text-muted-foreground mt-1">categorias de produtos</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Estoque Total</span>
            </div>
            <p className="text-2xl font-bold mt-2">{totalStock}</p>
            <p className="text-xs text-muted-foreground mt-1">unidades em estoque</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-purple-500 mr-2" />
              <span className="font-medium">Disponível</span>
            </div>
            <p className="text-2xl font-bold mt-2">{availableStock}</p>
            <p className="text-xs text-muted-foreground mt-1">unidades disponíveis</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium">Estoque Baixo</span>
            </div>
            <p className="text-2xl font-bold mt-2">{lowStockItems}</p>
            <p className="text-xs text-muted-foreground mt-1">itens abaixo do mínimo</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium">Sem Estoque</span>
            </div>
            <p className="text-2xl font-bold mt-2">{outOfStockItems}</p>
            <p className="text-xs text-muted-foreground mt-1">itens esgotados</p>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-teal-500 mr-2" />
              <span className="font-medium">Valor Total</span>
            </div>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totalInventoryValue)}</p>
            <p className="text-xs text-muted-foreground mt-1">valor em estoque</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Distribuição por Categoria</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStock}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryStock.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} unidades`, 'Estoque']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-white dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3">
            <h4 className="font-medium mb-4">Itens com Estoque Baixo</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Produto</th>
                    <th className="text-left py-2">Categoria</th>
                    <th className="text-right py-2">Em Estoque</th>
                    <th className="text-right py-2">Mínimo</th>
                    <th className="text-right py-2">Preço</th>
                    <th className="text-right py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems
                    .filter(item => item.stock <= item.minStock)
                    .map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3">{item.name}</td>
                        <td className="py-3">{item.category}</td>
                        <td className="text-right py-3">{item.stock}</td>
                        <td className="text-right py-3">{item.minStock}</td>
                        <td className="text-right py-3">{formatCurrency(item.price)}</td>
                        <td className="text-right py-3">
                          <Button variant="outline" size="sm">
                            Repor
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-4">Todos os Itens de Inventário</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Produto</th>
                  <th className="text-left py-2">Categoria</th>
                  <th className="text-right py-2">Em Estoque</th>
                  <th className="text-right py-2">Reservado</th>
                  <th className="text-right py-2">Disponível</th>
                  <th className="text-right py-2">Preço</th>
                  <th className="text-right py-2">Última Atualização</th>
                  <th className="text-right py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.category}</td>
                    <td className="text-right py-3">{item.stock}</td>
                    <td className="text-right py-3">{item.reserved}</td>
                    <td className="text-right py-3">{item.stock - item.reserved}</td>
                    <td className="text-right py-3">{formatCurrency(item.price)}</td>
                    <td className="text-right py-3">
                      {item.lastUpdated.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="text-right py-3">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}