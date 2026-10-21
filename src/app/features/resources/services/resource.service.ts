import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { ResourceDto, ResourceGroupItemDto, CreateResourceCommand, UpdateResourceCommand, MobileResourceDto, CreateMobileResourceCommand } from "../models/resource.model";

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'Resources';

  getAll(search?: string): Observable<ResourceDto[]> {
    return this.api.getAll<ResourceDto>(this.endpoint, { search: search ?? '' });
  }

  getActive(search?: string): Observable<ResourceDto[]> {
    return this.api.getAll<ResourceDto>(`${this.endpoint}/active`, { search: search ?? '' });
  }

  create(data: CreateResourceCommand): Observable<ResourceDto> {
    return this.api.create<CreateResourceCommand, ResourceDto>(this.endpoint, data);
  }

  update(id: string, data: UpdateResourceCommand): Observable<ResourceDto> {
    return this.api.patch<UpdateResourceCommand, ResourceDto>(`${this.endpoint}/${id}`, data);
  }

  softRemove(id: string): Observable<boolean> {
    return this.api.patch<Record<string, never>, boolean>(`${this.endpoint}/${id}/inactive`, {});
  }

  getAvailableToAssign(): Observable<ResourceGroupItemDto[]> {
    return this.api.getAll<ResourceGroupItemDto>(`${this.endpoint}/available-to-assignments`);
  }
}
