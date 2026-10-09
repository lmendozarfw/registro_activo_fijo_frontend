import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Model, ModelRequest } from "../models/model.model";
import { ModelService } from "../services/model.service";

type ModelState = {
    models: Model[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const ModelStore = signalStore(
    { providedIn: 'root' },
    withState<ModelState>({
        models: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(ModelService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const models = await firstValueFrom(service.getAll());
                    patchState(store, { models, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los modelos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async create(data: ModelRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Modelo creado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear el modelo');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async update(id: string, data: ModelRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Modelo actualizado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar el modelo');
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
                    toast.success('Modelo eliminado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar el modelo');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },
        }),
    ),
);