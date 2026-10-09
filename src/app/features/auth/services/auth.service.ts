import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiService } from "../../../core/services/api.service";
import { LocalStorageService } from "../../../core/services/storage.service";
import {
    IAuthTokens,
    ILoginRequest,
    ILoginResponse,
    IMeResponse,
    IRefreshTokenRequest,
    IRefreshTokenResponse,
} from "../models/auth.model";

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user';
export const PERMISSIONS_KEY = 'permissions';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private api = inject(ApiService);
    private storageService = inject(LocalStorageService);

    login(request: ILoginRequest): Observable<IAuthTokens> {
        return this.api
            .post<ILoginRequest, ILoginResponse>('Auth/Login', request)
            .pipe(map((response) => this.normalizeTokens(response)));
    }

    refreshToken(refreshToken: string): Observable<IAuthTokens> {
        return this.api
            .post<IRefreshTokenRequest, IRefreshTokenResponse>('Auth/refresh-token', { refreshToken })
            .pipe(map((response) => this.normalizeTokens(response)));
    }

    me(): Observable<IMeResponse> {
        return this.api.get<IMeResponse>('auth/Me');
    }

    getAccessToken(): string | null {
        return this.storageService.get<string>(ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return this.storageService.get<string>(REFRESH_TOKEN_KEY);
    }

    saveTokens(tokens: IAuthTokens): void {
        if (tokens.accessToken) {
            this.storageService.set(ACCESS_TOKEN_KEY, tokens.accessToken);
        }
        if (tokens.refreshToken) {
            this.storageService.set(REFRESH_TOKEN_KEY, tokens.refreshToken);
        }
    }

    clearTokens(): void {
        this.storageService.remove(ACCESS_TOKEN_KEY);
        this.storageService.remove(REFRESH_TOKEN_KEY);
    }

    logout(): void {
        this.clearTokens();
        this.storageService.remove(USER_KEY);
        this.storageService.remove(PERMISSIONS_KEY);
    }

    private normalizeTokens(response: ILoginResponse | IRefreshTokenResponse): IAuthTokens {
        return {
            accessToken: response.accessToken ?? response.access_token ?? '',
            refreshToken: response.refreshToken ?? response.refresh_token ?? '',
        };
    }
}
