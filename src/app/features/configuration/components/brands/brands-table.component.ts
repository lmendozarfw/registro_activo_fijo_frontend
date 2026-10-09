import { Component, OnInit, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { BrandStore } from "../../stores/brand.store";
import { Brand, BrandRequest } from "../../models/brand.model";
import { RESOURCE_TYPE_LABELS, RESOURCE_TYPE_OPTIONS, ResourceTypeEnum } from "../../models/resource-type.model";
import { Pencil, Plus, Trash } from '@primeicons/angular';

@Component({
    selector: "app-brands-table",
    templateUrl: "./brands-table.component.html",
    styles: [],
    imports: [TableModule, ButtonModule, InputText, SelectModule, TagModule, TooltipModule, ReactiveFormsModule,
        FormDialogComponent, FormLabelComponent, EmptyStateComponent, Pencil, Plus, Trash]
})
export class BrandsTableComponent implements OnInit {
    protected readonly store = inject(BrandStore);
    protected readonly resourceTypeLabels = RESOURCE_TYPE_LABELS;
    protected readonly resourceTypeOptions = RESOURCE_TYPE_OPTIONS;

    dialogVisible = false;
    dialogTitle = 'Nueva marca';
    deleteDialogVisible = false;
    editingBrand: Brand | null = null;
    brandToDelete: Brand | null = null;

    form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        type: new FormControl<ResourceTypeEnum | null>(null, { validators: Validators.required }),
    });

    ngOnInit(): void {
        this.store.load();
    }

    openCreate(): void {
        this.editingBrand = null;
        this.dialogTitle = 'Nueva marca';
        this.form.reset({ name: '', type: null });
        this.dialogVisible = true;
    }

    openEdit(brand: Brand): void {
        this.editingBrand = brand;
        this.dialogTitle = 'Editar marca';
        this.form.reset({ name: brand.name, type: brand.type });
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const type = this.form.controls.type.value;
        if (!type) return;

        const payload: BrandRequest = { name: this.form.controls.name.value.trim(), type };

        const success = this.editingBrand
            ? await this.store.update(this.editingBrand.id, payload)
            : await this.store.create(payload);

        if (success) {
            this.dialogVisible = false;
        }
    }

    openDelete(brand: Brand): void {
        this.brandToDelete = brand;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.brandToDelete) return;

        const success = await this.store.remove(this.brandToDelete.id);

        if (success) {
            this.brandToDelete = null;
            this.deleteDialogVisible = false;
        }
    }

    protected getTypeLabel(type: ResourceTypeEnum | string): string {
        const key = type as ResourceTypeEnum;
        return this.resourceTypeLabels[key] || String(type);
    }

    protected formatDate(value?: string | null): string {
        if (!value) return '—';

        const date = new Date(value);

        return isNaN(date.getTime()) ? '—' : date.toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    }
}