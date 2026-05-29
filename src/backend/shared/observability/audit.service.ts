import { logger } from "./logger.service";

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  READ = "read",
  LOGIN = "login",
  LOGOUT = "logout",
  ACTIVATE = "activate",
  DEACTIVATE = "deactivate",
  EXPORT = "export",
  IMPORT = "import",
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  userId?: string;
  userEmail?: string;
  changes?: Record<string, { from: any; to: any }>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  private static instance: AuditService;
  private audits: AuditEntry[] = [];
  private maxAudits: number = 5000;

  private constructor() {}

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  log(
    action: AuditAction,
    entityType: string,
    entityId: string,
    userId?: string,
    changes?: Record<string, { from: any; to: any }>,
    metadata?: Record<string, any>
  ): void {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      entityType,
      entityId,
      userId,
      changes,
      metadata,
    };

    this.audits.push(entry);

    // Keep only the last maxAudits entries
    if (this.audits.length > this.maxAudits) {
      this.audits = this.audits.slice(-this.maxAudits);
    }

    // Log the audit entry
    logger.info(
      `Audit: ${action} ${entityType}:${entityId}`,
      "audit",
      {
        auditId: entry.id,
        userId,
        changes,
        metadata,
      }
    );
  }

  getAudits(filters?: {
    action?: AuditAction;
    entityType?: string;
    entityId?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditEntry[] {
    let filtered = this.audits;

    if (filters?.action) {
      filtered = filtered.filter((audit) => audit.action === filters.action);
    }

    if (filters?.entityType) {
      filtered = filtered.filter((audit) => audit.entityType === filters.entityType);
    }

    if (filters?.entityId) {
      filtered = filtered.filter((audit) => audit.entityId === filters.entityId);
    }

    if (filters?.userId) {
      filtered = filtered.filter((audit) => audit.userId === filters.userId);
    }

    if (filters?.startDate) {
      filtered = filtered.filter((audit) => new Date(audit.timestamp) >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter((audit) => new Date(audit.timestamp) <= filters.endDate!);
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getAuditById(id: string): AuditEntry | undefined {
    return this.audits.find((audit) => audit.id === id);
  }

  clearAudits(): void {
    this.audits = [];
  }
}

export const auditService = AuditService.getInstance();
