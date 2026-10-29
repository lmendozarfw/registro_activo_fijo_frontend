import { Component, OnInit, inject, computed } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { SearchInputComponent } from "../../../shared/components/search-input/search-input.component";
import { ResourceStore } from "../stores/resource.store";
import { LineStore } from "../stores/line.store";
import { BrandStore } from "../../configuration/stores/brand.store";
import { ModelStore } from "../../configuration/stores/model.store";
import { CreateMobileResourceCommand, MobileResourceDto, UpdateMobileResourceCommand } from "../models/resource.model";
import { RESOURCE_TYPE_LABELS, ResourceTypeEnum } from "../models/resource-type.model";
import { STATUS_RESOURCE_LABELS, StatusResourceEnum } from "../models/status-resource.model";
import { PIcon } from '@primeicons/angular';
import { DatePickerModule } from 'primeng/datepicker';
import { LineDto, STATUS_LINE_LABELS, UpdateLineCommand } from "../models/line.model";
import { AssignmentStore } from "../../assignments/stores/assignment.store";
import { AssignmentDto } from "../../assignments/models/assignment.model";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: 'app-phones-page',
  templateUrl: './phones.page.html',
  styles: [
    `
      .p-tabs {
        border-radius: 12px;
      }
      .p-tablist {
        border-radius: 12px 12px 0 0;
      }
      .p-tabpanels {
        border-radius: 0 0 12px 12px;
      }
    `,
  ],
  imports: [
    TableModule,
    ButtonModule,
    InputText,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    TagModule,
    TooltipModule,
    TabsModule,
    ReactiveFormsModule,
    FormDialogComponent,
    FormLabelComponent,
    EmptyStateComponent,
    SearchInputComponent,
    DatePickerModule,
    CurrencyPipe,
    PIcon,
  ],
})
export class PhonesPage implements OnInit {
  protected readonly store = inject(ResourceStore);
  protected readonly lineStore = inject(LineStore);
  protected readonly brandStore = inject(BrandStore);
  protected readonly modelStore = inject(ModelStore);
  protected readonly assignmentStore = inject(AssignmentStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  protected readonly resourceTypeLabels = RESOURCE_TYPE_LABELS;
  protected readonly statusLabels = STATUS_RESOURCE_LABELS;
  protected readonly statusLineLabels = STATUS_LINE_LABELS;
  protected readonly statusResourceEnum = StatusResourceEnum;

  protected readonly mobileModels = computed(() =>
    this.modelStore.models().filter((m) => m.type === ResourceTypeEnum.MOBILE),
  );

  protected readonly assignmentByResourceId = computed(() => {
    const map = new Map<string, AssignmentDto>();
    for (const assignment of this.assignmentStore.assignments()) {
      if (assignment.isActive) {
        map.set(assignment.resourceId, assignment);
      }
    }
    return map;
  });

  activeTab = 'mobiles';
  dialogVisible = false;
  dialogTitle = 'Nuevo celular';
  deleteDialogVisible = false;
  editingMobile: MobileResourceDto | null = null;
  mobileToDelete: MobileResourceDto | null = null;
  lineDialogVisible = false;
  lineDialogTitle = 'Nueva línea';
  editingLine: LineDto | null = null;
  deleteLineDialogVisible = false;
  lineToDelete: LineDto | null = null;

  form = new FormGroup({
    modelId: new FormControl('', { nonNullable: true, validators: Validators.required }),
    serialNumber: new FormControl(''),
    price: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    imei: new FormControl('', { nonNullable: true, validators: Validators.required }),
    imei2: new FormControl(''),
    lineId: new FormControl<string | null>(null),
    observations: new FormControl(''),
  });

  lineForm = new FormGroup({
    phoneNumber: new FormControl('', { nonNullable: true, validators: Validators.required }),
    operator: new FormControl('', { nonNullable: true, validators: Validators.required }),
    plan: new FormControl(''),
    planPrice: new FormControl<number | null>(null),
    activationDate: new FormControl<Date | null>(null, { validators: Validators.required }),
    observations: new FormControl(''),
  });

  ngOnInit(): void {
    this.brandStore.load();
    this.modelStore.loadOnlyMobiles();
    this.loadTabData(this.activeTab);
  }

  onTabChange(tab: string | number | undefined): void {
    this.activeTab = String(tab);
    this.loadTabData(this.activeTab);
  }

  onMobileSearch(search: string): void {
    this.store.loadActiveMobile(search);
  }

  onLineSearch(search: string): void {
    this.lineStore.loadActive(search);
  }

  private loadTabData(tab: string): void {
    if (tab === 'mobiles') {
      this.store.loadActiveMobile();
      this.lineStore.loadAvailable();
      this.assignmentStore.loadActives();
    } else if (tab === 'lines') {
      this.lineStore.loadActive();
    }
  }

  openCreateMobile(): void {
    this.editingMobile = null;
    this.dialogTitle = 'Nuevo celular';
    this.form.reset({
      modelId: '',
      serialNumber: '',
      price: 0,
      imei: '',
      imei2: '',
      lineId: null,
      observations: '',
    });
    this.dialogVisible = true;
  }

  openEditMobile(mobile: MobileResourceDto): void {
    this.editingMobile = mobile;
    this.dialogTitle = 'Editar celular';
    this.form.reset({
      modelId: mobile.modelId ?? '',
      serialNumber: mobile.serialNumber ?? '',
      price: mobile.price ?? 0,
      imei: mobile.imei,
      imei2: mobile.imei2 ?? '',
      lineId: mobile.lineId ?? null,
      observations: mobile.observations ?? '',
    });
    this.dialogVisible = true;
  }

  async saveMobile(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.editingMobile) {
      const payload: UpdateMobileResourceCommand = {
        serialNumber: this.form.controls.serialNumber.value?.trim() || null,
        modelId: this.form.controls.modelId.value,
        price: Number(this.form.controls.price.value) || 0,
        observations: this.form.controls.observations.value?.trim() || null,
        imei: this.form.controls.imei.value.trim(),
        imei2: this.form.controls.imei2.value?.trim() || null,
        lineId: this.form.controls.lineId.value,
      };

      const success = await this.store.updateMobile(this.editingMobile.id, payload);
      if (success) {
        this.dialogVisible = false;
      }
      return;
    }

    const payload: CreateMobileResourceCommand = {
      serialNumber: this.form.controls.serialNumber.value?.trim() || null,
      modelId: this.form.controls.modelId.value,
      type: ResourceTypeEnum.MOBILE,
      price: Number(this.form.controls.price.value) || 0,
      observations: this.form.controls.observations.value?.trim() || null,
      imei: this.form.controls.imei.value.trim(),
      imei2: this.form.controls.imei2.value?.trim() || null,
      lineId: this.form.controls.lineId.value,
    };

    const success = await this.store.createMobile(payload);
    if (success) {
      this.dialogVisible = false;
    }
  }

  openDeleteMobile(mobile: MobileResourceDto): void {
    this.mobileToDelete = mobile;
    this.deleteDialogVisible = true;
  }

  async confirmDeleteMobile(): Promise<void> {
    if (!this.mobileToDelete) return;

    const success = await this.store.removeMobile(this.mobileToDelete.id);

    if (success) {
      this.mobileToDelete = null;
      this.deleteDialogVisible = false;
    }
  }

  openCreateLine(): void {
    this.editingLine = null;
    this.lineDialogTitle = 'Nueva línea';
    this.lineForm.reset({
      phoneNumber: '',
      operator: '',
      plan: '',
      planPrice: null,
      activationDate: null,
      observations: '',
    });
    this.lineDialogVisible = true;
  }

  openEditLine(line: LineDto): void {
    this.editingLine = line;
    this.lineDialogTitle = 'Editar línea';
    this.lineForm.reset({
      phoneNumber: line.phoneNumber,
      operator: line.operator,
      plan: line.plan ?? '',
      planPrice: line.planPrice ?? null,
      activationDate: line.activationDate ? new Date(line.activationDate) : null,
      observations: line.observations ?? '',
    });
    this.lineDialogVisible = true;
  }

  async saveLine(): Promise<void> {
    if (this.lineForm.invalid) {
      this.lineForm.markAllAsTouched();
      return;
    }

    const payload: UpdateLineCommand = {
      phoneNumber: this.lineForm.controls.phoneNumber.value.trim(),
      operator: this.lineForm.controls.operator.value.trim(),
      plan: this.lineForm.controls.plan.value?.trim() || null,
      planPrice: this.lineForm.controls.planPrice.value || null,
      activationDate:
        this.lineForm.controls.activationDate.value?.toISOString() ?? new Date().toISOString(),
      observations: this.lineForm.controls.observations.value?.trim() || null,
    };

    if (this.editingLine) {
      const success = await this.lineStore.update(this.editingLine.id, payload);
      if (success) {
        this.lineDialogVisible = false;
      }
      return;
    }

    const lineId = await this.lineStore.create(payload);
    if (lineId) {
      this.lineDialogVisible = false;
      this.form.controls.lineId.setValue(lineId);
    }
  }

  openDeleteLine(line: LineDto): void {
    this.lineToDelete = line;
    this.deleteLineDialogVisible = true;
  }

  async confirmDeleteLine(): Promise<void> {
    if (!this.lineToDelete) return;
    const success = await this.lineStore.remove(this.lineToDelete.id);
    if (success) {
      this.lineToDelete = null;
      this.deleteLineDialogVisible = false;
    }
  }

  protected getStatusLabel(status: StatusResourceEnum | string): string {
    const key = status as StatusResourceEnum;
    return STATUS_RESOURCE_LABELS[key] || String(status);
  }

  protected openLetter(mobile: MobileResourceDto): void {
    const assignment = this.assignmentByResourceId().get(mobile.resourceId);
    if (!assignment) {
      this.toast.warning('Sin asignación', 'No se encontró una asignación activa para este celular.');
      return;
    }

    this.router.navigate(['/app/assignments', assignment.id, 'letter'], {
      queryParams: {
        employeeName: assignment.employeeName,
        assetCode: assignment.assetCode,
        resourceName: assignment.resourceName,
        brandName: assignment.brandName,
        modelName: assignment.modelName,
        type: assignment.type,
        assignmentDate: assignment.assignmentDate,
      },
    });
  }

  protected formatDate(value?: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    return isNaN(date.getTime())
      ? '—'
      : date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }
}
