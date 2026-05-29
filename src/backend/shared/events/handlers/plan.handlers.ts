import { eventEmitter } from "../event-emitter";
import { EventType, BaseEvent } from "../event.types";
import { chatwootService } from "../../chatwoot/chatwoot.service";
import { logger } from "../../observability/logger.service";

// Plan event handlers
export const registerPlanEventHandlers = () => {
  // Handle plan activation
  eventEmitter.subscribe(EventType.PLAN_ACTIVATED, async (event: BaseEvent) => {
    logger.info("Plan activated", "plan-handler", event.data);
    // TODO: Send plan activation confirmation
    // TODO: Update customer permissions
    // TODO: Trigger welcome automation
    try {
      const { customerId, planId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Plan activated: ${planId}`);
        logger.info(`Updated Chatwoot timeline for plan ${planId}`, "plan-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "plan-handler", { error });
    }
  });

  // Handle plan upgrade
  eventEmitter.subscribe(EventType.PLAN_UPGRADED, async (event: BaseEvent) => {
    logger.info("Plan upgraded", "plan-handler", event.data);
    // TODO: Send upgrade confirmation
    // TODO: Update customer permissions
    // TODO: Prorate billing if applicable
    try {
      const { customerId, planId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Plan upgraded to: ${planId}`);
        logger.info(`Updated Chatwoot timeline for plan ${planId}`, "plan-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "plan-handler", { error });
    }
  });

  // Handle plan downgrade
  eventEmitter.subscribe(EventType.PLAN_DOWNGRADED, async (event: BaseEvent) => {
    logger.info("Plan downgraded", "plan-handler", event.data);
    // TODO: Send downgrade confirmation
    // TODO: Update customer permissions
    // TODO: Prorate billing if applicable
    try {
      const { customerId, planId } = event.data;
      const conversations = await chatwootService.searchConversations(customerId);
      if (conversations.length > 0) {
        await chatwootService.addNote(conversations[0].id, `Plan downgraded to: ${planId}`);
        logger.info(`Updated Chatwoot timeline for plan ${planId}`, "plan-handler");
      }
    } catch (error) {
      logger.error("Failed to update Chatwoot timeline", "plan-handler", { error });
    }
  });
};
