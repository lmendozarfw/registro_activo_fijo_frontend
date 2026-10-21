import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { LineDto, LineItemDto, CreateLineCommand, UpdateLineCommand } from "../models/line.model";

@Injectable({ providedIn: 'root' })
export class LineService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Lines';

    getAll(): Observable<LineDto[]> {
        return this.api.getAll<LineDto>(this.endpoint);
    }

    getActive(search?: string): Observable<LineDto[]> {
        return this.api.getAll<LineDto>(`${this.endpoint}/active`, { search: search ?? '' });
    }

    getAvailable(): Observable<LineItemDto[]> {
        return this.api.getAll<LineItemDto>(`${this.endpoint}/available`);
    }

    create(data: CreateLineCommand): Observable<string> {
        return this.api.create<CreateLineCommand, string>(this.endpoint, data);
    }

    update(id: string, data: UpdateLineCommand): Observable<LineDto> {
        return this.api.patch<UpdateLineCommand, LineDto>(`${this.endpoint}/${id}`, data);
    }

    remove(id: string): Observable<boolean> {
        return this.api.patch(`${this.endpoint}/${id}/inactive`, void 0);
    }
}