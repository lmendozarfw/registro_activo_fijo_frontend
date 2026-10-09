export interface Permission {
    id: string;
    code: string;
    name: string;
    description?: string;
    active: boolean;
}

export interface PermissionDto {
    id: string;
    moduleId: string;
    code: string;
    name: string;
    description?: string | null;
}

export interface PermissionsGroupByModuleDto {
    moduleName: string;
    permissions: PermissionDto[];
}