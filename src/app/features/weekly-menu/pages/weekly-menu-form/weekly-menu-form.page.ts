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
import { InputText } from 'primeng/inputtext';
import { PageHeaderService } from '../../../../core/services/page-header.service';
import { FormLabelComponent } from '../../../../shared/components/form-label/form-label.component';
import { WeeklyMenuImagePickerComponent } from '../../components/weekly-menu-image-picker/weekly-menu-image-picker.component';
import { WeeklyMenuStatusTagComponent } from '../../components/weekly-menu-status-tag/weekly-menu-status-tag.component';
import { WeeklyMenuDto } from '../../models/weekly-menu.model';
import { WeeklyMenuStore } from '../../stores/weekly-menu.store';
import {
  fromDateOnly,
  hasOverlappingWeeklyMenu,
  resolveWeeklyMenuStatus,
  toDateOnly,
} from '../../utils/weekly-menu.utils';

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const startDate = toDateOnly(group.get('startDate')?.value as Date | null);
  const endDate = toDateOnly(group.get('endDate')?.value as Date | null);

  if (!startDate || !endDate) return null;

  return startDate <= endDate ? null : { dateRange: true };
}

@Component({
  selector: 'app-weekly-menu-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekly-menu-form.page.html',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    InputText,
    FormLabelComponent,
    WeeklyMenuImagePickerComponent,
    WeeklyMenuStatusTagComponent,
  ],
})
export class WeeklyMenuFormPage implements OnInit {
  protected readonly store = inject(WeeklyMenuStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly pageHeader = inject(PageHeaderService);

  protected readonly menuId = signal<string | null>(null);
  protected readonly isEditing = computed(() => !!this.menuId());
  protected readonly submitted = signal(false);
  protected readonly selectedFile = signal<File | null>(null);

  protected readonly form = new FormGroup(
    {
      startDate: new FormControl<Date | null>(null, {
        validators: [Validators.required],
      }),
      endDate: new FormControl<Date | null>(null, {
        validators: [Validators.required],
      }),
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(150)],
      }),
    },
    { validators: [dateRangeValidator] },
  );

  protected readonly startDateValue = toSignal(
    this.form.controls.startDate.valueChanges,
    { initialValue: this.form.controls.startDate.value },
  );

  protected readonly endDateValue = toSignal(
    this.form.controls.endDate.valueChanges,
    { initialValue: this.form.controls.endDate.value },
  );

  protected readonly dateRangeInvalid = computed(() => {
    const startDate = toDateOnly(this.startDateValue());
    const endDate = toDateOnly(this.endDateValue());

    return !!startDate && !!endDate && startDate > endDate;
  });

  protected readonly overlapError = computed(() => {
    const startDate = toDateOnly(this.startDateValue());
    const endDate = toDateOnly(this.endDateValue());

    if (!startDate || !endDate || startDate > endDate) return null;

    const id = this.menuId();
    return hasOverlappingWeeklyMenu(
      this.store.items(),
      startDate,
      endDate,
      id ?? undefined,
    )
      ? 'Ya existe un menú que se traslapa con las fechas seleccionadas.'
      : null;
  });

  protected readonly imageError = computed(
    () => this.submitted() && !this.isEditing() && !this.selectedFile(),
  );

  protected readonly detailStatus = computed(() => {
    const detail = this.store.detail();
    return detail ? resolveWeeklyMenuStatus(detail) : null;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.store.clearDetail();
      this.pageHeader.setTitle('Nuevo menú semanal');
      return;
    }

    this.menuId.set(id);
    this.pageHeader.setTitle('Editar menú semanal');
    void this.loadForEdit(id);
  }

  protected retryLoad(): void {
    const id = this.menuId();
    if (!id) return;
    void this.loadForEdit(id);
  }

  protected onFileSelected(file: File): void {
    this.selectedFile.set(file);
  }

  protected selectCurrentWeek(): void {
    const today = new Date();
    const day = today.getDay();
    const offset = day === 0 ? -6 : 1 - day;

    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + offset,
    );
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + 4,
    );

    this.form.patchValue({ startDate, endDate });
    this.form.controls.startDate.markAsTouched();
    this.form.controls.endDate.markAsTouched();
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);

    if (
      this.form.invalid ||
      this.dateRangeInvalid() ||
      (!this.isEditing() && !this.selectedFile())
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const startDate = toDateOnly(value.startDate);
    const endDate = toDateOnly(value.endDate);

    if (!startDate || !endDate) return;

    const title = value.title.trim() || null;
    const id = this.menuId();

    if (id) {
      const success = await this.store.update(id, {
        startDate,
        endDate,
        title,
        file: this.selectedFile(),
      });

      if (success) this.cancel();
      return;
    }

    const createdId = await this.store.create({
      startDate,
      endDate,
      title,
      file: this.selectedFile()!,
    });

    if (createdId) this.cancel();
  }

  protected cancel(): void {
    void this.router.navigate(['/comunicacion/menu']);
  }

  private async loadForEdit(id: string): Promise<void> {
    await this.store.loadDetail(id, true);

    const detail = this.store.detail();
    if (detail?.id === id) {
      this.patchForm(detail);
    }
  }

  private patchForm(detail: WeeklyMenuDto): void {
    this.form.reset({
      startDate: fromDateOnly(detail.startDate),
      endDate: fromDateOnly(detail.endDate),
      title: detail.title ?? '',
    });
  }
}
