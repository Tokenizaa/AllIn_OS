// src/pages/admin/ApiKeysPage.tsx
import React from 'react';

import { AlertCircle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ApiKeyManager } from '@/components/admin/ApiKeyManager';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useAuth } from '@/hooks/useAuth';

const ApiKeysPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  // Mock store data (will be replaced with real auth.store when available)
  const store = { id: 'default-store' };
  
  // Get API keys for the current store
  const { 
    apiKeys, 
    loading, 
    error, 
    fetchApiKeys, 
    createApiKey, 
    updateApiKey, 
    deleteApiKey 
  } = useApiKeys(store?.id || '');

  // Handle navigation back to dashboard
  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  // If user is not logged in or doesn't have a store, show error
  if (!user || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Você precisa estar logado e ter uma loja associada para acessar esta página.
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => navigate('/login')}>
                Ir para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-allin-bg-dark-1">
      {/* Header */}
      <header className="bg-white shadow dark:bg-allin-bg-dark-2">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-allin-white">Gerenciamento de Chaves de API</h1>
            <p className="mt-2 text-gray-600 dark:text-allin-white/70">
              Configure e gerencie chaves de API para integração com canais de tráfego pago
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToDashboard}>
              Voltar ao Painel
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Introduction Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Integração com Canais de Tráfego Pago
              </CardTitle>
              <CardDescription>
                Conecte sua loja com plataformas de anúncios para automatizar campanhas e rastrear conversões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg dark:border-allin-bg-dark-3">
                  <h3 className="font-semibold mb-2">Meta Ads (Facebook, Instagram)</h3>
                  <p className="text-sm text-gray-600 dark:text-allin-white/70">
                    Integre sua loja com Meta Ads para criar campanhas automatizadas no Facebook e Instagram, 
                    além de rastrear conversões diretamente da plataforma.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg dark:border-allin-bg-dark-3">
                  <h3 className="font-semibold mb-2">Google Ads</h3>
                  <p className="text-sm text-gray-600 dark:text-allin-white/70">
                    Conecte sua loja ao Google Ads para gerenciar campanhas de pesquisa e display, 
                    com rastreamento avançado de conversões e otimização automática.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Como configurar:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Obtenha as credenciais de API nas plataformas respectivas</li>
                  <li>Adicione as chaves de API no formulário abaixo</li>
                  <li>Ative as integrações para começar a usar</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* API Key Manager */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-allin-orange"></div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          ) : (
            <ApiKeyManager
              apiKeys={apiKeys}
              onCreateApiKey={async (data: any) => { await createApiKey(data); return; }}
              onUpdateApiKey={async (id: string, data: Partial<any>) => { await updateApiKey(id, data); return; }}
              onDeleteApiKey={deleteApiKey}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ApiKeysPage;