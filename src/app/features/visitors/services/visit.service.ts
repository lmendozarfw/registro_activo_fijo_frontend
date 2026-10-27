import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateVisitRequest,
  UpdateVisitRequest,
  VisitDetailDto,
  VisitListItem,
  VisitListQuery,
  VisitorAccessStatus,
  VisitorDocumentType,
  VisitorEquipmentRequest,
} from '../models/visit.model';
import { unwrapId } from '../../../core/utils/id.utils';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'Visits';

  getList(query: VisitListQuery): Observable<VisitListItem[]> {
    let params = new HttpParams().set('skip', query.skip).set('take', query.take);

    if (query.status) params = params.set('status', query.status);
    if (query.search) params = params.set('search', query.search);
    if (query.businessUnitId) params = params.set('businessUnitId', query.businessUnitId);
    if (query.departmentId) params = params.set('departmentId', query.departmentId);
    if (query.from) params = params.set('from', query.from);
    if (query.to) params = params.set('to', query.to);

    return this.http.get<VisitListItem[]>(`${environment.apiUrl}/${this.endpoint}`, { params });
  }

  getDetail(id: string): Observable<VisitDetailDto> {
    return this.http.get<VisitDetailDto>(
      `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(id)}`,
    );
  }

  create(data: CreateVisitRequest): Observable<string> {
    return this.http
      .post(`${environment.apiUrl}/${this.endpoint}`, data, { responseType: 'text' })
      .pipe(map(unwrapId));
  }

  update(id: string, data: UpdateVisitRequest): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(id)}`,
      data,
    );
  }

  start(id: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(id)}/start`,
      {},
    );
  }

  finish(id: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(id)}/finish`,
      {},
    );
  }

  cancel(id: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(id)}/cancel`,
      {},
    );
  }

  addVisitor(visitId: string, fullName: string): Observable<string> {
    return this.http
      .post(
        `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(visitId)}/visitors`,
        { fullName },
        { responseType: 'text' },
      )
      .pipe(map(unwrapId));
  }

  updateVisitor(visitId: string, visitorId: string, fullName: string): Observable<void> {
    return this.http.put<void>(this.visitorEndpoint(visitId, visitorId), { fullName });
  }

  removeVisitor(visitId: string, visitorId: string): Observable<void> {
    return this.http.delete<void>(this.visitorEndpoint(visitId, visitorId));
  }

  setVisitorAccess(
    visitId: string,
    visitorId: string,
    accessStatus: Exclude<VisitorAccessStatus, 'PENDING'>,
  ): Observable<void> {
    return this.http.post<void>(`${this.visitorEndpoint(visitId, visitorId)}/access`, {
      accessStatus,
    });
  }

  addEquipment(
    visitId: string,
    visitorId: string,
    data: VisitorEquipmentRequest,
  ): Observable<string> {
    return this.http
      .post(`${this.visitorEndpoint(visitId, visitorId)}/equipments`, data, {
        responseType: 'text',
      })
      .pipe(map(unwrapId));
  }

  updateEquipment(
    visitId: string,
    visitorId: string,
    equipmentId: string,
    data: VisitorEquipmentRequest,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.visitorEndpoint(visitId, visitorId)}/equipments/${encodeURIComponent(equipmentId)}`,
      data,
    );
  }

  removeEquipment(visitId: string, visitorId: string, equipmentId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.visitorEndpoint(visitId, visitorId)}/equipments/${encodeURIComponent(equipmentId)}`,
    );
  }

  uploadDocument(
    visitId: string,
    visitorId: string,
    documentType: VisitorDocumentType,
    file: File,
  ): Observable<string> {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    return this.http
      .post(`${this.visitorEndpoint(visitId, visitorId)}/documents`, formData, {
        responseType: 'text',
      })
      .pipe(map(unwrapId));
  }

  downloadDocument(
    visitId: string,
    visitorId: string,
    documentId: string,
  ): Observable<HttpResponse<Blob>> {
    return this.http.get(
      `${this.visitorEndpoint(visitId, visitorId)}/documents/${encodeURIComponent(documentId)}/download`,
      {
        observe: 'response',
        responseType: 'blob',
      },
    );
  }

  removeDocument(visitId: string, visitorId: string, documentId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.visitorEndpoint(visitId, visitorId)}/documents/${encodeURIComponent(documentId)}`,
    );
  }

  private visitorEndpoint(visitId: string, visitorId: string): string {
    return `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(visitId)}/visitors/${encodeURIComponent(visitorId)}`;
  }
}
