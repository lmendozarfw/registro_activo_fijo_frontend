import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import {
  SaveSharePointAccessRequest,
  SharePointAccessRecord,
} from '../models/sharepoint-access.model';
import { SharePointAccessService } from '../services/sharepoint-access.service';

type SharePointAccessAdminState = {
  items: SharePointAccessRecord[];
  detail: SharePointAccessRecord | null;
  loading: boolean;
  listError: string | null;
  detailLoading: boolean;
  detailError: string | null;
  saving: boolean;
  togglingId: string | null;
};

export const SharePointAccessAdminStore = signalStore(
  { providedIn: 'root' },
  withState<SharePointAccessAdminState>({
    items: [],
    detail: null,
    loading: false,
    listError: null,
    detailLoading: false,
    detailError: null,
    saving: false,
    togglingId: null,
  }),
  withMethods((store, service = inject(SharePointAccessService), toast = inject(ToastService)) => {
    let listRequestId = 0;
    let detailRequestId = 0;

    return {
      async load(): Promise<void> {
        const requestId = ++listRequestId;
        patchState(store, { loading: true, listError: null });

        try {
          const items = await firstValueFrom(service.getAll());
          if (requestId !== listRequestId) return;

          patchState(store, { items, loading: false });
        } catch (error: unknown) {
          if (requestId !== listRequestId) return;

          const message = resolveErrorMessage(
            error,
            'No se pudieron cargar los accesos de SharePoint',
          );
          patchState(store, {
            loading: false,
            listError: message,
          });
          toast.error(message);
        }
      },

      async refresh(): Promise<void> {
        await this.load();
      },

      async loadDetail(id: string): Promise<SharePointAccessRecord | null> {
        const requestId = ++detailRequestId;
        patchState(store, {
          detail: store.detail()?.id === id ? store.detail() : null,
          detailLoading: true,
          detailError: null,
        });

        try {
          const detail = await firstValueFrom(service.getById(id));
          if (requestId !== detailRequestId) return null;

          patchState(store, { detail, detailLoading: false });
          return detail;
        } catch (error: unknown) {
          if (requestId !== detailRequestId) return null;

          const message = resolveErrorMessage(error, 'No se pudo cargar el acceso de SharePoint');
          patchState(store, {
            detailLoading: false,
            detailError: message,
          });
          toast.error(message);
          return null;
        }
      },

      clearDetail(): void {
        detailRequestId++;
        patchState(store, {
          detail: null,
          detailLoading: false,
          detailError: null,
        });
      },

      async create(data: SaveSharePointAccessRequest): Promise<boolean> {
        patchState(store, { saving: true });
        try {
          await firstValueFrom(service.create(data));
          patchState(store, { saving: false });
          toast.success('Acceso creado');
          await this.load();
          return true;
        } catch (error: unknown) {
          const message = resolveErrorMessage(error, 'No se pudo crear el acceso de SharePoint');
          patchState(store, { saving: false });
          toast.error(message);
          return false;
        }
      },

      async update(id: string, data: SaveSharePointAccessRequest): Promise<boolean> {
        patchState(store, { saving: true });
        try {
          await firstValueFrom(service.update(id, data));
          patchState(store, { saving: false });
          toast.success('Acceso actualizado');
          await this.load();
          return true;
        } catch (error: unknown) {
          const message = resolveErrorMessage(
            error,
            'No se pudo actualizar el acceso de SharePoint',
          );
          patchState(store, { saving: false });
          toast.error(message);
          return false;
        }
      },

      async setActive(id: string, active: boolean): Promise<boolean> {
        patchState(store, { togglingId: id });
        try {
          await firstValueFrom(service.updateStatus(id, { active }));
          patchState(store, { togglingId: null });
          toast.success(active ? 'Acceso activado' : 'Acceso desactivado');
          await this.load();
          return true;
        } catch (error: unknown) {
          const message = resolveErrorMessage(
            error,
            active
              ? 'No se pudo activar el acceso de SharePoint'
              : 'No se pudo desactivar el acceso de SharePoint',
          );
          patchState(store, { togglingId: null });
          toast.error(message);
          return false;
        }
      },
    };
  }),
);
