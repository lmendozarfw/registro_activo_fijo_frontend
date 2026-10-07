export interface Credential {
    id: string;
    employeeSystemId: string;
    employeeId?: string | null;
    systemId?: string | null;
    employeeName?: string | null;
    systemName?: string | null;
    canView: boolean;
    note?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface CredentialRequest {
    employeeId?: string;
    systemId?: string;
    encryptedPassword?: string;
    canView: boolean;
    note?: string | null;
}
