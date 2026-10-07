import { Component, OnInit, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../../shared/components/form-label/form-label.component";
import { SystemStore } from "../../stores/system.store";
import { System } from "../../models/system.model";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { Pencil, Plus, Refresh, Trash } from '@primeicons/angular';

const CODE_PATTERN = /^[A-Za-z0-9_-]+$/;

@Component({
    selector: "app-systems-table",
    templateUrl: "./systems-table.component.html",
    styles: [],
    imports: [TableModule, ButtonModule, InputText, TextareaModule, TooltipModule, ReactiveFormsModule,
    FormDialogComponent, FormLabelComponent, EmptyStateComponent, Pencil, Plus, Refresh, Trash]
})
export class SystemsTableComponent implements OnInit {
    protected readonly store = inject(SystemStore);

    dialogVisible = false;
    dialogTitle = 'Nuevo sistema';
    deleteDialogVisible = false;
    autoCode = true;
    editingSystem: System | null = null;
    systemToDelete: System | null = null;

    form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        code: new FormControl({disabled: this.autoCode, value: ''}, { nonNullable: true, validators: [Validators.required, Validators.pattern(CODE_PATTERN)] }),
        description: new FormControl('', { nonNullable: true }),
    });

    ngOnInit(): void {
        this.store.load();

        this.form.controls.name.valueChanges.subscribe(() => this.syncAutoCode());
        this.form.controls.code.valueChanges.subscribe((value) => {
            const normalized = this.normalizeCode(value);
            if (value !== normalized) {
                this.form.controls.code.setValue(normalized, { emitEvent: false });
            }
        });
    }

    protected toggleCodeMode(): void {
        this.autoCode = !this.autoCode;
        if (this.autoCode) {
            this.syncAutoCode();
        }
    }

    openCreate(): void {
        this.editingSystem = null;
        this.dialogTitle = 'Nuevo sistema';
        this.autoCode = true;
        this.form.reset({ name: '', code: '', description: '' });
        this.syncAutoCode();
        this.dialogVisible = true;
    }

    openEdit(system: System): void {
        this.editingSystem = system;
        this.dialogTitle = 'Editar sistema';
        this.autoCode = false;
        this.form.reset({
            name: system.name,
            code: system.code,
            description: system.description ?? '',
        });
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { name, code, description } = this.form.getRawValue();
        const payload = {
            name: name.trim(),
            code: code.trim().toUpperCase(),
            description: description.trim() || null,
        };

        const success = this.editingSystem
            ? await this.store.update(this.editingSystem.id, payload)
            : await this.store.create(payload);

        if (success) {
            this.dialogVisible = false;
        }
    }

    openDelete(system: System): void {
        this.systemToDelete = system;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.systemToDelete) return;

        const success = await this.store.remove(this.systemToDelete.id);

        if (success) {
            this.systemToDelete = null;
            this.deleteDialogVisible = false;
        }
    }

    private syncAutoCode(): void {
        if (!this.autoCode) return;

        this.form.controls.code.setValue(this.slugify(this.form.controls.name.value), { emitEvent: false });
    }

    private slugify(value: string): string {
        return this.normalizeCode(value)
            .replace(/[^A-Z0-9_-]+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^[-_]+|[-_]+$/g, '');
    }

    private normalizeCode(value: string): string {
        return (value ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase();
    }
}
