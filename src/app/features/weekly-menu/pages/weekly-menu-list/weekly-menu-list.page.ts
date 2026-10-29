import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderService } from '../../../../core/services/page-header.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { WeeklyMenuStatusTagComponent } from '../../components/weekly-menu-status-tag/weekly-menu-status-tag.component';
import { WeeklyMenuDto } from '../../models/weekly-menu.model';
import { WeeklyMenuStore } from '../../stores/weekly-menu.store';
import {
  formatWeeklyMenuPeriod,
  resolveWeeklyMenuStatus,
} from '../../utils/weekly-menu.utils';
import { HeaderPageSectionComponent } from '../../../../shared/components/header-page-section/header-page-section.component';

@Component({
  selector: 'app-weekly-menu-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weekly-menu-list.page.html',
  imports: [
    DatePipe,
    ButtonModule,
    TableModule,
    TooltipModule,
    PIcon,
    EmptyStateComponent,
    FormDialogComponent,
    SearchInputComponent,
    WeeklyMenuStatusTagComponent,
    HeaderPageSectionComponent
],
})
export class WeeklyMenuListPage implements OnInit {
  protected readonly store = inject(WeeklyMenuStore);
  private readonly router = inject(Router);
  private readonly pageHeader = inject(PageHeaderService);

  protected readonly viewItems = computed(() =>
    this.store.items().map((menu) => ({
      ...menu,
      period: formatWeeklyMenuPeriod(menu.startDate, menu.endDate),
      status: resolveWeeklyMenuStatus(menu),
    })),
  );

  protected readonly removeTarget = signal<WeeklyMenuDto | null>(null);
  protected readonly removeDialogVisible = signal(false);

  ngOnInit(): void {
    this.pageHeader.setTitle('Menú semanal');
    void this.store.resetFilters();
  }

  protected onSearch(search: string): void {
    void this.store.setSearch(search);
  }

  protected create(): void {
    void this.router.navigate(['/comunicacion/menu/nuevo']);
  }

  protected edit(id: string): void {
    void this.router.navigate(['/comunicacion/menu', id, 'editar']);
  }

  protected retry(): void {
    void this.store.refresh();
  }

  protected requestRemove(menu: WeeklyMenuDto): void {
    this.removeTarget.set(menu);
    this.removeDialogVisible.set(true);
  }

  protected async confirmRemove(): Promise<void> {
    const target = this.removeTarget();
    if (!target) return;

    const success = await this.store.remove(target.id);
    if (!success) return;

    this.removeTarget.set(null);
    this.removeDialogVisible.set(false);
  }
}
