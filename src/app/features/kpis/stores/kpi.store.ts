import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import { DashboardDto } from '../models/kpi.model';
import { KpiService } from '../services/kpi.service';

type KpiState = {
    dashboard: DashboardDto | null;
    loading: boolean;
    error: string | null;
};

export const KpiStore = signalStore(
    { providedIn: 'root' },
    withState<KpiState>({
        dashboard: null,
        loading: false,
        error: null,
    }),
    withMethods(
        (store, kpiService = inject(KpiService), toast = inject(ToastService)) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                try {
                    const dashboard = await firstValueFrom(kpiService.getDashboard());
                    patchState(store, { dashboard, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los indicadores');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
        }),
    ),
);
