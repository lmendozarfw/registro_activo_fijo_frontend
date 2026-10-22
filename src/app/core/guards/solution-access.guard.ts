import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';
import { SolutionsService } from '../services/solutions.service';

export const solutionAccessGuard: CanActivateFn = (route) => {
  const solutions = inject(SolutionsService);
  const permissions = inject(PermissionsService);
  const router = inject(Router);

  const code = route.paramMap.get('solution');
  const solution = solutions.findByCode(code);

  if (!solution || solution.external) {
    return router.createUrlTree(['/hub']);
  }

  if (!solution.preview) {
    return router.createUrlTree([solution.route]);
  }

  if (permissions.hasPermission(solution.permission)) return true;

  return router.createUrlTree(['/sin-acceso'], {
    queryParams: {
      solution: solution.code,
      permission: solution.permission,
      returnUrl: solution.route,
    },
  });
};
