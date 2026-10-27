import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { unwrapId } from '../../../core/utils/id.utils';
import { BusinessUnit } from '../models/business-unit.model';

@Injectable({ providedIn: 'root' })
export class BusinessUnitService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'BusinessUnits';

  getAll(search?: string): Observable<BusinessUnit[]> {
    return this.api.getAll<BusinessUnit>(this.endpoint, { search: search ?? '' });
  }

  getActive(search?: string): Observable<BusinessUnit[]> {
    return this.api.getAll<BusinessUnit>(`${this.endpoint}/active`, { search: search ?? '' });
  }

  create(name: string): Observable<string> {
    return this.http
      .post(`${environment.apiUrl}/${this.endpoint}`, { name }, { responseType: 'text' })
      .pipe(map(unwrapId));
  }

  update(id: string, name: string): Observable<void> {
    return this.api.patch<{ name: string }, void>(`${this.endpoint}/${id}`, { name });
  }

  activate(id: string): Observable<void> {
    return this.api.patch<Record<string, never>, void>(`${this.endpoint}/${id}/active`, {});
  }

  deactivate(id: string): Observable<void> {
    return this.api.patch<Record<string, never>, void>(`${this.endpoint}/${id}/inactive`, {});
  }
}
