import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart3, PieChart, TrendingUp, Calendar, Download, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  period: string;
  revenue: number;
  transactions: number;
  successRate: number;
  averageOrderValue: number;
}

interface PaymentMethodDistribution {
  method: string;
  count: number;
  percentage: number;
  revenue: number;
}

interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  transactions: number;
}

export function PaymentAnalytics() {
  const [dateRange, setDateRange] = useState('30d');
  const [analyticsData] = useState<AnalyticsData[]>([
    { period: 'Jan 1-7', revenue: 15000, transactions: 120, successRate: 94.5, averageOrderValue: 125 },
    { period: 'Jan 8-14', revenue: 18500, transactions: 145, successRate: 95.2, averageOrderValue: 127.5 },
    { period: 'Jan 15-21', revenue: 22000, transactions: 165, successRate: 93.8, averageOrderValue: 133.3 },
    { period: 'Jan 22-28', revenue: 19500, transactions: 150, successRate: 96.1, averageOrderValue: 130 },
  ]);

  const [paymentMethodDistribution] = useState<PaymentMethodDistribution[]>([
    { method: 'Card', count: 320, percentage: 45, revenue: 48000 },
    { method: 'PIX', count: 280, percentage: 39, revenue: 35000 },
    { method: 'Boleto', count: 80, percentage: 11, revenue: 12000 },
    { method: 'Cash', count: 35, percentage: 5, revenue: 5250 },
  ]);

  const [topProducts] = useState<TopProduct[]>([
    { id: 'prod_001', name: 'Product A', revenue: 15000, transactions: 100 },
    { id: 'prod_002', name: 'Product B', revenue: 12000, transactions: 85 },
    { id: 'prod_003', name: 'Product C', revenue: 9500, transactions: 70 },
    { id: 'prod_004', name: 'Product D', revenue: 8000, transactions: 60 },
    { id: 'prod_005', name: 'Product E', revenue: 6500, transactions: 50 },
  ]);

  const handleExport = () => {
    // TODO: Export analytics data
  };

  const handleRefresh = () => {
    // TODO: Refresh analytics data
  };

  const totalRevenue = analyticsData.reduce((sum, data) => sum + data.revenue, 0);
  const totalTransactions = analyticsData.reduce((sum, data) => sum + data.transactions, 0);
  const avgSuccessRate = analyticsData.reduce((sum, data) => sum + data.successRate, 0) / analyticsData.length;
  const avgOrderValue = analyticsData.reduce((sum, data) => sum + data.averageOrderValue, 0) / analyticsData.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into payment performance and trends</p>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="methods">
            <PieChart className="mr-2 h-4 w-4" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="products">
            <Calendar className="mr-2 h-4 w-4" />
            Top Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Selected period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground">Selected period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Selected period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {avgOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Selected period</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Period</CardTitle>
              <CardDescription>Revenue breakdown over the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.map((data) => (
                  <div key={data.period} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{data.period}</span>
                      <span className="text-muted-foreground">
                        R$ {data.revenue.toLocaleString()} ({data.transactions} transactions)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${(data.revenue / Math.max(...analyticsData.map(d => d.revenue))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Distribution</CardTitle>
              <CardDescription>Breakdown of payment methods by volume and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodDistribution.map((method) => (
                  <div key={method.method} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{method.method}</h4>
                        <p className="text-sm text-muted-foreground">
                          {method.count} transactions ({method.percentage}%)
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">R$ {method.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          R$ {(method.revenue / method.count).toFixed(2)} avg
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Success Rate Trends</CardTitle>
              <CardDescription>Payment success rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.map((data) => (
                  <div key={data.period} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{data.period}</span>
                      <span className={data.successRate >= 95 ? 'text-green-600' : data.successRate >= 90 ? 'text-yellow-600' : 'text-red-600'}>
                        {data.successRate}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          data.successRate >= 95 ? 'bg-green-500' : data.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${data.successRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Order Value Trends</CardTitle>
              <CardDescription>Average order value over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.map((data) => (
                  <div key={data.period} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{data.period}</span>
                      <span className="text-muted-foreground">R$ {data.averageOrderValue.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(data.averageOrderValue / Math.max(...analyticsData.map(d => d.averageOrderValue))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products by Revenue</CardTitle>
              <CardDescription>Best performing products in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.transactions} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">R$ {product.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          R$ {(product.revenue / product.transactions).toFixed(2)} avg
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
