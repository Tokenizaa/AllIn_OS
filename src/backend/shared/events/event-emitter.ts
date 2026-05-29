import { BaseEvent, EventType, EventHandler, EventSubscription } from "./event.types";

class EventEmitter {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private subscriptions: EventSubscription[] = [];

  subscribe(eventType: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler);

    const subscription: EventSubscription = { eventType, handler };
    this.subscriptions.push(subscription);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(eventType, handler);
    };
  }

  unsubscribe(eventType: EventType, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }

    this.subscriptions = this.subscriptions.filter(
      (sub) => !(sub.eventType === eventType && sub.handler === handler)
    );
  }

  async emit(event: BaseEvent): Promise<void> {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      const promises = Array.from(handlers).map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      });

      await Promise.all(promises);
    }
  }

  async emitAsync(event: BaseEvent): Promise<void> {
    // Emit without waiting for handlers to complete
    setImmediate(async () => {
      await this.emit(event);
    });
  }

  getSubscriptions(): EventSubscription[] {
    return [...this.subscriptions];
  }

  clear(): void {
    this.handlers.clear();
    this.subscriptions = [];
  }
}

// Singleton instance
export const eventEmitter = new EventEmitter();
