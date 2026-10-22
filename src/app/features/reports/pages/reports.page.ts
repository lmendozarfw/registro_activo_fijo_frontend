import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { PageHeaderService } from '../../../core/services/page-header.service';
import { ResourceTypeEnum } from '../../resources/models/resource-type.model';
import { StatusResourceEnum } from '../../resources/models/status-resource.model';
import { ResourceReportItemDto } from '../models/report.model';
import { ReportStore } from '../stores/report.store';

interface ReportConfig {
    key: 'inventory' | 'mobile-phones' | 'available-mobile-phones';
    title: string;
    description: string;
    icon: string;
    tone: string;
}

const TYPE_LABELS: Record<ResourceTypeEnum, string> = {
    [ResourceTypeEnum.MOBILE]: 'Celular',
    [ResourceTypeEnum.LAPTOP]: 'Laptop',
    [ResourceTypeEnum.PC]: 'PC',
    [ResourceTypeEnum.MONITOR]: 'Monitor',
    [ResourceTypeEnum.CAMERA]: 'Cámara',
    [ResourceTypeEnum.OTHER]: 'Otro',
};

const STATUS_LABELS: Record<StatusResourceEnum, string> = {
    [StatusResourceEnum.AVAILABLE]: 'Disponible',
    [StatusResourceEnum.ASSIGNED]: 'Asignado',
    [StatusResourceEnum.MAINTENANCE]: 'Mantenimiento',
    [StatusResourceEnum.LOST]: 'Perdido',
};

const STATUS_STYLES: Record<StatusResourceEnum, string> = {
    [StatusResourceEnum.AVAILABLE]: 'bg-emerald-50 text-emerald-700',
    [StatusResourceEnum.ASSIGNED]: 'bg-sky-50 text-sky-700',
    [StatusResourceEnum.MAINTENANCE]: 'bg-amber-50 text-amber-700',
    [StatusResourceEnum.LOST]: 'bg-rose-50 text-rose-700',
};

const TONE_STYLES: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    sky: 'bg-sky-50 text-sky-600',
    violet: 'bg-violet-50 text-violet-600',
};

@Component({
    selector: 'app-reports-page',
    templateUrl: './reports.page.html',
    imports: [CommonModule, PIcon, ButtonModule, SkeletonModule, TableModule],
})
export class ReportsPage implements OnInit {
    protected readonly store = inject(ReportStore);
    private readonly pageHeader = inject(PageHeaderService);

    protected readonly reports: ReportConfig[] = [
        {
            key: 'inventory',
            title: 'Inventario general',
            description: 'Todos los recursos registrados con sus datos completos.',
            icon: 'box',
            tone: 'emerald',
        },
        {
            key: 'mobile-phones',
            title: 'Celulares',
            description: 'Reporte detallado de celulares con línea, IMEI y asignación.',
            icon: 'mobile',
            tone: 'sky',
        },
        {
            key: 'available-mobile-phones',
            title: 'Celulares disponibles',
            description: 'Celulares sin línea asignada, listos para asignar.',
            icon: 'mobile',
            tone: 'violet',
        },
    ];

    protected readonly expanded = signal<Record<string, boolean>>({});

    protected readonly inventoryCount = computed(() => this.store.inventory().length);
    protected readonly mobilePhonesCount = computed(() => this.store.mobilePhones().length);
    protected readonly availableMobilePhonesCount = computed(() => this.store.availableMobilePhones().length);

    protected readonly inventoryTotalValue = computed(() =>
        this.store.inventory().reduce((sum, item) => sum + (Number(item.price) || 0), 0),
    );

    ngOnInit(): void {
        this.pageHeader.setTitle('Reportes');
    }

    protected toggle(reportKey: string): void {
        const isExpanded = this.expanded()[reportKey];
        this.expanded.update((state) => ({ ...state, [reportKey]: !isExpanded }));
        if (!isExpanded) {
            this.loadReport(reportKey);
        }
    }

    protected isExpanded(reportKey: string): boolean {
        return this.expanded()[reportKey] === true;
    }

    protected loadReport(reportKey: string): void {
        if (reportKey === 'inventory' && this.store.inventory().length === 0) {
            void this.store.loadInventory();
            return;
        }
        if (reportKey === 'mobile-phones' && this.store.mobilePhones().length === 0) {
            void this.store.loadMobilePhones();
            return;
        }
        if (reportKey === 'available-mobile-phones' && this.store.availableMobilePhones().length === 0) {
            void this.store.loadAvailableMobilePhones();
            return;
        }
    }

    protected reloadReport(reportKey: string): void {
        if (reportKey === 'inventory') {
            void this.store.loadInventory();
            return;
        }
        if (reportKey === 'mobile-phones') {
            void this.store.loadMobilePhones();
            return;
        }
        if (reportKey === 'available-mobile-phones') {
            void this.store.loadAvailableMobilePhones();
        }
    }

    protected download(reportKey: string): void {
        if (reportKey === 'inventory') {
            void this.store.downloadInventoryExcel();
            return;
        }
        if (reportKey === 'mobile-phones') {
            void this.store.downloadMobilePhonesExcel();
            return;
        }
        if (reportKey === 'available-mobile-phones') {
            void this.store.downloadAvailableMobilePhonesExcel();
        }
    }

    protected getItems(reportKey: string): ResourceReportItemDto[] {
        if (reportKey === 'inventory') return this.store.inventory();
        if (reportKey === 'mobile-phones') return this.store.mobilePhones();
        if (reportKey === 'available-mobile-phones') return this.store.availableMobilePhones();
        return [];
    }

    protected isLoading(reportKey: string): boolean {
        if (reportKey === 'inventory') return this.store.loadingInventory();
        if (reportKey === 'mobile-phones') return this.store.loadingMobilePhones();
        if (reportKey === 'available-mobile-phones') return this.store.loadingAvailableMobilePhones();
        return false;
    }

    protected isDownloading(reportKey: string): boolean {
        if (reportKey === 'inventory') return this.store.downloadingInventory();
        if (reportKey === 'mobile-phones') return this.store.downloadingMobilePhones();
        if (reportKey === 'available-mobile-phones') return this.store.downloadingAvailableMobilePhones();
        return false;
    }

    protected toneClass(tone: string): string {
        return TONE_STYLES[tone] ?? 'bg-slate-100 text-slate-600';
    }

    protected typeLabel(type: ResourceTypeEnum): string {
        return TYPE_LABELS[type] ?? String(type);
    }

    protected statusLabel(status: StatusResourceEnum): string {
        return STATUS_LABELS[status] ?? String(status);
    }

    protected statusClass(status: StatusResourceEnum): string {
        return STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600';
    }

    protected formatCurrency(value: number): string {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(
            value || 0,
        );
    }

    protected formatDate(value?: string | null): string {
        if (!value) return '-';
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toLocaleDateString('es-MX');
    }
}
