import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Department, DepartmentRequest } from "../models/department.model";

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Departments';

    getAll(): Observable<Department[]> {
        return this.api.getAll<Department>(this.endpoint);
    }

    getById(id: string): Observable<Department> {
        return this.api.getById<Department>(this.endpoint, id);
    }

    create(data: DepartmentRequest): Observable<Department> {
        return this.api.create<DepartmentRequest, Department>(this.endpoint, data);
    }

    update(id: string, data: DepartmentRequest): Observable<Department> {
        return this.api.update<DepartmentRequest, Department>(this.endpoint, id, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }
}
