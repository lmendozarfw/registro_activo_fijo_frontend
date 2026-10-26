import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import {
  NewsDetailDto,
  NewsListDto,
  NewsStatusFilter,
  SaveNewsRequest,
} from '../models/news.model';
import { NewsService } from '../services/news.service';

const LIST_PAGE_SIZE = 25;

type NewsState = {
  items: NewsListDto[];
  detail: NewsDetailDto | null;
  status: NewsStatusFilter;
  search: string;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  detailLoading: boolean;
  saving: boolean;
  uploading: boolean;
  removingImage: boolean;
  listError: string | null;
  detailError: string | null;
  detailNotFound: boolean;
};

export const NewsStore = signalStore(
  { providedIn: 'root' },
  withState<NewsState>({
    items: [],
    detail: null,
    status: 'All',
    search: '',
    hasMore: true,
    loading: false,
    loadingMore: false,
    detailLoading: false,
    saving: false,
    uploading: false,
    removingImage: false,
    listError: null,
    detailError: null,
    detailNotFound: false,
  }),
  withMethods(
    (store, service = inject(NewsService), toast = inject(ToastService)) => {
      let listRequestId = 0;
      let detailRequestId = 0;

      return {
        async resetFilters(): Promise<void> {
          patchState(store, { status: 'All', search: '' });
          await this.load(true);
        },

        async setStatus(status: NewsStatusFilter): Promise<void> {
          patchState(store, { status });
          await this.load(true);
        },

        async setSearch(search: string): Promise<void> {
          patchState(store, { search });
          await this.load(true);
        },

        async load(reset = true): Promise<void> {
          const requestId = ++listRequestId;
          const currentItems = store.items();
          const status = store.status();
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
                status: status === 'All' ? undefined : status,
                search: search || undefined,
                skip: reset ? 0 : currentItems.length,
                take: LIST_PAGE_SIZE,
              }),
            );
            console.log({items});
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
              'No se pudieron cargar las noticias',
            );
            patchState(store, {
              loading: false,
              loadingMore: false,
              listError: message,
            });
            toast.error(message);
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
            detail:
              store.detail()?.id === id ? store.detail() : null,
            detailLoading: true,
            detailError: null,
            detailNotFound: false,
          });

          try {
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
              'No se pudo cargar la noticia',
            );
            patchState(store, {
              detailLoading: false,
              detailError: message,
            });
            toast.error(message);
          }
        },

        async create(data: SaveNewsRequest): Promise<string | null> {
          patchState(store, { saving: true });
          try {
            const id = await firstValueFrom(service.create(data));
            patchState(store, { saving: false });

            if (!id) {
              toast.warning(
                'Noticia creada',
                'No se recibió el identificador de la noticia.',
              );
              return null;
            }

            toast.success('Noticia creada');
            return id;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo crear la noticia',
            );
            patchState(store, { saving: false });
            toast.error(message);
            return null;
          }
        },

        async update(id: string, data: SaveNewsRequest): Promise<boolean> {
          patchState(store, { saving: true });
          try {
            await firstValueFrom(service.update(id, data));
            patchState(store, { saving: false });
            toast.success('Noticia actualizada');

            if (store.detail()?.id === id) {
              await this.loadDetail(id, true);
            }

            return true;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo actualizar la noticia',
            );
            patchState(store, { saving: false });
            toast.error(message);
            return false;
          }
        },

        async publish(id: string): Promise<boolean> {
          patchState(store, { saving: true });
          try {
            await firstValueFrom(service.publish(id));
            patchState(store, { saving: false });
            toast.success('Noticia publicada');
            await this.load(true);
            if (store.detail()?.id === id) {
              await this.loadDetail(id, true);
            }
            return true;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo publicar la noticia',
            );
            patchState(store, { saving: false });
            toast.error(message);
            return false;
          }
        },

        async schedule(id: string, scheduledPublishAt: string): Promise<boolean> {
          patchState(store, { saving: true });
          try {
            await firstValueFrom(
              service.schedule(id, { scheduledPublishAt }),
            );
            patchState(store, { saving: false });
            toast.success(
              'Publicación programada',
              'La noticia se publicará automáticamente en la fecha indicada.',
            );
            await this.load(true);
            if (store.detail()?.id === id) {
              await this.loadDetail(id, true);
            }
            return true;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo programar la publicación',
            );
            patchState(store, { saving: false });
            toast.error(message);
            return false;
          }
        },

        async archive(id: string): Promise<boolean> {
          patchState(store, { saving: true });
          try {
            await firstValueFrom(service.archive(id));
            patchState(store, { saving: false });
            toast.success('Noticia archivada');
            await this.load(true);
            if (store.detail()?.id === id) {
              await this.loadDetail(id, true);
            }
            return true;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo archivar la noticia',
            );
            patchState(store, { saving: false });
            toast.error(message);
            return false;
          }
        },

        async uploadImage(
          id: string,
          file: File,
          isCover: boolean,
        ): Promise<boolean> {
          patchState(store, { uploading: true });
          try {
            await firstValueFrom(service.uploadImage(id, file, isCover));
            patchState(store, { uploading: false });
            toast.success('Imagen agregada');
            await this.loadDetail(id, true);
            return true;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo subir la imagen',
            );
            patchState(store, { uploading: false });
            toast.error(message);
            return false;
          }
        },

        async setCover(id: string, imageId: string): Promise<boolean> {
          patchState(store, { uploading: true });
          try {
            await firstValueFrom(service.setCover(id, imageId));
            patchState(store, { uploading: false });
            toast.success('Portada actualizada');
            await this.loadDetail(id, true);
            return true;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo actualizar la portada',
            );
            patchState(store, { uploading: false });
            toast.error(message);
            return false;
          }
        },

        async removeImage(id: string, imageId: string): Promise<boolean> {
          patchState(store, { removingImage: true });
          try {
            await firstValueFrom(service.removeImage(id, imageId));
            patchState(store, { removingImage: false });
            toast.success('Imagen eliminada');
            await this.loadDetail(id, true);
            return true;
          } catch (error: unknown) {
            const message = resolveErrorMessage(
              error,
              'No se pudo eliminar la imagen',
            );
            patchState(store, { removingImage: false });
            toast.error(message);
            return false;
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
