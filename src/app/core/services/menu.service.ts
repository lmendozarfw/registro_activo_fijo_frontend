import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  route?: string;
  visible?: boolean;
  disabled?: boolean;
  allowedRoles?: string | string[] | null | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly router = inject(Router);

  private readonly allItems = signal<MenuItem[]>([
    {
      key: 'kpis',
      label: 'Indicadores',
      icon: 'chart-bar',
      route: '/app/kpis',
      allowedRoles: [],
    },
    {
      key: 'employees',
      label: 'Empleados',
      icon: 'users',
      route: '/app/employees',
      allowedRoles: [],
    },
    {
      key: 'phones',
      label: 'Celulares',
      icon: 'mobile',
      route: '/app/phones',
      allowedRoles: [],
    },
    {
      key: 'assignments',
      label: 'Asignaciones',
      icon: 'list-check',
      route: '/app/assignments',
      allowedRoles: [],
    },
    {
      key: 'assets',
      label: 'Activo fijo',
      icon: 'briefcase',
      route: '/app/assets',
      allowedRoles: [],
    },
    {
      key: 'credentials',
      label: 'Credenciales',
      icon: 'key',
      route: '/app/credentials',
      allowedRoles: [],
    },
    {
      key: 'users',
      label: 'Usuarios',
      icon: 'user',
      route: '/app/users',
      allowedRoles: [],
    },
    {
      key: 'my-credentials',
      label: 'Mis credenciales',
      icon: 'id-card',
      route: '/app/my-credentials',
      allowedRoles: [],
    },
    {
      key: 'reports',
      label: 'Reportes',
      icon: 'file-pdf',
      route: '/app/reports',
      allowedRoles: [],
    },
    {
      key: 'settings',
      label: 'Configuración',
      icon: 'cog',
      route: '/app/settings',
      allowedRoles: [],
    },
  ]);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly items = computed<MenuItem[]>(() =>
    this.allItems().filter((item) => item.visible !== false),
  );

  isActive(item: MenuItem): boolean {
    if (!item.route) return false;

    const url = this.currentUrl();
    const route = item.route.endsWith('/') ? item.route.slice(0, -1) : item.route;

    return url === route || url.startsWith(`${route}/`);
  }

  setItems(items: MenuItem[]): void {
    this.allItems.set(items);
  }

  addItem(item: MenuItem): void {
    this.allItems.update((items) => [...items, item]);
  }

  removeItem(key: string): void {
    this.allItems.update((items) => items.filter((i) => i.key !== key));
  }

  updateItem(key: string, partial: Partial<MenuItem>): void {
    this.allItems.update((items) => items.map((i) => (i.key === key ? { ...i, ...partial } : i)));
  }

  setVisible(key: string, visible: boolean): void {
    this.updateItem(key, { visible });
  }

  setDisabled(key: string, disabled: boolean): void {
    this.updateItem(key, { disabled });
  }
}
