import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { SkeletonModule } from 'primeng/skeleton';
import { PIcon } from '@primeicons/angular/p-icon';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderService } from '../../../core/services/page-header.service';
import { StatusLineEnum } from '../../resources/models/line.model';
import { RESOURCE_TYPE_LABELS, ResourceTypeEnum } from '../../resources/models/resource-type.model';
import { STATUS_RESOURCE_LABELS, StatusResourceEnum } from '../../resources/models/status-resource.model';
import { KpiStore } from '../stores/kpi.store';

interface StatCard {
    label: string;
    value: string;
    icon: string;
    tone: string;
    hint?: string;
}

interface BarItem {
    label: string;
    value: number;
    percent: number;
    color: string;
    icon?: string;
    meta?: string;
}

interface DonutSegment {
    label: string;
    value: number;
    percent: number;
    color: string;
}

interface MonthPoint {
    label: string;
    value: number;
}

const AXIS_TEXT = '#64748b';
const AXIS_LINE = '#e2e8f0';
const SPLIT_LINE = '#f1f5f9';

const STATUS_COLORS: Record<StatusResourceEnum, string> = {
    [StatusResourceEnum.AVAILABLE]: '#10b981',
    [StatusResourceEnum.ASSIGNED]: '#0ea5e9',
    [StatusResourceEnum.MAINTENANCE]: '#f59e0b',
    [StatusResourceEnum.LOST]: '#f43f5e',
};

const TYPE_COLORS = ['#059669', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6', '#f43f5e', '#64748b'];

@Component({
    selector: 'app-kpis-page',
    templateUrl: './kpis.page.html',
    imports: [SkeletonModule, PIcon, EmptyStateComponent, DecimalPipe, NgxEchartsDirective],
})
export class KpisPage implements OnInit {
    protected readonly store = inject(KpiStore);
    private readonly pageHeader = inject(PageHeaderService);

    private readonly numberFormatter = new Intl.NumberFormat('es-MX');
    private readonly currencyFormatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0,
    });

    protected readonly toneClasses: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-600',
        sky: 'bg-sky-50 text-sky-600',
        amber: 'bg-amber-50 text-amber-600',
        violet: 'bg-violet-50 text-violet-600',
        rose: 'bg-rose-50 text-rose-600',
        slate: 'bg-slate-100 text-slate-600',
    };

    protected readonly totalAssets = computed(() => this.store.resources().length);

    protected readonly inventoryValue = computed(() =>
        this.store.resources().reduce((sum, resource) => sum + (resource.price || 0), 0),
    );

    protected readonly averageValue = computed(() => {
        const total = this.totalAssets();
        return total === 0 ? 0 : Math.round(this.inventoryValue() / total);
    });

    protected readonly statusCounts = computed<Record<StatusResourceEnum, number>>(() => {
        const counts: Record<StatusResourceEnum, number> = {
            [StatusResourceEnum.AVAILABLE]: 0,
            [StatusResourceEnum.ASSIGNED]: 0,
            [StatusResourceEnum.MAINTENANCE]: 0,
            [StatusResourceEnum.LOST]: 0,
        };
        for (const resource of this.store.resources()) {
            if (counts[resource.status] !== undefined) counts[resource.status] += 1;
        }
        return counts;
    });

    protected readonly availableCount = computed(() => this.statusCounts()[StatusResourceEnum.AVAILABLE]);
    protected readonly assignedCount = computed(() => this.statusCounts()[StatusResourceEnum.ASSIGNED]);
    protected readonly maintenanceCount = computed(() => this.statusCounts()[StatusResourceEnum.MAINTENANCE]);
    protected readonly lostCount = computed(() => this.statusCounts()[StatusResourceEnum.LOST]);

    protected readonly utilization = computed(() => {
        const total = this.totalAssets();
        return total === 0 ? 0 : Math.round((this.assignedCount() / total) * 100);
    });

    protected readonly activeAssignments = computed(() =>
        this.store.assignments().filter((assignment) => assignment.isActive).length,
    );

    protected readonly totalAssignments = computed(() => this.store.assignments().length);

    protected readonly employeesTotal = computed(() => this.store.employees().length);

    protected readonly employeesWithAssets = computed(() => {
        const ids = new Set(
            this.store.assignments().filter((assignment) => assignment.isActive).map((assignment) => assignment.employeeId),
        );
        return ids.size;
    });

    protected readonly coverage = computed(() => {
        const total = this.employeesTotal();
        return total === 0 ? 0 : Math.round((this.employeesWithAssets() / total) * 100);
    });

    protected readonly credentialsTotal = computed(() => this.store.credentials().length);
    protected readonly linesTotal = computed(() => this.store.lines().length);
    protected readonly activeLines = computed(() =>
        this.store.lines().filter((line) => line.status === StatusLineEnum.ACTIVE).length,
    );

    protected readonly hasData = computed(
        () => this.totalAssets() > 0 || this.employeesTotal() > 0 || this.store.assignments().length > 0,
    );

    protected readonly statCards = computed<StatCard[]>(() => [
        {
            label: 'Activos registrados',
            value: this.formatNumber(this.totalAssets()),
            icon: 'box',
            tone: 'emerald',
            hint: `${this.availableCount()} disponibles`,
        },
        {
            label: 'Valor del inventario',
            value: this.formatCurrency(this.inventoryValue()),
            icon: 'tag',
            tone: 'sky',
            hint: `Promedio ${this.formatCurrency(this.averageValue())}`,
        },
        {
            label: 'Asignaciones activas',
            value: this.formatNumber(this.activeAssignments()),
            icon: 'list-check',
            tone: 'amber',
            hint: `${this.formatNumber(this.totalAssignments())} históricas`,
        },
        {
            label: 'Tasa de utilización',
            value: `${this.utilization()}%`,
            icon: 'chart-bar',
            tone: 'violet',
            hint: `${this.assignedCount()} de ${this.totalAssets()} asignados`,
        },
    ]);

    protected readonly miniStats = computed<StatCard[]>(() => [
        {
            label: 'Empleados con activos',
            value: `${this.employeesWithAssets()}/${this.employeesTotal()}`,
            icon: 'users',
            tone: 'sky',
            hint: `${this.coverage()}% de cobertura`,
        },
        {
            label: 'Credenciales',
            value: this.formatNumber(this.credentialsTotal()),
            icon: 'key',
            tone: 'violet',
            hint: `${this.credentialsBySystem().length} sistemas`,
        },
        {
            label: 'Líneas activas',
            value: `${this.activeLines()}/${this.linesTotal()}`,
            icon: 'phone',
            tone: 'emerald',
            hint: 'Telefonía móvil',
        },
        {
            label: 'Requieren atención',
            value: this.formatNumber(this.maintenanceCount() + this.lostCount()),
            icon: 'exclamation-triangle',
            tone: 'rose',
            hint: `${this.maintenanceCount()} mantenimiento · ${this.lostCount()} perdidos`,
        },
    ]);

    protected readonly donutSegments = computed<DonutSegment[]>(() => {
        const counts = this.statusCounts();
        const total = this.totalAssets() || 1;
        const order: StatusResourceEnum[] = [
            StatusResourceEnum.ASSIGNED,
            StatusResourceEnum.AVAILABLE,
            StatusResourceEnum.MAINTENANCE,
            StatusResourceEnum.LOST,
        ];
        return order
            .map((status) => ({
                label: STATUS_RESOURCE_LABELS[status],
                value: counts[status],
                percent: (counts[status] / total) * 100,
                color: STATUS_COLORS[status],
            }))
            .filter((segment) => segment.value > 0);
    });

    protected readonly statusChart = computed<EChartsCoreOption>(() => ({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [
            {
                type: 'pie',
                radius: ['58%', '82%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: true,
                itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
                label: { show: false },
                labelLine: { show: false },
                data: this.donutSegments().map((segment) => ({
                    value: segment.value,
                    name: segment.label,
                    itemStyle: { color: segment.color },
                })),
            },
        ],
    }));

    protected readonly byType = computed<BarItem[]>(() => {
        const total = this.totalAssets() || 1;
        const map = new Map<ResourceTypeEnum, { count: number; value: number }>();
        for (const resource of this.store.resources()) {
            const current = map.get(resource.type) ?? { count: 0, value: 0 };
            current.count += 1;
            current.value += resource.price || 0;
            map.set(resource.type, current);
        }
        return [...map.entries()]
            .sort((a, b) => b[1].count - a[1].count)
            .map(([type, entry], index) => ({
                label: RESOURCE_TYPE_LABELS[type] ?? String(type),
                icon: this.typeIcon(type),
                value: entry.count,
                percent: Math.round((entry.count / total) * 100),
                meta: this.formatCurrency(entry.value),
                color: TYPE_COLORS[index % TYPE_COLORS.length],
            }));
    });

    protected readonly topBrands = computed<BarItem[]>(() => {
        const map = new Map<string, number>();
        for (const resource of this.store.resources()) {
            const brand = resource.brandName?.trim() || 'Sin marca';
            map.set(brand, (map.get(brand) ?? 0) + 1);
        }
        return this.rankEntries(map, 6, '#059669');
    });

    protected readonly topDepartments = computed<BarItem[]>(() => {
        const employees = new Map(this.store.employees().map((employee) => [employee.id, employee]));
        const map = new Map<string, number>();
        for (const assignment of this.store.assignments()) {
            if (!assignment.isActive) continue;
            const department = employees.get(assignment.employeeId)?.departmentName?.trim() || 'Sin departamento';
            map.set(department, (map.get(department) ?? 0) + 1);
        }
        return this.rankEntries(map, 6, '#0ea5e9');
    });

    protected readonly credentialsBySystem = computed<BarItem[]>(() => {
        const map = new Map<string, number>();
        for (const credential of this.store.credentials()) {
            const system = credential.systemName?.trim() || 'Sin sistema';
            map.set(system, (map.get(system) ?? 0) + 1);
        }
        return this.rankEntries(map, 6, '#6366f1');
    });

    protected readonly assignmentsByMonth = computed<MonthPoint[]>(() => {
        const now = new Date();
        const buckets: { key: string; label: string; value: number }[] = [];
        for (let offset = 5; offset >= 0; offset -= 1) {
            const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
            buckets.push({
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
                value: 0,
            });
        }
        const index = new Map(buckets.map((bucket) => [bucket.key, bucket]));
        for (const assignment of this.store.assignments()) {
            if (!assignment.assignmentDate) continue;
            const date = new Date(assignment.assignmentDate);
            if (isNaN(date.getTime())) continue;
            const bucket = index.get(`${date.getFullYear()}-${date.getMonth()}`);
            if (bucket) bucket.value += 1;
        }
        return buckets.map((bucket) => ({
            label: bucket.label,
            value: bucket.value,
        }));
    });

    protected readonly byTypeChart = computed<EChartsCoreOption>(() => {
        const items = this.byType();
        return this.horizontalBar(
            items.map((item) => item.label),
            items.map((item) => item.value),
            items.map((item) => item.color),
        );
    });

    protected readonly topBrandsChart = computed<EChartsCoreOption>(() => {
        const items = this.topBrands();
        return this.horizontalBar(
            items.map((item) => item.label),
            items.map((item) => item.value),
            '#059669',
        );
    });

    protected readonly topDepartmentsChart = computed<EChartsCoreOption>(() => {
        const items = this.topDepartments();
        return this.horizontalBar(
            items.map((item) => item.label),
            items.map((item) => item.value),
            '#0ea5e9',
        );
    });

    protected readonly credentialsChart = computed<EChartsCoreOption>(() => {
        const items = this.credentialsBySystem();
        return this.horizontalBar(
            items.map((item) => item.label),
            items.map((item) => item.value),
            '#6366f1',
        );
    });

    protected readonly monthlyChart = computed<EChartsCoreOption>(() => {
        const points = this.assignmentsByMonth();
        return {
            grid: { left: 8, right: 16, top: 28, bottom: 8, containLabel: true },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: {
                type: 'category',
                data: points.map((point) => point.label),
                axisLine: { lineStyle: { color: AXIS_LINE } },
                axisTick: { show: false },
                axisLabel: { color: AXIS_TEXT },
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                splitLine: { lineStyle: { color: SPLIT_LINE } },
                axisLabel: { color: '#94a3b8' },
            },
            series: [
                {
                    type: 'bar',
                    data: points.map((point) => point.value),
                    barWidth: 22,
                    itemStyle: {
                        borderRadius: [6, 6, 0, 0],
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#34d399' },
                                { offset: 1, color: '#059669' },
                            ],
                        },
                    },
                },
            ],
        };
    });

    protected readonly attentionResources = computed(() =>
        this.store
            .resources()
            .filter(
                (resource) =>
                    resource.status === StatusResourceEnum.MAINTENANCE || resource.status === StatusResourceEnum.LOST,
            )
            .sort((a, b) => this.statusWeight(a.status) - this.statusWeight(b.status))
            .slice(0, 8),
    );

    ngOnInit(): void {
        this.pageHeader.setTitle('Indicadores');
        void this.store.load();
    }

    protected toneClass(tone: string): string {
        return this.toneClasses[tone] ?? this.toneClasses['slate'];
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
            default:
                return 'box';
        }
    }

    protected statusLabel(status: StatusResourceEnum): string {
        return STATUS_RESOURCE_LABELS[status] ?? String(status);
    }

    protected statusTone(status: StatusResourceEnum): string {
        switch (status) {
            case StatusResourceEnum.AVAILABLE:
                return 'text-emerald-700 bg-emerald-50';
            case StatusResourceEnum.ASSIGNED:
                return 'text-sky-700 bg-sky-50';
            case StatusResourceEnum.MAINTENANCE:
                return 'text-amber-700 bg-amber-50';
            case StatusResourceEnum.LOST:
                return 'text-rose-700 bg-rose-50';
            default:
                return 'text-slate-600 bg-slate-100';
        }
    }

    protected statusColor(status: StatusResourceEnum): string {
        return STATUS_COLORS[status] ?? '#64748b';
    }

    private horizontalBar(labels: string[], values: number[], color: string | string[]): EChartsCoreOption {
        const isPalette = Array.isArray(color);
        return {
            grid: { left: 8, right: 28, top: 8, bottom: 8, containLabel: true },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: {
                type: 'value',
                minInterval: 1,
                splitLine: { lineStyle: { color: SPLIT_LINE } },
                axisLabel: { color: '#94a3b8' },
            },
            yAxis: {
                type: 'category',
                inverse: true,
                data: labels,
                axisLine: { lineStyle: { color: AXIS_LINE } },
                axisTick: { show: false },
                axisLabel: { color: '#475569' },
            },
            series: [
                {
                    type: 'bar',
                    data: values.map((value, index) => ({
                        value,
                        itemStyle: isPalette ? { color: color[index % color.length] } : undefined,
                    })),
                    barWidth: 14,
                    itemStyle: isPalette ? { borderRadius: [0, 4, 4, 0] } : { borderRadius: [0, 4, 4, 0], color },
                    label: { show: true, position: 'right', color: '#475569' },
                },
            ],
        };
    }

    private rankEntries(map: Map<string, number>, limit: number, color: string): BarItem[] {
        const entries = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
        const max = entries.length > 0 ? entries[0][1] : 1;
        return entries.map(([label, value]) => ({
            label,
            value,
            percent: Math.round((value / (max || 1)) * 100),
            color,
        }));
    }

    private statusWeight(status: StatusResourceEnum): number {
        if (status === StatusResourceEnum.LOST) return 0;
        if (status === StatusResourceEnum.MAINTENANCE) return 1;
        return 2;
    }

    private formatNumber(value: number): string {
        return this.numberFormatter.format(value);
    }

    private formatCurrency(value: number): string {
        return this.currencyFormatter.format(value);
    }
}
