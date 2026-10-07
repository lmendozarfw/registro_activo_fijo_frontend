import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex w-full flex-col items-center justify-center py-10 text-center">
      <span
        class="rounded-md bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-500"
      >
        {{ message() }}
      </span>

      @if (description()) {
        <p class="mt-2 max-w-md text-sm text-slate-400">
          {{ description() }}
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  message = input('No se han encontrado registros');

  description = input(
    'No hay información disponible para mostrar en este momento.'
  );
}