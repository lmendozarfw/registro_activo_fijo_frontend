import { Component, OnInit, inject, computed } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { AssignmentStore } from "../stores/assignment.store";
import { EmployeeStore } from "../../employees/stores/employee.store";
import { ResourceStore } from "../../resources/stores/resource.store";
import { ModelStore } from "../../configuration/stores/model.store";
import { AssignmentDto, CreateAssignmentCommand, NewMobileDeviceDto, RenewDeviceOption, RenewMobileAssignmentCommand, ReturnAssignmentCommand } from "../models/assignment.model";
import { ChevronDown, Pencil, Plus, Undo, ArrowRightArrowLeft } from '@primeicons/angular';
import { AuthStore } from "../../../features/auth/stores/auth.store";
import { TooltipModule } from "primeng/tooltip";

@Component({
    selector: "app-assignments-page",
    templateUrl: "./assignments.page.html",
    styles: [],
    imports: [TableModule, ButtonModule, SelectModule, DatePickerModule, TextareaModule, TagModule, TooltipModule, InputText,
        InputNumberModule, SelectButtonModule, ReactiveFormsModule, FormDialogComponent, FormLabelComponent, EmptyStateComponent,
        Plus, Pencil, Undo, ArrowRightArrowLeft]
})
export class AssignmentsPage implements OnInit {
    protected readonly store = inject(AssignmentStore);
    protected readonly employeeStore = inject(EmployeeStore);
    protected readonly resourceStore = inject(ResourceStore);
    protected readonly modelStore = inject(ModelStore);
    private readonly auth = inject(AuthStore);

    protected readonly renewDeviceOption = RenewDeviceOption;
    protected readonly renewOptions = [
        { label: 'Seleccionar celular existente', value: RenewDeviceOption.ExistingDevice },
        { label: 'Registrar nuevo celular', value: RenewDeviceOption.NewDevice },
    ];

    protected readonly availableEmployees = computed(() => this.employeeStore.employeesItem());
    protected readonly avaiableResources = computed(() => this.resourceStore.availableResourceGroups());
    protected readonly availableMobileItems = computed(() => this.resourceStore.unassignedMobileResources());
    protected readonly mobileModels = computed(() => this.modelStore.models());

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

    dialogRenewVisible = false;
    renewForm = new FormGroup({
        option: new FormControl<RenewDeviceOption>(RenewDeviceOption.ExistingDevice, {
            nonNullable: true, validators: Validators.required,
        }),
        existingMobileResourceId: new FormControl<string | null>(null),
        assetCode: new FormControl(''),
        name: new FormControl(''),
        serialNumber: new FormControl(''),
        modelId: new FormControl(''),
        price: new FormControl<number>(0),
        imei: new FormControl(''),
        imei2: new FormControl(''),
        deviceObservations: new FormControl(''),
        observation: new FormControl(''),
    });

    ngOnInit(): void {
        this.store.load();
        this.employeeStore.loadAvailablToAssignments();
        this.resourceStore.loadAvailableToAssign();
        this.modelStore.loadOnlyMobiles();
        this.renewForm.controls.option.valueChanges.subscribe(() => this.updateRenewValidators());
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

    openRenew(assignment: AssignmentDto): void {
        this.selectedAssignment = assignment;
        void this.resourceStore.loadUnassignedMobile();
        this.renewForm.reset({
            option: RenewDeviceOption.ExistingDevice,
            existingMobileResourceId: null,
            assetCode: '',
            name: '',
            serialNumber: '',
            modelId: '',
            price: 0,
            imei: '',
            imei2: '',
            deviceObservations: '',
            observation: '',
        });
        this.renewForm.controls.existingMobileResourceId.setValidators(Validators.required);
        this.dialogRenewVisible = true;
    }

    updateRenewValidators(): void {
        const c = this.renewForm.controls;
        const isNewDevice = c.option.value === RenewDeviceOption.NewDevice;

        [
            c.existingMobileResourceId, c.assetCode, c.name, c.serialNumber, c.modelId, c.imei, c.imei2,
            c.deviceObservations, c.observation,
        ].forEach(control => control.clearValidators());

        if (isNewDevice) {
            c.assetCode.setValidators(Validators.required);
            c.name.setValidators(Validators.required);
            c.modelId.setValidators(Validators.required);
            c.imei.setValidators(Validators.required);
            c.price.setValidators([Validators.required, Validators.min(0)]);
        } else {
            c.existingMobileResourceId.setValidators(Validators.required);
            c.price.clearValidators();
        }

        [
            c.existingMobileResourceId, c.assetCode, c.name, c.serialNumber, c.modelId, c.price, c.imei, c.imei2,
            c.deviceObservations, c.observation,
        ].forEach(control => control.updateValueAndValidity());
    }

    async renew(): Promise<void> {
        if (!this.selectedAssignment) {
            return;
        }

        this.updateRenewValidators();
        if (this.renewForm.invalid) {
            this.renewForm.markAllAsTouched();
            return;
        }

        const isNewDevice = this.renewForm.controls.option.value === RenewDeviceOption.NewDevice;
        const newDevice: NewMobileDeviceDto | null = isNewDevice ? {
            assetCode: this.renewForm.controls.assetCode.value?.trim() ?? '',
            name: this.renewForm.controls.name.value?.trim() ?? '',
            serialNumber: this.renewForm.controls.serialNumber.value?.trim() || null,
            modelId: this.renewForm.controls.modelId.value ?? '',
            price: Number(this.renewForm.controls.price.value) || 0,
            observations: this.renewForm.controls.deviceObservations.value?.trim() || null,
            imei: this.renewForm.controls.imei.value?.trim() ?? '',
            imei2: this.renewForm.controls.imei2.value?.trim() || null,
        } : null;

        const payload: RenewMobileAssignmentCommand = {
            assignmentId: this.selectedAssignment.id,
            option: this.renewForm.controls.option.value,
            newDevice,
            existingMobileResourceId: isNewDevice ? null : this.renewForm.controls.existingMobileResourceId.value,
            actorUserId: this.auth.user()?.id || '',
            renewalDate: new Date().toISOString(),
            observation: this.renewForm.controls.observation.value?.trim() || null,
        };

        const success = await this.store.renew(payload);
        if (success) {
            this.dialogRenewVisible = false;
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