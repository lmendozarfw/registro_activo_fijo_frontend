import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Credential } from "../models/credential.model";
import { CredentialService } from "../services/credential.service";

type MyCredentialState = {
    credentials: Credential[];
    loading: boolean;
    requesting: Record<string, boolean>;
    revealedPasswords: Record<string, string>;
    error: string | null;
};

export const MyCredentialStore = signalStore(
    { providedIn: 'root' },
    withState<MyCredentialState>({
        credentials: [],
        loading: false,
        requesting: {},
        revealedPasswords: {},
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
                    const credentials = await firstValueFrom(service.getMy());
                    patchState(store, { credentials, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar tus credenciales');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async requestPassword(id: string): Promise<void> {
                if (store.revealedPasswords()[id] || store.requesting()[id]) return;

                patchState(store, { requesting: { ...store.requesting(), [id]: true }, error: null });

                try {
                    const password = await firstValueFrom(service.requestViewPassword(id));
                    patchState(store, {
                        requesting: { ...store.requesting(), [id]: false },
                        revealedPasswords: { ...store.revealedPasswords(), [id]: password },
                    });
                    toast.success('Contraseña disponible');
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo solicitar la contraseña');
                    patchState(store, {
                        requesting: { ...store.requesting(), [id]: false },
                        error: message,
                    });
                    toast.error(message);
                }
            },

            hidePassword(id: string): void {
                const revealedPasswords = { ...store.revealedPasswords() };
                delete revealedPasswords[id];
                patchState(store, { revealedPasswords });
            },
        }),
    ),
);
