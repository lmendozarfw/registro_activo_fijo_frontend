import { Component, OnInit, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { SearchInputComponent } from "../../../../shared/components/search-input/search-input.component";
import { ModuleStore } from "../../stores/module.store";

@Component({
    selector: "app-modules-table",
    templateUrl: "./modules-table.component.html",
    styles: [],
    imports: [TableModule, EmptyStateComponent, SearchInputComponent]
})
export class ModulesTableComponent implements OnInit {
    protected readonly store = inject(ModuleStore);

    ngOnInit(): void {
        this.store.load();
    }

    protected async onSearch(search?: string): Promise<void> {
        await this.store.load(search);
    }
}
