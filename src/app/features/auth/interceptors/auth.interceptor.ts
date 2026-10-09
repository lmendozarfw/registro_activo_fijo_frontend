import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    Observable,
    catchError,
    finalize,
    map,
    shareReplay,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStore } from '../stores/auth.store';

const AUTH_ENDPOINTS = ['auth/login', 'auth/refresh-token'];

function isAuthEndpoint(url: string): boolean {
    const normalized = url.toLowerCase();
    return AUTH_ENDPOINTS.some((endpoint) => normalized.includes(endpoint));
}

function withBearerToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

type AuthStoreInstance = InstanceType<typeof AuthStore>;

let refreshRequest$: Observable<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (isAuthEndpoint(request.url)) {
        return next(request);
    }

    const accessToken = authService.getAccessToken();
    const authorizedRequest = accessToken ? withBearerToken(request, accessToken) : request;

    return next(authorizedRequest).pipe(
        catchError((error: unknown) => {
            console.log({ error });
            if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
                return throwError(() => error);
            }
            return handleUnauthorized(request, next, authService, authStore, router);
        }),
    );
};

function handleUnauthorized(
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authService: AuthService,
    authStore: AuthStoreInstance,
    router: Router,
): Observable<HttpEvent<unknown>> {
    const refreshToken = authService.getRefreshToken();

    if (!refreshToken) {
        return expireSession(authStore, router);
    }

    return getRefreshRequest(authService, authStore, router, refreshToken).pipe(
        switchMap((accessToken) => next(withBearerToken(request, accessToken))),
    );
}

function getRefreshRequest(
    authService: AuthService,
    authStore: AuthStoreInstance,
    router: Router,
    refreshToken: string,
): Observable<string> {
    if (!refreshRequest$) {
        refreshRequest$ = authService.refreshToken(refreshToken).pipe(
            tap((tokens) => {
                authStore.setTokens(tokens);
                authService.saveTokens(tokens);
            }),
            map((tokens) => {
                if (!tokens.accessToken) {
                    throw new Error('La respuesta de refresh no contiene access token');
                }
                return tokens.accessToken;
            }),
            catchError((error: unknown) => expireSession(authStore, router, error)),
            finalize(() => {
                refreshRequest$ = null;
            }),
            shareReplay({ bufferSize: 1, refCount: false }),
        );
    }

    return refreshRequest$;
}

function expireSession(
    authStore: AuthStoreInstance,
    router: Router,
    error: unknown = new Error('Sesión expirada'),
): Observable<never> {
    authStore.logout();
    void router.navigate(['/auth/login']);
    return throwError(() => error);
}
