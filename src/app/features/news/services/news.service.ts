import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  NewsDetailDto,
  NewsListDto,
  NewsListQuery,
  SaveNewsRequest,
  ScheduleNewsRequest,
} from '../models/news.model';

function unwrapId(raw: string): string {
  const trimmed = raw?.trim() ?? '';
  if (!trimmed) return '';

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (typeof parsed === 'string') return parsed;

    if (parsed && typeof parsed === 'object' && 'id' in parsed) {
      const id = (parsed as { id?: unknown }).id;
      if (typeof id === 'string') return id;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'News';

  getPublicList(skip = 0, take = 12): Observable<NewsListDto[]> {
    const params = new HttpParams().set('skip', skip).set('take', take);
    return this.http.get<NewsListDto[]>(`${environment.apiUrl}/${this.endpoint}/public`, {
      params,
    });
  }

  getPublicDetail(id: string): Observable<NewsDetailDto> {
    return this.http.get<NewsDetailDto>(
      `${environment.apiUrl}/${this.endpoint}/public/${id}`,
    );
  }

  getAdminList(query: NewsListQuery): Observable<NewsListDto[]> {
    let params = new HttpParams().set('skip', query.skip).set('take', query.take);

    if (query.status) params = params.set('status', query.status);
    if (query.search) params = params.set('search', query.search);

    return this.http.get<NewsListDto[]>(`${environment.apiUrl}/${this.endpoint}`, {
      params,
    });
  }

  getDetail(id: string): Observable<NewsDetailDto> {
    return this.http.get<NewsDetailDto>(`${environment.apiUrl}/${this.endpoint}/${id}`);
  }

  create(data: SaveNewsRequest): Observable<string> {
    return this.http
      .post(`${environment.apiUrl}/${this.endpoint}`, data, { responseType: 'text' })
      .pipe(map(unwrapId));
  }

  update(id: string, data: SaveNewsRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/${this.endpoint}/${id}`, data);
  }

  publish(id: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/${this.endpoint}/${id}/publish`,
      {},
    );
  }

  schedule(id: string, data: ScheduleNewsRequest): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/${this.endpoint}/${id}/schedule`,
      data,
    );
  }

  archive(id: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/${this.endpoint}/${id}/archive`,
      {},
    );
  }

  uploadImage(id: string, file: File, isCover: boolean): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isCover', String(isCover));

    return this.http.post<void>(
      `${environment.apiUrl}/${this.endpoint}/${id}/images`,
      formData,
    );
  }

  setCover(id: string, imageId: string): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/${this.endpoint}/${id}/images/${imageId}/cover`,
      {},
    );
  }

  removeImage(id: string, imageId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.endpoint}/${id}/images/${imageId}`,
    );
  }
}
