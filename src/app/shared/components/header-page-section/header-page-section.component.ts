import { Component, input, output } from "@angular/core";
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";

@Component({
  selector: 'app-header-page-section',
  template: `
    
    <section
    class="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#09090b_0%,#121214_58%,#3a0d08_100%)] px-5 py-5 text-white shadow-sm"
  >
    <div
      class="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-brand-500/25 blur-3xl"
    ></div>
    <div
      class="pointer-events-none absolute -bottom-24 left-1/3 size-56 rounded-full bg-rose-500/10 blur-3xl"
    ></div>

    <div class="relative flex flex-col gap-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="max-w-2xl">
          <h1 class="text-xl font-semibold tracking-tight">{{ title() }}</h1>
          @if (description()) {
            <p class="mt-1.5 text-sm leading-relaxed text-white/60">
                {{ description() }}
            </p>
          }
        </div>

        @if(hasAction()) {
          <button
          *hasPermission="permissionToAction() ? permissionToAction()! : null"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          (click)="create.emit()"
        >
          <svg [pIcon]="'plus'" [size]="16"></svg>
          {{ buttonText() }}
        </button>
        }
      </div>
    </div>
  </section>

    `,
  styles: [],
  imports: [
    PIcon,
    ButtonModule,
    HasPermissionDirective
]
})
export class HeaderPageSectionComponent {
  title = input.required<string>();
  description = input<string>();
  buttonText = input<string>('Nuevo');
  hasAction = input<boolean>(true);
  permissionToAction = input<string>();
  create = output<void>();
}