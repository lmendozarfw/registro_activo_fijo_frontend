import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { AssignmentHistoryGroupDto } from "../models/assignment.model";
import { AssignmentService } from "../services/assignment.service";

type AssignmentHistoryState = {
    groups: AssignmentHistoryGroupDto[];
    loading: boolean;
    error: string | null;
};

export const AssignmentHistoryStore = signalStore(
    { providedIn: 'root' },
    withState<AssignmentHistoryState>({
        groups: [],
        loading: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(AssignmentService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                try {
                    const groups = await firstValueFrom(service.getHistory());
                    patchState(store, { groups, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo cargar el historial de asignaciones');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
        }),
    ),
);
