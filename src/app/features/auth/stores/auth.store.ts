import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import {
    AuthService,
    ACCESS_TOKEN_KEY,
    PERMISSIONS_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
} from "../services/auth.service";
import { firstValueFrom } from "rxjs";
import { LocalStorageService } from "../../../core/services/storage.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { IAuthTokens, IPermissionAuth, IUserAuth } from "../models/auth.model";

type AuthState = {
  user: IUserAuth | null;
  permissions: IPermissionAuth[] | null;
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
      permissions: storageService.get<IPermissionAuth[]>(PERMISSIONS_KEY) ?? null,
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
    (
      store,
      authService = inject(AuthService),
      storageService = inject(LocalStorageService),
    ) => ({
      setUser(user: IUserAuth) {
        patchState(store, { user });
      },

      setAccessToken(accessToken: string) {
        patchState(store, { accessToken });
      },

      setRefreshToken(refreshToken: string) {
        patchState(store, { refreshToken });
      },

      setTokens(tokens: IAuthTokens) {
        patchState(store, {
          accessToken: tokens.accessToken || null,
          refreshToken: tokens.refreshToken || store.refreshToken(),
        });
      },

      setPermissions(permissions: IPermissionAuth[]) {
        patchState(store, { permissions });
      },

      logout() {
        patchState(store, {
          user: null,
          permissions: null,
          accessToken: null,
          refreshToken: null,
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
          const tokens = await firstValueFrom(
            authService.login({
              username,
              password,
            }),
          );
          this.setTokens(tokens);
          authService.saveTokens(tokens);
          patchState(store, {
            loading: false,
          });
        } catch (error: any) {
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
          const user: IUserAuth = response.user;

          this.setUser(user);
          this.setPermissions(response.permissions);

          storageService.set(USER_KEY, user);
          storageService.set(PERMISSIONS_KEY, response.permissions);

          patchState(store, {
            loading: false,
          });
        } catch (error: any) {
          patchState(store, {
            loading: false,
            error: resolveErrorMessage(error, 'No se ha podido restaurar la sesión'),
          });
        }
      },
    }),
  ),
);
