import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { Credential, CredentialRequest } from "../models/credential.model";

@Injectable({ providedIn: 'root' })
export class CredentialService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Credentials';

    getAll(): Observable<Credential[]> {
        return this.api.getAll<Credential>(this.endpoint);
    }

    getById(id: string): Observable<Credential> {
        return this.api.getById<Credential>(this.endpoint, id);
    }

    create(data: CredentialRequest): Observable<Credential> {
        return this.api.create<CredentialRequest, Credential>(this.endpoint, data);
    }

    update(id: string, data: CredentialRequest): Observable<Credential> {
        return this.api.update<CredentialRequest, Credential>(this.endpoint, id, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }

    getPassword(id: string): Observable<string | { password: string }> {
        return this.api.get<string | { password: string }>(`${this.endpoint}/${id}/password`);
    }
}
