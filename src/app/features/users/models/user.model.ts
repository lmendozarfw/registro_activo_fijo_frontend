import { PermissionDto } from "../../configuration/models/permission.model";

export interface User {
    id: string;
    username: string;
    employeeFullName?: string | null;
    createdAt?: string;
    employeeId?: string | null;
    permissionIds?: string[];
    permissions?: PermissionDto[];
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
