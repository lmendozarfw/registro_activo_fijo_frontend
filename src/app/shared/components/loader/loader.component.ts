import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [PIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loader.loading()) {
      <div
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      >
        <div
          class="flex flex-col items-center gap-3 rounded-xl px-6 py-4"
        >
          <svg [pIcon]="'spinner'" [spin]="true" [size]="50" class="text-emerald-600"></svg>
          <span class="text-sm font-medium text-white">{{ message() }}</span>
        </div>
      </div>
    }
  `,
})
export class LoaderComponent {
  protected readonly loader = inject(LoaderService);

  readonly message = input('Cargando...');
}
