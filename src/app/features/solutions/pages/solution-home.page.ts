import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { PermissionsService } from '../../../core/services/permissions.service';
import { SolutionContextService } from '../../../core/services/solution-context.service';
import { AuthStore } from '../../auth/stores/auth.store';

@Component({
  selector: 'app-solution-home-page',
  templateUrl: './solution-home.page.html',
  imports: [RouterLink, PIcon],
})
export class SolutionHomePage {
  private readonly context = inject(SolutionContextService);
  private readonly permissions = inject(PermissionsService);

  protected readonly authStore = inject(AuthStore);
  protected readonly solution = this.context.solution;
  protected readonly permissionVerified = computed(() => {
    const solution = this.solution();
    return !!solution && this.permissions.hasPermission(solution.permission);
  });
  protected readonly initials = computed(() => {
    const name = this.authStore.user()?.fullName ?? '';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  });
}
