import { Component, OnInit, inject, computed, OnDestroy } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { Pencil, Plus } from '@primeicons/angular';
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
import { CreateResourceCommand } from "../models/resource.model";
import { RESOURCE_TYPE_LABELS, ResourceTypeEnum, RESOURCE_TYPE_OPTIONS } from "../models/resource-type.model";
import { STATUS_RESOURCE_LABELS, STATUS_RESOURCE_OPTIONS, StatusResourceEnum } from "../models/status-resource.model";
import { Subscription } from "rxjs";

@Component({
    selector: "app-resources-page",
    templateUrl: "./resources.page.html",
    styles: [],
    imports: [TableModule, ButtonModule, InputText, InputNumberModule, TextareaModule, SelectModule, TagModule, TooltipModule,
        ReactiveFormsModule, FormDialogComponent, FormLabelComponent, EmptyStateComponent, Pencil, Plus, CurrencyPipe]
})
export class ResourcesPage implements OnInit, OnDestroy {
    protected readonly store = inject(ResourceStore);
    protected readonly brandStore = inject(BrandStore);
    protected readonly modelStore = inject(ModelStore);
    protected readonly resourceTypeLabels = RESOURCE_TYPE_LABELS;
    protected readonly resourceTypeOptions = RESOURCE_TYPE_OPTIONS;
    protected readonly statusOptions = STATUS_RESOURCE_OPTIONS;

    protected readonly filteredModels = computed(() => {
        const brandId = this.form.controls.brandId.value;
        const type = this.form.controls.type.value;
        const models = this.modelStore.models();
        return models.filter(m => (!brandId || m.brandId === brandId) && (!type || m.type === type));
    });

    dialogVisible = false;
    dialogTitle = 'Nuevo recurso';

    form = new FormGroup({
        brandId: new FormControl('', { nonNullable: true }),
        modelId: new FormControl({value: '', disabled: true}, { nonNullable: true, validators: Validators.required }),
        type: new FormControl<ResourceTypeEnum>(ResourceTypeEnum.OTHER, { nonNullable: true, validators: Validators.required }),
        assetCode: new FormControl('', { nonNullable: true, validators: Validators.required }),
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        serialNumber: new FormControl(''),
        price: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
        status: new FormControl<StatusResourceEnum>(StatusResourceEnum.AVAILABLE, { nonNullable: true, validators: Validators.required }),
        observations: new FormControl(''),
    });

    brandControlSubscription?: Subscription;
    ngOnInit(): void {
        this.store.loadAll();
        this.brandStore.load();
        this.modelStore.load();
        this.formSubscribers();
    }

    formSubscribers() {
        this.brandControlSubscription = this.form.get("brandId")?.valueChanges.subscribe(async (value) => {
            if (!value) return;
            await this.modelStore.loadByBrand(value);
            this.form.get("modelId")?.enable();
        });
    }

    openCreate(): void {
        this.dialogTitle = 'Nuevo recurso';
        this.form.reset({
            brandId: '',
            modelId: '',
            type: ResourceTypeEnum.OTHER,
            assetCode: '',
            name: '',
            serialNumber: '',
            price: 0,
            status: StatusResourceEnum.AVAILABLE,
            observations: '',
        });
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload: CreateResourceCommand = {
            assetCode: this.form.controls.assetCode.value.trim(),
            name: this.form.controls.name.value.trim(),
            serialNumber: this.form.controls.serialNumber.value?.trim() || null,
            modelId: this.form.controls.modelId.value,
            type: this.form.controls.type.value,
            price: Number(this.form.controls.price.value) || 0,
            observations: this.form.controls.observations.value?.trim() || null,
            status: this.form.controls.status.value,
        };

        const success = await this.store.create(payload);
        if (success) {
            this.dialogVisible = false;
        }
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
        return isNaN(date.getTime()) ? '—' : date.toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    }

    ngOnDestroy(): void {
        this.brandControlSubscription?.unsubscribe();
    }
}