import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  MessageSquare, 
  Settings, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Send,
  QrCode
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EvolutionInstance {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  token: string;
  number?: string;
  qrcode?: string;
  profilePicUrl?: string;
  ownerJid?: string;
  battery?: number;
  plugged?: boolean;
  groupsTotal?: number;
  contactsTotal?: number;
  messagesCount?: number;
  createdAt: string;
  lastConnection?: string;
}

const EvolutionManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [instances, setInstances] = useState<EvolutionInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToken, setShowToken] = useState<{ [key: string]: boolean }>({});
  const [newInstanceName, setNewInstanceName] = useState('');
  const [newInstanceNumber, setNewInstanceNumber] = useState('');
  const [qrCodeDialog, setQrCodeDialog] = useState<{ open: boolean; instanceId?: string; qrCode?: string }>({ open: false });
  const [apiStats, setApiStats] = useState({
    totalInstances: 0,
    connectedInstances: 0,
    totalMessages: 0,
    totalContacts: 0
  });

  const EVOLUTION_API_URL = 'http://localhost:8089';
  const GLOBAL_API_KEY = '429683C4C977415CAAFCCE10F7D57E11';

  // Carregar instâncias da Evolution API
  const fetchInstances = async () => {
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/fetchInstances`, {
        headers: {
          'apikey': GLOBAL_API_KEY
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInstances(data || []);
        
        // Calcular estatísticas
        const stats = {
          totalInstances: data.length,
          connectedInstances: data.filter((i: EvolutionInstance) => i.status === 'connected').length,
          totalMessages: data.reduce((sum: number, i: EvolutionInstance) => sum + (i.messagesCount || 0), 0),
          totalContacts: data.reduce((sum: number, i: EvolutionInstance) => sum + (i.contactsTotal || 0), 0)
        };
        setApiStats(stats);
      }
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova instância
  const createInstance = async () => {
    if (!newInstanceName.trim()) return;

    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': GLOBAL_API_KEY
        },
        body: JSON.stringify({
          instanceName: newInstanceName,
          number: newInstanceNumber || undefined,
          token: generateToken()
        })
      });

      if (response.ok) {
        setNewInstanceName('');
        setNewInstanceNumber('');
        fetchInstances();
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
    }
  };

  // Gerar QR Code
  const generateQRCode = async (instanceId: string) => {
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/connect/${instanceId}`, {
        method: 'POST',
        headers: {
          'apikey': GLOBAL_API_KEY
        }
      });

      if (response.ok) {
        // Abrir diálogo para mostrar QR Code
        setQrCodeDialog({ open: true, instanceId });
        
        // Poll para verificar se o QR Code foi gerado
        const checkQRCode = setInterval(async () => {
          try {
            const qrResponse = await fetch(`${EVOLUTION_API_URL}/instance/qrcode/${instanceId}`, {
              headers: { 'apikey': GLOBAL_API_KEY }
            });
            
            if (qrResponse.ok) {
              const qrData = await qrResponse.json();
              if (qrData.qrcode) {
                setQrCodeDialog({ open: true, instanceId, qrCode: qrData.qrcode });
                clearInterval(checkQRCode);
              }
            }
          } catch (error) {
            console.error('Erro ao verificar QR Code:', error);
          }
        }, 2000);

        // Limpar interval após 30 segundos
        setTimeout(() => clearInterval(checkQRCode), 30000);
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  // Deletar instância
  const deleteInstance = async (instanceId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta instância?')) return;

    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/delete/${instanceId}`, {
        method: 'DELETE',
        headers: {
          'apikey': GLOBAL_API_KEY
        }
      });

      if (response.ok) {
        fetchInstances();
      }
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
    }
  };

  // Desconectar instância
  const disconnectInstance = async (instanceId: string) => {
    try {
      const response = await fetch(`${EVOLUTION_API_URL}/instance/logout/${instanceId}`, {
        method: 'DELETE',
        headers: {
          'apikey': GLOBAL_API_KEY
        }
      });

      if (response.ok) {
        fetchInstances();
      }
    } catch (error) {
      console.error('Erro ao desconectar instância:', error);
    }
  };

  // Gerar token aleatório
  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Toggle visibilidade do token
  const toggleTokenVisibility = (instanceId: string) => {
    setShowToken(prev => ({
      ...prev,
      [instanceId]: !prev[instanceId]
    }));
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      connected: { color: 'bg-green-500', text: 'Conectado', icon: CheckCircle },
      disconnected: { color: 'bg-red-500', text: 'Desconectado', icon: XCircle },
      connecting: { color: 'bg-yellow-500', text: 'Conectando', icon: Clock },
      error: { color: 'bg-red-500', text: 'Erro', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.disconnected;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  useEffect(() => {
    fetchInstances();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchInstances, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-allin-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão Evolution API</h1>
          <p className="text-gray-600">Gerencie suas instâncias WhatsApp da Evolution API</p>
        </div>
        <Button 
          onClick={() => window.open('http://localhost:8089/manager', '_blank')}
          className="bg-green-600 hover:bg-green-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          Abrir Manager
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instâncias</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiStats.totalInstances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conectadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{apiStats.connectedInstances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mensagens</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiStats.totalMessages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiStats.totalContacts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="instances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="create">Nova Instância</TabsTrigger>
        </TabsList>

        <TabsContent value="instances" className="space-y-4">
          <div className="grid gap-4">
            {instances.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma instância encontrada</p>
                    <p className="text-sm text-gray-500">Crie sua primeira instância para começar</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              instances.map((instance) => (
                <Card key={instance.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {instance.name}
                          {getStatusBadge(instance.status)}
                        </CardTitle>
                        <CardDescription>
                          Criada em {new Date(instance.createdAt).toLocaleDateString('pt-BR')}
                          {instance.lastConnection && ` • Última conexão: ${new Date(instance.lastConnection).toLocaleDateString('pt-BR')}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {instance.status === 'disconnected' && (
                          <Button
                            size="sm"
                            onClick={() => generateQRCode(instance.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <QrCode className="w-4 h-4 mr-1" />
                            QR Code
                          </Button>
                        )}
                        {instance.status === 'connected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => disconnectInstance(instance.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Desconectar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteInstance(instance.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Token</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type={showToken[instance.id] ? 'text' : 'password'}
                            value={instance.token}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleTokenVisibility(instance.id)}
                          >
                            {showToken[instance.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      {instance.number && (
                        <div>
                          <Label className="text-sm font-medium">Número</Label>
                          <p className="mt-1 text-sm">{instance.number}</p>
                        </div>
                      )}
                      {instance.contactsTotal !== undefined && (
                        <div>
                          <Label className="text-sm font-medium">Contatos</Label>
                          <p className="mt-1 text-sm">{instance.contactsTotal}</p>
                        </div>
                      )}
                      {instance.messagesCount !== undefined && (
                        <div>
                          <Label className="text-sm font-medium">Mensagens</Label>
                          <p className="mt-1 text-sm">{instance.messagesCount}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Instância</CardTitle>
              <CardDescription>
                Crie uma nova instância WhatsApp na Evolution API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="instanceName">Nome da Instância *</Label>
                <Input
                  id="instanceName"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="Ex: MinhaEmpresa WhatsApp"
                />
              </div>
              <div>
                <Label htmlFor="instanceNumber">Número (Opcional)</Label>
                <Input
                  id="instanceNumber"
                  value={newInstanceNumber}
                  onChange={(e) => setNewInstanceNumber(e.target.value)}
                  placeholder="5511999999999"
                />
              </div>
              <Button onClick={createInstance} disabled={!newInstanceName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Instância
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code Dialog */}
      <Dialog open={qrCodeDialog.open} onOpenChange={(open) => setQrCodeDialog({ ...qrCodeDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code para Conexão</DialogTitle>
            <DialogDescription>
              Escaneie este QR Code com o WhatsApp do seu celular
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {qrCodeDialog.qrCode ? (
              <img 
                src={`data:image/png;base64,${qrCodeDialog.qrCode}`} 
                alt="QR Code" 
                className="w-64 h-64 border"
              />
            ) : (
              <div className="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-allin-orange mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Gerando QR Code...</p>
                </div>
              </div>
            )}
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertTitle>Como conectar?</AlertTitle>
              <AlertDescription>
                1. Abra o WhatsApp no seu celular<br />
                2. Vá em Configurações &gt; WhatsApp Web<br />
                3. Escaneie o QR Code acima
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvolutionManagementPage;
