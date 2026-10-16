import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { LineDto, CreateLineCommand, UpdateLineCommand } from "../models/line.model";

@Injectable({ providedIn: 'root' })
export class LineService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Lines';

    getAll(): Observable<LineDto[]> {
        return this.api.getAll<LineDto>(this.endpoint);
    }

    getActive(): Observable<LineDto[]> {
        return this.api.getAll<LineDto>(`${this.endpoint}/active`);
    }

    create(data: CreateLineCommand): Observable<LineDto> {
        return this.api.create<CreateLineCommand, LineDto>(this.endpoint, data);
    }

    update(id: string, data: UpdateLineCommand): Observable<LineDto> {
        return this.api.patch<UpdateLineCommand, LineDto>(`${this.endpoint}/${id}`, data);
    }

    remove(id: string): Observable<boolean> {
        return this.api.patch(`${this.endpoint}/${id}/inactive`, void 0);
    }
}