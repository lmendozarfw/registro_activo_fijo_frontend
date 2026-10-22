import { inject, Injectable } from "@angular/core";
import { AuthStore } from "../../features/auth/stores/auth.store";

@Injectable({providedIn: 'root'})
export class PermissionsService {
    private readonly authStore = inject(AuthStore);

    constructor() {}

    hasPermission(permission: string) {
        if (permission === '') return false;
        const permissions = this.authStore.permissions();
        if (Array.isArray(permissions) && permissions.length === 0) return false;
        return permissions!.includes(permission);
    }
}