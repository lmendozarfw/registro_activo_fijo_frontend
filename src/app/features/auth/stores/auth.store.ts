import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import {
  AuthService,
  ACCESS_TOKEN_KEY,
  PERMISSIONS_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { LocalStorageService } from '../../../core/services/storage.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import { IAuthTokens, IUserAuth } from '../models/auth.model';

type AuthState = {
  user: IUserAuth | null;
  permissions: string[] | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(() => {
    const storageService = inject(LocalStorageService);
    return {
      user: storageService.get<IUserAuth>(USER_KEY),
      permissions: storageService.get<string[]>(PERMISSIONS_KEY) ?? null,
      accessToken: storageService.get<string>(ACCESS_TOKEN_KEY) ?? null,
      refreshToken: storageService.get<string>(REFRESH_TOKEN_KEY) ?? null,
      loading: false,
      error: null,
    };
  }),
  withComputed(({ user, permissions, accessToken }) => ({
    isAuthenticated: computed(() => !!user() && !!permissions() && !!accessToken()),
  })),
  withMethods(
    (store, authService = inject(AuthService), storageService = inject(LocalStorageService)) => ({
      setUser(user: IUserAuth) {
        patchState(store, { user });
        storageService.set(USER_KEY, user);
      },

      setAccessToken(accessToken: string) {
        patchState(store, { accessToken });
        authService.saveTokens({ accessToken, refreshToken: '' });
      },

      setRefreshToken(refreshToken: string) {
        patchState(store, { refreshToken });
        authService.saveTokens({ accessToken: '', refreshToken });
      },

      setTokens(tokens: IAuthTokens) {
        const accessToken = tokens.accessToken || null;
        const refreshToken = tokens.refreshToken || store.refreshToken();

        patchState(store, { accessToken, refreshToken });

        if (accessToken) {
          authService.saveTokens({
            accessToken,
            refreshToken: refreshToken ?? '',
          });
        }
      },

      setPermissions(permissions: string[]) {
        patchState(store, { permissions });
        storageService.set(PERMISSIONS_KEY, permissions);
      },

      hasPermission(permission: string): boolean {
        if (!permission) return false;
        return store.permissions()?.includes(permission) ?? false;
      },

      logout() {
        patchState(store, {
          user: null,
          permissions: null,
          accessToken: null,
          refreshToken: null,
          loading: false,
          error: null,
        });
        storageService.remove(USER_KEY);
        storageService.remove(PERMISSIONS_KEY);
        authService.clearTokens();
      },

      async login(username: string, password: string) {
        patchState(store, {
          loading: true,
          error: null,
        });

        try {
          const response = await firstValueFrom(
            authService.login({
              username,
              password,
            }),
          );

          this.setTokens({
            accessToken: response.accessToken ?? '',
            refreshToken: response.refreshToken ?? '',
          });
          this.setPermissions(response.permissions);

          await this.me();

          if (store.error()) {
            const error = store.error();
            this.logout();
            patchState(store, { error });
            return;
          }

          patchState(store, { loading: false, error: null });
        } catch (error: unknown) {
          patchState(store, {
            loading: false,
            error: resolveErrorMessage(error, 'Usuario o contraseña incorrectos'),
          });
        }
      },

      async me() {
        patchState(store, {
          loading: true,
          error: null,
        });

        try {
          const response = await firstValueFrom(authService.me());
          console.log({ response, name: response.employeeFullName });
          this.setUser({id: response.id, fullName: response.employeeFullName});
          this.setPermissions(response.permissions);
          patchState(store, { loading: false });
        } catch (error: unknown) {
          patchState(store, {
            loading: false,
            error: resolveErrorMessage(error, 'No se ha podido restaurar la sesión'),
          });
        }
      },

      async restoreSession() {
        if (!store.accessToken()) return;
        await this.me();
      },
    }),
  ),
);
