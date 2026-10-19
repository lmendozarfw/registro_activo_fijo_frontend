import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Model, ModelRequest } from "../models/model.model";
import { ModelService } from "../services/model.service";
import { LoaderService } from "../../../core/services/loader.service";
import { ResourceTypeEnum } from '../models/resource-type.model';

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
      loader = inject(LoaderService),
    ) => ({
      async load(): Promise<void> {
        patchState(store, { loading: true, error: null });
        loader.show();
        try {
          const models = await firstValueFrom(service.getAll());
          patchState(store, { models, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar los modelos');
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
          const models = await firstValueFrom(service.getActive());
          patchState(store, { models, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar los modelos activos');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        } finally {
          loader.hide();
        }
      },
      async loadOnlyMobiles(): Promise<void> {
        patchState(store, { loading: true, error: null });
        loader.show();
        try {
          const models = await firstValueFrom(service.getOnlyMobiles());
          patchState(store, { models, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar los modelos');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        } finally {
          loader.hide();
        }
      },

      async loadByBrand(brandId: string): Promise<void> {
        patchState(store, { loading: true, error: null });
        loader.show();
        try {
          const models = await firstValueFrom(service.getByBrandId(brandId));
          patchState(store, { models, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar los modelos');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        } finally {
          loader.hide();
        }
      },

      async loadByType(type: ResourceTypeEnum): Promise<void> {
        patchState(store, { loading: true, error: null });
        loader.show();
        try {
          const models = await firstValueFrom(service.getByType(type));
          patchState(store, { models, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar los modelos');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        } finally {
          loader.hide();
        }
      },

      async create(data: ModelRequest): Promise<boolean> {
        patchState(store, { saving: true, error: null });
        loader.show();
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
        } finally {
          loader.hide();
        }
      },

      async update(id: string, data: ModelRequest): Promise<boolean> {
        patchState(store, { saving: true, error: null });
        loader.show();
        try {
          const updatedModel = await firstValueFrom(service.update(id, data));
          patchState(store, { saving: false });
          toast.success('Modelo actualizado');
          const models = store.models().map((m) => (m.id === id ? { ...m, ...updatedModel } : m));
          patchState(store, { models });
          return true;
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudo actualizar el modelo');
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
          toast.success('Modelo eliminado');
          await this.loadActive();
          return true;
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudo eliminar el modelo');
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
