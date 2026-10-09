import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Brand, BrandRequest } from "../models/brand.model";

@Injectable({ providedIn: 'root' })
export class BrandService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Brands';

    getAll(): Observable<Brand[]> {
        return this.api.getAll<Brand>(this.endpoint);
    }

    getById(id: string): Observable<Brand> {
        return this.api.getById<Brand>(this.endpoint, id);
    }

    create(data: BrandRequest): Observable<Brand> {
        return this.api.create<BrandRequest, Brand>(this.endpoint, data);
    }

    update(id: string, data: BrandRequest): Observable<Brand> {
        return this.api.update<BrandRequest, Brand>(this.endpoint, id, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }
}