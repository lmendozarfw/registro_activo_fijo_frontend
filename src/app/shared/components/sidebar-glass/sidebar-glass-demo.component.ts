import { Component, signal } from '@angular/core';
import { SidebarGlassComponent } from './sidebar-glass.component';
import {
  SidebarMenuItem,
  SidebarServiceItem,
  SidebarSettingItem,
  SidebarUser,
} from './sidebar-glass.models';

@Component({
  selector: 'app-sidebar-glass-demo',
  standalone: true,
  imports: [SidebarGlassComponent],
  template: `
    <div style="height: 100dvh; padding: 24px; background: radial-gradient(120% 120% at 20% 10%, #2a1f3d 0%, #101018 55%, #050509 100%);">
      <app-sidebar-glass
        [user]="user"
        [menuItems]="menuItems"
        [services]="services"
        [settings]="settings"
        [(collapsed)]="collapsed"
        (createTask)="onCreateTask()"
        (inviteLink)="onInviteLink()"
      />
    </div>
  `,
})
export class SidebarGlassDemoComponent {
  readonly user: SidebarUser = {
    name: 'Vitaliy D.',
    greeting: 'Good Day',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  };

  readonly collapsed = signal(false);

  readonly menuItems: SidebarMenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'pi-th-large',
      route: '/dashboard',
      showSettingsIcon: true,
    },
    {
      id: 'task',
      label: 'My project task',
      icon: 'pi-folder',
      route: '/tasks',
      exact: true,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: 'pi-calendar',
      route: '/calendar',
      showAddButton: true,
    },
    {
      id: 'mail',
      label: 'Mail',
      icon: 'pi-envelope',
      route: '/mail',
      mailAvatars: [
        'https://i.pravatar.cc/150?img=5',
        'https://i.pravatar.cc/150?img=6',
        'https://i.pravatar.cc/150?img=7',
      ],
      mailBadgeCount: 4,
    },
    {
      id: 'notification',
      label: 'Notification',
      icon: 'pi-bell',
      route: '/notifications',
      hasNotificationDot: true,
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: 'pi-shopping-bag',
      route: '/sales',
    },
  ];

  readonly services: SidebarServiceItem[] = [
    { id: 'jira', label: 'Jira software', icon: 'pi-box' },
    { id: 'slack', label: 'Slack', icon: 'pi-comments' },
    { id: 'intercom', label: 'Intercom', icon: 'pi-comment' },
    { id: 'add', label: 'Add new plugin', isAdd: true },
  ];

  readonly settings: SidebarSettingItem[] = [
    { id: 'doc', icon: 'pi-file' },
    { id: 'arrows', icon: 'pi-sort-alt' },
    { id: 'user', icon: 'pi-user', badge: 6 },
    { id: 'chart', icon: 'pi-chart-pie' },
    { id: 'sun', icon: 'pi-sun' },
    { id: 'bulb', icon: 'pi-lightbulb' },
  ];

  onCreateTask(): void {
    console.log('createTask clicked');
  }

  onInviteLink(): void {
    console.log('inviteLink clicked');
  }
}
