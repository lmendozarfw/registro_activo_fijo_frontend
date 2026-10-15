import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { PermissionDto } from "../models/permission.model";
import { ITemplate, TemplateRequest, TemplateUpdateRequest } from "../models/template.model";

@Injectable({ providedIn: 'root' })
export class TemplateService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Templates';

    getAll(): Observable<ITemplate[]> {
        return this.api.getAll<ITemplate>(this.endpoint);
    }

    getActive(): Observable<ITemplate[]> {
        return this.api.getAll<ITemplate>(`${this.endpoint}/active`);
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

    update(id: string, data: TemplateUpdateRequest): Observable<ITemplate> {
        return this.api.patch<TemplateUpdateRequest, ITemplate>(`${this.endpoint}/${id}`, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }

    softRemove(id: string): Observable<boolean> {
        return this.api.patch(`${this.endpoint}/${id}/inactive`, void 0);
    }
}
