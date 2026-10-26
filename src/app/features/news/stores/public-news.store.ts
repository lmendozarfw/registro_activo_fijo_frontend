import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import { NewsDetailDto, NewsListDto } from '../models/news.model';
import { NewsService } from '../services/news.service';

const PUBLIC_PAGE_SIZE = 12;

type PublicNewsState = {
  featured: NewsListDto[];
  list: NewsListDto[];
  detail: NewsDetailDto | null;
  featuredLoading: boolean;
  loading: boolean;
  loadingMore: boolean;
  detailLoading: boolean;
  featuredError: string | null;
  listError: string | null;
  detailError: string | null;
  detailNotFound: boolean;
  hasMore: boolean;
};

export const PublicNewsStore = signalStore(
  { providedIn: 'root' },
  withState<PublicNewsState>({
    featured: [],
    list: [],
    detail: null,
    featuredLoading: false,
    loading: false,
    loadingMore: false,
    detailLoading: false,
    featuredError: null,
    listError: null,
    detailError: null,
    detailNotFound: false,
    hasMore: true,
  }),
  withMethods((store, service = inject(NewsService)) => {
    let featuredRequestId = 0;
    let listRequestId = 0;
    let detailRequestId = 0;

    return {
      async loadFeatured(take = 3): Promise<void> {
        const requestId = ++featuredRequestId;
        patchState(store, { featuredLoading: true, featuredError: null });

        try {
          const featured = await firstValueFrom(
            service.getPublicList(0, take),
          );
          if (requestId !== featuredRequestId) return;

          patchState(store, { featured, featuredLoading: false });
        } catch (error: unknown) {
          if (requestId !== featuredRequestId) return;

          patchState(store, {
            featuredLoading: false,
            featuredError: resolveErrorMessage(
              error,
              'No se pudieron cargar las noticias',
            ),
          });
        }
      },

      async loadList(reset = true): Promise<void> {
        const requestId = ++listRequestId;
        const currentItems = store.list();

        patchState(
          store,
          reset
            ? { loading: true, listError: null }
            : { loadingMore: true, listError: null },
        );

        try {
          const items = await firstValueFrom(
            service.getPublicList(
              reset ? 0 : currentItems.length,
              PUBLIC_PAGE_SIZE,
            ),
          );
          if (requestId !== listRequestId) return;

          patchState(store, {
            list: reset ? items : [...currentItems, ...items],
            hasMore: items.length === PUBLIC_PAGE_SIZE,
            loading: false,
            loadingMore: false,
          });
        } catch (error: unknown) {
          if (requestId !== listRequestId) return;

          patchState(store, {
            loading: false,
            loadingMore: false,
            listError: resolveErrorMessage(
              error,
              'No se pudieron cargar las noticias',
            ),
          });
        }
      },

      async loadMore(): Promise<void> {
        if (store.loading() || store.loadingMore() || !store.hasMore()) return;
        await this.loadList(false);
      },

      async refreshList(): Promise<void> {
        await this.loadList(true);
      },

      async loadDetail(id: string): Promise<void> {
        const requestId = ++detailRequestId;
        patchState(store, {
          detail: store.detail()?.id === id ? store.detail() : null,
          detailLoading: true,
          detailError: null,
          detailNotFound: false,
        });

        try {
          const detail = await firstValueFrom(service.getPublicDetail(id));
          if (requestId !== detailRequestId) return;

          patchState(store, { detail, detailLoading: false });
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

          patchState(store, {
            detailLoading: false,
            detailError: resolveErrorMessage(
              error,
              'No se pudo cargar la noticia',
            ),
          });
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
  }),
);
