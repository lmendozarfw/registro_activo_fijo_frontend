import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputPassword } from 'primeng/inputpassword';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { PageHeaderService } from "../../../core/services/page-header.service";
import { UserStore } from "../stores/user.store";
import { User, CreateUserRequest, UpdateUserRequest } from "../models/user.model";
import { PermissionsGroupByModuleDto } from "../../configuration/models/permission.model";
import { ChevronDown, Pencil, Plus, Trash } from '@primeicons/angular';

type ModuleSelectionState = 'all' | 'some' | 'none';

@Component({
    selector: 'app-users-page',
    templateUrl: './users.page.html',
    styles: [],
    imports: [TableModule, ButtonModule, InputText, InputPassword, SelectModule, CheckboxModule, TooltipModule,
        FormsModule, ReactiveFormsModule, FormDialogComponent, FormLabelComponent, EmptyStateComponent,
        ChevronDown, Pencil, Plus, Trash],
})
export class UsersPage implements OnInit {
    protected readonly store = inject(UserStore);
    private readonly pageHeader = inject(PageHeaderService);

    dialogVisible = false;
    dialogTitle = 'Nuevo usuario';
    deleteDialogVisible = false;
    editingUser: User | null = null;
    userToDelete: User | null = null;

    permissionsExpanded = false;
    selectedPermissionIds = signal<ReadonlySet<string>>(new Set<string>());
    templateLoading = signal(false);

    form = new FormGroup({
        username: new FormControl('', { nonNullable: true, validators: Validators.required }),
        password: new FormControl('', { nonNullable: true }),
        employeeId: new FormControl('', { nonNullable: true }),
        templateId: new FormControl('', { nonNullable: true }),
    });

    protected readonly employeeOptions = computed(() =>
        this.store.availableEmployees().map((employee) => ({
            id: employee.id,
            label: `${employee.firstName} ${employee.paternalSurname} ${employee.maternalSurname} (No. ${employee.employeeNumber})`,
        })),
    );

    protected readonly totalPermissions = computed(() =>
        this.store.permissionGroups().reduce((total, group) => total + group.permissions.length, 0),
    );

    protected readonly selectedCount = computed(() => this.selectedPermissionIds().size);

    ngOnInit(): void {
        this.pageHeader.setTitle('Usuarios');
        this.store.load();
    }

    openCreate(): void {
        this.editingUser = null;
        this.dialogTitle = 'Nuevo usuario';
        this.permissionsExpanded = false;
        this.selectedPermissionIds.set(new Set<string>());
        this.form.reset({ username: '', password: '', employeeId: '', templateId: '' });
        this.form.controls.password.setValidators(Validators.required);
        this.form.controls.password.updateValueAndValidity();
        this.store.loadFormOptions();
        this.dialogVisible = true;
    }

    openEdit(user: User): void {
        this.editingUser = user;
        this.dialogTitle = 'Editar usuario';
        this.permissionsExpanded = false;
        this.form.reset({
            username: user.username,
            password: '',
            employeeId: user.employeeId ?? '',
            templateId: '',
        });
        this.selectedPermissionIds.set(new Set(user.permissionIds ?? user.permissions?.map((permission) => permission.id) ?? []));
        this.form.controls.password.setValidators(null);
        this.form.controls.password.updateValueAndValidity();
        this.store.loadFormOptions();
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const permissionIds = [...this.selectedPermissionIds()];

        let success: boolean;

        if (this.editingUser) {
            const payload: UpdateUserRequest = {
                username: value.username.trim(),
                employeeId: value.employeeId || null,
                permissionIds,
            };

            if (value.password.trim()) {
                payload.password = value.password.trim();
            }

            success = await this.store.update(this.editingUser.id, payload);
        } else {
            const payload: CreateUserRequest = {
                username: value.username.trim(),
                password: value.password.trim(),
                employeeId: value.employeeId || null,
                permissionIds,
            };

            success = await this.store.create(payload);
        }

        if (success) {
            this.dialogVisible = false;
        }
    }

    openDelete(user: User): void {
        this.userToDelete = user;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.userToDelete) return;

        const success = await this.store.remove(this.userToDelete.id);

        if (success) {
            this.userToDelete = null;
            this.deleteDialogVisible = false;
        }
    }

    togglePermissionsExpanded(): void {
        this.permissionsExpanded = !this.permissionsExpanded;
    }

    async onTemplateChange(templateId: string | null): Promise<void> {
        if (!templateId) {
            this.selectedPermissionIds.set(new Set<string>());
            return;
        }

        this.templateLoading.set(true);
        const permissionIds = await this.store.getTemplatePermissionIds(templateId);
        this.selectedPermissionIds.set(new Set(permissionIds));
        this.templateLoading.set(false);
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

    protected permissionCount(user: User): number {
        return user.permissionIds?.length ?? user.permissions?.length ?? 0;
    }

    protected formatDate(value?: string | null): string {
        if (!value) return '—';

        const date = new Date(value);

        return isNaN(date.getTime()) ? '—' : date.toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    }
}
