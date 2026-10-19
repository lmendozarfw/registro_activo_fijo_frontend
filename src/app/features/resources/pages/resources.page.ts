import { Component, OnInit, inject, computed, OnDestroy } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../shared/components/form-label/form-label.component";
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { ResourceStore } from "../stores/resource.store";
import { BrandStore } from "../../configuration/stores/brand.store";
import { ModelStore } from "../../configuration/stores/model.store";
import { CreateResourceCommand, ResourceDto, UpdateResourceCommand } from "../models/resource.model";
import { RESOURCE_TYPE_LABELS, ResourceTypeEnum, RESOURCE_TYPE_OPTIONS } from "../models/resource-type.model";
import { STATUS_RESOURCE_LABELS, StatusResourceEnum } from "../models/status-resource.model";
import { Subscription } from "rxjs";
import { PageHeaderService } from '../../../core/services/page-header.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-resources-page',
  templateUrl: './resources.page.html',
  styles: [],
  imports: [
    TableModule,
    ButtonModule,
    InputText,
    InputNumberModule,
    TextareaModule,
    SelectModule,
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
export class ResourcesPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  protected readonly store = inject(ResourceStore);
  protected readonly brandStore = inject(BrandStore);
  protected readonly modelStore = inject(ModelStore);
  protected readonly resourceTypeLabels = RESOURCE_TYPE_LABELS;
  protected readonly resourceTypeOptions = RESOURCE_TYPE_OPTIONS.filter(
    (option) => option.value !== ResourceTypeEnum.MOBILE,
  );
  private readonly pageHeader = inject(PageHeaderService);
  private readonly toast = inject(ToastService);

  dialogVisible = false;
  dialogTitle = 'Nuevo recurso';
  editingResource: ResourceDto | null = null;
  deleteDialogVisible = false;
  resourceToDelete: ResourceDto | null = null;

  form = new FormGroup({
    modelId: new FormControl(
      { value: '', disabled: true },
      { nonNullable: true, validators: Validators.required },
    ),
    type: new FormControl<ResourceTypeEnum>(ResourceTypeEnum.OTHER, {
      nonNullable: true,
      validators: Validators.required,
    }),
    serialNumber: new FormControl(''),
    price: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    observations: new FormControl(''),
  });

  brandControlSubscription?: Subscription;
  ngOnInit(): void {
    this.pageHeader.setTitle('Activo fijo');
    this.store.loadAll();
    this.formSubscribers();
  }

  formSubscribers() {
    this.brandControlSubscription = this.form
      .get('type')
      ?.valueChanges.subscribe(async (value) => {
        if (!value) return;
        await this.modelStore.loadByType(value);
        this.form.get('modelId')?.reset();
        this.form.get('modelId')?.enable();
      });
  }

  openCreate(): void {
    this.editingResource = null;
    this.dialogTitle = 'Nuevo recurso';
    this.form.reset({
      modelId: '',
      type: ResourceTypeEnum.OTHER,
      serialNumber: '',
      price: 0,
      observations: '',
    });
    this.form.controls.modelId.disable();
    this.dialogVisible = true;
  }

  openEdit(resource: ResourceDto): void {
    this.editingResource = resource;
    this.dialogTitle = 'Editar recurso';
    this.form.reset(
      {
        modelId: resource.modelId ?? '',
        type: resource.type,
        serialNumber: resource.serialNumber ?? '',
        price: resource.price ?? 0,
        observations: resource.observations ?? '',
      },
      { emitEvent: false },
    );
    this.form.controls.modelId.enable({ emitEvent: false });
    void this.modelStore.loadByType(resource.type);
    this.dialogVisible = true;
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.editingResource && this.form.controls.type.value === ResourceTypeEnum.MOBILE) {
      this.toast.warning(
        'Tipo no permitido',
        'Los celulares se registran en la pantalla de Celulares.',
      );
      return;
    }

    const payload = {
      serialNumber: this.form.controls.serialNumber.value?.trim() || null,
      modelId: this.form.controls.modelId.value,
      type: this.form.controls.type.value,
      price: Number(this.form.controls.price.value) || 0,
      observations: this.form.controls.observations.value?.trim() || null,
    } satisfies CreateResourceCommand & UpdateResourceCommand;

    const success = this.editingResource
      ? await this.store.update(this.editingResource.id, payload)
      : await this.store.create(payload);

    if (success) {
      this.dialogVisible = false;
    }
  }

  openDelete(resource: ResourceDto): void {
    this.resourceToDelete = resource;
    this.deleteDialogVisible = true;
  }

  async confirmDelete(): Promise<void> {
    if (!this.resourceToDelete) return;

    const success = await this.store.remove(this.resourceToDelete.id);
    if (success) {
      this.resourceToDelete = null;
      this.deleteDialogVisible = false;
    }
  }

  protected openMaintenances(resource: ResourceDto): void {
    this.router.navigate(['/app/assets', resource.id, 'maintenances'], {
      queryParams: { name: resource.name, code: resource.assetCode },
    });
  }

  protected getTypeLabel(type: ResourceTypeEnum | string): string {
    const key = type as ResourceTypeEnum;
    return RESOURCE_TYPE_LABELS[key] || String(type);
  }

  protected getStatusLabel(status: StatusResourceEnum | string): string {
    const key = status as StatusResourceEnum;
    return STATUS_RESOURCE_LABELS[key] || String(status);
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

  ngOnDestroy(): void {
    this.brandControlSubscription?.unsubscribe();
  }
}
