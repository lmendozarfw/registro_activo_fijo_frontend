import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { visitStatusLabel, visitStatusSeverity } from '../../utils/visit.utils';

@Component({
  selector: 'app-visit-status-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule],
  template: `<p-tag [value]="label()" [severity]="severity()" />`,
})
export class VisitStatusTagComponent {
  readonly status = input.required<string>();

  protected readonly label = computed(() => visitStatusLabel(this.status()));
  protected readonly severity = computed(() => visitStatusSeverity(this.status()));
}
