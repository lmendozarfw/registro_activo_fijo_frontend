import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { TemplateStore } from "../../stores/template.store";
import { ITemplate, TemplateRequest } from "../../models/template.model";
import { PermissionsGroupByModuleDto } from "../../models/permission.model";
import { Pencil, Plus, Spinner, Trash } from '@primeicons/angular';

type ModuleSelectionState = 'all' | 'some' | 'none';

@Component({
    selector: "app-templates-table",
    templateUrl: "./templates-table.component.html",
    styles: [],
    imports: [TableModule, ButtonModule, InputText, TextareaModule, CheckboxModule, TooltipModule,
        FormsModule, ReactiveFormsModule, FormDialogComponent, FormLabelComponent, EmptyStateComponent,
        Pencil, Plus, Spinner, Trash]
})
export class TemplatesTableComponent implements OnInit {
    protected readonly store = inject(TemplateStore);

    dialogVisible = false;
    dialogTitle = 'Nueva plantilla';
    deleteDialogVisible = false;
    editingTemplate: ITemplate | null = null;
    templateToDelete: ITemplate | null = null;

    selectedPermissionIds = signal<ReadonlySet<string>>(new Set<string>());

    form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        description: new FormControl('', { nonNullable: true }),
    });

    protected readonly totalPermissions = computed(() =>
        this.store.permissionGroups().reduce((total, group) => total + group.permissions.length, 0),
    );

    protected readonly selectedCount = computed(() => this.selectedPermissionIds().size);

    protected readonly allSelected = computed(() =>
        this.totalPermissions() > 0 && this.selectedCount() === this.totalPermissions(),
    );

    protected readonly someSelected = computed(() => this.selectedCount() > 0);

    ngOnInit(): void {
        this.store.load();
    }

    openCreate(): void {
        this.editingTemplate = null;
        this.dialogTitle = 'Nueva plantilla';
        this.selectedPermissionIds.set(new Set<string>());
        this.form.reset({ name: '', description: '' });
        this.store.loadPermissionGroups();
        this.dialogVisible = true;
    }

    openEdit(template: ITemplate): void {
        this.editingTemplate = template;
        this.dialogTitle = 'Editar plantilla';
        this.selectedPermissionIds.set(new Set(template.permissions.map((permission) => permission.id)));
        this.form.reset({
            name: template.name,
            description: template.description ?? '',
        });
        this.store.loadPermissionGroups();
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const payload: TemplateRequest = {
            name: value.name.trim(),
            description: value.description.trim() || null,
            permissionIds: [...this.selectedPermissionIds()],
        };

        const success = this.editingTemplate
            ? await this.store.update(this.editingTemplate.id, payload)
            : await this.store.create(payload);

        if (success) {
            this.dialogVisible = false;
        }
    }

    openDelete(template: ITemplate): void {
        this.templateToDelete = template;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.templateToDelete) return;

        const success = await this.store.remove(this.templateToDelete.id);

        if (success) {
            this.templateToDelete = null;
            this.deleteDialogVisible = false;
        }
    }

    isPermissionSelected(permissionId: string): boolean {
        return this.selectedPermissionIds().has(permissionId);
    }

    togglePermission(permissionId: string, checked: boolean): void {
        this.selectedPermissionIds.update((current) => {
            const next = new Set(current);

            if (checked) {
                next.add(permissionId);
            } else {
                next.delete(permissionId);
            }

            return next;
        });
    }

    moduleState(module: PermissionsGroupByModuleDto): ModuleSelectionState {
        const selected = this.selectedPermissionIds();
        const total = module.permissions.length;

        if (total === 0) return 'none';

        const count = module.permissions.filter((permission) => selected.has(permission.id)).length;

        if (count === 0) return 'none';
        if (count === total) return 'all';
        return 'some';
    }

    moduleSelectedCount(module: PermissionsGroupByModuleDto): number {
        const selected = this.selectedPermissionIds();
        return module.permissions.filter((permission) => selected.has(permission.id)).length;
    }

    toggleModule(module: PermissionsGroupByModuleDto, checked: boolean): void {
        this.selectedPermissionIds.update((current) => {
            const next = new Set(current);

            for (const permission of module.permissions) {
                if (checked) {
                    next.add(permission.id);
                } else {
                    next.delete(permission.id);
                }
            }

            return next;
        });
    }

    toggleAll(checked: boolean): void {
        if (!checked) {
            this.selectedPermissionIds.set(new Set<string>());
            return;
        }

        const all = this.store.permissionGroups().flatMap((group) =>
            group.permissions.map((permission) => permission.id),
        );

        this.selectedPermissionIds.set(new Set(all));
    }
}
