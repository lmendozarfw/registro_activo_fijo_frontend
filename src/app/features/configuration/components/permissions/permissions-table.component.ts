import { Component, OnInit, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { PermissionStore } from "../../stores/permission.store";

@Component({
    selector: "app-permissions-table",
    templateUrl: "./permissions-table.component.html",
    styles: [],
    imports: [TableModule, EmptyStateComponent]
})
export class PermissionsTableComponent implements OnInit {
    protected readonly store = inject(PermissionStore);

    ngOnInit(): void {
        this.store.load();
    }
}
