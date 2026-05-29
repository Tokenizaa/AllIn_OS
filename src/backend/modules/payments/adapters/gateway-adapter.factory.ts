import { PaymentProvider, GatewayConfig } from '../interfaces/payment-provider.interface';
import { logger } from '../../../shared/observability/logger.service';

export type GatewayType = 'belluno' | 'pagseguro';

export class GatewayAdapterFactory {
  private static adapters: Map<GatewayType, PaymentProvider> = new Map();

  static registerAdapter(type: GatewayType, adapter: PaymentProvider): void {
    this.adapters.set(type, adapter);
    logger.info(`Registered gateway adapter: ${type}`, 'gateway-factory');
  }

  static getAdapter(type: GatewayType): PaymentProvider | null {
    const adapter = this.adapters.get(type);
    if (!adapter) {
      logger.error(`Gateway adapter not found: ${type}`, 'gateway-factory');
      return null;
    }
    return adapter;
  }

  static hasAdapter(type: GatewayType): boolean {
    return this.adapters.has(type);
  }

  static getRegisteredAdapters(): GatewayType[] {
    return Array.from(this.adapters.keys());
  }
}
