import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import { WeeklyMenuDto } from '../models/weekly-menu.model';
import { WeeklyMenuService } from '../services/weekly-menu.service';

type PublicWeeklyMenuState = {
  current: WeeklyMenuDto | null;
  loading: boolean;
  error: string | null;
};

export const PublicWeeklyMenuStore = signalStore(
  { providedIn: 'root' },
  withState<PublicWeeklyMenuState>({
    current: null,
    loading: false,
    error: null,
  }),
  withMethods((store, service = inject(WeeklyMenuService)) => {
    let requestId = 0;

    return {
      async loadCurrent(): Promise<void> {
        const currentRequest = ++requestId;
        patchState(store, { loading: true, error: null });

        try {
          const current = await firstValueFrom(service.getPublicCurrent());
          if (currentRequest !== requestId) return;

          patchState(store, { current, loading: false });
        } catch (error: unknown) {
          if (currentRequest !== requestId) return;

          patchState(store, {
            current: null,
            loading: false,
            error: resolveErrorMessage(
              error,
              'No se pudo cargar el menú de la semana',
            ),
          });
        }
      },

      clear(): void {
        requestId++;
        patchState(store, { current: null, loading: false, error: null });
      },
    };
  }),
);
