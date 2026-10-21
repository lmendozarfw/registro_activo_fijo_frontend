import { Component, OnInit, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { SearchInputComponent } from "../../../../shared/components/search-input/search-input.component";
import { PermissionStore } from "../../stores/permission.store";

@Component({
    selector: "app-permissions-table",
    templateUrl: "./permissions-table.component.html",
    styles: [],
    imports: [TableModule, EmptyStateComponent, SearchInputComponent]
})
export class PermissionsTableComponent implements OnInit {
    protected readonly store = inject(PermissionStore);

    ngOnInit(): void {
        this.store.load();
    }

    protected async onSearch(search?: string): Promise<void> {
        await this.store.load(search);
    }
}
