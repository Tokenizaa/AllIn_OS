import { logger } from '../../../shared/observability/logger.service';
import { walletService } from './wallet.service';
import { bonusWalletService } from './bonus-wallet.service';
import { pointsWalletService } from './points-wallet.service';
import { discountEngineService } from './discount-engine.service';
import { PaymentRequest, PaymentResponse } from '../interfaces/payment-provider.interface';
import { GatewayType } from '../adapters/gateway-adapter.factory';
import { paymentService } from './payment.service';

export interface HybridPaymentRequest {
  customerId: string;
  orderId?: string;
  originalAmount: number;
  currency: string;
  paymentMethod: 'pix' | 'boleto' | 'card' | 'cash';
  gatewayType: GatewayType;
  customer?: {
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
  };
  card?: any;
  boleto?: any;
  pix?: any;
  // Hybrid payment options
  useWallet?: boolean;
  useBonus?: boolean;
  usePoints?: boolean;
  couponCode?: string;
  productId?: string;
  categoryId?: string;
}

export interface HybridPaymentResult {
  success: boolean;
  paymentId?: string;
  originalAmount: number;
  discountAmount: number;
  walletAmount: number;
  bonusAmount: number;
  pointsAmount: number;
  gatewayAmount: number;
  finalAmount: number;
  paymentData?: PaymentResponse;
  breakdown: {
    discount: any;
    wallet?: any;
    bonus?: any;
    points?: any;
    gateway?: any;
  };
  error?: string;
}

export class HybridPaymentService {
  private static instance: HybridPaymentService;

  private constructor() {}

  static getInstance(): HybridPaymentService {
    if (!HybridPaymentService.instance) {
      HybridPaymentService.instance = new HybridPaymentService();
    }
    return HybridPaymentService.instance;
  }

  async processHybridPayment(request: HybridPaymentRequest): Promise<HybridPaymentResult> {
    logger.info('Processing hybrid payment', 'hybrid-payment', { customerId: request.customerId, originalAmount: request.originalAmount });

    try {
      const breakdown: HybridPaymentResult['breakdown'] = {};
      let remainingAmount = request.originalAmount;
      let totalDiscount = 0;

      // Step 1: Calculate and apply discounts
      const discountCalculation = await discountEngineService.calculateDiscount(
        request.originalAmount,
        request.customerId,
        request.productId,
        request.categoryId,
        request.couponCode
      );
      totalDiscount = discountCalculation.discountAmount;
      remainingAmount -= totalDiscount;
      breakdown.discount = discountCalculation;

      logger.info('Discount applied', 'hybrid-payment', { discountAmount: totalDiscount, remainingAmount });

      // Step 2: Apply wallet balance if requested
      let walletAmount = 0;
      if (request.useWallet) {
        const wallet = await walletService.getWalletByCustomerId(request.customerId);
        if (wallet) {
          walletAmount = Math.min(wallet.available_balance, remainingAmount);
          if (walletAmount > 0) {
            await walletService.debitWallet(
              request.customerId,
              walletAmount,
              'Hybrid payment',
              request.orderId,
              'order'
            );
            remainingAmount -= walletAmount;
            breakdown.wallet = { amount: walletAmount, walletId: wallet.id };
            logger.info('Wallet balance applied', 'hybrid-payment', { walletAmount, remainingAmount });
          }
        }
      }

      // Step 3: Apply bonus balance if requested
      let bonusAmount = 0;
      if (request.useBonus && remainingAmount > 0) {
        const { available, maxUsagePercentage } = await bonusWalletService.getAvailableBonusForPayment(
          request.customerId,
          request.productId
        );
        const maxBonusUsage = Math.min(available, (remainingAmount * maxUsagePercentage) / 100);
        bonusAmount = Math.min(maxBonusUsage, remainingAmount);

        if (bonusAmount > 0) {
          await bonusWalletService.useBonus(
            request.customerId,
            bonusAmount,
            request.orderId,
            'order',
            'Hybrid payment'
          );
          remainingAmount -= bonusAmount;
          breakdown.bonus = { amount: bonusAmount, maxUsagePercentage };
          logger.info('Bonus balance applied', 'hybrid-payment', { bonusAmount, remainingAmount });
        }
      }

      // Step 4: Apply points if requested
      let pointsAmount = 0;
      if (request.usePoints && remainingAmount > 0) {
        const { available, maxUsagePercentage, currencyValue } = await pointsWalletService.getAvailablePointsForPayment(
          request.customerId,
          request.productId
        );
        const maxPointsUsage = Math.min(currencyValue, (remainingAmount * maxUsagePercentage) / 100);
        pointsAmount = Math.min(maxPointsUsage, remainingAmount);

        if (pointsAmount > 0) {
          const pointsToRedeem = await pointsWalletService.convertCurrencyToPoints(pointsAmount);
          await pointsWalletService.redeemPoints(
            request.customerId,
            pointsToRedeem,
            request.orderId,
            'order',
            'Hybrid payment'
          );
          remainingAmount -= pointsAmount;
          breakdown.points = { amount: pointsAmount, pointsRedeemed: pointsToRedeem };
          logger.info('Points applied', 'hybrid-payment', { pointsAmount, pointsRedeemed: pointsToRedeem, remainingAmount });
        }
      }

      // Step 5: Process remaining amount through gateway
      let gatewayAmount = remainingAmount;
      let gatewayPaymentData: PaymentResponse | undefined;

      if (gatewayAmount > 0) {
        const paymentRequest: PaymentRequest = {
          amount: gatewayAmount,
          currency: request.currency,
          customerId: request.customerId,
          orderId: request.orderId,
          paymentMethod: request.paymentMethod,
          customer: request.customer,
          card: request.card,
          boleto: request.boleto,
          pix: request.pix,
          metadata: {
            hybridPayment: true,
            originalAmount: request.originalAmount,
            discountAmount: totalDiscount,
            walletAmount,
            bonusAmount,
            pointsAmount,
          },
        };

        gatewayPaymentData = await paymentService.createPayment(paymentRequest, request.gatewayType);
        breakdown.gateway = gatewayPaymentData;

        if (!gatewayPaymentData.success) {
          // Rollback wallet, bonus, and points if gateway fails
          await this.rollbackPayment(request.customerId, walletAmount, bonusAmount, pointsAmount, request.orderId);
          return {
            success: false,
            originalAmount: request.originalAmount,
            discountAmount: totalDiscount,
            walletAmount,
            bonusAmount,
            pointsAmount,
            gatewayAmount,
            finalAmount: request.originalAmount,
            breakdown,
            error: gatewayPaymentData.message || 'Gateway payment failed',
          };
        }
      } else {
        // No gateway payment needed, create a zero-amount payment record
        logger.info('No gateway payment needed', 'hybrid-payment', { remainingAmount });
      }

      const finalAmount = request.originalAmount - totalDiscount - walletAmount - bonusAmount - pointsAmount;

      logger.info('Hybrid payment completed successfully', 'hybrid-payment', {
        originalAmount: request.originalAmount,
        finalAmount,
        discountAmount: totalDiscount,
        walletAmount,
        bonusAmount,
        pointsAmount,
        gatewayAmount,
      });

      return {
        success: true,
        paymentId: gatewayPaymentData?.paymentId,
        originalAmount: request.originalAmount,
        discountAmount: totalDiscount,
        walletAmount,
        bonusAmount,
        pointsAmount,
        gatewayAmount,
        finalAmount,
        paymentData: gatewayPaymentData,
        breakdown,
      };
    } catch (error) {
      logger.error('Hybrid payment error', 'hybrid-payment', { error });
      return {
        success: false,
        originalAmount: request.originalAmount,
        discountAmount: 0,
        walletAmount: 0,
        bonusAmount: 0,
        pointsAmount: 0,
        gatewayAmount: request.originalAmount,
        finalAmount: request.originalAmount,
        breakdown: {},
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async rollbackPayment(
    customerId: string,
    walletAmount: number,
    bonusAmount: number,
    pointsAmount: number,
    orderId?: string
  ): Promise<void> {
    logger.info('Rolling back payment', 'hybrid-payment', { customerId, walletAmount, bonusAmount, pointsAmount });

    try {
      // Rollback wallet
      if (walletAmount > 0) {
        await walletService.creditWallet(
          customerId,
          walletAmount,
          'Payment rollback',
          orderId,
          'order'
        );
      }

      // Rollback bonus
      if (bonusAmount > 0) {
        await bonusWalletService.earnBonus(
          customerId,
          bonusAmount,
          'rollback',
          orderId,
          'Payment rollback'
        );
      }

      // Rollback points
      if (pointsAmount > 0) {
        const pointsToEarn = await pointsWalletService.convertCurrencyToPoints(pointsAmount);
        await pointsWalletService.earnPoints(
          customerId,
          pointsToEarn,
          'rollback',
          orderId,
          'Payment rollback'
        );
      }

      logger.info('Payment rollback completed', 'hybrid-payment');
    } catch (error) {
      logger.error('Payment rollback error', 'hybrid-payment', { error });
    }
  }

  async calculateHybridPaymentPreview(
    customerId: string,
    originalAmount: number,
    useWallet: boolean = false,
    useBonus: boolean = false,
    usePoints: boolean = false,
    couponCode?: string,
    productId?: string,
    categoryId?: string
  ): Promise<{
    originalAmount: number;
    discountAmount: number;
    walletAvailable: number;
    bonusAvailable: number;
    pointsAvailable: number;
    pointsCurrencyValue: number;
    estimatedGatewayAmount: number;
    estimatedFinalAmount: number;
  }> {
    try {
      let remainingAmount = originalAmount;

      // Calculate discount
      const discountCalculation = await discountEngineService.calculateDiscount(
        originalAmount,
        customerId,
        productId,
        categoryId,
        couponCode
      );
      remainingAmount -= discountCalculation.discountAmount;

      // Get wallet balance
      const wallet = await walletService.getWalletByCustomerId(customerId);
      const walletAvailable = wallet?.available_balance || 0;
      const walletAmount = useWallet ? Math.min(walletAvailable, remainingAmount) : 0;
      remainingAmount -= walletAmount;

      // Get bonus available
      const { available: bonusAvailable, currencyValue: bonusCurrencyValue } = await bonusWalletService.getAvailableBonusForPayment(
        customerId,
        productId
      );
      const bonusAmount = useBonus ? Math.min(bonusCurrencyValue, remainingAmount) : 0;
      remainingAmount -= bonusAmount;

      // Get points available
      const { available: pointsAvailable, currencyValue: pointsCurrencyValue } = await pointsWalletService.getAvailablePointsForPayment(
        customerId,
        productId
      );
      const pointsAmount = usePoints ? Math.min(pointsCurrencyValue, remainingAmount) : 0;
      remainingAmount -= pointsAmount;

      return {
        originalAmount,
        discountAmount: discountCalculation.discountAmount,
        walletAvailable,
        bonusAvailable,
        pointsAvailable,
        pointsCurrencyValue,
        estimatedGatewayAmount: remainingAmount,
        estimatedFinalAmount: originalAmount - discountCalculation.discountAmount - walletAmount - bonusAmount - pointsAmount,
      };
    } catch (error) {
      logger.error('Error calculating hybrid payment preview', 'hybrid-payment', { error });
      return {
        originalAmount,
        discountAmount: 0,
        walletAvailable: 0,
        bonusAvailable: 0,
        pointsAvailable: 0,
        pointsCurrencyValue: 0,
        estimatedGatewayAmount: originalAmount,
        estimatedFinalAmount: originalAmount,
      };
    }
  }
}

export const hybridPaymentService = HybridPaymentService.getInstance();
