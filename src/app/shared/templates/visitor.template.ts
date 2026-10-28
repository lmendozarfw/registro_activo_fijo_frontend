import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChevronDown, Sidebar } from '@primeicons/angular';
import { PIcon } from '@primeicons/angular/p-icon';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { VISITOR_MENU } from '../../core/config/menu.config';
import { AuthStore } from '../../features/auth/stores/auth.store';
import { HeaderTitleComponent } from '../components/header-title/header-title.component';
import { SidebarMenuComponent } from '../components/sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'visitor-template',
  templateUrl: './visitor.template.html',
  imports: [
    SidebarModule,
    ButtonModule,
    PIcon,
    Sidebar,
    ChevronDown,
    Menu,
    MenuModule,
    RouterOutlet,
    HeaderTitleComponent,
    SidebarMenuComponent,
  ],
})
export class VisitorTemplate {
  protected readonly isMobile = signal(false);
  protected readonly mobileNavOpen = signal(false);
  protected readonly sidebarOpen = computed(
    () => !this.isMobile() || this.mobileNavOpen(),
  );

  protected readonly menuItems = VISITOR_MENU;
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly userItems: MenuItem[] = [
    {
      label: 'Opciones',
      items: [
        {
          label: 'Cerrar sesión',
          icon: 'sign-out',
          command: () => this.logout(),
        },
      ],
    },
  ];

  constructor() {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    this.isMobile.set(mediaQuery.matches);
    mediaQuery.addEventListener('change', (event) => this.isMobile.set(event.matches));
  }

  protected closeNav(): void {
    if (this.isMobile()) this.mobileNavOpen.set(false);
  }

  private logout(): void {
    this.authStore.logout();
    void this.router.navigate(['/']);
  }
}
