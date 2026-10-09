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