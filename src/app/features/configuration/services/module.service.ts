import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Module } from "../models/module.model";

@Injectable({ providedIn: 'root' })
export class ModuleService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Modules';

    getAll(): Observable<Module[]> {
        return this.api.getAll<Module>(this.endpoint);
    }
}
