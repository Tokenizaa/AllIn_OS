import React from 'react';

import { Users, UserCheck, UserX, Shield } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
}

export function UserStats({ totalUsers, activeUsers, inactiveUsers, adminUsers }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Total de Usuários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{totalUsers}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            Usuários cadastrados
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Usuários Ativos</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{activeUsers}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            {((activeUsers / totalUsers) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Usuários Inativos</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{inactiveUsers}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            {((inactiveUsers / totalUsers) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-allin-white/80">Administradores</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground dark:text-allin-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-allin-white">{adminUsers}</div>
          <p className="text-xs text-muted-foreground dark:text-allin-white/60">
            Usuários com acesso admin
          </p>
        </CardContent>
      </Card>
    </div>
  );
}