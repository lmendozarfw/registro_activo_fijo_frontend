import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorDetails } from '../../../core/utils/error.utils';
import { BusinessUnit } from '../models/business-unit.model';
import { BusinessUnitService } from '../services/business-unit.service';

type BusinessUnitState = {
  items: BusinessUnit[];
  activeItems: BusinessUnit[];
  search: string;
  loading: boolean;
  activeLoading: boolean;
  saving: boolean;
  error: string | null;
};

export const BusinessUnitStore = signalStore(
  { providedIn: 'root' },
  withState<BusinessUnitState>({
    items: [],
    activeItems: [],
    search: '',
    loading: false,
    activeLoading: false,
    saving: false,
    error: null,
  }),
  withMethods((store, service = inject(BusinessUnitService), toast = inject(ToastService)) => {
    let listRequestId = 0;
    let activeRequestId = 0;

    const notifyError = (error: unknown, fallback: string): void => {
      const details = resolveErrorDetails(error, fallback);
      toast.error(details.message, details.errors.join(' · ') || undefined);
    };

    return {
      async load(): Promise<void> {
        const requestId = ++listRequestId;
        patchState(store, { loading: true, error: null });

        try {
          const items = await firstValueFrom(service.getAll(store.search().trim() || undefined));
          if (requestId !== listRequestId) return;

          patchState(store, { items, loading: false });
        } catch (error: unknown) {
          if (requestId !== listRequestId) return;

          const details = resolveErrorDetails(
            error,
            'No se pudieron cargar las unidades de negocio',
          );
          patchState(store, {
            loading: false,
            error: details.message,
          });
          notifyError(error, 'No se pudieron cargar las unidades de negocio');
        }
      },

      async loadActive(): Promise<void> {
        const requestId = ++activeRequestId;
        patchState(store, { activeLoading: true });

        try {
          const activeItems = await firstValueFrom(service.getActive());
          if (requestId !== activeRequestId) return;

          patchState(store, { activeItems, activeLoading: false });
        } catch (error: unknown) {
          if (requestId !== activeRequestId) return;

          patchState(store, { activeLoading: false });
          notifyError(error, 'No se pudieron cargar las unidades de negocio activas');
        }
      },

      async setSearch(search: string): Promise<void> {
        patchState(store, { search });
        await this.load();
      },

      async create(name: string): Promise<boolean> {
        patchState(store, { saving: true });

        try {
          const id = await firstValueFrom(service.create(name.trim()));
          if (!id) {
            toast.warning(
              'Unidad registrada',
              'La unidad se guardó, pero no fue posible obtener su identificador.',
            );
          } else {
            toast.success('Unidad de negocio registrada');
          }

          patchState(store, { saving: false });
          await Promise.all([this.load(), this.loadActive()]);
          return true;
        } catch (error: unknown) {
          patchState(store, { saving: false });
          notifyError(error, 'No se pudo registrar la unidad de negocio');
          return false;
        }
      },

      async update(id: string, name: string): Promise<boolean> {
        patchState(store, { saving: true });

        try {
          await firstValueFrom(service.update(id, name.trim()));
          patchState(store, { saving: false });
          toast.success('Unidad de negocio actualizada');
          await Promise.all([this.load(), this.loadActive()]);
          return true;
        } catch (error: unknown) {
          patchState(store, { saving: false });
          notifyError(error, 'No se pudo actualizar la unidad de negocio');
          return false;
        }
      },

      async setActive(item: BusinessUnit): Promise<boolean> {
        patchState(store, { saving: true });

        try {
          await firstValueFrom(
            item.active ? service.deactivate(item.id) : service.activate(item.id),
          );
          patchState(store, { saving: false });
          toast.success(
            item.active ? 'Unidad de negocio desactivada' : 'Unidad de negocio activada',
          );
          await Promise.all([this.load(), this.loadActive()]);
          return true;
        } catch (error: unknown) {
          patchState(store, { saving: false });
          notifyError(
            error,
            item.active
              ? 'No se pudo desactivar la unidad de negocio'
              : 'No se pudo activar la unidad de negocio',
          );
          return false;
        }
      },
    };
  }),
);
