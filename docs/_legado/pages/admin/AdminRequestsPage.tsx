import React, { useState, useEffect } from 'react';

import { AdminRequestDetails } from '@/components/admin/AdminRequestDetails';
import { AdminRequestForm } from '@/components/admin/AdminRequestForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AdminRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestType: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<AdminRequest | null>(null);
  const [viewingRequest, setViewingRequest] = useState<AdminRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Carregar solicitações do localStorage
      const storedRequests = JSON.parse(localStorage.getItem('adminRequests') || '[]');
      setRequests(storedRequests);
    } catch (error: any) {
      console.error('Erro ao buscar solicitações:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar solicitações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (requestData: AdminRequest) => {
    try {
      // Salvar solicitação no localStorage
      const storedRequests = JSON.parse(localStorage.getItem('adminRequests') || '[]');
      
      if (editingRequest) {
        // Editar solicitação existente
        const index = storedRequests.findIndex((r: AdminRequest) => r.id === editingRequest.id);
        if (index !== -1) {
          storedRequests[index] = requestData;
        }
      } else {
        // Criar nova solicitação
        storedRequests.push(requestData);
      }
      
      localStorage.setItem('adminRequests', JSON.stringify(storedRequests));
      setRequests(storedRequests);
      
      setShowForm(false);
      setEditingRequest(null);
      setViewingRequest(null);
      
      toast({
        title: "Sucesso",
        description: editingRequest ? "Solicitação atualizada com sucesso!" : "Solicitação criada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao salvar solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar solicitação",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (request: AdminRequest) => {
    setEditingRequest(request);
    setShowForm(true);
    setViewingRequest(null);
  };

  const handleView = (request: AdminRequest) => {
    setViewingRequest(request);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta solicitação?')) return;

    try {
      // Excluir solicitação do localStorage
      const storedRequests = JSON.parse(localStorage.getItem('adminRequests') || '[]');
      const updatedRequests = storedRequests.filter((request: AdminRequest) => request.id !== id);
      localStorage.setItem('adminRequests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      
      toast({
        title: "Sucesso",
        description: "Solicitação excluída com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir solicitação",
        variant: "destructive"
      });
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
      </div>
    );
  }

  const filteredRequests = requests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.userName.toLowerCase().includes(searchLower) ||
      request.userEmail.toLowerCase().includes(searchLower) ||
      request.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Solicitações de Admin</h1>
          <Button variant="vibrantOutline" onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Barra de busca */}
        {viewingRequest === null && !showForm && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar solicitações..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Botão para adicionar solicitação */}
        {viewingRequest === null && !showForm && (
          <div className="mb-6">
            <Button 
              variant="vibrant"
              onClick={() => {
                setEditingRequest(null);
                setShowForm(true);
                setViewingRequest(null);
              }}
            >
              Adicionar Solicitação
            </Button>
          </div>
        )}

        {/* Visualização de detalhes da solicitação */}
        {viewingRequest && (
          <AdminRequestDetails
            request={viewingRequest}
            onBack={() => setViewingRequest(null)}
            onEdit={() => handleEdit(viewingRequest)}
          />
        )}

        {/* Formulário de solicitação */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingRequest ? 'Editar Solicitação' : 'Adicionar Nova Solicitação'}</CardTitle>
              <CardDescription>
                {editingRequest ? 'Edite as informações da solicitação' : 'Preencha as informações da nova solicitação'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminRequestForm 
                request={editingRequest} 
                onSave={handleSave} 
                onCancel={() => {
                  setShowForm(false);
                  setEditingRequest(null);
                }} 
              />
            </CardContent>
          </Card>
        )}

        {/* Lista de solicitações */}
        {!showForm && viewingRequest === null && (
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Cadastradas</CardTitle>
              <CardDescription>
                Lista de todas as solicitações de administração
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? 'Nenhuma solicitação encontrada.' : 'Nenhuma solicitação cadastrada ainda.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prioridade
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.userEmail}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.requestType === 'access_request' && 'Solicitação de Acesso'}
                              {request.requestType === 'permission_change' && 'Alteração de Permissão'}
                              {request.requestType === 'account_issue' && 'Problema com Conta'}
                              {request.requestType === 'feature_request' && 'Solicitação de Funcionalidade'}
                              {request.requestType === 'bug_report' && 'Relatório de Bug'}
                              {request.requestType === 'other' && 'Outro'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : request.status === 'in_progress' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : request.status === 'resolved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : request.status === 'rejected' 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status === 'pending' && 'Pendente'}
                              {request.status === 'in_progress' && 'Em Andamento'}
                              {request.status === 'resolved' && 'Resolvido'}
                              {request.status === 'rejected' && 'Rejeitado'}
                              {request.status === 'closed' && 'Fechado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.priority === 'low' 
                                ? 'bg-green-100 text-green-800' 
                                : request.priority === 'medium' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : request.priority === 'high' 
                                    ? 'bg-orange-100 text-orange-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                              {request.priority === 'low' && 'Baixa'}
                              {request.priority === 'medium' && 'Média'}
                              {request.priority === 'high' && 'Alta'}
                              {request.priority === 'urgent' && 'Urgente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="vibrantOutline"
                                size="sm"
                                onClick={() => handleView(request)}
                              >
                                Ver Detalhes
                              </Button>
                              <Button
                                variant="vibrantOutline"
                                size="sm"
                                onClick={() => handleEdit(request)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(request.id)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminRequestsPage;