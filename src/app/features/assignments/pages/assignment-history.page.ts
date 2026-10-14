import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { InputText } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { PIcon } from '@primeicons/angular/p-icon';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderService } from '../../../core/services/page-header.service';
import { RESOURCE_TYPE_LABELS, ResourceTypeEnum } from '../../resources/models/resource-type.model';
import { STATUS_RESOURCE_LABELS, StatusResourceEnum } from '../../resources/models/status-resource.model';
import { AssignmentHistoryEntryDto, ResourceAssignmentHistoryDto } from '../models/assignment.model';
import { AssignmentHistoryStore } from '../stores/assignment-history.store';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
    selector: 'app-assignment-history-page',
    templateUrl: './assignment-history.page.html',
    styles: [`
        .p-tabs {
            border-radius: 12px;
        }
        .p-tablist {
            border-radius: 12px 12px 0 0;
        }
        .p-tabpanels {
            border-radius: 0 0 12px 12px;
        }
        `],
    imports: [TabsModule, TagModule, InputText, SkeletonModule, PIcon, EmptyStateComponent],
})
export class AssignmentHistoryPage implements OnInit {
    protected readonly store = inject(AssignmentHistoryStore);
    private readonly pageHeader = inject(PageHeaderService);

    protected readonly resourceTypeLabels = RESOURCE_TYPE_LABELS;

    protected readonly activeTab = signal<string | undefined>(undefined);
    protected readonly search = signal('');
    private readonly expanded = signal<Record<string, boolean>>({});

    protected readonly groups = computed(() => this.store.groups());

    protected readonly tabs = computed(() =>
        this.groups().map((group) => ({
            id: group.resourceType,
            label: this.resourceTypeLabels[group.resourceType] ?? String(group.resourceType),
            icon: this.typeIcon(group.resourceType),
            count: group.resources.length,
        })),
    );

    protected readonly activeGroup = computed(
        () => this.groups().find((group) => group.resourceType === this.activeTab()) ?? null,
    );

    protected readonly resources = computed<ResourceAssignmentHistoryDto[]>(() => {
        const group = this.activeGroup();
        if (!group) return [];

        const query = this.search().trim().toLowerCase();
        if (!query) return group.resources;

        return group.resources.filter((resource) => this.matches(resource, query));
    });

    protected readonly totalResources = computed(() =>
        this.groups().reduce((total, group) => total + group.resources.length, 0),
    );

    protected readonly totalEntries = computed(() =>
        this.groups().reduce(
            (total, group) => total + group.resources.reduce((sum, resource) => sum + resource.assignments.length, 0),
            0,
        ),
    );

    protected readonly activeEntries = computed(() =>
        this.groups().reduce(
            (total, group) =>
                total +
                group.resources.reduce(
                    (sum, resource) => sum + resource.assignments.filter((entry) => entry.isActive).length,
                    0,
                ),
            0,
        ),
    );

    ngOnInit(): void {
        this.pageHeader.setTitle('Historial de asignaciones');
        void this.init();
    }

    private async init(): Promise<void> {
        await this.store.load();
        this.activeTab.set(this.groups()[0]?.resourceType);
    }

    protected onTabChange(value: string | number | undefined): void {
        this.activeTab.set(value as string);
    }

    protected onSearch(event: Event): void {
        this.search.set((event.target as HTMLInputElement).value);
    }

    protected isExpanded(resourceId: string): boolean {
        return this.expanded()[resourceId] ?? false;
    }

    protected toggle(resourceId: string): void {
        this.expanded.update((state) => ({ ...state, [resourceId]: !this.isExpanded(resourceId) }));
    }

    protected currentAssignment(resource: ResourceAssignmentHistoryDto): AssignmentHistoryEntryDto | null {
        return resource.assignments.find((entry) => entry.isActive) ?? null;
    }

    protected typeIcon(type: ResourceTypeEnum): string {
        switch (type) {
            case ResourceTypeEnum.MOBILE:
                return 'mobile';
            case ResourceTypeEnum.LAPTOP:
                return 'desktop';
            case ResourceTypeEnum.PC:
                return 'server';
            case ResourceTypeEnum.MONITOR:
                return 'desktop';
            case ResourceTypeEnum.CAMERA:
                return 'camera';
            case ResourceTypeEnum.CABLE:
                return 'wrench';
            default:
                return 'box';
        }
    }

    protected statusLabel(status: string): string {
        return STATUS_RESOURCE_LABELS[status as StatusResourceEnum] ?? status;
    }

    protected statusSeverity(status: string): TagSeverity {
        switch (status) {
            case StatusResourceEnum.AVAILABLE:
                return 'success';
            case StatusResourceEnum.ASSIGNED:
                return 'info';
            case StatusResourceEnum.MAINTENANCE:
                return 'warn';
            case StatusResourceEnum.LOST:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    protected formatDate(value?: string | null): string {
        if (!value) return '—';
        const date = new Date(value);
        return isNaN(date.getTime())
            ? '—'
            : date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    private matches(resource: ResourceAssignmentHistoryDto, query: string): boolean {
        return (
            resource.assetCode.toLowerCase().includes(query) ||
            resource.resourceName.toLowerCase().includes(query) ||
            (resource.serialNumber ?? '').toLowerCase().includes(query) ||
            resource.brandName.toLowerCase().includes(query) ||
            resource.modelName.toLowerCase().includes(query) ||
            (resource.imei ?? '').toLowerCase().includes(query) ||
            (resource.imei2 ?? '').toLowerCase().includes(query) ||
            resource.assignments.some(
                (entry) =>
                    entry.employeeName.toLowerCase().includes(query) ||
                    entry.employeeNumber.toLowerCase().includes(query),
            )
        );
    }
}
