import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Slider } from '../../ui/slider';
import { Gift, Plus, Edit, Trash2, Percent, Calendar, Users } from 'lucide-react';

interface BonusRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'tiered';
  value: number;
  maxBonus?: number;
  minPurchaseAmount: number;
  customerTiers: string[];
  productCategories?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
}

export function BonusConfiguration() {
  const [bonusRules] = useState<BonusRule[]>([
    {
      id: 'bonus_001',
      name: 'Welcome Bonus',
      type: 'percentage',
      value: 10,
      maxBonus: 50,
      minPurchaseAmount: 100,
      customerTiers: ['new'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      usageCount: 150,
      maxUsage: 1000,
    },
    {
      id: 'bonus_002',
      name: 'VIP Bonus',
      type: 'percentage',
      value: 15,
      maxBonus: 100,
      minPurchaseAmount: 200,
      customerTiers: ['vip', 'premium'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      usageCount: 75,
      maxUsage: 500,
    },
    {
      id: 'bonus_003',
      name: 'Weekend Special',
      type: 'fixed',
      value: 20,
      minPurchaseAmount: 50,
      customerTiers: ['all'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: false,
      usageCount: 200,
    },
  ]);

  const [selectedRule, setSelectedRule] = useState<BonusRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleActive = (ruleId: string) => {
    // TODO: Toggle rule active status
  };

  const handleEdit = (rule: BonusRule) => {
    setSelectedRule(rule);
    setIsEditing(true);
  };

  const handleDelete = (ruleId: string) => {
    // TODO: Delete bonus rule
  };

  const handleAddRule = () => {
    setSelectedRule(null);
    setIsEditing(true);
  };

  const handleSave = (config: Partial<BonusRule>) => {
    // TODO: Save bonus rule
    setIsEditing(false);
    setSelectedRule(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedRule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bonus Configuration</h2>
          <p className="text-muted-foreground">Configure bonus and promotional credit rules</p>
        </div>
        <Button onClick={handleAddRule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Bonus Rule
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">
            <Gift className="mr-2 h-4 w-4" />
            Bonus Rules
          </TabsTrigger>
          <TabsTrigger value="tiers">
            <Users className="mr-2 h-4 w-4" />
            Customer Tiers
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Percent className="mr-2 h-4 w-4" />
            General Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Bonus Rules</CardTitle>
              <CardDescription>Manage promotional credit and bonus configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tiers</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonusRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-semibold">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {rule.type === 'percentage' ? `${rule.value}%` : `R$ ${rule.value}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => handleToggleActive(rule.id)}
                          />
                          {rule.isActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {rule.customerTiers.map((tier) => (
                            <Badge key={tier} variant="outline" className="text-xs">
                              {tier}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.usageCount}
                        {rule.maxUsage && ` / ${rule.maxUsage}`}
                      </TableCell>
                      <TableCell>{new Date(rule.endDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(rule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(rule.id)}
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
                  {selectedRule ? 'Edit Bonus Rule' : 'Add New Bonus Rule'}
                </CardTitle>
                <CardDescription>
                  {selectedRule ? 'Update bonus configuration' : 'Create a new bonus rule'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bonus-name">Rule Name</Label>
                    <Input
                      id="bonus-name"
                      defaultValue={selectedRule?.name}
                      placeholder="e.g., Welcome Bonus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bonus-type">Bonus Type</Label>
                    <Select defaultValue={selectedRule?.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="tiered">Tiered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bonus-value">Bonus Value</Label>
                    <Input
                      id="bonus-value"
                      type="number"
                      defaultValue={selectedRule?.value}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-bonus">Maximum Bonus (optional)</Label>
                    <Input
                      id="max-bonus"
                      type="number"
                      defaultValue={selectedRule?.maxBonus}
                      placeholder="50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-purchase">Minimum Purchase Amount</Label>
                  <Input
                    id="min-purchase"
                    type="number"
                    defaultValue={selectedRule?.minPurchaseAmount}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Tiers</Label>
                  <div className="flex gap-2 flex-wrap">
                    {['new', 'standard', 'vip', 'premium', 'all'].map((tier) => (
                      <Badge key={tier} variant="outline" className="cursor-pointer">
                        {tier}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      defaultValue={selectedRule?.startDate}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      defaultValue={selectedRule?.endDate}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-usage">Maximum Usage (optional)</Label>
                  <Input
                    id="max-usage"
                    type="number"
                    defaultValue={selectedRule?.maxUsage}
                    placeholder="1000"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleSave({})}>
                    Save Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Tiers</CardTitle>
              <CardDescription>Configure customer loyalty tiers and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'New', bonus: '10%', minSpend: 0 },
                { name: 'Standard', bonus: '5%', minSpend: 500 },
                { name: 'VIP', bonus: '15%', minSpend: 2000 },
                { name: 'Premium', bonus: '20%', minSpend: 5000 },
              ].map((tier) => (
                <div key={tier.name} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{tier.name} Tier</h4>
                      <p className="text-sm text-muted-foreground">
                        Bonus: {tier.bonus} | Min Spend: R$ {tier.minSpend}
                      </p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Bonus Percentage</Label>
                    <Slider
                      defaultValue={[parseInt(tier.bonus)]}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Bonus Settings</CardTitle>
              <CardDescription>Configure global bonus system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Auto-apply Bonuses</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically apply eligible bonuses at checkout
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Bonus Stacking</h4>
                  <p className="text-sm text-muted-foreground">
                    Allow multiple bonuses to be combined
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Bonus Expiry Notification</h4>
                  <p className="text-sm text-muted-foreground">
                    Notify customers before bonuses expire
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry-days">Bonus Expiry Days</Label>
                <Input
                  id="expiry-days"
                  type="number"
                  defaultValue={90}
                  placeholder="90"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
