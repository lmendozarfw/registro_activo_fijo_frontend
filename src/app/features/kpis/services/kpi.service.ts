import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DashboardChartsDto, DashboardDto, DashboardKpisDto } from '../models/kpi.model';

@Injectable({ providedIn: 'root' })
export class KpiService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Dashboard';

    getDashboard(): Observable<DashboardDto> {
        return this.api.get<DashboardDto>(this.endpoint);
    }

    getKpis(): Observable<DashboardKpisDto> {
        return this.api.get<DashboardKpisDto>(`${this.endpoint}/kpis`);
    }

    getCharts(): Observable<DashboardChartsDto> {
        return this.api.get<DashboardChartsDto>(`${this.endpoint}/charts`);
    }
}
