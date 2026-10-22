import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonDirective } from 'primeng/button';
import { SolutionContextService } from '../../../core/services/solution-context.service';
import { SolutionsService } from '../../../core/services/solutions.service';
import { AuthStore } from '../../../features/auth/stores/auth.store';

@Component({
  selector: 'app-solution-template',
  templateUrl: './solution.template.html',
  imports: [RouterOutlet, RouterLink, PIcon, ButtonDirective],
  providers: [SolutionContextService],
})
export class SolutionTemplate {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solutions = inject(SolutionsService);
  private readonly context = inject(SolutionContextService);

  protected readonly authStore = inject(AuthStore);
  protected readonly solution = this.context.solution;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const code = params.get('solution');
      this.context.solution.set(this.solutions.findByCode(code));
    });
  }

  async logout(): Promise<void> {
    this.authStore.logout();
    await this.router.navigateByUrl('/');
  }
}
