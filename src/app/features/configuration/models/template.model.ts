import { PermissionDto } from "./permission.model";

export interface ITemplate {
    id: string;
    name: string;
    description?: string | null;
    permissions: PermissionDto[];
    createdAt?: string;
    updatedAt?: string | null;
}

export interface TemplateRequest {
    name: string;
    description?: string | null;
    permissionIds: string[];
}

export interface TemplateUpdateRequest {
    name: string;
    description?: string | null;
    permissionIds: string[];
}
