export interface Credential {
    id: string;
    employeeSystemId: string;
    employeeId: string;
    systemId: string;
    employeeFullName?: string | null;
    systemName?: string | null;
    canView: boolean;
    note?: string | null;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface CredentialRequest {
    employeeId?: string;
    systemId?: string;
    password?: string;
    canView: boolean;
    note?: string | null;
}

export interface CreateSupportRequest {
    employeeId: string;
    systemId: string;
    message: string;
}

export enum AuditEventType {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    VIEWED = "VIEWED",
    DELETED = "DELETED",
    RESET_REQUESTED = "RESET_REQUESTED",
}

export interface CredentialAuditEvent {
  id: string;
  actorUsername: string;
  actorEmployeeFullName?: string | null;
  note?: string | null;
  type: AuditEventType;
  createdAt: string;
}
