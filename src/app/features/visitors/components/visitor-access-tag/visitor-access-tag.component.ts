import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { visitorAccessSeverity, visitorAccessStatusLabel } from '../../utils/visit.utils';

@Component({
  selector: 'app-visitor-access-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule],
  template: `<p-tag [value]="label()" [severity]="severity()" />`,
})
export class VisitorAccessTagComponent {
  readonly status = input.required<string>();

  protected readonly label = computed(() => visitorAccessStatusLabel(this.status()));
  protected readonly severity = computed(() => visitorAccessSeverity(this.status()));
}
