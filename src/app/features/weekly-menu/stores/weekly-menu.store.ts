import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { LoaderService } from '../../../core/services/loader.service';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import {
  CreateWeeklyMenuRequest,
  UpdateWeeklyMenuRequest,
  WeeklyMenuDto,
} from '../models/weekly-menu.model';
import { WeeklyMenuService } from '../services/weekly-menu.service';

const LIST_PAGE_SIZE = 25;

type WeeklyMenuState = {
  items: WeeklyMenuDto[];
  detail: WeeklyMenuDto | null;
  search: string;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  detailLoading: boolean;
  saving: boolean;
  removing: boolean;
  listError: string | null;
  detailError: string | null;
  detailNotFound: boolean;
};

function resolveSaveError(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse && error.status === 409) {
    return resolveErrorMessage(
      error,
      'Ya existe un menú que se traslapa con el rango de fechas seleccionado.',
    );
  }

  return resolveErrorMessage(error, fallback);
}

export const WeeklyMenuStore = signalStore(
  { providedIn: 'root' },
  withState<WeeklyMenuState>({
    items: [],
    detail: null,
    search: '',
    hasMore: true,
    loading: false,
    loadingMore: false,
    detailLoading: false,
    saving: false,
    removing: false,
    listError: null,
    detailError: null,
    detailNotFound: false,
  }),
  withMethods(
    (
      store,
      service = inject(WeeklyMenuService),
      toast = inject(ToastService),
      loader = inject(LoaderService),
    ) => {
      let listRequestId = 0;
      let detailRequestId = 0;

      return {
        async resetFilters(): Promise<void> {
          patchState(store, { search: '' });
          await this.load(true);
        },

        async setSearch(search: string): Promise<void> {
          patchState(store, { search });
          await this.load(true);
        },

        async load(reset = true): Promise<void> {
          loader.show();
          const requestId = ++listRequestId;
          const currentItems = store.items();
          const search = store.search().trim();

          patchState(
            store,
            reset
              ? { loading: true, listError: null }
              : { loadingMore: true, listError: null },
          );

          try {
            const items = await firstValueFrom(
              service.getAdminList({
                search: search || undefined,
                skip: reset ? 0 : currentItems.length,
                take: LIST_PAGE_SIZE,
              }),
            );
            if (requestId !== listRequestId) return;

            patchState(store, {
              items: reset ? items : [...currentItems, ...items],
              hasMore: items.length === LIST_PAGE_SIZE,
              loading: false,
              loadingMore: false,
            });
          } catch (error: unknown) {
            if (requestId !== listRequestId) return;

            const message = resolveErrorMessage(
              error,
              'No se pudieron cargar los menús semanales',
            );
            patchState(store, {
              loading: false,
              loadingMore: false,
              listError: message,
            });
            toast.error(message);
          } finally {
            loader.hide();
          }
        },

        async loadMore(): Promise<void> {
          if (store.loading() || store.loadingMore() || !store.hasMore()) return;
          await this.load(false);
        },

        async refresh(): Promise<void> {
          await this.load(true);
        },

        async loadDetail(id: string, force = false): Promise<void> {
          if (!force && store.detail()?.id === id) return;

          const requestId = ++detailRequestId;
          patchState(store, {
            detail: store.detail()?.id === id ? store.detail() : null,
            detailLoading: true,
            detailError: null,
            detailNotFound: false,
          });

          try {
            loader.show();
            const detail = await firstValueFrom(service.getDetail(id));
            if (requestId !== detailRequestId) return;

            patchState(store, {
              detail,
              detailLoading: false,
            });
          } catch (error: unknown) {
            if (requestId !== detailRequestId) return;

            if (error instanceof HttpErrorResponse && error.status === 404) {
              patchState(store, {
                detail: null,
                detailLoading: false,
                detailNotFound: true,
              });
              return;
            }

            const message = resolveErrorMessage(
              error,
              'No se pudo cargar el menú semanal',
            );
            patchState(store, {
              detailLoading: false,
              detailError: message,
            });
            toast.error(message);
          } finally {
            loader.hide();
          }
        },

        async create(data: CreateWeeklyMenuRequest): Promise<string | null> {
          patchState(store, { saving: true });
          try {
            loader.show();
            const id = await firstValueFrom(service.create(data));
            patchState(store, { saving: false });

            if (!id) {
              toast.warning(
                'Menú creado',
                'No se recibió el identificador del menú semanal.',
              );
              return null;
            }

            toast.success('Menú semanal creado');
            return id;
          } catch (error: unknown) {
            const message = resolveSaveError(error, 'No se pudo crear el menú semanal');
            patchState(store, { saving: false });
            toast.error(message);
            return null;
          } finally {
            loader.hide();
          }
        },

        async update(id: string, data: UpdateWeeklyMenuRequest): Promise<boolean> {
          patchState(store, { saving: true });
          try {
            loader.show();
            await firstValueFrom(service.update(id, data));
            patchState(store, { saving: false });
            toast.success('Menú semanal actualizado');

            if (store.detail()?.id === id) {
              await this.loadDetail(id, true);
            }

            return true;
          } catch (error: unknown) {
            const message = resolveSaveError(
              error,
              'No se pudo actualizar el menú semanal',
            );
            patchState(store, { saving: false });
            toast.error(message);
            return false;
          } finally {
            loader.hide();
          }
        },

        async remove(id: string): Promise<boolean> {
          patchState(store, { removing: true });
          try {
            loader.show();
            await firstValueFrom(service.delete(id));
            patchState(store, { removing: false });
            toast.success('Menú semanal eliminado');
            await this.load(true);
            return true;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo eliminar el menú semanal',
            );
            patchState(store, { removing: false });
            toast.error(message);
            return false;
          } finally {
            loader.hide();
          }
        },

        clearDetail(): void {
          detailRequestId++;
          patchState(store, {
            detail: null,
            detailLoading: false,
            detailError: null,
            detailNotFound: false,
          });
        },
      };
    },
  ),
);
