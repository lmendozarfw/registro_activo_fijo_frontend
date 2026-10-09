import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { PermissionsGroupByModuleDto } from "../models/permission.model";

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Permissions';

    getGroupByModules(): Observable<PermissionsGroupByModuleDto[]> {
        return this.api.get<PermissionsGroupByModuleDto[]>(`${this.endpoint}/group-by-modules`);
    }
}
