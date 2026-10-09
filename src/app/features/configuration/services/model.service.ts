import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Model, ModelRequest } from "../models/model.model";

@Injectable({ providedIn: 'root' })
export class ModelService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Models';

    getAll(): Observable<Model[]> {
        return this.api.getAll<Model>(this.endpoint);
    }

    getById(id: string): Observable<Model> {
        return this.api.getById<Model>(this.endpoint, id);
    }

    create(data: ModelRequest): Observable<Model> {
        return this.api.create<ModelRequest, Model>(this.endpoint, data);
    }

    update(id: string, data: ModelRequest): Observable<Model> {
        return this.api.update<ModelRequest, Model>(this.endpoint, id, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }
}