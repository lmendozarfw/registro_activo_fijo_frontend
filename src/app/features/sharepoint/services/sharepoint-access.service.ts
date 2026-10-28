import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SaveSharePointAccessRequest,
  SharePointAccess,
  SharePointAccessRecord,
  SharePointAccessResponse,
  UpdateSharePointAccessStatusRequest,
} from '../models/sharepoint-access.model';

function normalizeAccess(item: SharePointAccessResponse): SharePointAccess | null {
  const name = (item.name ?? '').trim();
  const url = (item.url ?? '').trim();

  if (!name || !url) return null;

  const description = item.description ?? null;

  return {
    id: String(item.id ?? url),
    name,
    description: description?.trim() || null,
    url,
  };
}

@Injectable({ providedIn: 'root' })
export class SharePointAccessService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'SharepointAccesses';

  getPublic(): Observable<SharePointAccess[]> {
    return this.http
      .get<SharePointAccessResponse[]>(`${environment.apiUrl}/${this.endpoint}/public`)
      .pipe(
        map((items) =>
          (items ?? [])
            .map(normalizeAccess)
            .filter((item): item is SharePointAccess => item !== null),
        ),
      );
  }

  getAll(): Observable<SharePointAccessRecord[]> {
    return this.http.get<SharePointAccessRecord[]>(`${environment.apiUrl}/${this.endpoint}`);
  }

  getById(id: string): Observable<SharePointAccessRecord> {
    return this.http.get<SharePointAccessRecord>(`${environment.apiUrl}/${this.endpoint}/${id}`);
  }

  create(data: SaveSharePointAccessRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/${this.endpoint}`, data);
  }

  update(id: string, data: SaveSharePointAccessRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/${this.endpoint}/${id}`, data);
  }

  updateStatus(id: string, data: UpdateSharePointAccessStatusRequest): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/${this.endpoint}/${id}/status`, data);
  }
}
