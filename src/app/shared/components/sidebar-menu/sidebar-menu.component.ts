import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { SidebarModule } from 'primeng/sidebar';
import { filter, map } from 'rxjs';
import { MenuItem } from '../../../core/config/menu.config';

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
  imports: [SidebarModule, RouterLink, PIcon],
  template: `
    <p-sidebar-group>
      <p-sidebar-group-label class="px-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-neutral-500">{{ label() }}</p-sidebar-group-label>
      <p-sidebar-group-content>
        <p-sidebar-menu class="space-y-1.5">
          @for (item of viewItems(); track item.key) {
            @if (item.children.length) {
              <p-sidebar-menu-item
                [collapsible]="true"
                [open]="item.open"
                (openChange)="setGroupOpen(item.key, $event)"
              >
                <button
                  type="button"
                  pSidebarMenuButton
                  [isActive]="item.active"
                  class="group relative overflow-hidden rounded-2xl px-2 py-2 transition-all duration-300 hover:translate-x-0.5 hover:bg-white/6 data-[active=true]:translate-x-0.5 data-[active=true]:bg-gradient-to-r data-[active=true]:from-brand-500/40 data-[active=true]:via-brand-600/25 data-[active=true]:to-transparent data-[active=true]:text-white data-[active=true]:shadow-[inset_4px_0_0_0_rgb(243,58,32),0_18px_60px_-30px_rgba(243,58,32,0.9)]"
                >
                  <span class="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(80%_80%_at_0%_50%,rgba(243,58,32,0.16)_0%,transparent_70%)]"></span>
                  <span class="relative flex size-8 items-center justify-center rounded-xl bg-white/6 text-neutral-400 transition group-hover:text-white group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] data-[active=true]:bg-gradient-to-br data-[active=true]:from-brand-500 data-[active=true]:to-rose-600 data-[active=true]:text-white data-[active=true]:shadow-[0_10px_40px_-12px_rgba(243,58,32,0.95)]">
                    <svg [pIcon]="item.icon || ''" [size]="17"></svg>
                  </span>
                  <span class="relative font-medium text-neutral-300 transition group-hover:text-white data-[active=true]:text-white">{{ item.label }}</span>
                  <svg
                    pIcon="chevron-right"
                    class="relative ml-auto text-neutral-500 transition-transform duration-300 group-hover:text-white data-[active=true]:text-brand-200"
                    [class.rotate-90]="item.open"
                  ></svg>
                </button>
                <p-sidebar-menu-sub class="ml-3 mt-1.5 border-l border-white/8 pl-3">
                  @for (child of item.children; track child.key) {
                    <p-sidebar-menu-sub-item>
                      <a
                        pSidebarMenuSubButton
                        [routerLink]="child.route"
                        [isActive]="child.active"
                        (click)="navigated.emit()"
                        class="group relative rounded-xl px-2 py-1.5 transition-all duration-200 hover:translate-x-0.5 hover:bg-white/6 data-[active=true]:translate-x-0.5 data-[active=true]:bg-gradient-to-r data-[active=true]:from-brand-500/30 data-[active=true]:to-transparent data-[active=true]:text-white data-[active=true]:shadow-[inset_3px_0_0_0_rgb(243,58,32)]"
                      >
                        @if (child.icon) {
                          <span class="flex size-6 items-center justify-center rounded-lg text-neutral-500 transition group-hover:text-brand-200 data-[active=true]:text-brand-200">
                            <svg [pIcon]="child.icon" [size]="15"></svg>
                          </span>
                        } @else {
                          <span class="size-1.5 rounded-full bg-neutral-600 transition group-hover:bg-brand-400 data-[active=true]:bg-brand-500 data-[active=true]:shadow-[0_0_0_4px_rgba(243,58,32,0.18)]"></span>
                        }
                        <span class="text-sm text-neutral-400 transition group-hover:text-white data-[active=true]:text-white">{{ child.label }}</span>
                      </a>
                    </p-sidebar-menu-sub-item>
                  }
                </p-sidebar-menu-sub>
              </p-sidebar-menu-item>
            } @else {
              <p-sidebar-menu-item>
                <a
                  pSidebarMenuButton
                  [routerLink]="item.route"
                  [isActive]="item.active"
                  (click)="navigated.emit()"
                  class="group relative overflow-hidden rounded-2xl px-2 py-2 transition-all duration-300 hover:translate-x-0.5 hover:bg-white/6 data-[active=true]:translate-x-0.5 data-[active=true]:bg-gradient-to-r data-[active=true]:from-brand-500/40 data-[active=true]:via-brand-600/25 data-[active=true]:to-transparent data-[active=true]:text-white data-[active=true]:shadow-[inset_4px_0_0_0_rgb(243,58,32),0_18px_60px_-30px_rgba(243,58,32,0.9)]"
                >
                  <span class="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(80%_80%_at_0%_50%,rgba(243,58,32,0.16)_0%,transparent_70%)]"></span>
                  <span class="relative flex size-8 items-center justify-center rounded-xl bg-white/6 text-neutral-400 transition group-hover:text-white group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] data-[active=true]:bg-gradient-to-br data-[active=true]:from-brand-500 data-[active=true]:to-rose-600 data-[active=true]:text-white data-[active=true]:shadow-[0_10px_40px_-12px_rgba(243,58,32,0.95)]">
                    <svg [pIcon]="item.icon || ''" [size]="17"></svg>
                  </span>
                  <span class="relative font-medium text-neutral-300 transition group-hover:text-white data-[active=true]:text-white">{{ item.label }}</span>
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
