import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderService } from '../../../../core/services/page-header.service';
import { DepartmentStore } from '../../../configuration/stores/department.store';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { VisitStatusTagComponent } from '../../components/visit-status-tag/visit-status-tag.component';
import { VisitListItem, VisitStatusFilter } from '../../models/visit.model';
import { BusinessUnitStore } from '../../../configuration/stores/business-unit.store';
import { VisitStore } from '../../stores/visit.store';
import {
  formatDateTime,
  formatVisitSchedule,
  toUtcEndOfDay,
  toUtcStartOfDay,
} from '../../utils/visit.utils';

type StatusAction = 'start' | 'finish' | 'cancel';

@Component({
  selector: 'app-visits-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './visits-list.page.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PIcon,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    TableModule,
    TooltipModule,
    FormDialogComponent,
    SearchInputComponent,
    EmptyStateComponent,
    VisitStatusTagComponent,
  ],
})
export class VisitsListPage implements OnInit {
  protected readonly store = inject(VisitStore);
  protected readonly businessUnitStore = inject(BusinessUnitStore);
  protected readonly departmentStore = inject(DepartmentStore);
  private readonly pageHeader = inject(PageHeaderService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly dateRange = new FormControl<Date[] | null>(null);
  protected readonly actionTarget = signal<VisitListItem | null>(null);
  protected readonly actionType = signal<StatusAction | null>(null);
  protected readonly confirmVisible = signal(false);

  protected readonly statusOptions: { label: string; value: VisitStatusFilter }[] = [
    { label: 'Todas', value: 'All' },
    { label: 'Programadas', value: 'SCHEDULED' },
    { label: 'En curso', value: 'STARTED' },
    { label: 'Finalizadas', value: 'FINISHED' },
    { label: 'Canceladas', value: 'CANCELLED' },
  ];

  protected readonly hasFilters = computed(
    () =>
      this.store.status() !== 'All' ||
      !!this.store.search() ||
      !!this.store.businessUnitId() ||
      !!this.store.departmentId() ||
      !!this.store.from() ||
      !!this.store.to(),
  );

  protected readonly confirmTitle = computed(() => {
    switch (this.actionType()) {
      case 'start':
        return 'Iniciar visita';
      case 'finish':
        return 'Finalizar visita';
      case 'cancel':
        return 'Cancelar visita';
      default:
        return '';
    }
  });

  protected readonly confirmLabel = computed(() => {
    switch (this.actionType()) {
      case 'start':
        return 'Iniciar';
      case 'finish':
        return 'Finalizar';
      case 'cancel':
        return 'Cancelar visita';
      default:
        return 'Confirmar';
    }
  });

  protected readonly confirmMessage = computed(() => {
    const visit = this.actionTarget();
    if (!visit) return '';

    switch (this.actionType()) {
      case 'start':
        return `¿Deseas iniciar la visita de ${visit.companyName}? Se registrará la hora de entrada.`;
      case 'finish':
        return `¿Deseas finalizar la visita de ${visit.companyName}? Se registrará la hora de salida.`;
      case 'cancel':
        return `¿Deseas cancelar la visita de ${visit.companyName}? Esta acción no se puede revertir.`;
      default:
        return '';
    }
  });

  ngOnInit(): void {
    this.pageHeader.setTitle('Visitas');
    this.dateRange.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((range) => this.applyDateRange(range));

    void this.store.resetFilters();
    void this.businessUnitStore.loadActive();
    void this.departmentStore.loadActive();
  }

  protected onSearch(search: string): void {
    void this.store.setFilters({ search });
  }

  protected onStatusChange(status: VisitStatusFilter | null): void {
    void this.store.setFilters({ status: status ?? 'All' });
  }

  protected onBusinessUnitChange(id: string | null): void {
    void this.store.setFilters({ businessUnitId: id || null });
  }

  protected onDepartmentChange(id: string | null): void {
    void this.store.setFilters({ departmentId: id || null });
  }

  protected onPage(event: { first: number; rows: number }): void {
    void this.store.setPage(event.first, event.rows);
  }

  protected clearFilters(): void {
    this.dateRange.setValue(null, { emitEvent: false });
    void this.store.resetFilters();
  }

  protected newVisit(): void {
    void this.router.navigate(['/visitantes/visitas/nueva']);
  }

  protected retryLoad(): void {
    void this.store.load();
  }

  protected openVisit(visit: VisitListItem): void {
    void this.router.navigate(['/visitantes/visitas', visit.id]);
  }

  protected editVisit(visit: VisitListItem): void {
    void this.router.navigate(['/visitantes/visitas', visit.id, 'editar']);
  }

  protected onConfirmVisibleChange(visible: boolean): void {
    if (visible) {
      this.confirmVisible.set(true);
      return;
    }
    this.closeConfirm();
  }

  protected openAction(action: StatusAction, visit: VisitListItem): void {
    this.actionTarget.set(visit);
    this.actionType.set(action);
    this.confirmVisible.set(true);
  }

  protected closeConfirm(): void {
    this.confirmVisible.set(false);
    this.actionTarget.set(null);
    this.actionType.set(null);
  }

  protected async confirmAction(): Promise<void> {
    const visit = this.actionTarget();
    const action = this.actionType();
    if (!visit || !action) return;

    const success =
      action === 'start'
        ? await this.store.start(visit.id)
        : action === 'finish'
          ? await this.store.finish(visit.id)
          : await this.store.cancel(visit.id);

    if (!success) return;

    this.closeConfirm();
    await this.store.load();
  }

  protected formatSchedule(visit: VisitListItem): string {
    return formatVisitSchedule(visit);
  }

  protected formatDate(value: string | null | undefined): string {
    return formatDateTime(value);
  }

  private applyDateRange(range: Date[] | null): void {
    if (!range || range.length === 0) {
      void this.store.setFilters({ from: null, to: null });
      return;
    }

    if (range.length < 2) return;

    void this.store.setFilters({
      from: toUtcStartOfDay(range[0]),
      to: toUtcEndOfDay(range[1]),
    });
  }
}
