import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Module } from "../models/module.model";
import { ModuleService } from "../services/module.service";

type ModuleState = {
    modules: Module[];
    loading: boolean;
    error: string | null;
};

export const ModuleStore = signalStore(
    { providedIn: 'root' },
    withState<ModuleState>({
        modules: [],
        loading: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(ModuleService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const modules = await firstValueFrom(service.getAll());
                    patchState(store, { modules, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los módulos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
        }),
    ),
);
