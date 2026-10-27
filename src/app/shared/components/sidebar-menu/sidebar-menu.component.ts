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
      <p-sidebar-group-label class="px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">{{ label() }}</p-sidebar-group-label>
      <p-sidebar-group-content>
        <p-sidebar-menu>
          @for (item of viewItems(); track item.key) {
            @if (item.children.length) {
              <p-sidebar-menu-item
                [collapsible]="true"
                [open]="item.open"
                (openChange)="setGroupOpen(item.key, $event)"
              >
                <button type="button" pSidebarMenuButton [isActive]="item.active" class="group">
                  <span class="flex size-7 items-center justify-center rounded-lg bg-neutral-50 text-neutral-500 transition group-hover:bg-brand-50 group-hover:text-brand-700">
                    <svg [pIcon]="item.icon || ''" [size]="16"></svg>
                  </span>
                  <span class="font-medium">{{ item.label }}</span>
                  <svg
                    pIcon="chevron-right"
                    class="ml-auto transition-transform duration-200"
                    [class.rotate-90]="item.open"
                  ></svg>
                </button>
                <p-sidebar-menu-sub>
                  @for (child of item.children; track child.key) {
                    <p-sidebar-menu-sub-item>
                      <a
                        pSidebarMenuSubButton
                        [routerLink]="child.route"
                        [isActive]="child.active"
                        (click)="navigated.emit()"
                        class="group"
                      >
                        @if (child.icon) {
                          <span class="flex size-6 items-center justify-center rounded-md text-neutral-400 transition group-hover:text-brand-700">
                            <svg [pIcon]="child.icon" [size]="15"></svg>
                          </span>
                        } @else {
                          <span class="size-1.5 rounded-full bg-neutral-300 transition group-hover:bg-brand-500"></span>
                        }
                        <span class="text-sm">{{ child.label }}</span>
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
                  class="group"
                >
                  <span class="flex size-7 items-center justify-center rounded-lg bg-neutral-50 text-neutral-500 transition group-hover:bg-brand-50 group-hover:text-brand-700">
                    <svg [pIcon]="item.icon || ''" [size]="16"></svg>
                  </span>
                  <span class="font-medium">{{ item.label }}</span>
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
