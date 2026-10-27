import { Component, input, output } from "@angular/core";
import { PIcon } from '@primeicons/angular/p-icon';
import { SolutionConfig } from "../../../core/config/solutions.config";

@Component({
    selector: 'app-solution-card',
    template: `
        <a
            [attr.href]="solution().external ? solution().route : null"
            [attr.target]="solution().external ? '_blank' : null"
            [attr.rel]="solution().external ? 'noopener noreferrer' : null"
            (click)="onOpenSolution($event)"
            class="group flex min-h-56 cursor-pointer flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5"
          >
            <div class="flex items-start justify-between gap-3">
              <span
                [class]="
                  'flex size-12 items-center justify-center rounded-xl ' + solution().theme.tone
                "
              >
                <svg [pIcon]="solution().icon" [size]="23"></svg>
              </span>

              @if (solution().preview) {
                <span
                  class="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700"
                >
                  Vista de prueba
                </span>
              } @else {
                <span
                  class="flex size-8 items-center justify-center rounded-full text-neutral-300 transition group-hover:bg-brand-50 group-hover:text-brand-600"
                >
                  <svg
                    [pIcon]="solution().external ? 'external-link' : 'arrow-right'"
                    [size]="16"
                  ></svg>
                </span>
              }
            </div>

            <h3 class="mt-5 text-base font-bold text-neutral-900">{{ solution().name }}</h3>
            <p class="mt-2 text-sm leading-6 text-neutral-500">{{ solution().description }}</p>

            <span class="mt-auto pt-5 text-sm font-semibold text-brand-700">
              @if (solution().external) {
                Abrir portal
              } @else if (solution().preview) {
                Explorar vista de prueba
              } @else {
                Entrar al módulo
              }
            </span>
          </a>
    `,
    styles: [],
    imports: [PIcon]
})
export class SolutionCardComponent {
    solution = input.required<SolutionConfig>();
    openSolution = output<SolutionConfig>();

    onOpenSolution($event: Event) {
        $event.stopPropagation();
        $event.preventDefault();
        this.openSolution.emit(this.solution());
    }
}