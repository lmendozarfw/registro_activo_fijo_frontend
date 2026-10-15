export interface Brand {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface BrandRequest {
    name: string;
}

export interface BrandUpdateRequest {
    name: string;
}