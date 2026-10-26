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
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { EditorModule } from 'primeng/editor';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PageHeaderService } from '../../../../core/services/page-header.service';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { FormLabelComponent } from '../../../../shared/components/form-label/form-label.component';
import {
  NewsImageManagerComponent,
  NewsImageUploadRequest,
} from '../../components/news-image-manager/news-image-manager.component';
import { NewsStatusTagComponent } from '../../components/news-status-tag/news-status-tag.component';
import {
  EditableNewsStatus,
  NewsDetailDto,
  NewsImageDto,
  SaveNewsRequest,
} from '../../models/news.model';
import { NewsDatePipe } from '../../pipes/news-date.pipe';
import { NewsStore } from '../../stores/news.store';
import { fromUtcIso, isRichTextEmpty, toUtcIso } from '../../utils/news.utils';

function richTextRequired(control: AbstractControl<string | null>): ValidationErrors | null {
  return isRichTextEmpty(control.value) ? { required: true } : null;
}

function scheduleRequired(group: AbstractControl): ValidationErrors | null {
  const status = group.get('status')?.value as EditableNewsStatus | null;
  const scheduledPublishAt = group.get('scheduledPublishAt')?.value as Date | null;

  return status === 'Scheduled' && !scheduledPublishAt
    ? { scheduleRequired: true }
    : null;
}

@Component({
  selector: 'app-news-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './news-form.page.html',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    EditorModule,
    InputText,
    SelectModule,
    FormLabelComponent,
    FormDialogComponent,
    NewsImageManagerComponent,
    NewsStatusTagComponent,
    NewsDatePipe,
  ],
})
export class NewsFormPage implements OnInit {
  protected readonly store = inject(NewsStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly pageHeader = inject(PageHeaderService);

  protected readonly newsId = signal<string | null>(null);
  protected readonly isEditing = computed(() => !!this.newsId());
  protected readonly isArchived = computed(
    () => this.store.detail()?.status === 'Archived',
  );
  protected readonly submitted = signal(false);

  protected readonly statusOptions: {
    label: string;
    value: EditableNewsStatus;
  }[] = [
    { label: 'Borrador', value: 'Draft' },
    { label: 'Programada', value: 'Scheduled' },
    { label: 'Publicada', value: 'Published' },
  ];

  protected readonly form = new FormGroup(
    {
      title: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(/\S/),
          Validators.maxLength(200),
        ],
      }),
      content: new FormControl('', {
        nonNullable: true,
        validators: [richTextRequired],
      }),
      status: new FormControl<EditableNewsStatus>('Draft', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      scheduledPublishAt: new FormControl<Date | null>(null),
    },
    { validators: [scheduleRequired] },
  );

  private readonly statusValue = toSignal(
    this.form.controls.status.valueChanges,
    { initialValue: this.form.controls.status.value },
  );

  protected readonly isScheduled = computed(
    () => this.statusValue() === 'Scheduled',
  );

  protected readonly scheduleDateValue = toSignal(
    this.form.controls.scheduledPublishAt.valueChanges,
    { initialValue: this.form.controls.scheduledPublishAt.value },
  );

  protected readonly scheduleError = computed(
    () =>
      this.submitted() &&
      this.isScheduled() &&
      !this.scheduleDateValue(),
  );

  protected readonly minDate = new Date();

  protected readonly imageToDelete = signal<NewsImageDto | null>(null);
  protected readonly deleteImageDialogVisible = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.store.clearDetail();
      this.pageHeader.setTitle('Nueva noticia');
      return;
    }

    this.newsId.set(id);
    this.pageHeader.setTitle('Editar noticia');
    void this.loadForEdit(id);
  }

  protected retryLoad(): void {
    const id = this.newsId();
    if (!id) return;
    void this.loadForEdit(id);
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const scheduledPublishAt =
      value.status === 'Scheduled' ? toUtcIso(value.scheduledPublishAt) : null;

    if (value.status === 'Scheduled' && !scheduledPublishAt) {
      this.form.markAllAsTouched();
      return;
    }

    const request: SaveNewsRequest = {
      title: value.title.trim(),
      content: value.content,
      status: value.status,
      scheduledPublishAt,
    };

    const id = this.newsId();
    if (id) {
      await this.store.update(id, request);
      return;
    }

    const createdId = await this.store.create(request);
    if (!createdId) return;

    await this.router.navigate([
      '/comunicacion/noticias',
      createdId,
      'editar',
    ]);
  }

  protected cancel(): void {
    void this.router.navigate(['/comunicacion/noticias']);
  }

  protected async uploadImage(event: NewsImageUploadRequest): Promise<void> {
    const id = this.newsId();
    if (!id) return;

    await this.store.uploadImage(id, event.file, event.isCover);
  }

  protected async setCover(image: NewsImageDto): Promise<void> {
    const id = this.newsId();
    if (!id) return;

    await this.store.setCover(id, image.id);
  }

  protected requestRemoveImage(image: NewsImageDto): void {
    this.imageToDelete.set(image);
    this.deleteImageDialogVisible.set(true);
  }

  protected async confirmRemoveImage(): Promise<void> {
    const id = this.newsId();
    const image = this.imageToDelete();
    if (!id || !image) return;

    const success = await this.store.removeImage(id, image.id);
    if (!success) return;

    this.imageToDelete.set(null);
    this.deleteImageDialogVisible.set(false);
  }

  private async loadForEdit(id: string): Promise<void> {
    await this.store.loadDetail(id, true);

    const detail = this.store.detail();
    if (detail?.id === id) {
      this.patchForm(detail);
    }
  }

  private patchForm(detail: NewsDetailDto): void {
    const status: EditableNewsStatus =
      detail.status === 'Archived' ? 'Draft' : detail.status;

    this.form.reset({
      title: detail.title,
      content: detail.content,
      status,
      scheduledPublishAt: fromUtcIso(detail.scheduledPublishAt),
    });
  }
}
