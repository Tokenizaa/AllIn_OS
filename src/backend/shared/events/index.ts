import { eventEmitter } from "./event-emitter";
import { EventType, BaseEvent } from "./event.types";
import { registerCustomerEventHandlers } from "./handlers/customer.handlers";
import { registerOrderEventHandlers } from "./handlers/order.handlers";
import { registerPaymentEventHandlers } from "./handlers/payment.handlers";
import { registerPlanEventHandlers } from "./handlers/plan.handlers";

// Initialize all event handlers
export function initializeEventHandlers() {
  registerCustomerEventHandlers();
  registerOrderEventHandlers();
  registerPaymentEventHandlers();
  registerPlanEventHandlers();
}

// Export event emitter for direct use in services
export { eventEmitter };
export { EventType, BaseEvent };
