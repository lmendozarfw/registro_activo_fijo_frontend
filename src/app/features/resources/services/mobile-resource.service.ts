import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../../core/services/api.service";
import { Observable } from "rxjs";
import { CreateMobileResourceCommand, MobileResourceDto } from "../models/resource.model";

@Injectable({providedIn: 'root'})
export class MobileResourceService {
    private readonly api = inject(ApiService);
    private readonly endPoint = 'MobileResources';

    getAll(): Observable<MobileResourceDto[]> {
        return this.api.getAll<MobileResourceDto>(this.endPoint);
    }

    create(data: CreateMobileResourceCommand): Observable<MobileResourceDto> {
        return this.api.create<CreateMobileResourceCommand, MobileResourceDto>(this.endPoint, data);
    }

}