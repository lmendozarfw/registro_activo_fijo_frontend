export interface System {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface SystemRequest {
    name: string;
    code: string;
    description?: string | null;
}

export interface SystemUpdateRequest {
    name: string;
    code: string;
    description?: string | null;
}
