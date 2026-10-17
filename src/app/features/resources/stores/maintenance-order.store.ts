import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import {
  CreateMaintenanceOrderCommand,
  MaintenanceOrder
} from '../models/maintenance-plan.model';
import { MaintenanceOrderService } from '../services/maintenance-order.service';

type MaintenanceOrderState = {
  orders: MaintenanceOrder[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

export const MaintenanceOrderStore = signalStore(
  { providedIn: 'root' },
  withState<MaintenanceOrderState>({
    orders: [],
    loading: false,
    saving: false,
    error: null
  }),
  withMethods(
    (
      store,
      service = inject(MaintenanceOrderService),
      toast = inject(ToastService)
    ) => ({
      async loadByResource(resourceId: string): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const orders = await firstValueFrom(service.getByResource(resourceId));
          patchState(store, { orders, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar las órdenes de mantenimiento');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        }
      },
      async loadByPlan(planId: string): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const orders = await firstValueFrom(service.getByPlan(planId));
          patchState(store, { orders, loading: false });
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudieron cargar las órdenes de mantenimiento');
          patchState(store, { loading: false, error: message });
          toast.error(message);
        }
      },
      async create(data: CreateMaintenanceOrderCommand): Promise<boolean> {
        patchState(store, { saving: true, error: null });
        try {
          const created = await firstValueFrom(service.create(data));
          patchState(store, { saving: false });
          toast.success('Maintenance order created');
          patchState(store, { orders: [created, ...store.orders()] });
          return true;
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudo crear la orden de mantenimiento');
          patchState(store, { saving: false, error: message });
          toast.error(message);
          return false;
        }
      },
      async update(id: string, data: Partial<CreateMaintenanceOrderCommand>): Promise<boolean> {
        patchState(store, { saving: true, error: null });
        try {
          const updated = await firstValueFrom(service.update(id, data));
          patchState(store, { saving: false });
          toast.success('Maintenance order updated');
          patchState(store, { orders: store.orders().map(o => (o.id === id ? updated : o)) });
          return true;
        } catch (error) {
          const message = resolveErrorMessage(error, 'No se pudo actualizar la orden de mantenimiento');
          patchState(store, { saving: false, error: message });
          toast.error(message);
          return false;
        }
      },
      clear(): void {
        patchState(store, { orders: [], loading: false, saving: false, error: null });
      }
    })
  )
);
