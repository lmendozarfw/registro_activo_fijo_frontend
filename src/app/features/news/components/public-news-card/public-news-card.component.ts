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
      class="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5"
    >
      <div class="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          [src]="coverUrl()"
          [alt]="news().title"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      <div class="flex flex-1 flex-col p-5">
        <div
          class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-teal-700"
        >
          <span>Noticia</span>
          <span class="size-1 rounded-full bg-teal-300"></span>
          <span class="text-slate-400">
            {{ news().publishedAt | newsDate }}
          </span>
        </div>

        <h3 class="mt-2 line-clamp-2 text-base font-bold leading-snug text-slate-900">
          {{ news().title }}
        </h3>

        <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          Consulta la información completa en el portal de Comunicación Interna.
        </p>

        <span
          class="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold text-slate-700 transition group-hover:text-teal-700"
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
