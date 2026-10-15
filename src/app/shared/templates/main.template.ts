import { Component, computed, inject, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ChevronDown, ChevronRight, NoteSticky, Sidebar } from '@primeicons/angular';
import { PIcon } from '@primeicons/angular/p-icon';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderTitleComponent } from '../components/header-title/header-title.component';
import { MenuService } from '../../core/services/menu.service';
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
                <p-sidebar id="mobile-nav" [collapsible]="isMobile() ? 'offcanvas' : 'icon'" [overlay]="isMobile()" [open]="sidebarOpen()" (openChange)="mobileNavOpen.set($event)" width="14rem">
                    <p-sidebar-spacer />
                    <p-sidebar-aside>
                        <p-sidebar-panel>
                            <p-sidebar-header>
                                <p-sidebar-menu>
                                    <p-sidebar-menu-item>
                                        <button pSidebarMenuButton class="p-1!">
                                            <div class="flex size-6 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-red-500 to-red-800 text-white text-xs font-bold leading-none">R</div>
                                            <span class="font-semibold text-sm">Raudal Footwear</span>
                                        </button>
                                    </p-sidebar-menu-item>
                                </p-sidebar-menu>
                            </p-sidebar-header>
                            <p-sidebar-content>
                                <p-sidebar-group>
                                    <p-sidebar-group-label>Menú</p-sidebar-group-label>
                                    <p-sidebar-group-content>
                                        <p-sidebar-menu>
                                            @for (item of menuService.items(); track item.key) {
                                                @if (item.children?.length) {
                                                    <p-sidebar-menu-item [collapsible]="true"
                                                        [open]="menuService.isGroupOpen(item.key, menuService.isActive(item))"
                                                        (openChange)="menuService.setGroupOpen(item.key, $event)">
                                                        <button type="button" pSidebarMenuButton [isActive]="menuService.isActive(item)">
                                                            <svg [pIcon]="item.icon || ''"></svg>
                                                            <span>{{ item.label }}</span>
                                                            <svg data-p-icon="chevron-right" class="ml-auto transition-transform duration-200"
                                                                [class.rotate-90]="menuService.isGroupOpen(item.key, menuService.isActive(item))"></svg>
                                                        </button>
                                                        <p-sidebar-menu-sub>
                                                            @for (child of item.children; track child.key) {
                                                                <p-sidebar-menu-sub-item>
                                                                    <a pSidebarMenuSubButton [routerLink]="child.route" [isActive]="menuService.isActive(child)" (click)="closeNav()">
                                                                        @if (child.icon) {
                                                                            <svg [pIcon]="child.icon"></svg>
                                                                        }
                                                                        <span>{{ child.label }}</span>
                                                                    </a>
                                                                </p-sidebar-menu-sub-item>
                                                            }
                                                        </p-sidebar-menu-sub>
                                                    </p-sidebar-menu-item>
                                                } @else {
                                                    <p-sidebar-menu-item>
                                                        <a pSidebarMenuButton [routerLink]="item.route" [isActive]="menuService.isActive(item)" (click)="closeNav()">
                                                            <svg [pIcon]="item.icon || ''"></svg>
                                                            <span>{{ item.label }}</span>
                                                        </a>
                                                    </p-sidebar-menu-item>
                                                }
                                            }
                                        </p-sidebar-menu>
                                    </p-sidebar-group-content>
                                </p-sidebar-group>
                            </p-sidebar-content>
                            <p-sidebar-footer>
                                <p-sidebar-menu>
                                    <p-sidebar-menu-item>
                                        <button pSidebarMenuButton class="p-1!" (click)="userMenu.toggle($event)">
                                            <span>Luis Angel Mendoza Lucio</span>
                                            <svg data-p-icon="chevron-down" class="ml-auto"></svg>
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
                    <header class="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 px-4">
                        <button pButton pSidebarTrigger target="mobile-nav" severity="secondary" text size="small">
                            <svg data-p-icon="sidebar"></svg>
                        </button>
                        <app-header-title />
                        <div class="ml-auto flex items-center gap-2">
                            <button
                                type="button"
                                class="relative cursor-pointer flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                                (click)="notesBoard.togglePanel()"
                                aria-label="Notas"
                            >
                                <svg data-p-icon="note-sticky" [size]="15"></svg>
                                <span>Notas</span>
                                @if (notesStore.totalCount() > 0) {
                                    <span class="min-w-5 rounded-full bg-emerald-600 px-1.5 text-[10px] font-semibold text-white">
                                        {{ notesStore.totalCount() }}
                                    </span>
                                }
                            </button>
                            <span class="h-7.5 flex items-center text-xs text-slate-900 rounded-md bg-slate-100 px-2 py-1">
                              {{ '#5366' }}
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
        `
    ],
    standalone: true,
    imports: [
        AvatarModule,
        SidebarModule,
        ButtonModule,
        PIcon,
        Sidebar,
        ChevronDown,
        ChevronRight,
        NoteSticky,
        Menu,
        MenuModule,
        RouterOutlet,
        RouterLink,
        HeaderTitleComponent,
        NotesBoardComponent
    ],
})
export class MainTemplate {
    isMobile = signal(false);
    protected readonly mobileNavOpen = signal(false);
    protected readonly sidebarOpen = computed(() => !this.isMobile() || this.mobileNavOpen());

    userItems: MenuItem[] = [
        {
            label: 'Opciones',
            items: [{ label: 'Cerrar sesión', icon: 'sign-out', command: () => this.logout() }]
        }
    ];

    protected menuService = inject(MenuService);
    private readonly authStore = inject(AuthStore);
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
        void this.router.navigate(['/auth/login']);
    }
}
