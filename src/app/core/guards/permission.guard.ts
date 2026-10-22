import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);
  const permission = route.data['permission'] as string | undefined;

  if (!permission || permissions.hasPermission(permission)) return true;

  return router.createUrlTree(['/sin-acceso'], {
    queryParams: {
      permission,
      returnUrl: state.url,
    },
  });
};
