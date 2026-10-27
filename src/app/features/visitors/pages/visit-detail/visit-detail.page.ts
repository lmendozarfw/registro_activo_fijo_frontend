import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderService } from '../../../../core/services/page-header.service';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { FormLabelComponent } from '../../../../shared/components/form-label/form-label.component';
import { VisitStatusTagComponent } from '../../components/visit-status-tag/visit-status-tag.component';
import { VisitorAccessTagComponent } from '../../components/visitor-access-tag/visitor-access-tag.component';
import {
  VisitDetailDto,
  VisitorDocumentDto,
  VisitorDocumentType,
  VisitorEquipmentDto,
  VisitVisitorDto,
} from '../../models/visit.model';
import { VisitStore } from '../../stores/visit.store';
import {
  formatDate as formatDateValue,
  formatDateTime as formatDateTimeValue,
  formatVisitSchedule,
  visitorDocumentTypeLabel,
} from '../../utils/visit.utils';

type StatusAction = 'start' | 'finish' | 'cancel';
type ConfirmKind = 'status' | 'visitor' | 'equipment' | 'document';

interface ConfirmState {
  kind: ConfirmKind;
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
  action: () => Promise<boolean>;
}

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

@Component({
  selector: 'app-visit-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './visit-detail.page.html',
  imports: [
    ReactiveFormsModule,
    PIcon,
    ButtonModule,
    SelectModule,
    InputText,
    TextareaModule,
    TooltipModule,
    FormDialogComponent,
    FormLabelComponent,
    VisitStatusTagComponent,
    VisitorAccessTagComponent,
  ],
})
export class VisitDetailPage implements OnInit {
  protected readonly store = inject(VisitStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pageHeader = inject(PageHeaderService);

  protected readonly visitId = signal('');
  protected readonly detail = computed(() => this.store.detail());
  protected readonly visitors = computed(() => this.store.detail()?.visitors ?? []);
  protected readonly visitorCount = computed(() => this.visitors().length);
  protected readonly visitorsPending = computed(
    () => this.visitors().filter((visitor) => visitor.accessStatus === 'PENDING').length,
  );
  protected readonly visitorsAllowed = computed(
    () => this.visitors().filter((visitor) => visitor.accessStatus === 'PERMIT').length,
  );
  protected readonly visitorsDenied = computed(
    () => this.visitors().filter((visitor) => visitor.accessStatus === 'DENIED').length,
  );

  protected readonly canManage = computed(() => {
    const status = this.detail()?.status;
    return status === 'SCHEDULED' || status === 'STARTED';
  });
  protected readonly canEditVisit = computed(() => this.detail()?.status === 'SCHEDULED');
  protected readonly canStart = computed(() => this.detail()?.status === 'SCHEDULED');
  protected readonly canFinish = computed(() => this.detail()?.status === 'STARTED');
  protected readonly canCancel = computed(
    () => this.detail()?.status === 'SCHEDULED' || this.detail()?.status === 'STARTED',
  );

  protected readonly visitorDialogVisible = signal(false);
  protected readonly editingVisitor = signal<VisitVisitorDto | null>(null);
  protected readonly visitorSubmitted = signal(false);
  protected readonly visitorForm = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)],
    }),
  });

  protected readonly equipmentDialogVisible = signal(false);
  protected readonly equipmentVisitor = signal<VisitVisitorDto | null>(null);
  protected readonly editingEquipment = signal<VisitorEquipmentDto | null>(null);
  protected readonly equipmentSubmitted = signal(false);
  protected readonly equipmentForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)],
    }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    brandName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    modelName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    serialNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    observations: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(1000)],
    }),
  });

  protected readonly documentDialogVisible = signal(false);
  protected readonly documentVisitor = signal<VisitVisitorDto | null>(null);
  protected readonly selectedDocumentFile = signal<File | null>(null);
  protected readonly documentFileError = signal<string | null>(null);
  protected readonly documentSubmitted = signal(false);
  protected readonly documentTypeOptions: {
    label: string;
    value: VisitorDocumentType;
  }[] = [
    { label: 'NSS', value: 'NSS' },
    { label: 'INE', value: 'INE' },
  ];
  protected readonly documentForm = new FormGroup({
    documentType: new FormControl<VisitorDocumentType>('NSS', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly confirmState = signal<ConfirmState | null>(null);
  protected readonly confirmVisible = computed(() => this.confirmState() !== null);
  protected readonly confirmLoading = computed(() => {
    const state = this.confirmState();
    if (!state) return false;

    switch (state.kind) {
      case 'status':
        return this.store.actionLoading();
      case 'visitor':
        return this.store.visitorSaving();
      case 'equipment':
        return this.store.equipmentSaving();
      case 'document':
        return this.store.documentDeletingId() !== null;
    }
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/visitantes/visitas']);
      return;
    }

    this.visitId.set(id);
    this.pageHeader.setTitle('Detalle de visita');
    void this.store.loadDetail(id, true);
  }

  protected goBack(): void {
    void this.router.navigate(['/visitantes/visitas']);
  }

  protected retryLoad(): void {
    const id = this.visitId();
    if (!id) return;
    void this.store.loadDetail(id, true);
  }

  protected editVisit(): void {
    const id = this.visitId();
    if (!id) return;
    void this.router.navigate(['/visitantes/visitas', id, 'editar']);
  }

  protected openStatusAction(action: StatusAction): void {
    const detail = this.detail();
    if (!detail) return;

    const config = {
      start: {
        title: 'Iniciar visita',
        message: '¿Deseas iniciar esta visita? Se registrará la hora de entrada.',
        confirmLabel: 'Iniciar',
      },
      finish: {
        title: 'Finalizar visita',
        message: '¿Deseas finalizar esta visita? Se registrará la hora de salida.',
        confirmLabel: 'Finalizar',
      },
      cancel: {
        title: 'Cancelar visita',
        message: '¿Deseas cancelar esta visita? Esta acción no se puede revertir.',
        confirmLabel: 'Cancelar visita',
      },
    }[action];

    this.confirmState.set({
      kind: 'status',
      title: config.title,
      message: config.message,
      confirmLabel: config.confirmLabel,
      danger: action === 'cancel',
      action: () =>
        action === 'start'
          ? this.store.start(detail.id)
          : action === 'finish'
            ? this.store.finish(detail.id)
            : this.store.cancel(detail.id),
    });
  }

  protected openAddVisitor(): void {
    this.editingVisitor.set(null);
    this.visitorSubmitted.set(false);
    this.visitorForm.reset({ fullName: '' });
    this.visitorDialogVisible.set(true);
  }

  protected openEditVisitor(visitor: VisitVisitorDto): void {
    this.editingVisitor.set(visitor);
    this.visitorSubmitted.set(false);
    this.visitorForm.reset({ fullName: visitor.fullName });
    this.visitorDialogVisible.set(true);
  }

  protected async saveVisitor(): Promise<void> {
    this.visitorSubmitted.set(true);
    if (this.visitorForm.invalid) {
      this.visitorForm.markAllAsTouched();
      return;
    }

    const detail = this.detail();
    if (!detail) return;

    const fullName = this.visitorForm.controls.fullName.value.trim();
    const editing = this.editingVisitor();

    const success = editing
      ? await this.store.updateVisitor(detail.id, editing.id, fullName)
      : await this.store.addVisitor(detail.id, fullName);

    if (!success) return;

    this.visitorDialogVisible.set(false);
    this.editingVisitor.set(null);
  }

  protected requestRemoveVisitor(visitor: VisitVisitorDto): void {
    const detail = this.detail();
    if (!detail) return;

    this.confirmState.set({
      kind: 'visitor',
      title: 'Eliminar visitante',
      message: `¿Deseas eliminar a ${visitor.fullName} de esta visita? También se eliminarán sus equipos y documentos.`,
      confirmLabel: 'Eliminar',
      danger: true,
      action: () => this.store.removeVisitor(detail.id, visitor.id),
    });
  }

  protected async setVisitorAccess(
    visitor: VisitVisitorDto,
    accessStatus: 'PERMIT' | 'DENIED',
  ): Promise<void> {
    const detail = this.detail();
    if (!detail) return;
    await this.store.setVisitorAccess(detail.id, visitor.id, accessStatus);
  }

  protected openAddEquipment(visitor: VisitVisitorDto): void {
    this.equipmentVisitor.set(visitor);
    this.editingEquipment.set(null);
    this.equipmentSubmitted.set(false);
    this.equipmentForm.reset({
      name: '',
      type: '',
      brandName: '',
      modelName: '',
      serialNumber: '',
      observations: '',
    });
    this.equipmentDialogVisible.set(true);
  }

  protected openEditEquipment(visitor: VisitVisitorDto, equipment: VisitorEquipmentDto): void {
    this.equipmentVisitor.set(visitor);
    this.editingEquipment.set(equipment);
    this.equipmentSubmitted.set(false);
    this.equipmentForm.reset({
      name: equipment.name,
      type: equipment.type ?? '',
      brandName: equipment.brandName ?? '',
      modelName: equipment.modelName ?? '',
      serialNumber: equipment.serialNumber ?? '',
      observations: equipment.observations ?? '',
    });
    this.equipmentDialogVisible.set(true);
  }

  protected async saveEquipment(): Promise<void> {
    this.equipmentSubmitted.set(true);
    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      return;
    }

    const detail = this.detail();
    const visitor = this.equipmentVisitor();
    if (!detail || !visitor) return;

    const value = this.equipmentForm.getRawValue();
    const data = {
      name: value.name.trim(),
      type: value.type.trim() || null,
      brandName: value.brandName.trim() || null,
      modelName: value.modelName.trim() || null,
      serialNumber: value.serialNumber.trim() || null,
      observations: value.observations.trim() || null,
    };

    const editing = this.editingEquipment();
    const success = editing
      ? await this.store.updateEquipment(detail.id, visitor.id, editing.id, data)
      : await this.store.addEquipment(detail.id, visitor.id, data);

    if (!success) return;

    this.equipmentDialogVisible.set(false);
    this.equipmentVisitor.set(null);
    this.editingEquipment.set(null);
  }

  protected requestRemoveEquipment(visitor: VisitVisitorDto, equipment: VisitorEquipmentDto): void {
    const detail = this.detail();
    if (!detail) return;

    this.confirmState.set({
      kind: 'equipment',
      title: 'Eliminar equipo',
      message: `¿Deseas eliminar el equipo ${equipment.name}?`,
      confirmLabel: 'Eliminar',
      danger: true,
      action: () => this.store.removeEquipment(detail.id, visitor.id, equipment.id),
    });
  }

  protected openUploadDocument(visitor: VisitVisitorDto): void {
    this.documentVisitor.set(visitor);
    this.selectedDocumentFile.set(null);
    this.documentFileError.set(null);
    this.documentSubmitted.set(false);
    this.documentForm.reset({ documentType: 'NSS' });
    this.documentDialogVisible.set(true);
  }

  protected onDocumentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';

    this.selectedDocumentFile.set(null);
    this.documentFileError.set(null);

    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
      this.documentFileError.set('Formato no permitido. Usa PDF, JPG, JPEG, PNG o WEBP.');
      return;
    }

    if (file.size === 0) {
      this.documentFileError.set('El archivo está vacío.');
      return;
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      this.documentFileError.set('El documento no debe superar los 10 MB.');
      return;
    }

    this.selectedDocumentFile.set(file);
  }

  protected async uploadDocument(): Promise<void> {
    this.documentSubmitted.set(true);

    const file = this.selectedDocumentFile();
    if (!file) {
      this.documentFileError.set('Selecciona un archivo para cargar.');
      return;
    }

    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    const detail = this.detail();
    const visitor = this.documentVisitor();
    if (!detail || !visitor) return;

    const success = await this.store.uploadDocument(
      detail.id,
      visitor.id,
      this.documentForm.controls.documentType.value,
      file,
    );

    if (!success) return;

    this.documentDialogVisible.set(false);
    this.documentVisitor.set(null);
    this.selectedDocumentFile.set(null);
  }

  protected downloadDocument(visitor: VisitVisitorDto, document: VisitorDocumentDto): void {
    const detail = this.detail();
    if (!detail) return;
    void this.store.downloadDocument(detail.id, visitor.id, document);
  }

  protected requestRemoveDocument(visitor: VisitVisitorDto, document: VisitorDocumentDto): void {
    const detail = this.detail();
    if (!detail) return;

    this.confirmState.set({
      kind: 'document',
      title: 'Eliminar documento',
      message: `¿Deseas eliminar el documento ${document.originalName}? Esta acción no se puede revertir.`,
      confirmLabel: 'Eliminar',
      danger: true,
      action: () => this.store.removeDocument(detail.id, visitor.id, document.id),
    });
  }

  protected closeConfirm(): void {
    this.confirmState.set(null);
  }

  protected onConfirmVisibleChange(visible: boolean): void {
    if (!visible) this.closeConfirm();
  }

  protected async runConfirm(): Promise<void> {
    const state = this.confirmState();
    if (!state) return;

    const success = await state.action();
    if (success) this.closeConfirm();
  }

  protected showVisitorError(): boolean {
    const control = this.visitorForm.controls.fullName;
    return control.invalid && (control.touched || control.dirty || this.visitorSubmitted());
  }

  protected showEquipmentError(control: AbstractControl | null): boolean {
    return (
      !!control &&
      control.invalid &&
      (control.touched || control.dirty || this.equipmentSubmitted())
    );
  }

  protected showDocumentTypeError(): boolean {
    const control = this.documentForm.controls.documentType;
    return control.invalid && (control.touched || control.dirty || this.documentSubmitted());
  }

  protected formatSchedule(detail: VisitDetailDto): string {
    return formatVisitSchedule(detail);
  }

  protected formatDate(value: string | null | undefined): string {
    return formatDateValue(value);
  }

  protected formatDateTime(value: string | null | undefined): string {
    return formatDateTimeValue(value);
  }

  protected documentTypeLabel(type: string): string {
    return visitorDocumentTypeLabel(type);
  }

  protected documentSize(file: File): string {
    if (file.size < 1024) return `${file.size} B`;
    if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(1)} KB`;
    return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  }

  protected equipmentSummary(equipment: VisitorEquipmentDto): string {
    const parts = [equipment.type, equipment.brandName, equipment.modelName].filter(
      (value): value is string => !!value,
    );
    return parts.length > 0 ? parts.join(' · ') : 'Sin clasificación';
  }
}
