import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { CreateUserRequest, UpdateUserRequest, User } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'Users';

    getAll(): Observable<User[]> {
        return this.api.getAll<User>(this.endpoint);
    }

    getById(id: string): Observable<User> {
        return this.api.getById<User>(this.endpoint, id);
    }

    create(data: CreateUserRequest): Observable<User> {
        return this.api.create<CreateUserRequest, User>(this.endpoint, data);
    }

    update(id: string, data: UpdateUserRequest): Observable<User> {
        return this.api.update<UpdateUserRequest, User>(this.endpoint, id, data);
    }

    remove(id: string): Observable<void> {
        return this.api.delete<void>(this.endpoint, id);
    }
}
