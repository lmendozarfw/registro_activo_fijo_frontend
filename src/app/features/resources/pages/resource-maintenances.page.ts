import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { FormDialogComponent } from '../../../shared/components/form-dialog/form-dialog.component';
import { FormLabelComponent } from '../../../shared/components/form-label/form-label.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import {
  CreateMaintenanceOrderCommand,
  CreateMaintenancePlanCommand,
  FREQUENCY_UNIT_LABELS,
  FREQUENCY_UNIT_OPTIONS,
  FrequencyUnitEnum,
  MAINTENANCE_ORDER_STATUS_LABELS,
  MAINTENANCE_ORDER_STATUS_OPTIONS,
  MAINTENANCE_TYPE_LABELS,
  MAINTENANCE_TYPE_OPTIONS,
  MaintenanceOrderStatusEnum,
  MaintenancePlan,
  MaintenanceTypeEnum
} from '../models/maintenance-plan.model';
import { MaintenanceOrderStore } from '../stores/maintenance-order.store';
import { MaintenancePlanStore } from '../stores/maintenance-plan.store';
import { EmployeeStore } from '../../employees/stores/employee.store';
import { PageHeaderService } from '../../../core/services/page-header.service';

@Component({
  selector: 'app-resource-maintenances-page',
  templateUrl: './resource-maintenances.page.html',
  styles: [],
  imports: [
    TableModule,
    ButtonModule,
    InputText,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    TooltipModule,
    ReactiveFormsModule,
    FormDialogComponent,
    FormLabelComponent,
    EmptyStateComponent,
    PIcon,
    CurrencyPipe,
  ],
})
export class ResourceMaintenancesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly planStore = inject(MaintenancePlanStore);
  protected readonly orderStore = inject(MaintenanceOrderStore);
  protected readonly employeeStore = inject(EmployeeStore);
  private readonly pageHeader = inject(PageHeaderService);

  protected readonly resourceId = signal<string>('');
  protected readonly resourceName = signal<string>('');
  protected readonly resourceCode = signal<string>('');
  protected readonly selectedPlanId = signal<string | null>(null);
  protected readonly ordersBySelectedPlan = computed(() =>
    this.orderStore.orders().filter((o) => o.maintenancePlanId === this.selectedPlanId()),
  );
  protected readonly activePlans = computed(() => this.planStore.plans().filter((p) => p.active));

  planDialogVisible = false;
  planDialogTitle = 'Nuevo plan de mantenimiento';
  editingPlan: MaintenancePlan | null = null;

  orderDialogVisible = false;

  readonly maintenanceTypeOptions = MAINTENANCE_TYPE_OPTIONS;
  readonly frequencyUnitOptions = FREQUENCY_UNIT_OPTIONS;
  readonly orderStatusOptions = MAINTENANCE_ORDER_STATUS_OPTIONS;

  protected readonly planOptions = computed(() =>
    this.activePlans().map((p) => ({ label: p.name, value: p.id })),
  );

  protected readonly employeeOptions = computed(() => {
    const employees = this.employeeStore.employees();
    if (employees.length === 0) {
      return [
        { label: 'Juan Pérez López (No. 1001)', value: 'emp-1' },
        { label: 'María Gómez Ruiz (No. 1002)', value: 'emp-2' },
      ];
    }
    return employees.map((e) => ({
      label: `${e.firstName} ${e.paternalSurname} ${e.maternalSurname} (No. ${e.employeeNumber})`,
      value: e.id,
    }));
  });

  planForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl('', { nonNullable: true }),
    maintenanceType: new FormControl<MaintenanceTypeEnum>(MaintenanceTypeEnum.PREVENTIVE, {
      nonNullable: true,
      validators: Validators.required,
    }),
    frequencyValue: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    frequencyUnit: new FormControl<FrequencyUnitEnum>(FrequencyUnitEnum.MONTH, {
      nonNullable: true,
      validators: Validators.required,
    }),
    startDate: new FormControl<Date | null>(new Date(), { validators: Validators.required }),
    nextMaintenanceDate: new FormControl<Date | null>(null),
  });

  orderForm = new FormGroup({
    maintenancePlanId: new FormControl<string | null>(null),
    maintenanceType: new FormControl<MaintenanceTypeEnum>(MaintenanceTypeEnum.PREVENTIVE, {
      nonNullable: true,
      validators: Validators.required,
    }),
    reason: new FormControl('', { nonNullable: true, validators: Validators.required }),
    startDate: new FormControl<Date | null>(new Date()),
    endDate: new FormControl<Date | null>(null),
    responsibleEmployeeId: new FormControl<string | null>(null),
    status: new FormControl<MaintenanceOrderStatusEnum>(MaintenanceOrderStatusEnum.PENDING, {
      nonNullable: true,
    }),
    observations: new FormControl(''),
    maintenanceCost: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(0)],
    }),
  });

  ngOnInit(): void {
    this.pageHeader.setTitle("Mantenimiento");
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.resourceId.set(id);
    }
    this.resourceName.set(this.route.snapshot.queryParamMap.get('name') ?? '');
    this.resourceCode.set(this.route.snapshot.queryParamMap.get('code') ?? '');
    this.planStore.clear();
    this.orderStore.clear();
    void this.planStore.loadByResource(this.resourceId());
    void this.orderStore.loadByResource(this.resourceId());
    void this.employeeStore.load();
  }

  openCreatePlan(): void {
    this.editingPlan = null;
    this.planDialogTitle = 'Nuevo plan de mantenimiento';
    this.planForm.reset({
      name: '',
      description: '',
      maintenanceType: MaintenanceTypeEnum.PREVENTIVE,
      frequencyValue: 1,
      frequencyUnit: FrequencyUnitEnum.MONTH,
      startDate: new Date(),
      nextMaintenanceDate: null,
    });
    this.planDialogVisible = true;
  }

  openEditPlan(plan: MaintenancePlan): void {
    this.editingPlan = plan;
    this.planDialogTitle = 'Editar plan de mantenimiento';
    this.planForm.reset({
      name: plan.name,
      description: plan.description ?? '',
      maintenanceType: plan.maintenanceType,
      frequencyValue: plan.frequencyValue,
      frequencyUnit: plan.frequencyUnit,
      startDate: plan.startDate ? new Date(plan.startDate) : new Date(),
      nextMaintenanceDate: plan.nextMaintenanceDate ? new Date(plan.nextMaintenanceDate) : null,
    });
    this.planDialogVisible = true;
  }

  async savePlan(): Promise<void> {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }
    const value = this.planForm.getRawValue();
    const payload: CreateMaintenancePlanCommand = {
      resourceId: this.resourceId(),
      name: value.name.trim(),
      description: value.description.trim() || null,
      maintenanceType: value.maintenanceType,
      frequencyValue: value.frequencyValue,
      frequencyUnit: value.frequencyUnit,
      startDate: value.startDate ? value.startDate.toISOString() : new Date().toISOString(),
      nextMaintenanceDate: value.nextMaintenanceDate
        ? value.nextMaintenanceDate.toISOString()
        : null,
    };
    const success = this.editingPlan
      ? await this.planStore.update(this.editingPlan.id, payload)
      : await this.planStore.create(payload);
    if (success) {
      this.planDialogVisible = false;
      void this.planStore.loadByResource(this.resourceId());
    }
  }

  async deletePlan(plan: MaintenancePlan): Promise<void> {
    await this.planStore.remove(plan.id);
    void this.planStore.loadByResource(this.resourceId());
  }

  openCreateOrder(): void {
    this.orderForm.reset({
      maintenancePlanId: this.selectedPlanId(),
      maintenanceType: MaintenanceTypeEnum.PREVENTIVE,
      reason: '',
      startDate: new Date(),
      endDate: null,
      responsibleEmployeeId: null,
      status: MaintenanceOrderStatusEnum.PENDING,
      observations: '',
      maintenanceCost: 0,
    });
    this.orderDialogVisible = true;
  }

  markForMaintenance(): void {
    this.orderForm.reset({
      maintenancePlanId: this.selectedPlanId(),
      maintenanceType: MaintenanceTypeEnum.PREVENTIVE,
      reason: 'Marcar recurso para mantenimiento.',
      startDate: new Date(),
      endDate: null,
      responsibleEmployeeId: null,
      status: MaintenanceOrderStatusEnum.PENDING,
      observations: '',
      maintenanceCost: 0,
    });
    this.orderDialogVisible = true;
  }

  async saveOrder(): Promise<void> {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    const value = this.orderForm.getRawValue();
    const payload: CreateMaintenanceOrderCommand = {
      resourceId: this.resourceId(),
      maintenancePlanId: value.maintenancePlanId || null,
      maintenanceType: value.maintenanceType,
      reason: value.reason.trim(),
      startDate: value.startDate ? value.startDate.toISOString() : null,
      endDate: value.endDate ? value.endDate.toISOString() : null,
      responsibleEmployeeId: value.responsibleEmployeeId || null,
      status: value.status,
      observations: value.observations?.trim() || null,
      maintenanceCost: value.maintenanceCost || 0,
    };
    const success = await this.orderStore.create(payload);
    if (success) {
      this.orderDialogVisible = false;
      void this.orderStore.loadByResource(this.resourceId());
    }
  }

  loadOrdersByPlan(planId: string): void {
    this.selectedPlanId.set(planId);
  }

  goBack(): void {
    this.router.navigate(['/app/fixed-asset']);
  }

  maintenanceTypeLabel(type: MaintenanceTypeEnum): string {
    return MAINTENANCE_TYPE_LABELS[type] || String(type);
  }

  frequencyUnitLabel(unit: FrequencyUnitEnum): string {
    return FREQUENCY_UNIT_LABELS[unit] || String(unit);
  }

  orderStatusLabel(status: MaintenanceOrderStatusEnum): string {
    return MAINTENANCE_ORDER_STATUS_LABELS[status] || String(status);
  }

  orderStatusSeverity(
    status: MaintenanceOrderStatusEnum,
  ): 'success' | 'info' | 'secondary' | 'warn' | 'danger' {
    switch (status) {
      case MaintenanceOrderStatusEnum.COMPLETED:
        return 'success';
      case MaintenanceOrderStatusEnum.IN_PROGRESS:
        return 'info';
      case MaintenanceOrderStatusEnum.ASSIGNED:
        return 'warn';
      case MaintenanceOrderStatusEnum.PENDING:
        return 'secondary';
      case MaintenanceOrderStatusEnum.CANCELLED:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getIndicator(plan: MaintenancePlan): {
    color: 'emerald' | 'yellow' | 'red' | 'slate';
    label: string;
  } {
    const next = plan.nextMaintenanceDate ? new Date(plan.nextMaintenanceDate) : null;
    if (!next) {
      return { color: 'slate', label: 'Sin fecha' };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { color: 'red', label: 'Vencido' };
    }
    if (diffDays <= 7) {
      return { color: 'yellow', label: `Vence en ${diffDays}d` };
    }
    return { color: 'emerald', label: `${diffDays}d restantes` };
  }

  formatDate(value?: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    return isNaN(date.getTime())
      ? '—'
      : date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
  }
}
