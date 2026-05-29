import React from 'react';

import { Plus, Download, RefreshCw, Settings, HelpCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Ações Rápidas
        </CardTitle>
        <CardDescription>
          Acesso rápido às funcionalidades mais utilizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="vibrantOutline" 
          className="w-full justify-start"
          disabled
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Novo Produto
        </Button>
        
        <Button 
          variant="vibrantOutline" 
          className="w-full justify-start"
          onClick={() => navigate('/admin/leads')}
        >
          <Users className="w-4 h-4 mr-2" />
          Ver Novos Leads
        </Button>
        
        <Button 
          variant="vibrantOutline" 
          className="w-full justify-start"
          disabled
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
        
        <Button 
          variant="vibrantOutline" 
          className="w-full justify-start"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Dados
        </Button>
        
        <Button 
          variant="vibrantOutline" 
          className="w-full justify-start"
          onClick={() => window.open('https://docs.lovable.dev', '_blank')}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Central de Ajuda
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
