import { Directive, inject, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { PermissionsService } from "../services/permissions.service";

@Directive({
    selector: '[hasPermission]',
    standalone: true
})
export class HasPermissionDirective {
    private readonly permissionService = inject(PermissionsService);
    private readonly templateRef = inject(TemplateRef);
    private readonly viewContainer = inject(ViewContainerRef);

    @Input()
    hasPermission(permission: string) {
        this.viewContainer.clear();
        if (this.permissionService.hasPermission(permission)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }

}