import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { System, SystemRequest } from "../models/system.model";

@Injectable({ providedIn: 'root' })
export class SystemService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Systems';

    getAll(): Observable<System[]> {
        return this.api.getAll<System>(this.endpoint);
    }

    getById(id: string): Observable<System> {
        return this.api.getById<System>(this.endpoint, id);
    }

    create(data: SystemRequest): Observable<System> {
        return this.api.create<SystemRequest, System>(this.endpoint, data);
    }

    update(id: string, data: SystemRequest): Observable<System> {
        return this.api.update<SystemRequest, System>(this.endpoint, id, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }
}
