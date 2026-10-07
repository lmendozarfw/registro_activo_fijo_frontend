export interface System {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface SystemRequest {
    name: string;
    code: string;
    description?: string | null;
}
