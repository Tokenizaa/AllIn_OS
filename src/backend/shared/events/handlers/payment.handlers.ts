import { eventEmitter } from "../event-emitter";
import { EventType, BaseEvent } from "../event.types";
import { chatwootService } from "../../chatwoot/chatwoot.service";
import { logger } from "../../observability/logger.service";

// Payment event handlers
export const registerPaymentEventHandlers = () => {
  // Handle payment approval
  eventEmitter.subscribe(EventType.PAYMENT_APPROVED, async (event: BaseEvent) => {
    logger.info("Payment approved", "payment-handler", event.data);
    // TODO: Update order status
    // TODO: Send payment confirmation
    // TODO: Trigger commission calculation
    try {
      const { customerId, paymentId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Payment approved: ${paymentId}`);
        logger.info(`Updated Chatwoot timeline for payment ${paymentId}`, "payment-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "payment-handler", { error });
    }
  });

  // Handle payment rejection
  eventEmitter.subscribe(EventType.PAYMENT_REJECTED, async (event: BaseEvent) => {
    logger.info("Payment rejected", "payment-handler", event.data);
    // TODO: Update order status
    // TODO: Send payment failure notification
    // TODO: Retry payment if applicable
    try {
      const { customerId, paymentId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Payment rejected: ${paymentId}`);
        logger.info(`Updated Chatwoot timeline for payment ${paymentId}`, "payment-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "payment-handler", { error });
    }
  });

  // Handle payment refund
  eventEmitter.subscribe(EventType.PAYMENT_REFUNDED, async (event: BaseEvent) => {
    logger.info("Payment refunded", "payment-handler", event.data);
    // TODO: Update order status
    // TODO: Send refund confirmation
    // TODO: Adjust commissions if applicable
    try {
      const { customerId, paymentId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Payment refunded: ${paymentId}`);
        logger.info(`Updated Chatwoot timeline for payment ${paymentId}`, "payment-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "payment-handler", { error });
    }
  });
};
