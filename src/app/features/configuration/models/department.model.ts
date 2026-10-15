export interface Department {
    id: string;
    name: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface DepartmentRequest {
    name: string;
}

export interface DepartmentUpdateRequest {
    name: string;
}
