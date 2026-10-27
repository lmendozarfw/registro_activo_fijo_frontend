import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { SkeletonModule } from 'primeng/skeleton';
import { PIcon } from '@primeicons/angular/p-icon';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderService } from '../../../core/services/page-header.service';
import { DashboardChartsDto, DashboardKpisDto } from '../models/kpi.model';
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
}

interface DonutSegment {
    label: string;
    value: number;
    percent: number;
    color: string;
}

const AXIS_TEXT = '#666667';
const AXIS_LINE = '#d9d9d8';
const SPLIT_LINE = '#efefef';

const TYPE_COLORS = ['#f33a20', '#151111', '#666667', '#ababab', '#bd2d19', '#4c4c4d', '#d9d9d8', '#852012', '#efefef'];

const STATUS_COLORS: Record<string, string> = {
    disponible: '#4c4c4d',
    disponibles: '#4c4c4d',
    asignado: '#ababab',
    asignados: '#ababab',
    mantenimiento: '#f59e0b',
    perdido: '#f33a20',
    perdidos: '#f33a20',
};

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
        brand: 'bg-brand-50 text-brand-600',
        neutral: 'bg-neutral-100 text-neutral-600',
    };

    protected readonly kpis = computed<DashboardKpisDto | null>(() => this.store.dashboard()?.kpis ?? null);
    protected readonly charts = computed<DashboardChartsDto | null>(() => this.store.dashboard()?.charts ?? null);

    protected readonly totalAssets = computed(() => this.kpis()?.registeredAssets.total ?? 0);
    protected readonly availableCount = computed(() => this.kpis()?.registeredAssets.available ?? 0);
    protected readonly inventoryValue = computed(() => this.kpis()?.inventoryValue.total ?? 0);
    protected readonly averageValue = computed(() => this.kpis()?.inventoryValue.average ?? 0);

    protected readonly activeAssignments = computed(() => this.kpis()?.assignments.active ?? 0);
    protected readonly historicalAssignments = computed(() => this.kpis()?.assignments.historical ?? 0);

    protected readonly assignedCount = computed(() => this.kpis()?.assignmentRate.assigned ?? 0);
    protected readonly assignmentTotalAssets = computed(() => this.kpis()?.assignmentRate.totalAssets ?? 0);
    protected readonly utilization = computed(() => Math.round(this.kpis()?.assignmentRate.percentage ?? 0));

    protected readonly employeesWithAssets = computed(
        () => this.kpis()?.employeesWithAssets.employeesWithAssets ?? 0,
    );
    protected readonly employeesTotal = computed(() => this.kpis()?.employeesWithAssets.totalEmployees ?? 0);
    protected readonly coverage = computed(() => Math.round(this.kpis()?.employeesWithAssets.coveragePercentage ?? 0));

    protected readonly credentialsTotal = computed(() => this.kpis()?.credentials.totalCredentials ?? 0);
    protected readonly systemsTotal = computed(() => this.kpis()?.credentials.totalSystems ?? 0);

    protected readonly activeLines = computed(() => this.kpis()?.activeLines.total ?? 0);

    protected readonly mobileTotal = computed(() => this.kpis()?.mobilePhones.total ?? 0);
    protected readonly mobileWithLine = computed(() => this.kpis()?.mobilePhones.withActiveLine ?? 0);
    protected readonly mobileCoverage = computed(() => Math.round(this.kpis()?.mobilePhones.coveragePercentage ?? 0));

    protected readonly hasData = computed(() => {
        const kpis = this.kpis();
        if (!kpis) return false;
        return (
            kpis.registeredAssets.total > 0 ||
            kpis.employeesWithAssets.totalEmployees > 0 ||
            kpis.assignments.active > 0 ||
            kpis.assignments.historical > 0
        );
    });

    protected readonly statCards = computed<StatCard[]>(() => [
        {
            label: 'Activos registrados',
            value: this.formatNumber(this.totalAssets()),
            icon: 'box',
            tone: 'brand',
            hint: `${this.formatNumber(this.availableCount())} disponibles`,
        },
        {
            label: 'Valor del inventario',
            value: this.formatCurrency(this.inventoryValue()),
            icon: 'tag',
            tone: 'neutral',
            hint: `Promedio ${this.formatCurrency(this.averageValue())}`,
        },
        {
            label: 'Asignaciones activas',
            value: this.formatNumber(this.activeAssignments()),
            icon: 'list-check',
            tone: 'brand',
            hint: `${this.formatNumber(this.historicalAssignments())} históricas`,
        },
        {
            label: 'Tasa de utilización',
            value: `${this.utilization()}%`,
            icon: 'chart-bar',
            tone: 'neutral',
            hint: `${this.formatNumber(this.assignedCount())} de ${this.formatNumber(this.assignmentTotalAssets())} asignados`,
        },
    ]);

    protected readonly miniStats = computed<StatCard[]>(() => [
        {
            label: 'Empleados con activos',
            value: `${this.formatNumber(this.employeesWithAssets())}/${this.formatNumber(this.employeesTotal())}`,
            icon: 'users',
            tone: 'neutral',
            hint: `${this.coverage()}% de cobertura`,
        },
        {
            label: 'Credenciales',
            value: this.formatNumber(this.credentialsTotal()),
            icon: 'key',
            tone: 'brand',
            hint: `${this.formatNumber(this.systemsTotal())} sistemas`,
        },
        {
            label: 'Líneas activas',
            value: this.formatNumber(this.activeLines()),
            icon: 'phone',
            tone: 'neutral',
            hint: 'Telefonía móvil',
        },
        {
            label: 'Celulares con línea',
            value: `${this.formatNumber(this.mobileWithLine())}/${this.formatNumber(this.mobileTotal())}`,
            icon: 'mobile',
            tone: 'brand',
            hint: `${this.mobileCoverage()}% con línea activa`,
        },
    ]);

    protected readonly byType = computed<BarItem[]>(() => {
        const items = this.charts()?.resourcesByType ?? [];
        const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
        return items.map((item, index) => ({
            label: item.label,
            value: item.value,
            percent: Math.round((item.value / total) * 100),
            color: TYPE_COLORS[index % TYPE_COLORS.length],
        }));
    });

    protected readonly statusTotal = computed(
        () => this.charts()?.resourcesByStatus.reduce((sum, item) => sum + item.value, 0) ?? 0,
    );

    protected readonly donutSegments = computed<DonutSegment[]>(() => {
        const items = this.charts()?.resourcesByStatus ?? [];
        const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
        return items
            .map((item, index) => ({
                label: item.label,
                value: item.value,
                percent: (item.value / total) * 100,
                color: this.statusColor(item.label, index),
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

    protected readonly byTypeChart = computed<EChartsCoreOption>(() => {
        const items = this.byType();
        return this.horizontalBar(
            items.map((item) => item.label),
            items.map((item) => item.value),
            items.map((item) => item.color),
        );
    });

    ngOnInit(): void {
        this.pageHeader.setTitle('Indicadores');
        void this.store.load();
    }

    protected toneClass(tone: string): string {
        return this.toneClasses[tone] ?? this.toneClasses['neutral'];
    }

    private statusColor(label: string, index: number): string {
        return STATUS_COLORS[label.trim().toLowerCase()] ?? TYPE_COLORS[index % TYPE_COLORS.length];
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
                axisLabel: { color: AXIS_TEXT },
            },
            yAxis: {
                type: 'category',
                inverse: true,
                data: labels,
                axisLine: { lineStyle: { color: AXIS_LINE } },
                axisTick: { show: false },
                axisLabel: { color: AXIS_TEXT },
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
                    label: { show: true, position: 'right', color: AXIS_TEXT },
                },
            ],
        };
    }

    private formatNumber(value: number): string {
        return this.numberFormatter.format(value);
    }

    private formatCurrency(value: number): string {
        return this.currencyFormatter.format(value);
    }
}
