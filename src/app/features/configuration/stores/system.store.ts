import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { System, SystemRequest } from "../models/system.model";
import { SystemService } from "../services/system.service";
import { LoaderService } from "../../../core/services/loader.service";

type SystemState = {
    systems: System[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const SystemStore = signalStore(
    { providedIn: 'root' },
    withState<SystemState>({
        systems: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(SystemService),
            toast = inject(ToastService),
            loader = inject(LoaderService)
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const systems = await firstValueFrom(service.getAll());
                    patchState(store, { systems, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los sistemas');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },

            async loadActive(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const systems = await firstValueFrom(service.getActive());
                    patchState(store, { systems, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los sistemas activos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },

            async create(data: SystemRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Sistema creado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear el sistema');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                } finally {
                    loader.hide();
                }
            },

            async update(id: string, data: SystemRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    const updatedSystem = await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Sistema actualizado');
                    const systems = store.systems().map(s => (s.id === id ? { ...s, ...updatedSystem } : s));
                    patchState(store, { systems });
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar el sistema');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                } finally {
                    loader.hide();
                }
            },

            async remove(id: string): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    await firstValueFrom(service.softRemove(id));
                    patchState(store, { saving: false });
                    toast.success('Sistema eliminado');
                    await this.loadActive();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar el sistema');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                } finally {
                    loader.hide();
                }
            },
        }),
    ),
);
