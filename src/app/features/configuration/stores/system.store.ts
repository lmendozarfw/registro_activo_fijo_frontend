import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { System, SystemRequest } from "../models/system.model";
import { SystemService } from "../services/system.service";

type SystemState = {
    systems: System[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

function resolveErrorMessage(error: unknown): string {
    const payload = (error as { error?: { mensaje?: string; message?: string } })?.error;
    return payload?.mensaje || payload?.message || 'Ocurrió un error inesperado';
}

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
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const systems = await firstValueFrom(service.getAll());
                    patchState(store, { systems, loading: false });
                } catch (error) {
                    patchState(store, { loading: false, error: resolveErrorMessage(error) });
                    toast.error('No se pudieron cargar los sistemas');
                }
            },

            async create(data: SystemRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Sistema creado');
                    await this.load();
                    return true;
                } catch (error) {
                    patchState(store, { saving: false, error: resolveErrorMessage(error) });
                    toast.error('No se pudo crear el sistema');
                    return false;
                }
            },

            async update(id: string, data: SystemRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Sistema actualizado');
                    await this.load();
                    return true;
                } catch (error) {
                    patchState(store, { saving: false, error: resolveErrorMessage(error) });
                    toast.error('No se pudo actualizar el sistema');
                    return false;
                }
            },

            async remove(id: string): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.remove(id));
                    patchState(store, { saving: false });
                    toast.success('Sistema eliminado');
                    await this.load();
                    return true;
                } catch (error) {
                    patchState(store, { saving: false, error: resolveErrorMessage(error) });
                    toast.error('No se pudo eliminar el sistema');
                    return false;
                }
            },
        }),
    ),
);
