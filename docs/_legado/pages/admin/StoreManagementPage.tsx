// src/pages/admin/StoreManagementPage.tsx
import React, { useState, useEffect } from 'react';

import StoreCreationForm from '@/components/admin/StoreCreationForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { storeManagementService } from '@/services/storeManagementService';
import { StoreInfo } from '@/types/store';

const StoreManagementPage = () => {
  const { toast } = useToast();
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadStores = async () => {
    try {
      setLoading(true);
      const storeList = await storeManagementService.getAllStores();
      setStores(storeList);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar as lojas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleDeleteStore = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a loja "${name}"?`)) {
      try {
        const success = await storeManagementService.deleteStore(id);
        if (success) {
          toast({
            title: "Sucesso",
            description: `Loja "${name}" excluída com sucesso.`
          });
          loadStores(); // Recarregar a lista
        } else {
          toast({
            title: "Erro",
            description: "Falha ao excluir a loja.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir a loja.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Lojas</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nova Loja'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Loja</CardTitle>
            </CardHeader>
            <CardContent>
              <StoreCreationForm />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lojas Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-allin-orange"></div>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma loja cadastrada ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <Card key={store.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                        <p className="text-gray-600">{store.city}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(`/loja/${store.slug}`)}
                        >
                          Copiar URL
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteStore(store.id, store.name)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Identificador:</p>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">/loja/{store.slug}</p>
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{store.rating}</span>
                      <span className="text-gray-500 ml-1">({store.reviewCount} avaliações)</span>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">WhatsApp:</p>
                      <p className="text-sm">{store.contact.whatsapp}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreManagementPage;