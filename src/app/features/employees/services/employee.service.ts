import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Employee, EmployeeItem, EmployeeRequest } from "../models/employee.model";

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Employees';

    getAll(): Observable<Employee[]> {
        return this.api.getAll<Employee>(this.endpoint);
    }

    getAvailable(): Observable<EmployeeItem[]> {
        return this.api.getAll<EmployeeItem>(`${this.endpoint}/available`);
    }

    getById(id: string): Observable<Employee> {
        return this.api.getById<Employee>(this.endpoint, id);
    }

    create(data: EmployeeRequest): Observable<Employee> {
        return this.api.create<EmployeeRequest, Employee>(this.endpoint, data);
    }

    update(id: string, data: EmployeeRequest): Observable<Employee> {
        return this.api.update<EmployeeRequest, Employee>(this.endpoint, id, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }
}
