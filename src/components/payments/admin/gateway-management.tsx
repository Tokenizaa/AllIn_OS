import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Settings, Plus, Edit, Trash2, CheckCircle2, XCircle, Key, Copy, Check } from 'lucide-react';

interface GatewayConfig {
  id: string;
  name: string;
  type: 'belluno' | 'pagseguro' | 'stripe' | 'mercadopago';
  isActive: boolean;
  priority: number;
  apiKey: string;
  webhookSecret: string;
  supportedMethods: string[];
  createdAt: string;
  updatedAt: string;
}

export function GatewayManagement() {
  const [gateways] = useState<GatewayConfig[]>([
    {
      id: 'gw_001',
      name: 'Belluno Production',
      type: 'belluno',
      isActive: true,
      priority: 1,
      apiKey: 'bell_live_****************',
      webhookSecret: 'whsec_****************',
      supportedMethods: ['card', 'pix', 'boleto'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'gw_002',
      name: 'PagSeguro Sandbox',
      type: 'pagseguro',
      isActive: false,
      priority: 2,
      apiKey: 'pagseg_sandbox_****************',
      webhookSecret: 'whsec_****************',
      supportedMethods: ['card', 'boleto'],
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-10T14:20:00Z',
    },
  ]);

  const [selectedGateway, setSelectedGateway] = useState<GatewayConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggleActive = (gatewayId: string) => {
    // TODO: Toggle gateway active status
  };

  const handleEdit = (gateway: GatewayConfig) => {
    setSelectedGateway(gateway);
    setIsEditing(true);
  };

  const handleDelete = (gatewayId: string) => {
    // TODO: Delete gateway configuration
  };

  const handleAddGateway = () => {
    setSelectedGateway(null);
    setIsEditing(true);
  };

  const handleSave = (config: Partial<GatewayConfig>) => {
    // TODO: Save gateway configuration
    setIsEditing(false);
    setSelectedGateway(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedGateway(null);
  };

  const handleTestConnection = (gatewayId: string) => {
    // TODO: Test gateway connection
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gateway Management</h2>
          <p className="text-muted-foreground">Configure and manage payment gateway integrations</p>
        </div>
        <Button onClick={handleAddGateway}>
          <Plus className="mr-2 h-4 w-4" />
          Add Gateway
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">
            <Settings className="mr-2 h-4 w-4" />
            Gateway List
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Key className="mr-2 h-4 w-4" />
            Webhook Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Gateways</CardTitle>
              <CardDescription>Manage your payment gateway configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Methods</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gateways.map((gateway) => (
                    <TableRow key={gateway.id}>
                      <TableCell className="font-semibold">{gateway.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{gateway.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={gateway.isActive}
                            onCheckedChange={() => handleToggleActive(gateway.id)}
                          />
                          {gateway.isActive ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{gateway.priority}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {gateway.supportedMethods.map((method) => (
                            <Badge key={method} variant="secondary" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(gateway.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTestConnection(gateway.id)}
                          >
                            Test
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(gateway)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(gateway.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedGateway ? 'Edit Gateway' : 'Add New Gateway'}
                </CardTitle>
                <CardDescription>
                  {selectedGateway ? 'Update gateway configuration' : 'Configure a new payment gateway'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gateway-name">Gateway Name</Label>
                    <Input
                      id="gateway-name"
                      defaultValue={selectedGateway?.name}
                      placeholder="e.g., Belluno Production"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gateway-type">Gateway Type</Label>
                    <select
                      id="gateway-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={selectedGateway?.type}
                    >
                      <option value="belluno">Belluno</option>
                      <option value="pagseguro">PagSeguro</option>
                      <option value="stripe">Stripe</option>
                      <option value="mercadopago">Mercado Pago</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    defaultValue={selectedGateway?.apiKey}
                    placeholder="Enter API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <Input
                    id="webhook-secret"
                    type="password"
                    defaultValue={selectedGateway?.webhookSecret}
                    placeholder="Enter webhook secret"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    defaultValue={selectedGateway?.priority || 1}
                    placeholder="1 (highest) to 10 (lowest)"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSave({})}>
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>Configure webhook URLs for each gateway</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gateways.map((gateway) => (
                <div key={gateway.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{gateway.name}</h4>
                      <p className="text-sm text-muted-foreground">{gateway.type}</p>
                    </div>
                    <Badge variant={gateway.isActive ? 'default' : 'secondary'}>
                      {gateway.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`webhook-url-${gateway.id}`}>Webhook URL</Label>
                    <div className="relative">
                      <Input
                        id={`webhook-url-${gateway.id}`}
                        value={typeof window !== 'undefined' ? `${window.location.origin}/api/payments/webhook/${gateway.id}` : `https://api.allinlife.com.br/api/payments/webhook/${gateway.id}`}
                        readOnly
                        className="pr-10 font-mono text-xs"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        id={`copy-webhook-url-${gateway.id}`}
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-foreground text-muted-foreground"
                        onClick={() => {
                          const url = typeof window !== 'undefined' ? `${window.location.origin}/api/payments/webhook/${gateway.id}` : `https://api.allinlife.com.br/api/payments/webhook/${gateway.id}`;
                          navigator.clipboard.writeText(url);
                          setCopiedId(gateway.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                      >
                        {copiedId === gateway.id ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`webhook-events-${gateway.id}`}>Events</Label>
                    <div className="flex flex-wrap gap-2">
                      {['payment.created', 'payment.approved', 'payment.rejected', 'payment.refunded'].map((event) => (
                        <Badge key={event} variant="outline" className="cursor-pointer">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
