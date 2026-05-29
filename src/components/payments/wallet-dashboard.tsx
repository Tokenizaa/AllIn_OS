import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Wallet, Gift, Star, ArrowUpRight, ArrowDownLeft, History, CreditCard } from 'lucide-react';

interface WalletData {
  balance: number;
  currency: string;
  bonusBalance: number;
  points: number;
  recentTransactions: Array<{
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
  }>;
}

export function WalletDashboard() {
  const [walletData] = useState<WalletData>({
    balance: 1250.50,
    currency: 'BRL',
    bonusBalance: 150.00,
    points: 2500,
    recentTransactions: [
      { id: '1', type: 'credit', amount: 500.00, description: 'Payment received', date: '2024-01-15' },
      { id: '2', type: 'debit', amount: 150.00, description: 'Purchase at Store A', date: '2024-01-14' },
      { id: '3', type: 'credit', amount: 100.00, description: 'Bonus earned', date: '2024-01-13' },
      { id: '4', type: 'debit', amount: 75.50, description: 'Purchase at Store B', date: '2024-01-12' },
    ],
  });

  const handleAddFunds = () => {
    // TODO: Open add funds modal
  };

  const handleWithdraw = () => {
    // TODO: Open withdraw modal
  };

  const handleTransfer = () => {
    // TODO: Open transfer modal
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wallet Dashboard</h2>
        <p className="text-muted-foreground">Manage your wallets and view transaction history</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletData.currency} {walletData.balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bonus Balance</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletData.currency} {walletData.bonusBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Promotional credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {walletData.points.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Redeemable for rewards
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleAddFunds}>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Add Funds
        </Button>
        <Button variant="outline" onClick={handleWithdraw}>
          <ArrowDownLeft className="mr-2 h-4 w-4" />
          Withdraw
        </Button>
        <Button variant="outline" onClick={handleTransfer}>
          <CreditCard className="mr-2 h-4 w-4" />
          Transfer
        </Button>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">
            <History className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="bonus">
            <Gift className="mr-2 h-4 w-4" />
            Bonus Wallet
          </TabsTrigger>
          <TabsTrigger value="points">
            <Star className="mr-2 h-4 w-4" />
            Points
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest wallet activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletData.recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === 'credit'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'credit' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {walletData.currency} {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bonus Wallet</CardTitle>
              <CardDescription>Manage your promotional credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Bonus credits:</strong> Can be used for purchases but cannot be withdrawn.
                  Expires after 90 days of inactivity.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Bonus</span>
                  <span className="font-semibold">
                    {walletData.currency} {walletData.bonusBalance.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Earned</span>
                  <span className="font-semibold">
                    {walletData.currency} {(walletData.bonusBalance * 2).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Used</span>
                  <span className="font-semibold">
                    {walletData.currency} {walletData.bonusBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Points Wallet</CardTitle>
              <CardDescription>Earn and redeem loyalty points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Loyalty Points:</strong> Earn 1 point for every {walletData.currency} 10 spent.
                  100 points = {walletData.currency} 5 discount.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Points</span>
                  <span className="font-semibold">{walletData.points.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Points Value</span>
                  <span className="font-semibold">
                    {walletData.currency} {(walletData.points / 20).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tier Status</span>
                  <span className="font-semibold text-purple-600">Gold Member</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Redeem Points
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
