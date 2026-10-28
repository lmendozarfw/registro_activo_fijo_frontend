import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderService } from '../../../core/services/page-header.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { FormDialogComponent } from '../../../shared/components/form-dialog/form-dialog.component';
import { FormLabelComponent } from '../../../shared/components/form-label/form-label.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import {
  SaveSharePointAccessRequest,
  SharePointAccessRecord,
  SharePointAccessStatusFilter,
} from '../models/sharepoint-access.model';
import { SharePointAccessAdminStore } from '../stores/sharepoint-access-admin.store';

type SharePointAccessView = SharePointAccessRecord & { safeUrl: string | null };

function httpUrlValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = (control.value ?? '').trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? null : { protocol: true };
  } catch {
    return { url: true };
  }
}

@Component({
  selector: 'app-sharepoint-accesses-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sharepoint-accesses.page.html',
  imports: [
    ReactiveFormsModule,
    PIcon,
    ButtonModule,
    CheckboxModule,
    InputText,
    SelectModule,
    TableModule,
    TagModule,
    Textarea,
    TooltipModule,
    EmptyStateComponent,
    FormDialogComponent,
    FormLabelComponent,
    SearchInputComponent,
  ],
})
export class SharePointAccessesPage implements OnInit {
  protected readonly store = inject(SharePointAccessAdminStore);
  private readonly pageHeader = inject(PageHeaderService);

  protected readonly dialogVisible = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly isEditing = computed(() => !!this.editingId());

  protected readonly deactivateTarget = signal<SharePointAccessRecord | null>(null);
  protected readonly deactivateDialogVisible = signal(false);

  protected readonly search = signal('');
  protected readonly statusOptions: {
    label: string;
    value: SharePointAccessStatusFilter;
  }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' },
  ];
  protected readonly statusControl = new FormControl<SharePointAccessStatusFilter>('all', {
    nonNullable: true,
  });
  protected readonly statusFilter = toSignal(this.statusControl.valueChanges, {
    initialValue: this.statusControl.value,
  });

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(150)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(300)],
    }),
    url: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, httpUrlValidator],
    }),
    active: new FormControl(true, { nonNullable: true }),
  });

  protected readonly viewItems = computed<SharePointAccessView[]>(() =>
    this.store.items().map((item) => ({
      ...item,
      safeUrl: this.toSafeUrl(item.url),
    })),
  );

  protected readonly filteredItems = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    return this.viewItems().filter((item) => {
      const matchesStatus = status === 'all' || (status === 'active' ? item.active : !item.active);
      if (!matchesStatus) return false;
      if (!term) return true;

      return `${item.name} ${item.description ?? ''} ${item.url}`.toLowerCase().includes(term);
    });
  });

  protected readonly hasFilters = computed(() => !!this.search() || this.statusFilter() !== 'all');

  ngOnInit(): void {
    this.pageHeader.setTitle('Accesos SharePoint');
    void this.store.load();
  }

  protected onSearch(search: string): void {
    this.search.set(search);
  }

  protected retry(): void {
    void this.store.refresh();
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.store.clearDetail();
    this.form.reset({
      name: '',
      description: '',
      url: '',
      active: true,
    });
    this.dialogVisible.set(true);
  }

  protected async openEdit(item: SharePointAccessRecord): Promise<void> {
    this.editingId.set(item.id);
    this.form.reset({
      name: item.name,
      description: item.description ?? '',
      url: item.url,
      active: item.active,
    });
    this.dialogVisible.set(true);
    await this.loadDetail(item.id);
  }

  protected onDialogVisibleChange(visible: boolean): void {
    this.dialogVisible.set(visible);

    if (!visible) {
      this.editingId.set(null);
      this.store.clearDetail();
    }
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: SaveSharePointAccessRequest = {
      name: value.name.trim(),
      description: value.description.trim() || null,
      url: value.url.trim(),
      active: value.active,
    };

    const id = this.editingId();
    const success = id ? await this.store.update(id, payload) : await this.store.create(payload);

    if (success) {
      this.closeDialog();
    }
  }

  protected toggleActive(item: SharePointAccessRecord): void {
    if (!item.active) {
      void this.store.setActive(item.id, true);
      return;
    }

    this.deactivateTarget.set(item);
    this.deactivateDialogVisible.set(true);
  }

  protected async confirmDeactivate(): Promise<void> {
    const target = this.deactivateTarget();
    if (!target) return;

    const success = await this.store.setActive(target.id, false);
    if (!success) return;

    this.onDeactivateVisibleChange(false);
  }

  protected onDeactivateVisibleChange(visible: boolean): void {
    this.deactivateDialogVisible.set(visible);
    if (!visible) this.deactivateTarget.set(null);
  }

  protected retryDetail(): void {
    const id = this.editingId();
    if (!id) return;
    void this.loadDetail(id);
  }

  protected nameError(): string {
    const control = this.form.controls.name;
    if (!control.invalid || !control.touched) return '';
    if (control.hasError('required') || control.hasError('pattern')) {
      return 'El nombre es obligatorio.';
    }
    if (control.hasError('maxlength')) {
      return 'El nombre debe tener máximo 150 caracteres.';
    }
    return 'Verifica el nombre del acceso.';
  }

  protected descriptionError(): string {
    const control = this.form.controls.description;
    if (!control.invalid || !control.touched) return '';
    return 'La descripción debe tener máximo 300 caracteres.';
  }

  protected urlError(): string {
    const control = this.form.controls.url;
    if (!control.invalid || !control.touched) return '';
    if (control.hasError('required')) return 'La URL es obligatoria.';
    if (control.hasError('protocol')) {
      return 'La URL debe iniciar con http:// o https://.';
    }
    return 'Ingresa una URL válida, por ejemplo https://empresa.sharepoint.com.';
  }

  protected formatDate(value: string | null | undefined): string {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private async loadDetail(id: string): Promise<void> {
    const detail = await this.store.loadDetail(id);
    if (!detail || this.editingId() !== id) return;

    this.patchForm(detail);
  }

  private patchForm(detail: SharePointAccessRecord): void {
    this.form.reset({
      name: detail.name,
      description: detail.description ?? '',
      url: detail.url,
      active: detail.active,
    });
  }

  private closeDialog(): void {
    this.dialogVisible.set(false);
    this.editingId.set(null);
    this.store.clearDetail();
  }

  private toSafeUrl(url: string): string | null {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
    } catch {
      return null;
    }
  }
}
