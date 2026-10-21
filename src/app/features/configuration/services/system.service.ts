import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { System, SystemRequest, SystemUpdateRequest } from "../models/system.model";

@Injectable({ providedIn: 'root' })
export class SystemService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Systems';

    getAll(): Observable<System[]> {
        return this.api.getAll<System>(this.endpoint);
    }

    getActive(search?: string): Observable<System[]> {
        return this.api.getAll<System>(`${this.endpoint}/active`, { search: search ?? '' });
    }

    getById(id: string): Observable<System> {
        return this.api.getById<System>(this.endpoint, id);
    }

    create(data: SystemRequest): Observable<System> {
        return this.api.create<SystemRequest, System>(this.endpoint, data);
    }

    update(id: string, data: SystemUpdateRequest): Observable<System> {
        return this.api.patch<SystemUpdateRequest, System>(`${this.endpoint}/${id}`, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }

    softRemove(id: string): Observable<boolean> {
        return this.api.patch(`${this.endpoint}/${id}/inactive`, void 0);
    }
}
