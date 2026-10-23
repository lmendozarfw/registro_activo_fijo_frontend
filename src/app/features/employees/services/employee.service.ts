import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Employee, EmployeeItem, EmployeeRequest, EmployeeUpdateRequest } from "../models/employee.model";

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Employees';

    getAll(): Observable<Employee[]> {
        return this.api.getAll<Employee>(this.endpoint);
    }

    getActive(search?: string): Observable<Employee[]> {
        return this.api.getAll<Employee>(`${this.endpoint}/active`, {search: search ?? ""});
    }

    getAvailable(employeeId?: string): Observable<EmployeeItem[]> {
        return this.api.getAll<EmployeeItem>(`${this.endpoint}/available?includedEmployeeId=${employeeId ?? ""}`);
    }

    getAvailableToAssignments(): Observable<EmployeeItem[]> {
        return this.api.getAll<EmployeeItem>(`${this.endpoint}/available-to-assignments`);
    }

    getById(id: string): Observable<Employee> {
        return this.api.getById<Employee>(this.endpoint, id);
    }

    create(data: EmployeeRequest): Observable<Employee> {
        return this.api.create<EmployeeRequest, Employee>(this.endpoint, data);
    }

    update(id: string, data: EmployeeUpdateRequest): Observable<Employee> {
        return this.api.patch<EmployeeUpdateRequest, Employee>(`${this.endpoint}/${id}`, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }

    softRemove(id: string): Observable<boolean> {
        return this.api.patch(`${this.endpoint}/${id}/inactive`, void 0);
    }
}
