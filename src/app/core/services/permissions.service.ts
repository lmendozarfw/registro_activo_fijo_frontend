import { inject, Injectable } from '@angular/core';
import { AuthStore } from '../../features/auth/stores/auth.store';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly authStore = inject(AuthStore);

  hasPermission(permission: string | null | undefined): boolean {
    return this.authStore.hasPermission(permission ?? '');
  }

  hasAnyPermission(permissions: readonly string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }
}
