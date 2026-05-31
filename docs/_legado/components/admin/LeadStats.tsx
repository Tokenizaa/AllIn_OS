import React from 'react';

import { Users, TrendingUp, Clock, BarChart3 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LeadStatsProps {
  leadsCount: number;
  newLeadsToday: number;
  conversionRate: number;
  avgScore: number;
}

export function LeadStats({ leadsCount, newLeadsToday, conversionRate, avgScore }: LeadStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Total de Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{leadsCount}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            Leads cadastrados
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Novos Hoje</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{newLeadsToday}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            +10% em relação a ontem
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{conversionRate}%</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            +2% em relação ao mês passado
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Score Médio</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{avgScore}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            Score de qualificação
          </p>
        </CardContent>
      </Card>
    </div>
  );
}