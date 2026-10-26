import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { NewsStatus } from '../../models/news.model';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

const STATUS_LABELS: Record<NewsStatus, string> = {
  Draft: 'Borrador',
  Scheduled: 'Programada',
  Published: 'Publicada',
  Archived: 'Archivada',
};

const STATUS_SEVERITIES: Record<NewsStatus, TagSeverity> = {
  Draft: 'secondary',
  Scheduled: 'warn',
  Published: 'success',
  Archived: 'contrast',
};

@Component({
  selector: 'app-news-status-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagModule],
  template: `<p-tag [value]="label()" [severity]="severity()" />`,
})
export class NewsStatusTagComponent {
  readonly status = input.required<NewsStatus>();

  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
  protected readonly severity = computed(() => STATUS_SEVERITIES[this.status()]);
}
