import { Component, OnInit, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { SearchInputComponent } from "../../../shared/components/search-input/search-input.component";
import { PageHeaderService } from "../../../core/services/page-header.service";
import { EmployeeStore } from "../stores/employee.store";
import { Employee, EmployeeRequest } from "../models/employee.model";
import { JobStore } from "../../configuration/stores/job.store";
import { DepartmentStore } from "../../configuration/stores/department.store";
import { Pencil, Plus, Trash, PIcon } from '@primeicons/angular';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";
import { HeaderPageSectionComponent } from "../../../shared/components/header-page-section/header-page-section.component";

@Component({
    selector: 'app-employees-page',
    templateUrl: './employees.page.html',
    styles: [],
        imports: [TableModule, ButtonModule, InputText, SelectModule, TooltipModule, ReactiveFormsModule,
    FormDialogComponent, FormLabelComponent, EmptyStateComponent, SearchInputComponent, Pencil, Plus, Trash, HasPermissionDirective, HeaderPageSectionComponent, PIcon],
})
export class EmployeesPage implements OnInit {
    protected readonly store = inject(EmployeeStore);
    protected readonly jobStore = inject(JobStore);
    protected readonly departmentStore = inject(DepartmentStore);
    private readonly pageHeader = inject(PageHeaderService);

    dialogVisible = false;
    dialogTitle = 'Nuevo empleado';
    deleteDialogVisible = false;
    editingEmployee: Employee | null = null;
    employeeToDelete: Employee | null = null;

    form = new FormGroup({
        employeeNumber: new FormControl('', { nonNullable: true, validators: Validators.required }),
        firstName: new FormControl('', { nonNullable: true, validators: Validators.required }),
        paternalSurname: new FormControl('', { nonNullable: true, validators: Validators.required }),
        maternalSurname: new FormControl('', { nonNullable: true, validators: Validators.required }),
        jobId: new FormControl('', { nonNullable: true, validators: Validators.required }),
        departmentId: new FormControl('', { nonNullable: true, validators: Validators.required }),
        email: new FormControl('', { nonNullable: true, validators: Validators.email }),
        phoneNumber: new FormControl('', { nonNullable: true }),
    });

    ngOnInit(): void {
        this.pageHeader.setTitle('Empleados');
        this.store.loadActive();
        this.jobStore.loadActive();
        this.departmentStore.loadActive();
    }

    protected fullName(employee: Employee): string {
        return `${employee.firstName} ${employee.paternalSurname} ${employee.maternalSurname}`;
    }

    protected async onSearch(value?: string): Promise<void> {
        await this.store.loadActive(value);
    }

    openCreate(): void {
        this.editingEmployee = null;
        this.dialogTitle = 'Nuevo empleado';
        this.form.reset({
            employeeNumber: '',
            firstName: '',
            paternalSurname: '',
            maternalSurname: '',
            jobId: '',
            departmentId: '',
            email: '',
            phoneNumber: '',
        });
        this.dialogVisible = true;
    }

    openEdit(employee: Employee): void {
        this.editingEmployee = employee;
        this.dialogTitle = 'Editar empleado';
        this.form.reset({
            employeeNumber: employee.employeeNumber,
            firstName: employee.firstName,
            paternalSurname: employee.paternalSurname,
            maternalSurname: employee.maternalSurname,
            jobId: this.jobStore.jobs().find((job) => job.name === employee.jobTitle)?.id ?? '',
            departmentId: this.departmentStore.departments().find((department) => department.name === employee.departmentName)?.id ?? '',
            email: employee.email ?? '',
            phoneNumber: employee.phoneNumber ?? '',
        });
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const payload: EmployeeRequest = {
            employeeNumber: value.employeeNumber.trim(),
            firstName: value.firstName.trim(),
            paternalSurname: value.paternalSurname.trim(),
            maternalSurname: value.maternalSurname.trim(),
            jobId: value.jobId,
            departmentId: value.departmentId,
            email: value.email.trim() || null,
            phoneNumber: value.phoneNumber.trim() || null,
        };

        const success = this.editingEmployee
            ? await this.store.update(this.editingEmployee.id, payload)
            : await this.store.create(payload);

        if (success) {
            this.dialogVisible = false;
        }
    }

    openDelete(employee: Employee): void {
        this.employeeToDelete = employee;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.employeeToDelete) return;

        const success = await this.store.remove(this.employeeToDelete.id);

        if (success) {
            this.employeeToDelete = null;
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

    async retry(): Promise<void> {
        this.store.loadActive();
    }
}
