import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { PermissionDto } from "../models/permission.model";
import { ITemplate, TemplateRequest } from "../models/template.model";

@Injectable({ providedIn: 'root' })
export class TemplateService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Templates';

    getAll(): Observable<ITemplate[]> {
        return this.api.getAll<ITemplate>(this.endpoint);
    }

    getById(id: string): Observable<ITemplate> {
        return this.api.getById<ITemplate>(this.endpoint, id);
    }

    getPermissions(templateId: string): Observable<PermissionDto[]> {
        return this.api.get<PermissionDto[]>(`${this.endpoint}/${templateId}/permissions`);
    }

    create(data: TemplateRequest): Observable<ITemplate> {
        return this.api.create<TemplateRequest, ITemplate>(this.endpoint, data);
    }

    update(id: string, data: TemplateRequest): Observable<ITemplate> {
        return this.api.update<TemplateRequest, ITemplate>(this.endpoint, id, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }
}
