import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Model, ModelRequest, ModelUpdateRequest } from "../models/model.model";

@Injectable({ providedIn: 'root' })
export class ModelService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Models';

    getAll(): Observable<Model[]> {
        return this.api.getAll<Model>(this.endpoint);
    }

    getActive(): Observable<Model[]> {
        return this.api.getAll<Model>(`${this.endpoint}/active`);
    }

    getOnlyMobiles(): Observable<Model[]> {
        return this.api.getAll<Model>(`${this.endpoint}/mobiles`);
    }

    getByBrandId(brandId: string): Observable<Model[]> {
        return this.api.getAll<Model>(`${this.endpoint}/by-brand/${brandId}`);
    }

    getById(id: string): Observable<Model> {
        return this.api.getById<Model>(this.endpoint, id);
    }

    create(data: ModelRequest): Observable<Model> {
        return this.api.create<ModelRequest, Model>(this.endpoint, data);
    }

    update(id: string, data: ModelUpdateRequest): Observable<Model> {
        return this.api.patch<ModelUpdateRequest, Model>(`${this.endpoint}/${id}`, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }

    softRemove(id: string): Observable<boolean> {
        return this.api.patch(`${this.endpoint}/${id}/inactive`, void 0);
    }
}