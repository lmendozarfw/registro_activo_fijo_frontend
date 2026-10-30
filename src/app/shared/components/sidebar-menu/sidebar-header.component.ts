import { Component } from "@angular/core";
import { SidebarMenu, SidebarMenuItem, SidebarHeader } from "primeng/sidebar";

@Component({
    selector: 'app-sidebar-header',
    template: `
    <p-sidebar-header>
        <p-sidebar-menu>
              <p-sidebar-menu-item>
                <div class="flex items-center gap-2">
                  <div class="min-w-10 w-10 h-10 rounded-lg px-1 flex items-center justify-center bg-brand/20">
                    <img src="assets/images/isotipo-sinergy-r.png" alt="Raudal Footwear"
                      class="w-full h-full object-contain" />
                  </div>
                  <p class="text-neutral-50 text-xl font-bold">Sinergy<span class="text-brand">Hub</span></p>
                </div>
              </p-sidebar-menu-item>
            </p-sidebar-menu>
    </p-sidebar-header>
    `,
    styles: [],
    imports: [SidebarMenu, SidebarMenuItem, SidebarHeader]
})
export class SidebarHeaderComponent {

}