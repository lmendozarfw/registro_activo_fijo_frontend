import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { Observable } from "rxjs";
import { CreateMobileResourceCommand, MobileResourceDto, UpdateMobileResourceCommand } from "../models/resource.model";

@Injectable({providedIn: 'root'})
export class MobileResourceService {
    private readonly api = inject(ApiService);
    private readonly endPoint = 'MobileResources';

    getAll(): Observable<MobileResourceDto[]> {
        return this.api.getAll<MobileResourceDto>(this.endPoint);
    }

    getActive(search?: string): Observable<MobileResourceDto[]> {
        return this.api.getAll<MobileResourceDto>(`${this.endPoint}/active`, { search: search ?? '' });
    }

    getUnassigned(): Observable<MobileResourceDto[]> {
        return this.api.getAll<MobileResourceDto>(`${this.endPoint}/unassigned`);
    }

    create(data: CreateMobileResourceCommand): Observable<MobileResourceDto> {
        return this.api.create<CreateMobileResourceCommand, MobileResourceDto>(this.endPoint, data);
    }

    update(id: string, data: UpdateMobileResourceCommand): Observable<MobileResourceDto> {
        return this.api.patch<UpdateMobileResourceCommand, MobileResourceDto>(`${this.endPoint}/${id}`, data);
    }

    inactive(id: string): Observable<void> {
        return this.api.patch<Record<string, never>, void>(`${this.endPoint}/${id}/inactive`, {});
    }

}