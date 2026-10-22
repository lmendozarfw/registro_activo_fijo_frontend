import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { SolutionsService } from '../../../core/services/solutions.service';
import { safeReturnUrl } from '../../../core/utils/navigation.utils';

@Component({
  selector: 'app-access-denied-page',
  templateUrl: './access-denied.page.html',
  imports: [RouterLink, PIcon],
})
export class AccessDeniedPage {
  private readonly route = inject(ActivatedRoute);
  private readonly solutions = inject(SolutionsService);
  private readonly query = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected readonly solution = computed(() =>
    this.solutions.findByCode(this.query().get('solution')),
  );

  protected readonly permission = computed(
    () => this.query().get('permission') ?? this.solution()?.permission ?? '',
  );

  protected readonly returnUrl = computed(() => safeReturnUrl(this.query().get('returnUrl')));
}
