import { PermissionDto } from "../../configuration/models/permission.model";

export interface User {
    id: string;
    username: string;
    employeeId?: string | null;
    employeeName?: string | null;
    active?: boolean;
    permissionIds?: string[];
    permissions?: PermissionDto[];
    createdAt?: string;
    updatedAt?: string | null;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    employeeId?: string | null;
    permissionIds: string[];
}

export interface UpdateUserRequest {
    username: string;
    password?: string | null;
    employeeId?: string | null;
    permissionIds: string[];
}
