export interface Credential {
    id: string;
    employeeSystemId: string;
    employeeId: string;
    systemId: string;
    employeeFullName?: string | null;
    systemName?: string | null;
    canView: boolean;
    note?: string | null;
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
    CREATED = 0,
    UPDATED = 1,
    VIEWED = 2,
    DELETED = 3,
    RESET_REQUESTED = 4,
}

export interface CredentialAuditEvent {
    id: string;
    actorUsername: string;
    actorEmployeeFullName?: string | null;
    note?: string | null;
    type: number;
    createdAt: string;
}