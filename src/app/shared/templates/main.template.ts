import { Component, computed, inject, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ChevronDown, NoteSticky, Sidebar } from '@primeicons/angular';
import { PIcon } from '@primeicons/angular/p-icon';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MenuModule } from 'primeng/menu';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderTitleComponent } from '../components/header-title/header-title.component';
import { SidebarMenuComponent } from '../components/sidebar-menu/sidebar-menu.component';
import { ACTIVO_FIJO_MENU } from '../../core/config/menu.config';
import { AuthStore } from '../../features/auth/stores/auth.store';
import { NotesStore } from '../../features/notes/stores/note.store';
import { NotesBoardStore } from '../../features/notes/stores/notes-board.store';
import { NotesBoardComponent } from '../../features/notes/components/notes-board/notes-board.component';

@Component({
  selector: 'main-template',
  template: `
    <div class="h-dvh overflow-hidden">
      <p-sidebar-layout class="relative! h-full min-h-full!">
        @if (isMobile()) {
          <p-sidebar-backdrop class="absolute!" />
        }
        <p-sidebar
          id="mobile-nav"
          [collapsible]="isMobile() ? 'offcanvas' : 'icon'"
          [overlay]="isMobile()"
          [open]="sidebarOpen()"
          (openChange)="mobileNavOpen.set($event)"
          width="17rem"
          class="!border-0"
        >
          <p-sidebar-spacer />
          <p-sidebar-aside class="relative overflow-hidden bg-[radial-gradient(120%_120%_at_0%_0%,rgba(239,68,68,0.28)_0%,transparent_58%),radial-gradient(140%_140%_at_100%_100%,rgba(225,29,72,0.22)_0%,transparent_62%),linear-gradient(180deg,#050506_0%,#020203_100%)] text-slate-100 border-r border-white/5" style="color-scheme: dark;">
            <div class="pointer-events-none absolute -left-24 top-0 size-64 rounded-full bg-brand-500/20 blur-[90px]"></div>
            <div class="pointer-events-none absolute -right-28 bottom-10 size-72 rounded-full bg-rose-600/16 blur-[110px]"></div>
            <p-sidebar-panel class="relative">
              <p-sidebar-header class="border-b border-white/5">
                <p-sidebar-menu>
                  <p-sidebar-menu-item>
                    <div class="flex items-center gap-2">
                      <div class="w-10 h-10 rounded-lg px-1 flex items-center justify-center bg-brand/20">
                      <img
                        src="assets/images/isotipo-sinergy-r.png"
                        alt="Raudal Footwear"
                        class="w-full h-full object-contain"
                      />
                    </div>
                    <p class="text-neutral-50 text-xl font-bold">Sinergy<span class="text-brand">Hub</span></p>
                    </div>
                  </p-sidebar-menu-item>
                </p-sidebar-menu>
              </p-sidebar-header>
              <p-sidebar-content>
                <app-sidebar-menu [items]="menuItems" (navigated)="closeNav()" />
              </p-sidebar-content>
              <p-sidebar-footer class="border-t border-white/5">
                <p-sidebar-menu>
                  <p-sidebar-menu-item>
                    <button
                      pSidebarMenuButton
                      class="group relative w-full overflow-hidden rounded-2xl px-1! py-2 transition h-10!"
                      (click)="userMenu.toggle($event)"
                    >
                      <div class="flex items-center gap-2">
                        <div class="w-8! h-8! rounded-lg px-1 flex items-center justify-center bg-brand">
                          <span>{{ authStore.user()?.fullName ? authStore.user()?.fullName[0] : 'U' }}</span>
                        </div>
                        <span class="relative flex items-center gap-2 truncate mr-4">
                          {{authStore.user()?.fullName ?? 'Usuario'}}
                        </span>
                      </div>
                      <svg data-p-icon="chevron-down" class="relative ml-auto text-neutral-400 transition group-hover:text-white"></svg>
                    </button>
                    <p-menu #userMenu [model]="userItems" [popup]="true" appendTo="body">
                      <ng-template #item let-item>
                        <a class="flex items-center gap-2">
                          <svg [pIcon]="item.icon || ''" [size]="14" class="ml-2"></svg>
                          <span>{{ item.label }}</span>
                        </a>
                      </ng-template>
                    </p-menu>
                  </p-sidebar-menu-item>
                </p-sidebar-menu>
              </p-sidebar-footer>
            </p-sidebar-panel>
          </p-sidebar-aside>
        </p-sidebar>
        <p-sidebar-main class="min-w-0 overflow-hidden">
          <header class="flex h-12 shrink-0 items-center gap-2 border-b border-neutral-200 px-4">
            <button
              pButton
              pSidebarTrigger
              target="mobile-nav"
              severity="secondary"
              text
              size="small"
            >
              <svg data-p-icon="sidebar"></svg>
            </button>
            <app-header-title />
            <div class="ml-auto flex items-center gap-2">
              <button
                type="button"
                class="relative cursor-pointer flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                (click)="notesBoard.togglePanel()"
                aria-label="Notas"
              >
                <svg data-p-icon="note-sticky" [size]="15"></svg>
                <span>Notas</span>
                @if (notesStore.totalCount() > 0) {
                  <span
                    class="min-w-5 rounded-full bg-brand-600 px-1.5 text-[10px] font-semibold text-white"
                  >
                    {{ notesStore.totalCount() }}
                  </span>
                }
              </button>
              <span
                class="h-7.5 flex items-center text-xs text-neutral-900 rounded-md bg-neutral-100 px-2 py-1"
              >
                {{ 'V.0.1' }}
              </span>
            </div>
          </header>
          <div class="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 flex flex-col">
            <router-outlet />
          </div>
        </p-sidebar-main>
      </p-sidebar-layout>
      <app-notes-board />
    </div>
  `,
  styles: [
    `
      .p-sidebar-layout {
      }
    `,
  ],
  standalone: true,
  imports: [
    AvatarModule,
    SidebarModule,
    ButtonModule,
    PIcon,
    Sidebar,
    ChevronDown,
    NoteSticky,
    Menu,
    MenuModule,
    RouterOutlet,
    HeaderTitleComponent,
    SidebarMenuComponent,
    NotesBoardComponent,
  ],
})
export class MainTemplate {
  isMobile = signal(false);
  protected readonly mobileNavOpen = signal(false);
  protected readonly sidebarOpen = computed(() => !this.isMobile() || this.mobileNavOpen());

  userItems: MenuItem[] = [
    {
      label: 'Opciones',
      items: [{ label: 'Cerrar sesión', icon: 'sign-out', command: () => this.logout() }],
    },
  ];

  protected readonly menuItems = ACTIVO_FIJO_MENU;
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  protected readonly notesStore = inject(NotesStore);
  protected readonly notesBoard = inject(NotesBoardStore);

  constructor() {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 1023px)');
    this.isMobile.set(mql.matches);
    mql.addEventListener('change', (e) => this.isMobile.set(e.matches));
  }

  protected closeNav(): void {
    if (this.isMobile()) this.mobileNavOpen.set(false);
  }

  private logout(): void {
    this.authStore.logout();
    void this.router.navigate(['/']);
  }
}
