import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CreditCard, QrCode, FileText, Truck, Lock, CheckCircle2 } from 'lucide-react';

interface CheckoutProps {
  amount: number;
  currency?: string;
  onPaymentComplete?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export function Checkout({ amount, currency = 'BRL', onPaymentComplete, onError }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // TODO: Integrate with actual payment API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentComplete(true);
      onPaymentComplete?.('payment_' + Date.now());
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground text-center">
              Your payment of {currency} {amount.toFixed(2)} has been processed successfully.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          Secure payment powered by Allin Payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold">
              {currency} {amount.toFixed(2)}
            </span>
          </div>
        </div>

        <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="card">
              <CreditCard className="w-4 h-4 mr-2" />
              Card
            </TabsTrigger>
            <TabsTrigger value="pix">
              <QrCode className="w-4 h-4 mr-2" />
              PIX
            </TabsTrigger>
            <TabsTrigger value="boleto">
              <FileText className="w-4 h-4 mr-2" />
              Boleto
            </TabsTrigger>
            <TabsTrigger value="cash">
              <Truck className="w-4 h-4 mr-2" />
              Cash
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input id="card-name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installments">Installments</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select installments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x (no interest)</SelectItem>
                  <SelectItem value="2">2x (no interest)</SelectItem>
                  <SelectItem value="3">3x (no interest)</SelectItem>
                  <SelectItem value="6">6x (with interest)</SelectItem>
                  <SelectItem value="12">12x (with interest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="pix" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <QrCode className="w-32 h-32 mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Scan the QR code with your banking app to complete the payment
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pix-code">PIX Code</Label>
              <Input id="pix-code" readOnly value="00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865405{amount.toFixed(2)}5802BR5925Allin Distribuidores Ltda6009Sao Paulo62070503***6304ABCD" />
            </div>
          </TabsContent>

          <TabsContent value="boleto" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="000.000.000-00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boleto-name">Full Name</Label>
              <Input id="boleto-name" placeholder="John Doe" />
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Boleto payments take up to 3 business days to process.
                The due date will be shown after payment confirmation.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="cash" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="cash-name">Full Name</Label>
              <Input id="cash-name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cash-phone">Phone</Label>
              <Input id="cash-phone" placeholder="(11) 99999-9999" />
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Cash on Delivery:</strong> Pay when your order arrives. 
                Please have the exact amount ready.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center text-xs text-muted-foreground">
          <Lock className="w-3 h-3 mr-1" />
          <span>Your payment information is secure and encrypted</span>
        </div>
        <Button 
          onClick={handlePayment} 
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing...' : `Pay ${currency} ${amount.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
