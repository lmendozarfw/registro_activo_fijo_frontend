import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PageHeaderService } from '../../../../core/services/page-header.service';
import { FormLabelComponent } from '../../../../shared/components/form-label/form-label.component';
import { DepartmentStore } from '../../../configuration/stores/department.store';
import { Employee } from '../../../employees/models/employee.model';
import { EmployeeStore } from '../../../employees/stores/employee.store';
import { VisitStatusTagComponent } from '../../components/visit-status-tag/visit-status-tag.component';
import { CreateVisitRequest, UpdateVisitRequest, VisitDetailDto } from '../../models/visit.model';
import { BusinessUnitStore } from '../../../configuration/stores/business-unit.store';
import { VisitStore } from '../../stores/visit.store';
import { fromUtcIso, toUtcIso } from '../../utils/visit.utils';

function scheduleRequired(group: AbstractControl): ValidationErrors | null {
  if (group.get('isWalkIn')?.value === true) return null;
  return group.get('scheduledStartAt')?.value ? null : { scheduleRequired: true };
}

function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('scheduledStartAt')?.value as Date | null;
  const end = group.get('scheduledEndAt')?.value as Date | null;

  if (!start || !end) return null;
  return end.getTime() > start.getTime() ? null : { endBeforeStart: true };
}

@Component({
  selector: 'app-visit-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './visit-form.page.html',
  imports: [
    ReactiveFormsModule,
    PIcon,
    ButtonModule,
    DatePickerModule,
    InputText,
    SelectModule,
    TextareaModule,
    ToggleSwitchModule,
    FormLabelComponent,
    VisitStatusTagComponent,
  ],
})
export class VisitFormPage implements OnInit {
  protected readonly store = inject(VisitStore);
  protected readonly businessUnitStore = inject(BusinessUnitStore);
  protected readonly departmentStore = inject(DepartmentStore);
  protected readonly employeeStore = inject(EmployeeStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly pageHeader = inject(PageHeaderService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly visitId = signal<string | null>(null);
  protected readonly isEditing = computed(() => !!this.visitId());
  protected readonly submitted = signal(false);
  protected readonly today = new Date();

  protected readonly canEdit = computed(() => {
    if (!this.isEditing()) return true;
    return this.store.detail()?.status === 'SCHEDULED';
  });

  protected readonly employeeOptions = computed(() =>
    this.employeeStore.employees().map((employee) => ({
      id: employee.id,
      label: this.employeeFullName(employee),
      employeeNumber: employee.employeeNumber,
    })),
  );

  protected readonly form = new FormGroup(
    {
      companyName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)],
      }),
      reason: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(500)],
      }),
      observations: new FormControl('', {
        nonNullable: true,
        validators: [Validators.maxLength(2000)],
      }),
      businessUnitId: new FormControl('', {
        nonNullable: true,
        validators: [],
      }),
      departmentId: new FormControl('', {
        nonNullable: true,
        validators: [],
      }),
      employeeId: new FormControl<string | null>(null),
      highRiskActivity: new FormControl(false, { nonNullable: true }),
      isWalkIn: new FormControl(false, { nonNullable: true }),
      scheduledStartAt: new FormControl<Date | null>(null),
      scheduledEndAt: new FormControl<Date | null>(null),
      visitors: new FormArray<FormControl<string>>([this.createVisitorControl()]),
    },
    { validators: [scheduleRequired, endAfterStart] },
  );

  private readonly isWalkInValue = toSignal(this.form.controls.isWalkIn.valueChanges, {
    initialValue: this.form.controls.isWalkIn.value,
  });

  protected readonly isWalkIn = computed(() => this.isWalkInValue() === true);

  constructor() {
    effect(() => {
      const isEditing = this.isEditing();
      if (isEditing) {
        // quitar validacion de visitantes
        this.form.controls.visitors.controls.forEach(c => {
          c.clearValidators();
          c.updateValueAndValidity();
        });
      }
    });
  }

  ngOnInit(): void {
    this.form.controls.isWalkIn.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isWalkIn) => {
        if (!isWalkIn) return;
        this.form.controls.scheduledStartAt.reset(null, { emitEvent: false });
        this.form.controls.scheduledEndAt.reset(null, { emitEvent: false });
      });

    void Promise.all([
      this.businessUnitStore.loadActive(),
      this.departmentStore.loadActive(),
      this.employeeStore.loadActive(),
    ]);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.store.clearDetail();
      this.pageHeader.setTitle('Nueva visita');
      return;
    }

    this.visitId.set(id);
    if (this.store.detail()?.id !== id) {
      this.store.clearDetail();
    }
    this.form.controls.isWalkIn.disable({ emitEvent: false });
    this.pageHeader.setTitle('Editar visita');
    void this.loadForEdit(id);
  }

  protected get visitors(): FormArray<FormControl<string>> {
    return this.form.controls.visitors;
  }

  protected addVisitor(): void {
    this.visitors.push(this.createVisitorControl());
  }

  protected removeVisitor(index: number): void {
    if (this.visitors.length <= 1) return;
    this.visitors.removeAt(index);
  }

  protected showError(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.touched || control.dirty || this.submitted());
  }

  protected showVisitorError(): boolean {
    return this.visitors.invalid && (this.visitors.touched || this.submitted());
  }

  protected showScheduleError(): boolean {
    return (
      !!this.form.errors?.['scheduleRequired'] &&
      (this.form.controls.scheduledStartAt.touched || this.submitted()) &&
      !this.isWalkIn()
    );
  }

  protected showEndError(): boolean {
    return (
      !!this.form.errors?.['endBeforeStart'] &&
      (this.form.controls.scheduledEndAt.touched || this.submitted()) &&
      !this.isWalkIn()
    );
  }

  protected retryLoad(): void {
    const id = this.visitId();
    if (!id) return;
    void this.loadForEdit(id);
  }

  protected cancel(): void {
    const id = this.visitId();
    if (id) {
      void this.router.navigate(['/visitantes/visitas', id]);
      return;
    }

    void this.router.navigate(['/visitantes/visitas']);
  }

  protected openDetail(): void {
    const id = this.visitId();
    if (!id) return;
    void this.router.navigate(['/visitantes/visitas', id]);
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);
    console.log({form: this.form});
    console.log('es invalido ?', this.form.invalid);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const isWalkIn = value.isWalkIn === true;
    const scheduledStartAt = isWalkIn ? null : toUtcIso(value.scheduledStartAt);
    const scheduledEndAt = isWalkIn ? null : toUtcIso(value.scheduledEndAt);

    if (!isWalkIn && !scheduledStartAt) {
      this.form.markAllAsTouched();
      return;
    }

    const base: UpdateVisitRequest = {
      companyName: value.companyName.trim(),
      reason: value.reason.trim(),
      observations: value.observations.trim() || null,
      businessUnitId: value.businessUnitId,
      departmentId: value.departmentId,
      employeeId: value.employeeId || null,
      highRiskActivity: value.highRiskActivity,
      scheduledStartAt,
      scheduledEndAt,
    };

    const id = this.visitId();
    if (id) {
      const success = await this.store.update(id, base);
      if (!success) return;
      await this.router.navigate(['/visitantes/visitas', id]);
      return;
    }

    const visitors = value.visitors
      .map((fullName) => fullName.trim())
      .filter((fullName) => fullName.length > 0)
      .map((fullName) => ({ fullName }));

    if (visitors.length === 0) {
      this.visitors.markAsTouched();
      return;
    }

    const request: CreateVisitRequest = {
      ...base,
      isWalkIn,
      visitors,
    };

    const createdId = await this.store.create(request);
    if (!createdId) return;

    await this.router.navigate(['/visitantes/visitas', createdId]);
  }

  private createVisitorControl(): FormControl<string> {
    return new FormControl('', {
      nonNullable: true,
      validators: this.isEditing() ? [] : [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)],
    });
  }

  private async loadForEdit(id: string): Promise<void> {
    await this.store.loadDetail(id, true);

    const detail = this.store.detail();
    if (detail?.id === id) {
      this.patchForm(detail);
    }
  }

  private patchForm(detail: VisitDetailDto): void {
    this.form.patchValue({
      companyName: detail.companyName,
      reason: detail.reason,
      observations: detail.observations ?? '',
      businessUnitId: detail.businessUnitId,
      departmentId: detail.departmentId,
      employeeId: detail.employeeId,
      highRiskActivity: detail.highRiskActivity,
      isWalkIn: detail.isWalkIn,
      scheduledStartAt: fromUtcIso(detail.scheduledStartAt),
      scheduledEndAt: fromUtcIso(detail.scheduledEndAt),
    });
  }

  private employeeFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.paternalSurname} ${employee.maternalSurname}`.trim();
  }
}
