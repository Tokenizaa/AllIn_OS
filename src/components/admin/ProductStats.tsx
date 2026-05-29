import React from 'react';

import { Package, TrendingUp, AlertTriangle, ShoppingCart } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductStatsProps {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export function ProductStats({ totalProducts, activeProducts, lowStockProducts, outOfStockProducts }: ProductStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Total de Produtos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{totalProducts}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            Produtos cadastrados
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Produtos Ativos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{activeProducts}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            {((activeProducts / totalProducts) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Estoque Baixo</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{lowStockProducts}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            Produtos com estoque &lt; 10
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Sem Estoque</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{outOfStockProducts}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            Produtos indisponíveis
          </p>
        </CardContent>
      </Card>
    </div>
  );
}