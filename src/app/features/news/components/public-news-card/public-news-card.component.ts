import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { NewsListDto } from '../../models/news.model';
import { NewsDatePipe } from '../../pipes/news-date.pipe';

@Component({
  selector: 'app-public-news-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  imports: [RouterLink, PIcon, NewsDatePipe],
  template: `
    <a
      [routerLink]="['/noticias', news().id]"
      class="shadow-card group flex h-full flex-col overflow-hidden rounded-2xl bg-white transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5"
    >
      <div class="relative aspect-[16/9] overflow-hidden bg-neutral-100">
        <img
          [src]="coverUrl()"
          [alt]="news().title"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      <div class="flex flex-1 flex-col p-5">
        <div
          class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand-700"
        >
          <span>Noticia</span>
          <span class="size-1 rounded-full bg-brand-300"></span>
          <span class="text-neutral-400">
            {{ news().publishedAt | newsDate }}
          </span>
        </div>

        <h3 class="mt-2 line-clamp-2 text-base font-bold leading-snug text-neutral-900">
          {{ news().title }}
        </h3>

        <p class="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
          Consulta la información completa en el portal de Comunicación Interna.
        </p>

        <span
          class="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold text-neutral-700 transition group-hover:text-brand-700"
        >
          Leer nota
          <svg [pIcon]="'arrow-right'" [size]="14"></svg>
        </span>
      </div>
    </a>
  `,
})
export class PublicNewsCardComponent {
  readonly news = input.required<NewsListDto>();

  protected readonly coverUrl = computed(
    () => this.news().coverImage?.url ?? 'assets/images/news-1.svg',
  );
}
