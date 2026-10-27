import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../auth/stores/auth.store';

@Component({
  selector: 'app-public-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { display: 'block' },
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl"
    >
      <div
        class="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <a
          routerLink="/"
          class="flex shrink-0 items-center"
          aria-label="Raudal Footwear, inicio"
        >
          <img
            src="assets/images/sinergyHub.jpg"
            alt="Raudal Footwear"
            class="h-9 w-auto sm:h-10"
          />
        </a>

        <nav class="ml-auto hidden items-center gap-1 sm:flex">
          <a
            routerLink="/"
            routerLinkActive="bg-neutral-100 text-neutral-900"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            Inicio
          </a>
          <a
            routerLink="/noticias"
            routerLinkActive="bg-neutral-100 text-neutral-900"
            class="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            Noticias
          </a>
        </nav>

        @if (authStore.isAuthenticated()) {
          <a
            routerLink="/hub"
            class="ml-auto inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.99]"
          >
            Ir al hub
          </a>
        } @else {
          <a
            [routerLink]="['/']"
            [queryParams]="{ returnUrl: returnUrl }"
            class="ml-auto inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]"
          >
            Iniciar sesión
          </a>
        }
      </div>
    </header>
  `,
})
export class PublicHeaderComponent {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  protected readonly returnUrl = this.router.url;
}
