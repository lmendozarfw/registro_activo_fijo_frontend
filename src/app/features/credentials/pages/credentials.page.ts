import { Component, OnInit, computed, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputPassword } from 'primeng/inputpassword';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { PageHeaderService } from "../../../core/services/page-header.service";
import { ToastService } from "../../../core/services/toast.service";
import { CredentialStore } from "../stores/credential.store";
import { Credential, CredentialRequest } from "../models/credential.model";
import { EmployeeStore } from "../../employees/stores/employee.store";
import { SystemStore } from "../../configuration/stores/system.store";
import { Copy, Eye, Pencil, Plus, Spinner, Trash } from '@primeicons/angular';

@Component({
    selector: 'app-credentials-page',
    templateUrl: './credentials.page.html',
    styles: [],
    imports: [TableModule, ButtonModule, InputText, InputPassword, TextareaModule, ToggleSwitchModule,
        SelectModule, TooltipModule, ReactiveFormsModule, FormDialogComponent, FormLabelComponent,
        EmptyStateComponent, Copy, Eye, Pencil, Plus, Spinner, Trash],
})
export class CredentialsPage implements OnInit {
    protected readonly store = inject(CredentialStore);
    protected readonly employeeStore = inject(EmployeeStore);
    protected readonly systemStore = inject(SystemStore);
    private readonly pageHeader = inject(PageHeaderService);
    private readonly toast = inject(ToastService);

    dialogVisible = false;
    dialogTitle = 'Nueva credencial';
    deleteDialogVisible = false;
    passwordDialogVisible = false;
    editingCredential: Credential | null = null;
    credentialToDelete: Credential | null = null;
    private optionsLoaded = false;

    protected readonly employeeOptions = computed(() =>
        this.employeeStore.employees().map((employee) => ({
            id: employee.id,
            label: `${employee.firstName} ${employee.paternalSurname} ${employee.maternalSurname} (No. ${employee.employeeNumber})`,
        })),
    );

    form = new FormGroup({
        employeeId: new FormControl('', { nonNullable: true, validators: Validators.required }),
        systemId: new FormControl('', { nonNullable: true, validators: Validators.required }),
        password: new FormControl('', { nonNullable: true, validators: Validators.required }),
        canView: new FormControl(true, { nonNullable: true }),
        note: new FormControl('', { nonNullable: true }),
    });

    ngOnInit(): void {
        this.pageHeader.setTitle('Credenciales');
        this.store.load();
    }

    openCreate(): void {
        this.editingCredential = null;
        this.dialogTitle = 'Nueva credencial';
        this.ensureOptionsLoaded();
        this.form.reset({
            employeeId: '',
            systemId: '',
            password: '',
            canView: true,
            note: '',
        });
        this.form.controls.password.setValidators(Validators.required);
        this.dialogVisible = true;
    }

    openEdit(credential: Credential): void {
        this.editingCredential = credential;
        this.dialogTitle = 'Editar credencial';
        this.form.reset({
            employeeId: credential.employeeId ?? '',
            systemId: credential.systemId ?? '',
            password: '',
            canView: credential.canView,
            note: credential.note ?? '',
        });
        this.form.controls.password.setValidators(null);
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const password = value.password.trim();
        const payload: CredentialRequest = {
            canView: value.canView,
            note: value.note.trim() || null,
        };

        if (this.editingCredential) {
            if (this.editingCredential.employeeId) payload.employeeId = this.editingCredential.employeeId;
            if (this.editingCredential.systemId) payload.systemId = this.editingCredential.systemId;
            if (password) payload.password = password;
        } else {
            payload.employeeId = value.employeeId;
            payload.systemId = value.systemId;
            payload.password = password;
        }

        const success = this.editingCredential
            ? await this.store.update(this.editingCredential.id, payload)
            : await this.store.create(payload);

        if (success) {
            this.dialogVisible = false;
        }
    }

    openPassword(credential: Credential): void {
        this.passwordDialogVisible = true;
        this.store.revealPassword(credential.employeeId, credential.systemId);
    }

    onPasswordDialogChange(visible: boolean): void {
        this.passwordDialogVisible = visible;
        if (!visible) {
            this.store.clearPassword();
        }
    }

    async copyPassword(): Promise<void> {
        const password = this.store.revealedPassword();
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            this.toast.success('Contraseña copiada');
        } catch {
            this.toast.error('No se pudo copiar la contraseña');
        }
    }

    openDelete(credential: Credential): void {
        this.credentialToDelete = credential;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.credentialToDelete) return;

        const success = await this.store.remove(this.credentialToDelete.id);

        if (success) {
            this.credentialToDelete = null;
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

    private ensureOptionsLoaded(): void {
        if (this.optionsLoaded) return;

        this.optionsLoaded = true;
        this.employeeStore.load();
        this.systemStore.load();
    }
}
