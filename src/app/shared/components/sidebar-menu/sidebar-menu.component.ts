import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { SidebarModule } from 'primeng/sidebar';
import { filter, map } from 'rxjs';
import { MenuItem } from '../../../core/config/menu.config';
import { NgClass } from '@angular/common';

interface MenuChildView extends MenuItem {
  active: boolean;
}

interface MenuItemView extends MenuItem {
  active: boolean;
  open: boolean;
  children: MenuChildView[];
}

@Component({
  selector: 'app-sidebar-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarModule, RouterLink, PIcon, NgClass],
  template: `
    <p-sidebar-group class="block">
      <p-sidebar-group-label
        class="px-2.5 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.10em] text-slate-500"
        >{{ label() }}</p-sidebar-group-label>
      <p-sidebar-group-content>
        <p-sidebar-menu class="space-y-4">
          @for (item of viewItems(); track item.key) {
            @if (item.children.length) {
              <p-sidebar-menu-item
                class="mb-1"
                [collapsible]="true"
                [open]="item.open"
                (openChange)="setGroupOpen(item.key, $event)"
              >
                <a
                  pSidebarMenuButton
                  [isActive]="item.active"
                  class="group relative flex items-center gap-3 px-1! h-10! transition-colors duration-300 hover:bg-red-500/5! mb-0!"
                  [style.background]="item.active ? activeItemBackground : null"
                  [style.border-radius]="item.active ? '8px' : null"
                  [style.border-left]="item.active ? '2px solid red' : null"
                >
                  <div
                    class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
                    [ngClass]="item.active ? 'bg-brand/20' : 'bg-black/30'"
                  >
                    <svg
                      [pIcon]="item.icon || ''"
                      [size]="18"
                      class="relative text-slate-300 transition-all duration-300 group-hover:text-red-400 group-hover:drop-shadow-[0_0_14px_rgba(248,113,113,0.9)] group-data-[active=true]:text-red-500!"
                    ></svg>
                  </div>
                  <span
                    class="relative flex-1 text-sm text-slate-200"
                    >{{ item.label }}</span
                  >
                  <svg
                    pIcon="chevron-right"
                    class="relative ml-auto text-slate-500 transition-all duration-300 group-hover:text-red-400 group-hover:drop-shadow-[0_0_12px_rgba(248,113,113,0.7)] data-[active=true]:text-red-500 data-[active=true]:drop-shadow-[0_0_16px_rgba(239,68,68,0.9)]"
                    [class.rotate-90]="item.open"
                    [size]="16"
                  ></svg>
                </a>
                <p-sidebar-menu-sub
                  class="relative ml-6 mt-1.5 space-y-1 border-l border-red-500/20 pl-3"
                >
                  @for (child of item.children; track child.key) {
                    <p-sidebar-menu-sub-item>
                      <a
                        pSidebarMenuSubButton
                        [routerLink]="child.route"
                        [isActive]="child.active"
                        (click)="navigated.emit()"
                        class="group relative flex items-center gap-3 px-1! h-10! transition-colors duration-300 hover:bg-red-500/5! data-[active=true]:border-l-2! border-brand!"
                        [style.background]="child.active ? activeItemBackground : null"
                        [style.border-radius]="child.active ? '8px' : null"
                      >
                        <div
                          class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
                          [ngClass]="child.active ? 'bg-brand/25' : 'bg-black/30'"
                        >
                          @if (child.icon) {
                            <svg
                              [pIcon]="child.icon"
                              [size]="18"
                              class="relative text-slate-300 transition-all duration-300 group-hover:text-red-400! group-data-[active=true]:text-red-500!"
                            ></svg>
                          } @else {
                            <span
                              class="relative size-1 rounded-full bg-slate-500 transition-all duration-300 group-hover:bg-red-400 data-[active=true]:bg-red-500"
                            ></span>
                          }
                        </div>
                        <span
                          class="relative flex-1 text-sm text-slate-200"
                          >{{ child.label }}</span
                        >
                      </a>
                    </p-sidebar-menu-sub-item>
                  }
                </p-sidebar-menu-sub>
              </p-sidebar-menu-item>
            } @else {
              <p-sidebar-menu-item class="mb-1">
                <a
                  pSidebarMenuButton
                  [routerLink]="item.route"
                  [isActive]="item.active"
                  (click)="navigated.emit()"
                  class="group relative flex items-center gap-3 px-1! h-10! transition-colors duration-300 hover:bg-red-500/5! data-[active=true]:border-l-2! border-brand!"
                  [style.background]="item.active ? activeItemBackground : null"
                  [style.border-radius]="item.active ? '8px' : null"
                >
                  <div
                    class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
                    [ngClass]="item.active ? 'bg-brand/25' : 'bg-black/30'"
                  >
                    <svg
                    [pIcon]="item.icon || ''"
                    [size]="18"
                    class="relative text-slate-300 transition-all duration-300 group-hover:text-red-400! group-data-[active=true]:text-red-500!"
                  ></svg>
                  </div>
                  <span
                    class="relative flex-1 text-sm text-slate-200"
                    >{{ item.label }}</span
                  >
                </a>
              </p-sidebar-menu-item>
            }
          }
        </p-sidebar-menu>
      </p-sidebar-group-content>
    </p-sidebar-group>
  `,
})
export class SidebarMenuComponent {
  private readonly router = inject(Router);

  protected readonly activeItemBackground =
    'linear-gradient(90deg, rgba(243, 58, 32, 0.32) 0%, rgba(243, 58, 32, 0.12) 75%, rgba(5, 5, 6, 0) 100%)';

  readonly items = input.required<MenuItem[]>();
  readonly label = input('Menú');
  readonly navigated = output<void>();

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  private readonly openGroups = signal<Record<string, boolean>>({});

  protected readonly viewItems = computed<MenuItemView[]>(() => {
    const url = this.currentUrl();

    return this.items().map((item) => {
      const children = (item.children ?? []).map((child) => ({
        ...child,
        active: this.isRouteActive(child.route, url),
      }));
      const active = children.length
        ? children.some((child) => child.active)
        : this.isRouteActive(item.route, url);

      return {
        ...item,
        active,
        open: this.openGroups()[item.key] ?? active,
        children,
      };
    });
  });

  protected setGroupOpen(key: string, open: boolean): void {
    this.openGroups.update((groups) => ({ ...groups, [key]: open }));
  }

  private isRouteActive(route: string | undefined, url: string): boolean {
    if (!route) return false;

    const normalized = route.endsWith('/') ? route.slice(0, -1) : route;
    const cleanUrl = url.split('?')[0].split('#')[0];

    return cleanUrl === normalized || cleanUrl.startsWith(`${normalized}/`);
  }
}
