import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet, 
  Gift, 
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';

interface FinancialStats {
  totalRevenue: number;
  totalPayments: number;
  successRate: number;
  averageOrderValue: number;
  refunds: number;
  chargebacks: number;
  pendingAmount: number;
  currency: string;
}

interface GatewayStats {
  name: string;
  totalTransactions: number;
  successRate: number;
  totalVolume: number;
  fees: number;
}

interface RecentTransaction {
  id: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected' | 'refunded';
  method: string;
  date: string;
  customer: string;
}

export function FinancialDashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [stats] = useState<FinancialStats>({
    totalRevenue: 125000.50,
    totalPayments: 842,
    successRate: 94.5,
    averageOrderValue: 148.45,
    refunds: 3200.00,
    chargebacks: 850.00,
    pendingAmount: 12500.00,
    currency: 'BRL',
  });

  const [gatewayStats] = useState<GatewayStats[]>([
    {
      name: 'Belluno',
      totalTransactions: 520,
      successRate: 96.2,
      totalVolume: 75000.00,
      fees: 2250.00,
    },
    {
      name: 'PagSeguro',
      totalTransactions: 322,
      successRate: 91.8,
      totalVolume: 50000.50,
      fees: 1750.00,
    },
  ]);

  const [recentTransactions] = useState<RecentTransaction[]>([
    {
      id: 'pay_001',
      amount: 150.00,
      status: 'approved',
      method: 'card',
      date: '2024-01-15T10:30:00Z',
      customer: 'John Doe',
    },
    {
      id: 'pay_002',
      amount: 75.50,
      status: 'pending',
      method: 'pix',
      date: '2024-01-15T09:20:00Z',
      customer: 'Jane Smith',
    },
    {
      id: 'pay_003',
      amount: 200.00,
      status: 'refunded',
      method: 'card',
      date: '2024-01-14T16:45:00Z',
      customer: 'Bob Johnson',
    },
  ]);

  const handleExport = () => {
    // TODO: Export financial data
  };

  const handleRefresh = () => {
    // TODO: Refresh financial data
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
          <p className="text-muted-foreground">Overview of payment performance and financial metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.currency} {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +2.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.currency} {stats.averageOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              -3.4% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunds</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.currency} {stats.refunds.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((stats.refunds / stats.totalRevenue) * 100).toFixed(1)}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chargebacks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.currency} {stats.chargebacks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((stats.chargebacks / stats.totalRevenue) * 100).toFixed(2)}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.currency} {stats.pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gateways" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gateways">
            <CreditCard className="mr-2 h-4 w-4" />
            Gateway Performance
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Wallet className="mr-2 h-4 w-4" />
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger value="wallets">
            <Gift className="mr-2 h-4 w-4" />
            Wallet Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gateway Performance</CardTitle>
              <CardDescription>Transaction volume and success rates by gateway</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Total Volume</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Net Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gatewayStats.map((gateway) => (
                    <TableRow key={gateway.name}>
                      <TableCell className="font-semibold">{gateway.name}</TableCell>
                      <TableCell>{gateway.totalTransactions}</TableCell>
                      <TableCell>
                        <Badge variant={gateway.successRate > 95 ? 'default' : 'secondary'}>
                          {gateway.successRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {stats.currency} {gateway.totalVolume.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -{stats.currency} {gateway.fees.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {stats.currency} {(gateway.totalVolume - gateway.fees).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment activity across all gateways</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell className="font-semibold">
                        {stats.currency} {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Activity</CardTitle>
              <CardDescription>Overview of wallet balances and transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Main Wallet</h4>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">
                    {stats.currency} 45,250.00
                  </div>
                  <p className="text-xs text-muted-foreground">Total balance</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Bonus Wallet</h4>
                    <Gift className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">
                    {stats.currency} 8,500.00
                  </div>
                  <p className="text-xs text-muted-foreground">Promotional credits</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Points Wallet</h4>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">
                    125,000 pts
                  </div>
                  <p className="text-xs text-muted-foreground">Loyalty points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
