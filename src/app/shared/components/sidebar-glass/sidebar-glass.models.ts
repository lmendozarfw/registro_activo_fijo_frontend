export interface SidebarUser {
  name: string;
  greeting?: string;
  avatarUrl?: string;
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  exact?: boolean;
  showSettingsIcon?: boolean;
  hasNotificationDot?: boolean;
  mailAvatars?: string[];
  mailBadgeCount?: number;
  showAddButton?: boolean;
  disabled?: boolean;
}

export interface SidebarServiceItem {
  id: string;
  label: string;
  icon?: string;
  logo?: string;
  isAdd?: boolean;
}

export interface SidebarSettingItem {
  id: string;
  icon: string;
  badge?: number | string;
}

export interface SidebarConfig {
  menuSectionLabel?: string;
  menuCount?: number;
  serviceSectionLabel?: string;
  settingsSectionLabel?: string;
  createTaskLabel?: string;
  inviteLinkLabel?: string;
}
