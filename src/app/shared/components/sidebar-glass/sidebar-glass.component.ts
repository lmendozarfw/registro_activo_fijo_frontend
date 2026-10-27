import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ButtonDirective } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import {
  SidebarConfig,
  SidebarMenuItem,
  SidebarServiceItem,
  SidebarSettingItem,
  SidebarUser,
} from './sidebar-glass.models';

@Component({
  selector: 'app-sidebar-glass',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AvatarModule,
    BadgeModule,
    OverlayBadgeModule,
    ButtonDirective,
    DividerModule,
    TooltipModule,
    SelectButtonModule,
  ],
  templateUrl: './sidebar-glass.component.html',
  styleUrl: './sidebar-glass.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarGlassComponent {
  readonly user = input.required<SidebarUser>();
  readonly menuItems = input.required<SidebarMenuItem[]>();
  readonly services = input.required<SidebarServiceItem[]>();
  readonly settings = input.required<SidebarSettingItem[]>();
  readonly config = input<SidebarConfig>({});

  readonly collapsed = model<boolean>(false);

  readonly createTask = output<void>();
  readonly inviteLink = output<void>();

  readonly settingsSelected = signal<string | undefined>(undefined);

  readonly showWindowDots = input<boolean>(true);
  readonly isMobileView = signal<boolean>(false);

  readonly displayUser = computed(() => this.user());
  readonly displayMenuItems = computed(() => this.menuItems());
  readonly displayServices = computed(() => this.services());
  readonly displaySettings = computed(() => this.settings());

  readonly menuLabel = computed(
    () => this.config().menuSectionLabel ?? 'Menu',
  );
  readonly menuCount = computed(() => this.config().menuCount ?? this.menuItems().length);
  readonly serviceLabel = computed(
    () => this.config().serviceSectionLabel ?? 'Service',
  );
  readonly settingsLabel = computed(
    () => this.config().settingsSectionLabel ?? 'Settings',
  );
  readonly createTaskLabel = computed(
    () => this.config().createTaskLabel ?? 'Create new task',
  );
  readonly inviteLinkLabel = computed(
    () => this.config().inviteLinkLabel ?? 'invite link',
  );

  readonly collapsedDisplaySettings = computed(() => {
    const items = this.displaySettings();
    return items.slice(0, 2);
  });
  readonly hasMoreSettings = computed(() => this.displaySettings().length > 2);

  constructor() {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(max-width: 768px)');
      this.isMobileView.set(mql.matches);
      if (mql.matches) {
        this.collapsed.set(true);
      }
      mql.addEventListener('change', (e) => {
        this.isMobileView.set(e.matches);
        if (e.matches) {
          this.collapsed.set(true);
        }
      });
    }
  }

  toggleCollapsed(): void {
    this.collapsed.update((v) => !v);
  }

  onCreateTask(): void {
    this.createTask.emit();
  }

  onInviteLink(): void {
    this.inviteLink.emit();
  }

  selectSetting(id: string): void {
    this.settingsSelected.set(id);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }
}
