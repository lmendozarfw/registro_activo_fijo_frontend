import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { PermissionDto, PermissionsGroupByModuleDto } from "../models/permission.model";

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Permissions';

    getAll(): Observable<PermissionDto[]> {
        return this.api.getAll<PermissionDto>(this.endpoint);
    }

    getGroupByModules(): Observable<PermissionsGroupByModuleDto[]> {
        return this.api.get<PermissionsGroupByModuleDto[]>(`${this.endpoint}/group-by-modules`);
    }
}
