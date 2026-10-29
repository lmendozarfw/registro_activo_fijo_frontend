import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PageHeaderService } from '../../../../core/services/page-header.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FormDialogComponent } from '../../../../shared/components/form-dialog/form-dialog.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { NewsStatusTagComponent } from '../../components/news-status-tag/news-status-tag.component';
import {
  NewsListDto,
  NewsStatusFilter,
} from '../../models/news.model';
import { NewsDatePipe } from '../../pipes/news-date.pipe';
import { NewsStore } from '../../stores/news.store';
import { fromUtcIso, toUtcIso } from '../../utils/news.utils';
import { HeaderPageSectionComponent } from '../../../../shared/components/header-page-section/header-page-section.component';

@Component({
  selector: 'app-news-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './news-list.page.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    TableModule,
    TooltipModule,
    PIcon,
    FormDialogComponent,
    EmptyStateComponent,
    SearchInputComponent,
    NewsStatusTagComponent,
    NewsDatePipe,
    HeaderPageSectionComponent
],
})
export class NewsListPage implements OnInit {
  protected readonly store = inject(NewsStore);
  private readonly router = inject(Router);
  private readonly pageHeader = inject(PageHeaderService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly statusOptions: { label: string; value: NewsStatusFilter }[] = [
    { label: 'Todas', value: 'All' },
    { label: 'Borradores', value: 'Draft' },
    { label: 'Programadas', value: 'Scheduled' },
    { label: 'Publicadas', value: 'Published' },
    { label: 'Archivadas', value: 'Archived' },
  ];

  protected readonly statusControl = new FormControl<NewsStatusFilter>('All', {
    nonNullable: true,
  });

  protected readonly viewItems = computed(() =>
    this.store.items().map((news) => ({
      ...news,
      canViewPublic: news.status === 'Published',
      canPublish: news.status === 'Draft' || news.status === 'Scheduled',
      canSchedule: news.status === 'Draft' || news.status === 'Scheduled',
      canArchive: news.status !== 'Archived',
    })),
  );

  protected readonly publishTarget = signal<NewsListDto | null>(null);
  protected readonly publishDialogVisible = signal(false);

  protected readonly archiveTarget = signal<NewsListDto | null>(null);
  protected readonly archiveDialogVisible = signal(false);

  protected readonly scheduleTarget = signal<NewsListDto | null>(null);
  protected readonly scheduleDialogVisible = signal(false);
  protected readonly scheduleControl = new FormControl<Date | null>(null);
  protected readonly scheduleValue = toSignal(this.scheduleControl.valueChanges, {
    initialValue: this.scheduleControl.value,
  });
  protected readonly minDate = new Date();

  ngOnInit(): void {
    this.pageHeader.setTitle('Noticias');
    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        void this.store.setStatus(status);
      });

    void this.store.resetFilters();
  }

  protected onSearch(search: string): void {
    void this.store.setSearch(search);
  }

  protected create(): void {
    void this.router.navigate(['/comunicacion/noticias/nueva']);
  }

  protected edit(id: string): void {
    void this.router.navigate(['/comunicacion/noticias', id, 'editar']);
  }

  protected retry(): void {
    void this.store.refresh();
  }

  protected openPublish(news: NewsListDto): void {
    this.publishTarget.set(news);
    this.publishDialogVisible.set(true);
  }

  protected async confirmPublish(): Promise<void> {
    const target = this.publishTarget();
    if (!target) return;

    const success = await this.store.publish(target.id);
    if (!success) return;

    this.publishTarget.set(null);
    this.publishDialogVisible.set(false);
  }

  protected openArchive(news: NewsListDto): void {
    this.archiveTarget.set(news);
    this.archiveDialogVisible.set(true);
  }

  protected async confirmArchive(): Promise<void> {
    const target = this.archiveTarget();
    if (!target) return;

    const success = await this.store.archive(target.id);
    if (!success) return;

    this.archiveTarget.set(null);
    this.archiveDialogVisible.set(false);
  }

  protected openSchedule(news: NewsListDto): void {
    const scheduled = fromUtcIso(news.scheduledPublishAt);
    const fallback = new Date(Date.now() + 60 * 60 * 1000);

    this.scheduleTarget.set(news);
    this.scheduleControl.setValue(scheduled ?? fallback);
    this.scheduleDialogVisible.set(true);
  }

  protected async confirmSchedule(): Promise<void> {
    const target = this.scheduleTarget();
    const scheduledPublishAt = toUtcIso(this.scheduleControl.value);

    if (!target || !scheduledPublishAt) {
      this.scheduleControl.markAsTouched();
      return;
    }

    const success = await this.store.schedule(target.id, scheduledPublishAt);
    if (!success) return;

    this.scheduleTarget.set(null);
    this.scheduleDialogVisible.set(false);
  }
}
