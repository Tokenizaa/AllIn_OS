import React, { useState } from 'react';

import { Users, Package, MessageSquare, BarChart3, TrendingUp, Search, Filter } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

import { AnalyticsSummary } from '@/components/admin/AnalyticsSummary';
import { ContentSummary } from '@/components/admin/ContentSummary';
import { CriticalAlerts } from '@/components/admin/CriticalAlerts';
import { CustomerSupportSummary } from '@/components/admin/CustomerSupportSummary';
import { DashboardCharts } from '@/components/admin/DashboardCharts';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { EventCalendar } from '@/components/admin/EventCalendar';
import { IntegrationsSummary } from '@/components/admin/IntegrationsSummary';
import { InventorySummary } from '@/components/admin/InventorySummary';
import { LeadStats } from '@/components/admin/LeadStats';
import { MarketingSummary } from '@/components/admin/MarketingSummary';
import { Notifications } from '@/components/admin/Notifications';
import { PendingTasks } from '@/components/admin/PendingTasks';
import { ProductStats } from '@/components/admin/ProductStats';
import { QuickSummary } from '@/components/admin/QuickSummary';
import { RealTimeMetrics } from '@/components/admin/RealTimeMetrics';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { SalesSummary } from '@/components/admin/SalesSummary';
import { SecuritySummary } from '@/components/admin/SecuritySummary';
import { SystemPerformance } from '@/components/admin/SystemPerformance';
import { UserFeedback } from '@/components/admin/UserFeedback';
import { UserStats } from '@/components/admin/UserStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseDashboard } from '@/hooks/useSupabaseDashboard';
import { useSupabaseLeads } from '@/hooks/useSupabaseLeads';

const Dashboard = () => {
  const { user, profile, loading, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('month');
  
  // Hooks para dados reais
  const { 
    dashboardStats, 
    userStats: realUserStats, 
    productStats: realProductStats, 
    loading: dashboardLoading 
  } = useSupabaseDashboard();
  
  const { 
    leadStats: realLeadStats, 
    loading: leadsLoading 
  } = useSupabaseLeads();


  // Se ainda estiver carregando, mostrar spinner
  if (loading || dashboardLoading || leadsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
      </div>
    );
  }

  // Verificar acesso antes de renderizar
  if (!user || (!isAdmin && !isSuperAdmin)) {
    return <Navigate to="/login" replace />;
  }

  const handleSignOut = async () => {
    // Redirecionar para a página de login
    navigate('/login');
  };

  // Dados padrão caso não haja dados reais
  const defaultDashboardStats = {
    usersCount: 0,
    productsCount: 0,
    conversationsCount: 0,
    revenue: 0,
    leadsCount: 0,
    ordersCount: 0
  };

  const dashboardStatsToUse = dashboardStats || defaultDashboardStats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-allin-bg-dark-1 dark:text-allin-white">
      {/* Header */}
      <header className="bg-white shadow dark:bg-allin-bg-dark-2 dark:text-allin-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-allin-white">Painel Administrativo</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Barra de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-allin-orange focus:border-transparent dark:bg-allin-bg-dark-1 dark:border-allin-bg-dark-3 dark:text-allin-white dark:placeholder:text-allin-white/50"
              />
            </div>
            
            {/* Filtro de data */}
            <div className="flex items-center">
              <Filter className="text-gray-400 w-4 h-4 mr-2" />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-allin-orange focus:border-transparent dark:bg-allin-bg-dark-1 dark:border-allin-bg-dark-3 dark:text-allin-white dark:[color-scheme:dark]"
              >
                <option value="day">Hoje</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
                <option value="year">Este ano</option>
              </select>
            </div>
            
            {/* Informações do usuário */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-allin-white/80">
                Bem-vindo, {profile?.full_name || user?.email || 'Administrador Especial'}
              </span>
              <Button variant="vibrantOutline" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Alertas Críticos */}
        <CriticalAlerts />

        {/* Resumo Rápido */}
        <QuickSummary 
          users={dashboardStatsToUse.usersCount}
          products={dashboardStatsToUse.productsCount}
          conversations={dashboardStatsToUse.conversationsCount}
          revenue={dashboardStatsToUse.revenue}
          leads={dashboardStatsToUse.leadsCount}
          orders={dashboardStatsToUse.ordersCount}
        />

        {/* Métricas em Tempo Real */}
        <RealTimeMetrics />

        {/* Stats Cards */}
        <DashboardStats 
          usersCount={dashboardStatsToUse.usersCount}
          productsCount={dashboardStatsToUse.productsCount}
          conversationsCount={dashboardStatsToUse.conversationsCount}
          revenue={dashboardStatsToUse.revenue}
          leadsCount={dashboardStatsToUse.leadsCount}
          ordersCount={dashboardStatsToUse.ordersCount}
        />

        {/* Estatísticas específicas */}
        {realLeadStats && (
          <LeadStats 
            leadsCount={realLeadStats.total_leads}
            newLeadsToday={realLeadStats.new_leads_today}
            conversionRate={realLeadStats.conversion_rate}
            avgScore={realLeadStats.avg_score}
          />
        )}
        
        {realProductStats && (
          <ProductStats 
            totalProducts={realProductStats.totalProducts}
            activeProducts={realProductStats.activeProducts}
            lowStockProducts={realProductStats.lowStockProducts}
            outOfStockProducts={realProductStats.outOfStockProducts}
          />
        )}
        
        {realUserStats && (
          <UserStats 
            totalUsers={realUserStats.totalUsers}
            activeUsers={realUserStats.activeUsers}
            inactiveUsers={realUserStats.inactiveUsers}
            adminUsers={realUserStats.adminUsers}
          />
        )}

        {/* Charts */}
        <DashboardCharts />

        {/* Resumo de Vendas */}
        <SalesSummary />

        {/* Resumo de Marketing */}
        <MarketingSummary />

        {/* Suporte ao Cliente */}
        <CustomerSupportSummary />

        {/* Resumo de Inventário */}
        <InventorySummary />

        {/* Segurança do Sistema */}
        <SecuritySummary />

        {/* Analytics do Site */}
        <AnalyticsSummary />

        {/* Gerenciamento de Conteúdo */}
        <ContentSummary />

        {/* Integrações do Sistema */}
        <IntegrationsSummary />

        {/* Performance do Sistema */}
        <SystemPerformance />

        {/* Feedback dos Usuários */}
        <UserFeedback />

        {/* Calendário de Eventos */}
        <EventCalendar />

        {/* Tarefas Pendentes */}
        <PendingTasks />

        {/* Notificações */}
        <Notifications />

        {/* Atividade Recente */}
        <RecentActivity />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Card de Produtos */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-allin-white">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Gerenciar Produtos
              </CardTitle>
              <CardDescription className="dark:text-allin-white/70">
                Adicione, edite ou remova produtos do catálogo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2 dark:text-allin-white">{dashboardStatsToUse.productsCount} produtos</p>
              <p className="text-sm text-gray-600 mb-4 dark:text-allin-white/70">
                8 adicionados este mês
              </p>
            </CardContent>
            <CardContent className="pt-0">
              <Button 
                variant="vibrantOutline"
                className="w-full"
                disabled
              >
                <Package className="w-4 h-4 mr-2" />
                Em breve
              </Button>
            </CardContent>
          </Card>

          {/* Card de Leads */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-allin-white">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Gerenciar Leads
              </CardTitle>
              <CardDescription className="dark:text-allin-white/70">
                Visualize e gerencie os leads cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2 dark:text-allin-white">{realLeadStats?.total_leads || 0} leads</p>
              <p className="text-sm text-gray-600 mb-4 dark:text-allin-white/70">
                {realLeadStats?.new_leads_today || 0} novos esta semana
              </p>
            </CardContent>
            <CardContent className="pt-0">
              <Button
                variant="vibrant"
                onClick={() => navigate('/admin/leads')}
              >
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Leads
              </Button>
            </CardContent>
          </Card>

          {/* Card de Conversas */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-allin-white">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                Conversas do Chat
              </CardTitle>
              <CardDescription className="dark:text-allin-white/70">
                Acompanhe as conversas dos usuários com o chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2 dark:text-allin-white">{dashboardStatsToUse.conversationsCount} conversas hoje</p>
              <p className="text-sm text-gray-600 mb-4 dark:text-allin-white/70">
                Score médio de leads: 75 pontos
              </p>
            </CardContent>
            <CardContent className="pt-0">
              <Button
                variant="vibrant"
                onClick={() => navigate('/admin/messages')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Ver Conversas
              </Button>
            </CardContent>
          </Card>

          {/* Card de Análises */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-allin-white">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                Relatórios e Análises
              </CardTitle>
              <CardDescription className="dark:text-allin-white/70">
                Visualize métricas e relatórios detalhados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2 dark:text-allin-white">R$ {dashboardStatsToUse.revenue?.toLocaleString('pt-BR') || '0'}</p>
              <p className="text-sm text-gray-600 mb-4 dark:text-allin-white/70">
                Receita do mês atual
              </p>
            </CardContent>
            <CardContent className="pt-0">
              <Button 
                variant="vibrantOutline"
                disabled
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Em Breve
              </Button>
            </CardContent>
          </Card>

          {/* Card de Configurações */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-allin-white">
                <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                Configurações
              </CardTitle>
              <CardDescription className="dark:text-allin-white/70">
                Gerencie configurações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 dark:text-allin-white/70">
                Configurações avançadas do sistema
              </p>
            </CardContent>
            <CardContent className="pt-0">
              <Button 
                variant="vibrantOutline"
                disabled
              >
                Em Breve
              </Button>
            </CardContent>
          </Card>

          {/* Card de Suporte */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-allin-bg-dark-2 dark:border-allin-bg-dark-3 dark:text-allin-white">
            <CardHeader>
              <CardTitle className="dark:text-allin-white">Suporte e Ajuda</CardTitle>
              <CardDescription className="dark:text-allin-white/70">
                Acesso rápido a documentação e suporte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 dark:text-allin-white/70">
                Encontre ajuda e documentação do sistema
              </p>
            </CardContent>
            <CardContent className="pt-0">
              <Button 
                variant="vibrantOutline"
                onClick={() => window.open('https://docs.lovable.dev', '_blank')}
              >
                Acessar Documentação
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
