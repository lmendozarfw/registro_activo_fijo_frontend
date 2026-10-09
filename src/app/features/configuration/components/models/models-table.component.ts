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
import { ModelStore } from "../../stores/model.store";
import { BrandStore } from "../../stores/brand.store";
import { Model, ModelRequest } from "../../models/model.model";
import { RESOURCE_TYPE_LABELS, RESOURCE_TYPE_OPTIONS, ResourceTypeEnum } from "../../models/resource-type.model";
import { Pencil, Plus, Trash } from '@primeicons/angular';

@Component({
    selector: "app-models-table",
    templateUrl: "./models-table.component.html",
    styles: [],
    imports: [TableModule, ButtonModule, InputText, SelectModule, TagModule, TooltipModule, ReactiveFormsModule,
        FormDialogComponent, FormLabelComponent, EmptyStateComponent, Pencil, Plus, Trash]
})
export class ModelsTableComponent implements OnInit {
    protected readonly store = inject(ModelStore);
    protected readonly brandStore = inject(BrandStore);
    protected readonly resourceTypeLabels = RESOURCE_TYPE_LABELS;
    protected readonly resourceTypeOptions = RESOURCE_TYPE_OPTIONS;

    dialogVisible = false;
    dialogTitle = 'Nuevo modelo';
    deleteDialogVisible = false;
    editingModel: Model | null = null;
    modelToDelete: Model | null = null;

    form = new FormGroup({
        brandId: new FormControl('', { nonNullable: true, validators: Validators.required }),
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        type: new FormControl<ResourceTypeEnum | null>(null, { validators: Validators.required }),
    });

    ngOnInit(): void {
        this.store.load();
        this.brandStore.load();
    }

    openCreate(): void {
        this.editingModel = null;
        this.dialogTitle = 'Nuevo modelo';
        this.form.reset({ brandId: '', name: '', type: null });
        this.dialogVisible = true;
    }

    openEdit(model: Model): void {
        this.editingModel = model;
        this.dialogTitle = 'Editar modelo';
        this.form.reset({ brandId: model.brandId, name: model.name, type: model.type });
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const type = this.form.controls.type.value;
        if (!type) return;

        const payload: ModelRequest = {
            brandId: this.form.controls.brandId.value,
            name: this.form.controls.name.value.trim(),
            type,
        };

        const success = this.editingModel
            ? await this.store.update(this.editingModel.id, payload)
            : await this.store.create(payload);

        if (success) {
            this.dialogVisible = false;
        }
    }

    openDelete(model: Model): void {
        this.modelToDelete = model;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.modelToDelete) return;

        const success = await this.store.remove(this.modelToDelete.id);

        if (success) {
            this.modelToDelete = null;
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