import { eventEmitter } from "../event-emitter";
import { EventType, BaseEvent } from "../event.types";
import { chatwootService } from "../../chatwoot/chatwoot.service";
import { logger } from "../../observability/logger.service";

// Order event handlers
export const registerOrderEventHandlers = () => {
  // Handle order creation
  eventEmitter.subscribe(EventType.ORDER_CREATED, async (event: BaseEvent) => {
    logger.info("Order created", "order-handler", event.data);
    // TODO: Send order confirmation email
    // TODO: Update inventory
    // TODO: Trigger payment processing
    try {
      const { customerId, orderId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `New order created: ${orderId}`);
        logger.info(`Updated Chatwoot timeline for order ${orderId}`, "order-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "order-handler", { error });
    }
  });

  // Handle order cancellation
  eventEmitter.subscribe(EventType.ORDER_CANCELLED, async (event: BaseEvent) => {
    logger.info("Order cancelled", "order-handler", event.data);
    // TODO: Send cancellation notification
    // TODO: Restore inventory
    // TODO: Process refund if applicable
    try {
      const { customerId, orderId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Order cancelled: ${orderId}`);
        logger.info(`Updated Chatwoot timeline for order ${orderId}`, "order-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "order-handler", { error });
    }
  });

  // Handle order shipping
  eventEmitter.subscribe(EventType.ORDER_SHIPPED, async (event: BaseEvent) => {
    logger.info("Order shipped", "order-handler", event.data);
    // TODO: Send shipping notification
    // TODO: Update tracking information
    try {
      const { customerId, orderId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Order shipped: ${orderId}`);
        logger.info(`Updated Chatwoot timeline for order ${orderId}`, "order-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "order-handler", { error });
    }
  });

  // Handle order delivery
  eventEmitter.subscribe(EventType.ORDER_DELIVERED, async (event: BaseEvent) => {
    logger.info("Order delivered", "order-handler", event.data);
    // TODO: Send delivery confirmation
    // TODO: Request review
    try {
      const { customerId, orderId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Order delivered: ${orderId}`);
        logger.info(`Updated Chatwoot timeline for order ${orderId}`, "order-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "order-handler", { error });
    }
  });
};
