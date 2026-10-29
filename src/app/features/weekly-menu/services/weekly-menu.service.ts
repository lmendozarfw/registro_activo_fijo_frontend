import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { unwrapId } from '../../../core/utils/id.utils';
import {
  CreateWeeklyMenuRequest,
  SaveWeeklyMenuRequest,
  UpdateWeeklyMenuRequest,
  WeeklyMenuDto,
  WeeklyMenuListQuery,
} from '../models/weekly-menu.model';

function buildFormData(data: SaveWeeklyMenuRequest, file?: File | null): FormData {
  const formData = new FormData();

  formData.append('startDate', data.startDate);
  formData.append('endDate', data.endDate);
  formData.append('title', data.title ?? '');

  if (file) {
    formData.append('file', file);
  }

  return formData;
}

@Injectable({ providedIn: 'root' })
export class WeeklyMenuService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'WeeklyMenus';

  getPublicCurrent(): Observable<WeeklyMenuDto | null> {
    return this.http
      .get<WeeklyMenuDto>(`${environment.apiUrl}/${this.endpoint}/public/current`)
      .pipe(
        catchError((error: unknown) => {
          if (
            error instanceof HttpErrorResponse &&
            (error.status === 204 || error.status === 404)
          ) {
            return of(null);
          }

          return throwError(() => error);
        }),
      );
  }

  getAdminList(query: WeeklyMenuListQuery): Observable<WeeklyMenuDto[]> {
    let params = new HttpParams().set('skip', query.skip).set('take', query.take);

    if (query.search) params = params.set('search', query.search);

    return this.http.get<WeeklyMenuDto[]>(`${environment.apiUrl}/${this.endpoint}`, {
      params,
    });
  }

  getDetail(id: string): Observable<WeeklyMenuDto> {
    return this.http.get<WeeklyMenuDto>(
      `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(id)}`,
    );
  }

  create(data: CreateWeeklyMenuRequest): Observable<string> {
    return this.http
      .post(
        `${environment.apiUrl}/${this.endpoint}`,
        buildFormData(data, data.file),
        { responseType: 'text' },
      )
      .pipe(map(unwrapId));
  }

  update(id: string, data: UpdateWeeklyMenuRequest): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(id)}`,
      buildFormData(data, data.file),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.endpoint}/${encodeURIComponent(id)}`,
    );
  }
}
