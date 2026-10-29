import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { WeeklyMenuStatus } from '../../models/weekly-menu.model';

type TagSeverity = 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';

const LABELS: Record<WeeklyMenuStatus, string> = {
  Upcoming: 'Próximo',
  Active: 'Vigente',
  Expired: 'Finalizado',
};

const SEVERITIES: Record<WeeklyMenuStatus, TagSeverity> = {
  Upcoming: 'info',
  Active: 'success',
  Expired: 'secondary',
};

@Component({
  selector: 'app-weekly-menu-status-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule],
  template: `<p-tag [value]="label()" [severity]="severity()" />`,
})
export class WeeklyMenuStatusTagComponent {
  readonly status = input<WeeklyMenuStatus>('Upcoming');

  protected readonly label = computed(() => LABELS[this.status()]);
  protected readonly severity = computed(() => SEVERITIES[this.status()]);
}
