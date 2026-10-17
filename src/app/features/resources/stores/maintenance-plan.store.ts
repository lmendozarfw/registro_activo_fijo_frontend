import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import {
  CreateMaintenancePlanCommand,
  MaintenancePlan
} from '../models/maintenance-plan.model';
import { MaintenancePlanService } from '../services/maintenance-plan.service';

type MaintenancePlanState = {
  plans: MaintenancePlan[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

export const MaintenancePlanStore = signalStore(
  { providedIn: 'root' },
  withState<MaintenancePlanState>({
    plans: [],
    loading: false,
    saving: false,
    error: null
  }),
  withMethods(
    (
      store,
      service = inject(MaintenancePlanService),
      toast = inject(ToastService)
    ) => ({
      async load(): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const plans = await firstValueFrom(service.getAll());
          patchState(store, { plans, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar los planes de mantenimiento');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        }
      },
      async loadByResource(resourceId: string): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const plans = await firstValueFrom(service.getByResource(resourceId));
          patchState(store, { plans, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar los planes de mantenimiento');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        }
      },
      async loadActiveByResource(resourceId: string): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const plans = await firstValueFrom(service.getActiveByResource(resourceId));
          patchState(store, { plans, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar los planes de mantenimiento');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        }
      },
      async create(data: CreateMaintenancePlanCommand): Promise<boolean> {
        patchState(store, { saving: true, error: null });
        try {
          const created = await firstValueFrom(service.create(data));
          patchState(store, { saving: false });
          toast.success('Maintenance plan created');
          patchState(store, { plans: [...store.plans(), created] });
          return true;
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudo crear el plan de mantenimiento');
          patchState(store, { saving: false, error: message });
          toast.error(message);
          return false;
        }
      },
      async update(id: string, data: Partial<CreateMaintenancePlanCommand>): Promise<boolean> {
        patchState(store, { saving: true, error: null });
        try {
          const updated = await firstValueFrom(service.update(id, data));
          patchState(store, { saving: false });
          toast.success('Maintenance plan updated');
          patchState(store, { plans: store.plans().map(p => (p.id === id ? updated : p)) });
          return true;
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudo actualizar el plan de mantenimiento');
          patchState(store, { saving: false, error: message });
          toast.error(message);
          return false;
        }
      },
      async remove(id: string): Promise<boolean> {
        patchState(store, { saving: true, error: null });
        try {
          await firstValueFrom(service.softRemove(id));
          patchState(store, { saving: false });
          toast.success('Maintenance plan deleted');
          patchState(store, { plans: store.plans().map(p => (p.id === id ? { ...p, active: false } : p)) });
          return true;
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudo eliminar el plan de mantenimiento');
          patchState(store, { saving: false, error: message });
          toast.error(message);
          return false;
        }
      },
      clear(): void {
        patchState(store, { plans: [], loading: false, saving: false, error: null });
      }
    })
  )
);
