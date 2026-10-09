import { PermissionDto } from "./permission.model";

export interface ITemplate {
    id: string;
    name: string;
    description?: string | null;
    permissions: PermissionDto[];
}

export interface TemplateRequest {
    name: string;
    description?: string | null;
    permissionIds: string[];
}
