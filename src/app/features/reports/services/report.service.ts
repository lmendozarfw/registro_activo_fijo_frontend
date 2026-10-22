import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ResourceReportItemDto } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Reports';

    getInventory(): Observable<ResourceReportItemDto[]> {
        return this.api.get<ResourceReportItemDto[]>(`${this.endpoint}/inventory`);
    }

    getMobilePhones(): Observable<ResourceReportItemDto[]> {
        return this.api.get<ResourceReportItemDto[]>(`${this.endpoint}/mobile-phones`);
    }

    getAvailableMobilePhones(): Observable<ResourceReportItemDto[]> {
        return this.api.get<ResourceReportItemDto[]>(`${this.endpoint}/available-mobile-phones`);
    }

    downloadInventoryExcel(): Observable<Blob> {
        return this.api.downloadBlob(`${this.endpoint}/inventory/excel`);
    }

    downloadMobilePhonesExcel(): Observable<Blob> {
        return this.api.downloadBlob(`${this.endpoint}/mobile-phones/excel`);
    }

    downloadAvailableMobilePhonesExcel(): Observable<Blob> {
        return this.api.downloadBlob(`${this.endpoint}/available-mobile-phones/excel`);
    }
}
