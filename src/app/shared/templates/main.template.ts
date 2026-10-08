import { Component, computed, inject, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ChevronDown, Sidebar } from '@primeicons/angular';
import { PIcon } from '@primeicons/angular/p-icon';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MenuModule } from 'primeng/menu';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderTitleComponent } from '../components/header-title/header-title.component';
import { MenuService } from '../../core/services/menu.service';
import { AuthStore } from '../../features/auth/stores/auth.store';

@Component({
    selector: 'main-template',
    template: `
        <div class="h-dvh overflow-hidden">
            <p-sidebar-layout class="relative! h-full">
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
                                                <p-sidebar-menu-item>
                                                    <a pSidebarMenuButton [routerLink]="item.route" [isActive]="menuService.isActive(item)" (click)="closeNav()">
                                                        <svg [pIcon]="item.icon || ''"></svg>
                                                        <span>{{ item.label }}</span>
                                                    </a>
                                                </p-sidebar-menu-item>
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
                                        <p-menu #userMenu [model]="userItems" [popup]="true" appendTo="body" />
                                    </p-sidebar-menu-item>
                                </p-sidebar-menu>
                            </p-sidebar-footer>
                        </p-sidebar-panel>
                    </p-sidebar-aside>
                </p-sidebar>
                <p-sidebar-main>
                    <header class="flex h-12 shrink-0 items-center gap-2 border-b border-slate-200 px-4">
                        <button pButton pSidebarTrigger target="mobile-nav" severity="secondary" text size="small">
                            <svg data-p-icon="sidebar"></svg>
                        </button>
                        <app-header-title />
                        <span class="ml-auto text-xs text-slate-900 rounded-md bg-slate-100 px-2 py-1"> <span class="text-xs text-slate-600">Empleado</span> {{ '#5366' }}</span>
                    </header>
                    <div class="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col">
                        <router-outlet />
                    </div>
                </p-sidebar-main>
            </p-sidebar-layout>
        </div>
    `,
    styles: [
        `
        .p-sidebar-layout {
            display: block;
        }
        `
    ],
    standalone: true,
    imports: [AvatarModule, SidebarModule, ButtonModule, PIcon, Sidebar, ChevronDown, Menu, MenuModule,
        RouterOutlet, RouterLink, HeaderTitleComponent],
})
export class MainTemplate {
    isMobile = signal(false);
    protected readonly mobileNavOpen = signal(false);
    protected readonly sidebarOpen = computed(() => !this.isMobile() || this.mobileNavOpen());

    userItems: MenuItem[] = [
        {
            label: 'Menú',
            items: [{ label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }]
        }
    ];

    protected menuService = inject(MenuService);
    private readonly authStore = inject(AuthStore);
    private readonly router = inject(Router);

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
