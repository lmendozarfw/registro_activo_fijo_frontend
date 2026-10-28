import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { SharePointAccess } from '../../models/sharepoint-access.model';

function toSafeSharePointUrl(raw: string): string | null {
  const value = String(raw ?? '').trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

@Component({
  selector: 'app-sharepoint-access-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  imports: [PIcon],
  template: `
    <a
      [attr.href]="safeUrl()"
      [attr.target]="safeUrl() ? '_blank' : null"
      [attr.rel]="safeUrl() ? 'noopener noreferrer' : null"
      [attr.aria-disabled]="safeUrl() ? null : true"
      [attr.tabindex]="safeUrl() ? null : -1"
      [class.pointer-events-none]="!safeUrl()"
      [class.opacity-60]="!safeUrl()"
      class="group relative flex h-full min-h-56 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5"
    >
      <div class="flex items-start justify-between gap-3">
        <span
          class="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition duration-200 group-hover:bg-brand-100"
        >
          <svg [pIcon]="'microsoft'" [size]="23"></svg>
        </span>
        <span
          class="flex size-8 items-center justify-center rounded-full text-neutral-300 transition group-hover:bg-brand-50 group-hover:text-brand-700"
        >
          <svg [pIcon]="'external-link'" [size]="16"></svg>
        </span>
      </div>

      <h3 class="mt-5 line-clamp-2 text-base font-bold text-neutral-900">
        {{ access().name }}
      </h3>

      @if (access().description) {
        <p class="mt-2 line-clamp-3 text-sm leading-6 text-neutral-500">
          {{ access().description }}
        </p>
      }

      <span
        class="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-brand-700"
      >
        Abrir en SharePoint
        <svg
          [pIcon]="'arrow-right'"
          [size]="14"
          class="transition-transform duration-200 group-hover:translate-x-0.5"
        ></svg>
      </span>
    </a>
  `,
})
export class SharePointAccessCardComponent {
  readonly access = input.required<SharePointAccess>();

  protected readonly safeUrl = computed(() => toSafeSharePointUrl(this.access().url));
}
