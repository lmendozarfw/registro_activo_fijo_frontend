import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonDirective } from 'primeng/button';
import { SolutionConfig } from '../../../core/config/solutions.config';
import { SolutionsService } from '../../../core/services/solutions.service';
import { AuthStore } from '../../auth/stores/auth.store';

@Component({
  selector: 'app-hub-page',
  templateUrl: './hub.page.html',
  imports: [RouterLink, PIcon, ButtonDirective],
})
export class HubPage {
  protected readonly authStore = inject(AuthStore);
  private readonly solutions = inject(SolutionsService);
  private readonly router = inject(Router);

  protected readonly accessibleSolutions = this.solutions.accessible;
  protected readonly firstName = computed(
    () => this.authStore.user()?.fullName.trim().split(/\s+/)[0] ?? '',
  );

  openSolution(event: Event, solution: SolutionConfig): void {
    if (solution.external) return;
    event.preventDefault();
    void this.router.navigateByUrl(solution.route);
  }

  async logout(): Promise<void> {
    this.authStore.logout();
    await this.router.navigateByUrl('/');
  }
}
