import { Component, OnInit, inject, computed } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { AssignmentStore } from "../stores/assignment.store";
import { EmployeeStore } from "../../employees/stores/employee.store";
import { ResourceStore } from "../../resources/stores/resource.store";
import { AssignmentDto, CreateAssignmentCommand, ReturnAssignmentCommand } from "../models/assignment.model";
import { ChevronDown, Pencil, Plus, Undo, ArrowRightArrowLeft } from '@primeicons/angular';
import { AuthStore } from "../../../features/auth/stores/auth.store";
import { TooltipModule } from "primeng/tooltip";

@Component({
    selector: "app-assignments-page",
    templateUrl: "./assignments.page.html",
    styles: [],
    imports: [TableModule, ButtonModule, SelectModule, DatePickerModule, TextareaModule, TagModule, TooltipModule,
        ReactiveFormsModule, FormDialogComponent, FormLabelComponent, EmptyStateComponent, Plus, Pencil, Undo, ArrowRightArrowLeft]
})
export class AssignmentsPage implements OnInit {
    protected readonly store = inject(AssignmentStore);
    protected readonly employeeStore = inject(EmployeeStore);
    protected readonly resourceStore = inject(ResourceStore);
    private readonly auth = inject(AuthStore);

    protected readonly availableEmployees = computed(() => this.employeeStore.employeesItem());
    protected readonly availableMobiles = computed(() => this.resourceStore.mobileResources());
    protected readonly avaiableResources = computed(() => this.resourceStore.availableResourceGroups());

    dialogVisible = false;

    form = new FormGroup({
        employeeId: new FormControl('', { nonNullable: true, validators: Validators.required }),
        resourceId: new FormControl('', { nonNullable: true, validators: Validators.required }),
        assignmentDate: new FormControl<Date | null>(new Date(), { validators: Validators.required }),
        renewalDate: new FormControl<Date | null>(null),
        observation: new FormControl(''),
    });

    dialogReturnVisible = false;
    selectedAssignment: AssignmentDto | null = null;
    formReturn = new FormGroup({
        observation: new FormControl('', [])
    });
    ngOnInit(): void {
        this.store.load();
        this.employeeStore.loadAvailablToAssignments();
        this.resourceStore.loadAvailableToAssign();
    }

    openCreate(): void {
        this.form.reset({
            employeeId: '',
            resourceId: '',
            assignmentDate: new Date(),
            renewalDate: null,
            observation: '',
        });
        this.dialogVisible = true;
    }

    openReturn(assignment: AssignmentDto): void {
        this.selectedAssignment = assignment;
        this.formReturn.reset({
            observation: ''
        });
        this.dialogReturnVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload: CreateAssignmentCommand = {
            employeeId: this.form.controls.employeeId.value,
            resourceId: this.form.controls.resourceId.value,
            assignmentDate: this.form.controls.assignmentDate.value?.toISOString() ?? new Date().toISOString(),
            renewalDate: this.form.controls.renewalDate.value?.toISOString() || null,
            observation: this.form.controls.observation.value?.trim() || null,
            actorUserId: this.auth.user()?.id || null,
        };

        const success = await this.store.create(payload);
        if (success) {
            this.dialogVisible = false;
        }
    }

    async returnResource(): Promise<void> {
        if (!this.selectedAssignment) {
            return;
        }

        const payload: ReturnAssignmentCommand = {
            assignmentId: this.selectedAssignment.id,
            returnDate: new Date().toISOString(),
            observation: this.formReturn.controls.observation.value?.trim() || null,
            actorUserId: this.auth.user()?.id || null,
        };

        const success = await this.store.returnResource(payload);
        if (success) {
            this.dialogReturnVisible = false;
            this.selectedAssignment = null;
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