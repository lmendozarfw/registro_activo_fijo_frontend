import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    AddNoteTextRequest,
    CreateNoteRequest,
    NoteDetail,
    NoteListItem,
    UpdateNoteSettingsRequest,
} from '../models/note.model';

function unwrapId(raw: string): string {
    const trimmed = raw?.trim() ?? '';
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}

@Injectable({ providedIn: 'root' })
export class NoteService {
    private readonly http = inject(HttpClient);
    private readonly endpoint = 'Notes';

    getMine(): Observable<NoteListItem[]> {
        return this.http.get<NoteListItem[]>(`${environment.apiUrl}/${this.endpoint}/my`);
    }

    getShared(): Observable<NoteListItem[]> {
        return this.http.get<NoteListItem[]>(`${environment.apiUrl}/${this.endpoint}/shared`);
    }

    getDetail(id: string): Observable<NoteDetail> {
        return this.http.get<NoteDetail>(`${environment.apiUrl}/${this.endpoint}/${id}`);
    }

    create(data: CreateNoteRequest): Observable<string> {
        return this.http
            .post(`${environment.apiUrl}/${this.endpoint}`, data, { responseType: 'text' })
            .pipe(map(unwrapId));
    }

    updateSettings(id: string, data: UpdateNoteSettingsRequest): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/${this.endpoint}/${id}/settings`, data);
    }

    addText(id: string, data: AddNoteTextRequest): Observable<string> {
        return this.http
            .post(`${environment.apiUrl}/${this.endpoint}/${id}/texts`, data, { responseType: 'text' })
            .pipe(map(unwrapId));
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/${this.endpoint}/${id}`);
    }
}
