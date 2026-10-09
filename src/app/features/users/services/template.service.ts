import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { ITemplate } from "../../configuration/models/template.model";
import { PermissionDto } from "../models/permission.model";

@Injectable({ providedIn: 'root' })
export class TemplateService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Templates';

    getAll(): Observable<ITemplate[]> {
        return this.api.getAll<ITemplate>(this.endpoint);
    }

    getPermissions(templateId: string): Observable<PermissionDto[]> {
        return this.api.get<PermissionDto[]>(`${this.endpoint}/${templateId}/permissions`);
    }
}
