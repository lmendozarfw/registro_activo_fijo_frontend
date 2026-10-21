import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { ApiService } from "../../../core/services/api.service";
import { AssignmentDto, AssignmentHistoryGroupDto, CreateAssignmentCommand, RenewMobileAssignmentCommand, ReturnAssignmentCommand } from "../models/assignment.model";
import { AssignmentLetterDto } from "../models/assignment-letter.model";

@Injectable({ providedIn: 'root' })
export class AssignmentService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Assignments';

    getAll(): Observable<AssignmentDto[]> {
        return this.api.getAll<AssignmentDto>(this.endpoint);
    }

    getActive(search?: string): Observable<AssignmentDto[]> {
        return this.api.getAll<AssignmentDto>(`${this.endpoint}/active`, { search: search ?? '' });
    }

    getHistory(): Observable<AssignmentHistoryGroupDto[]> {
        return this.api.getAll<AssignmentHistoryGroupDto>(`${this.endpoint}/history`);
    }

    create(data: CreateAssignmentCommand): Observable<AssignmentDto> {
        return this.api.create<CreateAssignmentCommand, AssignmentDto>(this.endpoint, data);
    }

    returnResource(data: ReturnAssignmentCommand): Observable<string> {
        return this.api.post<ReturnAssignmentCommand, string>(`${this.endpoint}/${data.assignmentId}/return`, data);
    }

    renewMobile(data: RenewMobileAssignmentCommand): Observable<string> {
        return this.api.post<RenewMobileAssignmentCommand, string>(`${this.endpoint}/${data.assignmentId}/renew`, data);
    }

    getLetter(assignmentId: string): Observable<AssignmentLetterDto> {
        return this.api.get<AssignmentLetterDto>(`${this.endpoint}/${assignmentId}/letter`);
    }

    downloadLetter(assignmentId: string): Observable<HttpResponse<Blob>> {
        return this.api.download(`${this.endpoint}/${assignmentId}/letter/download`, 'carta-asignacion.pdf');
    }

    uploadSignedLetter(assignmentId: string, file: File): Observable<boolean> {
        const formData = new FormData();
        formData.append('file', file);
        return this.api.upload<boolean>(`${this.endpoint}/${assignmentId}/letter/upload`, formData);
    }
}
