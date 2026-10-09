import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { PermissionDto } from "../models/permission.model";
import { PermissionService } from "../services/permission.service";

type PermissionState = {
    permissions: PermissionDto[];
    loading: boolean;
    error: string | null;
};

export const PermissionStore = signalStore(
    { providedIn: 'root' },
    withState<PermissionState>({
        permissions: [],
        loading: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(PermissionService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const permissions = await firstValueFrom(service.getAll());
                    patchState(store, { permissions, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los permisos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
        }),
    ),
);
