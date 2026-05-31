// src/components/admin/ApiKeyManager.tsx
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ApiKey } from '@/types/apiKeys';

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  onCreateApiKey: (data: any) => Promise<void>;
  onUpdateApiKey: (id: string, data: Partial<any>) => Promise<void>;
  onDeleteApiKey: (id: string) => Promise<void>;
  loading: boolean;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  apiKeys,
  onCreateApiKey,
  onUpdateApiKey,
  onDeleteApiKey,
  loading
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState({
    platform: 'meta_ads' as 'meta_ads' | 'google_ads',
    api_key: '',
    api_secret: '',
    access_token: '',
    refresh_token: '',
    name: '',
    description: ''
  });

  const handleCreate = async () => {
    try {
      await onCreateApiKey(newKey);
      setNewKey({
        platform: 'meta_ads',
        api_key: '',
        api_secret: '',
        access_token: '',
        refresh_token: '',
        name: '',
        description: ''
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleUpdate = async (id: string, field: string, value: string | boolean) => {
    try {
      await onUpdateApiKey(id, { [field]: value });
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Chaves de API</CardTitle>
        <CardDescription>
          Configure e gerencie chaves de API para integração com canais de tráfego pago
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Chaves de API Cadastradas</h3>
            <Button onClick={() => setIsAdding(!isAdding)}>
              {isAdding ? 'Cancelar' : 'Adicionar Nova Chave'}
            </Button>
          </div>

          {isAdding && (
            <Card className="p-4 bg-muted">
              <div className="space-y-4">
                <div>
                  <Label>Plataforma</Label>
                  <Select 
                    value={newKey.platform} 
                    onValueChange={(value: 'meta_ads' | 'google_ads') => 
                      setNewKey({...newKey, platform: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meta_ads">Meta Ads (Facebook, Instagram)</SelectItem>
                      <SelectItem value="google_ads">Google Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Nome (opcional)</Label>
                  <Input
                    value={newKey.name}
                    onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                    placeholder="Nome descritivo para identificar esta chave"
                  />
                </div>

                <div>
                  <Label>Chave de API *</Label>
                  <Input
                    value={newKey.api_key}
                    onChange={(e) => setNewKey({...newKey, api_key: e.target.value})}
                    placeholder="Insira a chave de API"
                  />
                </div>

                <div>
                  <Label>Segredo da API (opcional)</Label>
                  <Input
                    value={newKey.api_secret}
                    onChange={(e) => setNewKey({...newKey, api_secret: e.target.value})}
                    placeholder="Insira o segredo da API, se necessário"
                  />
                </div>

                <div>
                  <Label>Token de Acesso (opcional)</Label>
                  <Input
                    value={newKey.access_token}
                    onChange={(e) => setNewKey({...newKey, access_token: e.target.value})}
                    placeholder="Insira o token de acesso OAuth, se necessário"
                  />
                </div>

                <div>
                  <Label>Token de Atualização (opcional)</Label>
                  <Input
                    value={newKey.refresh_token}
                    onChange={(e) => setNewKey({...newKey, refresh_token: e.target.value})}
                    placeholder="Insira o token de atualização OAuth, se necessário"
                  />
                </div>

                <div>
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    value={newKey.description}
                    onChange={(e) => setNewKey({...newKey, description: e.target.value})}
                    placeholder="Descrição adicional sobre esta chave de API"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={!newKey.api_key}>
                    Adicionar Chave
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma chave de API cadastrada. Adicione uma nova chave para começar.
              </p>
            ) : (
              apiKeys.map((key) => (
                <Card key={key.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">
                          {key.name || `${key.platform === 'meta_ads' ? 'Meta Ads' : 'Google Ads'} API Key`}
                        </h4>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-1">
                        Plataforma: {key.platform === 'meta_ads' ? 'Meta Ads' : 'Google Ads'}
                      </p>
                      
                      {key.description && (
                        <p className="text-sm mb-2">{key.description}</p>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Criada em: {new Date(key.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={key.is_active}
                        onCheckedChange={(checked) => handleUpdate(key.id, 'is_active', checked)}
                      />
                      <span className="text-sm">Ativa</span>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => onDeleteApiKey(key.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};