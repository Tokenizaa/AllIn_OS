export interface PaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
  orderId?: string;
  paymentMethod: 'pix' | 'boleto' | 'card' | 'cash';
  metadata?: Record<string, any>;
  customer?: {
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
  };
  card?: {
    number: string;
    holderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    installments?: number;
  };
  boleto?: {
    dueDate?: string;
  };
  pix?: {
    expiresInSeconds?: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  gatewayTransactionId?: string;
  status: 'pending' | 'processing' | 'approved' | 'failed' | 'cancelled';
  message?: string;
  paymentData?: {
    pixCode?: string;
    pixQrCode?: string;
    boletoUrl?: string;
    boletoBarcode?: string;
    boletoDueDate?: string;
    cardToken?: string;
  };
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  gatewayTransactionId?: string;
  status: 'pending' | 'approved' | 'failed';
  message?: string;
}

export interface WebhookEvent {
  eventType: string;
  payload: Record<string, any>;
  signature?: string;
  headers?: Record<string, string>;
}

export interface GatewayConfig {
  apiKey: string;
  apiSecret: string;
  environment: 'sandbox' | 'production';
  webhookUrl?: string;
  webhookSecret?: string;
  additionalConfig?: Record<string, any>;
}

export abstract class PaymentProvider {
  protected config: GatewayConfig;

  constructor(config: GatewayConfig) {
    this.config = config;
  }

  abstract createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract getPaymentStatus(gatewayTransactionId: string): Promise<PaymentResponse>;
  abstract refundPayment(request: RefundRequest): Promise<RefundResponse>;
  abstract cancelPayment(gatewayTransactionId: string): Promise<PaymentResponse>;
  abstract verifyWebhook(event: WebhookEvent): Promise<boolean>;
  abstract processWebhook(event: WebhookEvent): Promise<PaymentResponse>;

  protected abstract log(message: string, context?: Record<string, any>): void;
  protected abstract logError(message: string, error?: any, context?: Record<string, any>): void;
}
