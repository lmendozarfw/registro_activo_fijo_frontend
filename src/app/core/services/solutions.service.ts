import { computed, inject, Injectable } from '@angular/core';
import { SOLUTIONS, SolutionConfig } from '../config/solutions.config';
import { AuthStore } from '../../features/auth/stores/auth.store';

@Injectable({ providedIn: 'root' })
export class SolutionsService {
  private readonly authStore = inject(AuthStore);

  readonly all = SOLUTIONS;

  readonly accessible = computed(() => this.all.filter((solution) => this.canAccess(solution)));

  findByCode(code: string | null | undefined): SolutionConfig | null {
    if (!code) return null;
    return this.all.find((solution) => solution.code === code) ?? null;
  }

  canAccess(solution: SolutionConfig): boolean {
    return !solution.permission || this.authStore.hasPermission(solution.permission);
  }
}
