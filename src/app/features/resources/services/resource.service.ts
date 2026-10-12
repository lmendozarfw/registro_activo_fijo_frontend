import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { ResourceDto, CreateResourceCommand, MobileResourceDto, CreateMobileResourceCommand } from "../models/resource.model";

@Injectable({ providedIn: 'root' })
export class ResourceService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Resources';

    getAll(): Observable<ResourceDto[]> {
        return this.api.getAll<ResourceDto>(this.endpoint);
    }

    create(data: CreateResourceCommand): Observable<ResourceDto> {
        return this.api.create<CreateResourceCommand, ResourceDto>(this.endpoint, data);
    }
}