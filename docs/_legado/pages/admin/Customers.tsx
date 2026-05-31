import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string | null;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Carregar clientes do localStorage
      const storedCustomers = JSON.parse(localStorage.getItem('users') || '[]');
      setCustomers(storedCustomers);
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      // Atualizar cliente no localStorage
      const storedCustomers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedCustomers = storedCustomers.map((customer: Customer) => {
        if (customer.id === userId) {
          return {
            ...customer,
            role: newRole
          };
        }
        return customer;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedCustomers));
      setCustomers(updatedCustomers);
      
      toast({
        title: "Sucesso",
        description: "Função do usuário atualizada com sucesso!"
      });
    } catch (error: any) {
      console.error('Erro ao atualizar função:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar função do usuário",
        variant: "destructive"
      });
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-allin-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Clientes</h1>
          <Button variant="vibrantOutline" onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Clientes Cadastrados</CardTitle>
            <CardDescription>
              Lista de todos os clientes e administradores do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Função
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Cadastro
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.full_name || 'Não informado'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {customer.email || 'Não informado'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.role === 'super_admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : customer.role === 'store_admin' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {customer.role === 'super_admin' 
                              ? 'Super Admin' 
                              : customer.role === 'store_admin' 
                                ? 'Admin' 
                                : 'Usuário'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.created_at 
                            ? new Date(customer.created_at).toLocaleDateString('pt-BR') 
                            : 'Não informado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {customer.role !== 'super_admin' && (
                            <div className="flex space-x-2">
                              <Button
                                variant="vibrantOutline"
                                size="sm"
                                onClick={() => handleChangeRole(
                                  customer.id, 
                                  customer.role === 'store_admin' ? 'user' : 'store_admin'
                                )}
                              >
                                {customer.role === 'store_admin' ? 'Remover Admin' : 'Tornar Admin'}
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Customers;