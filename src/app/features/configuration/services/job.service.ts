import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Job, JobRequest, JobUpdateRequest } from "../models/job.model";

@Injectable({ providedIn: 'root' })
export class JobService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Jobs';

    getAll(): Observable<Job[]> {
        return this.api.getAll<Job>(this.endpoint);
    }

    getActive(search?: string): Observable<Job[]> {
        return this.api.getAll<Job>(`${this.endpoint}/active`, { search: search ?? '' });
    }

    getById(id: string): Observable<Job> {
        return this.api.getById<Job>(this.endpoint, id);
    }

    create(data: JobRequest): Observable<Job> {
        return this.api.create<JobRequest, Job>(this.endpoint, data);
    }

    update(id: string, data: JobUpdateRequest): Observable<Job> {
        return this.api.patch<JobUpdateRequest, Job>(`${this.endpoint}/${id}`, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }

    softRemove(id: string): Observable<boolean> {
        return this.api.patch(`${this.endpoint}/${id}/inactive`, void 0);
    }
}
