import { Component, input } from "@angular/core";
import { SidebarMenu, SidebarMenuItem, SidebarFooter } from "primeng/sidebar";
import { Menu } from "primeng/menu";
import { PIcon } from '@primeicons/angular/p-icon';
import { MenuItem } from "primeng/api";

@Component({
  selector: 'app-sidebar-footer',
  template: `
    <p-sidebar-footer>
        <p-sidebar-menu>
              <p-sidebar-menu-item>
                <button pSidebarMenuButton
                  class="group relative flex w-full min-w-10! h-10! items-center overflow-hidden rounded-lg! pl-0! pr-1 transition cursor-pointer hover:bg-neutral-50/10"
                  (click)="userMenu.toggle($event)">

                  <div class="flex min-w-0 flex-1 items-center gap-2">
                    <div class="flex h-10! w-10! min-w-10! shrink-0 items-center justify-center rounded-lg bg-brand">
                      <span>{{ name() ? name()![0] : 'U' }}</span>
                    </div>

                    <span class="min-w-0 flex-1 truncate">
                      {{ name() ?? 'Usuario' }}
                    </span>
                  </div>

                  <svg
                    [pIcon]="'chevron-down'"
                    class="ml-2 shrink-0 text-neutral-400 transition group-hover:text-white">
                  </svg>
                </button>
                <p-menu #userMenu [model]="userItems()" [popup]="true" appendTo="body">
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
    `,
  styles: [],
  imports: [SidebarMenu, SidebarMenuItem, Menu, PIcon, SidebarFooter]
})
export class SidebarFooterComponent {
  name = input<string>();
  userItems = input<MenuItem[]>();
}