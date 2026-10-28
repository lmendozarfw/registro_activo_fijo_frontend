import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import { SharePointAccess } from '../models/sharepoint-access.model';
import { SharePointAccessService } from '../services/sharepoint-access.service';

type SharePointAccessState = {
  items: SharePointAccess[];
  loading: boolean;
  error: string | null;
};

export const PublicSharePointAccessStore = signalStore(
  { providedIn: 'root' },
  withState<SharePointAccessState>({
    items: [],
    loading: false,
    error: null,
  }),
  withMethods((store, service = inject(SharePointAccessService)) => {
    let requestId = 0;

    return {
      async load(): Promise<void> {
        const currentRequest = ++requestId;
        patchState(store, { loading: true, error: null });

        try {
          const items = await firstValueFrom(service.getPublic());
          if (currentRequest !== requestId) return;

          patchState(store, { items, loading: false });
        } catch (error: unknown) {
          if (currentRequest !== requestId) return;

          patchState(store, {
            loading: false,
            error: resolveErrorMessage(error, 'No se pudieron cargar los accesos de SharePoint'),
          });
        }
      },
    };
  }),
);
