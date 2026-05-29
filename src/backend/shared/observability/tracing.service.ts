import { logger } from "./logger.service";

export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  userId?: string;
  requestId?: string;
}

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: "started" | "completed" | "error";
  error?: string;
  metadata?: Record<string, any>;
}

export class TracingService {
  private static instance: TracingService;
  private spans: Map<string, Span> = new Map();
  private activeContext: TraceContext | null = null;

  private constructor() {}

  static getInstance(): TracingService {
    if (!TracingService.instance) {
      TracingService.instance = new TracingService();
    }
    return TracingService.instance;
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  startTrace(operation: string, parentSpanId?: string, metadata?: Record<string, any>): TraceContext {
    const traceId = this.activeContext?.traceId || this.generateId();
    const spanId = this.generateId();

    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      operation,
      startTime: Date.now(),
      status: "started",
      metadata,
    };

    this.spans.set(spanId, span);

    const context: TraceContext = {
      traceId,
      spanId,
      parentSpanId,
      userId: this.activeContext?.userId,
      requestId: this.activeContext?.requestId,
    };

    this.activeContext = context;

    logger.debug(`Span started: ${operation}`, "tracing", {
      traceId,
      spanId,
      parentSpanId,
    });

    return context;
  }

  endSpan(spanId: string, error?: string): void {
    const span = this.spans.get(spanId);
    if (!span) {
      return;
    }

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
    span.status = error ? "error" : "completed";
    if (error) {
      span.error = error;
    }

    logger.debug(
      `Span ended: ${span.operation} (${span.duration}ms)`,
      "tracing",
      {
        traceId: span.traceId,
        spanId,
        duration: span.duration,
        status: span.status,
        error,
      }
    );

    // If this was the active context, clear it
    if (this.activeContext?.spanId === spanId) {
      this.activeContext = null;
    }
  }

  getActiveContext(): TraceContext | null {
    return this.activeContext;
  }

  setActiveContext(context: TraceContext): void {
    this.activeContext = context;
  }

  getTrace(traceId: string): Span[] {
    return Array.from(this.spans.values()).filter((span) => span.traceId === traceId);
  }

  getSpan(spanId: string): Span | undefined {
    return this.spans.get(spanId);
  }

  clearTraces(): void {
    this.spans.clear();
    this.activeContext = null;
  }

  // Helper method to trace async operations
  async traceAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const context = this.startTrace(operation, undefined, metadata);
    try {
      const result = await fn();
      this.endSpan(context.spanId);
      return result;
    } catch (error) {
      this.endSpan(context.spanId, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}

export const tracingService = TracingService.getInstance();
