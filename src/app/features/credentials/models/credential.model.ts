export interface Credential {
    id: string;
    employeeSystemId: string;
    employeeId?: string | null;
    systemId?: string | null;
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
