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
                  class="group relative w-full flex items-center hover:bg-neutral-50/10 pr-1 cursor-pointer overflow-hidden transition min-w-10! h-10! pl-0! rounded-lg!"
                  (click)="userMenu.toggle($event)">
                  <div class="flex items-center gap-2">
                    <div class="w-10! h-10! min-w-10! rounded-lg flex items-center justify-center bg-brand">
                      <span>{{ name() ? name()![0] : 'U' }}</span>
                    </div>
                    <span class="relative flex items-center gap-2 truncate mr-4">
                      {{name() ?? 'Usuario'}}
                    </span>
                  </div>
                  <svg [pIcon]="'chevron-down'" class="relative ml-auto text-neutral-400 transition group-hover:text-white"></svg>
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