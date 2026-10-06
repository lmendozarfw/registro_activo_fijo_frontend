import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageHeaderService } from '../../../core/services/page-header.service';

@Component({
  selector: 'app-header-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="text-sm font-medium">{{ header.title() }}</span>
  `,
})
export class HeaderTitleComponent {
  protected readonly header = inject(PageHeaderService);
}
