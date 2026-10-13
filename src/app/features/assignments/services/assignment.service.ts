import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { AssignmentDto, CreateAssignmentCommand, ReturnAssignmentCommand } from "../models/assignment.model";

@Injectable({ providedIn: 'root' })
export class AssignmentService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Assignments';

    getAll(): Observable<AssignmentDto[]> {
        return this.api.getAll<AssignmentDto>(this.endpoint);
    }

    create(data: CreateAssignmentCommand): Observable<AssignmentDto> {
        return this.api.create<CreateAssignmentCommand, AssignmentDto>(this.endpoint, data);
    }

    returnResource(data: ReturnAssignmentCommand): Observable<string> {
        return this.api.post<ReturnAssignmentCommand, string>(`${this.endpoint}/${data.assignmentId}/return`, data);
    }
}
