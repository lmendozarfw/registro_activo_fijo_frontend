import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Credential } from "../models/credential.model";
import { CredentialService } from "../services/credential.service";

type MyCredentialState = {
    credentials: Credential[];
    search: string;
    loading: boolean;
    error: string | null;
    revealedPasswords: any;
    requesting: any;
};

export const MyCredentialStore = signalStore(
    { providedIn: 'root' },
    withState<MyCredentialState>({
        credentials: [],
        search: '',
        loading: false,
        error: null,
        revealedPasswords: {},
        requesting: {}
    }),
    withMethods(
        (
            store,
            service = inject(CredentialService),
            toast = inject(ToastService),
        ) => ({
            async load(search?: string): Promise<void> {
                const term = search ?? store.search();
                patchState(store, { loading: true, error: null, search: term });

                try {
                    const credentials = await firstValueFrom(service.getMy(term));
                    patchState(store, { credentials, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar tus credenciales');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async requestPassword(employeeId: string, systemId: string): Promise<void> {
                patchState(store, {requesting: {...store.requesting(), [employeeId+"."+systemId]: true}, error: null });

                try {
                    const response = await firstValueFrom(service.getPassword(employeeId, systemId));
                    const password = response?.message;
                    patchState(store, {revealedPasswords: {...store.revealedPasswords(), [employeeId+"."+systemId]: password}});
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo obtener la contraseña');
                    patchState(store, { requesting: {...store.requesting(), [employeeId+"."+systemId]: false}, error: message });
                    toast.error(message);
                }
            },

            hidePassword(employeeId: string, systemId: string): void {
                const revealedPasswords = { ...store.revealedPasswords() };
                delete revealedPasswords[employeeId+"."+systemId];
                patchState(store, { revealedPasswords});
            },
        }),
    ),
);
