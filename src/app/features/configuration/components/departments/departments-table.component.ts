import { Component, OnInit, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../../shared/components/form-label/form-label.component";
import { DepartmentStore } from "../../stores/department.store";
import { Department } from "../../models/department.model";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { Pencil, Plus, Trash } from '@primeicons/angular';

@Component({
    selector: "app-departments-table",
    templateUrl: "./departments-table.component.html",
    styles: [],
    imports: [TableModule, ButtonModule, InputText, TooltipModule, ReactiveFormsModule,
        FormDialogComponent, FormLabelComponent, EmptyStateComponent, Pencil, Plus, Trash]
})
export class DepartmentsTableComponent implements OnInit {
    protected readonly store = inject(DepartmentStore);

    dialogVisible = false;
    dialogTitle = 'Nuevo departamento';
    deleteDialogVisible = false;
    editingDepartment: Department | null = null;
    departmentToDelete: Department | null = null;

    form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });

    ngOnInit(): void {
        this.store.load();
    }

    openCreate(): void {
        this.editingDepartment = null;
        this.dialogTitle = 'Nuevo departamento';
        this.form.reset({ name: '' });
        this.dialogVisible = true;
    }

    openEdit(department: Department): void {
        this.editingDepartment = department;
        this.dialogTitle = 'Editar departamento';
        this.form.reset({ name: department.name });
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload = { name: this.form.controls.name.value.trim() };

        const success = this.editingDepartment
            ? await this.store.update(this.editingDepartment.id, payload)
            : await this.store.create(payload);

        if (success) {
            this.dialogVisible = false;
        }
    }

    openDelete(department: Department): void {
        this.departmentToDelete = department;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.departmentToDelete) return;

        const success = await this.store.remove(this.departmentToDelete.id);

        if (success) {
            this.departmentToDelete = null;
            this.deleteDialogVisible = false;
        }
    }

    protected formatDate(value?: string | null): string {
        if (!value) return '—';

        const date = new Date(value);

        return isNaN(date.getTime()) ? '—' : date.toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    }
}
