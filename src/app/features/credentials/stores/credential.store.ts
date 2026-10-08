import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Credential, CredentialRequest } from "../models/credential.model";
import { CredentialService } from "../services/credential.service";

type CredentialState = {
    credentials: Credential[];
    loading: boolean;
    saving: boolean;
    passwordLoading: boolean;
    revealedPassword: string | null;
    error: string | null;
};

export const CredentialStore = signalStore(
    { providedIn: 'root' },
    withState<CredentialState>({
        credentials: [],
        loading: false,
        saving: false,
        passwordLoading: false,
        revealedPassword: null,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(CredentialService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const credentials = await firstValueFrom(service.getAll());
                    patchState(store, { credentials, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las credenciales');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async create(data: CredentialRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Credencial creada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear la credencial');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async update(id: string, data: CredentialRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Credencial actualizada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar la credencial');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async remove(id: string): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.remove(id));
                    patchState(store, { saving: false });
                    toast.success('Credencial eliminada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar la credencial');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async revealPassword(id: string): Promise<void> {
                patchState(store, { passwordLoading: true, revealedPassword: null, error: null });

                try {
                    const response = await firstValueFrom(service.getPassword(id));
                    const password = typeof response === 'string' ? response : response?.password;
                    patchState(store, { passwordLoading: false, revealedPassword: password ?? null });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo obtener la contraseña');
                    patchState(store, { passwordLoading: false, error: message });
                    toast.error(message);
                }
            },

            clearPassword(): void {
                patchState(store, { revealedPassword: null, passwordLoading: false });
            },
        }),
    ),
);
