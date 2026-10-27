import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { FormLabelComponent } from '../../../../shared/components/form-label/form-label.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { BusinessUnit } from '../../models/business-unit.model';
import { BusinessUnitStore } from '../../stores/business-unit.store';

@Component({
  selector: 'app-business-units-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './business-units-table.component.html',
  imports: [
    ReactiveFormsModule,
    PIcon,
    ButtonModule,
    InputText,
    TableModule,
    TagModule,
    TooltipModule,
    FormDialogComponent,
    FormLabelComponent,
    SearchInputComponent,
    EmptyStateComponent,
  ],
})
export class BusinessUnitsTableComponent implements OnInit {
  protected readonly store = inject(BusinessUnitStore);

  protected readonly dialogVisible = signal(false);
  protected readonly editing = signal<BusinessUnit | null>(null);
  protected readonly submitted = signal(false);
  protected readonly confirmVisible = signal(false);
  protected readonly confirmTarget = signal<BusinessUnit | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)],
    }),
  });

  ngOnInit(): void {
    void this.store.setSearch('');
  }

  protected onSearch(search: string): void {
    void this.store.setSearch(search);
  }

  protected retryLoad(): void {
    void this.store.load();
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.submitted.set(false);
    this.form.reset({ name: '' });
    this.dialogVisible.set(true);
  }

  protected openEdit(item: BusinessUnit): void {
    this.editing.set(item);
    this.submitted.set(false);
    this.form.reset({ name: item.name });
    this.dialogVisible.set(true);
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.form.controls.name.value.trim();
    const editing = this.editing();
    const success = editing
      ? await this.store.update(editing.id, name)
      : await this.store.create(name);

    if (!success) return;
    this.dialogVisible.set(false);
    this.editing.set(null);
  }

  protected askToggle(item: BusinessUnit): void {
    this.confirmTarget.set(item);
    this.confirmVisible.set(true);
  }

  protected closeConfirm(): void {
    this.confirmVisible.set(false);
    this.confirmTarget.set(null);
  }

  protected onConfirmVisibleChange(visible: boolean): void {
    if (!visible) this.closeConfirm();
  }

  protected async confirmToggle(): Promise<void> {
    const item = this.confirmTarget();
    if (!item) return;

    const success = await this.store.setActive(item);
    if (success) this.closeConfirm();
  }

  protected showNameError(): boolean {
    const control = this.form.controls.name;
    return control.invalid && (control.touched || control.dirty || this.submitted());
  }

  protected formatDate(value: string | null | undefined): string {
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
