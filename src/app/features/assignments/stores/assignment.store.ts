import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { AssignmentDto, CreateAssignmentCommand } from "../models/assignment.model";
import { AssignmentService } from "../services/assignment.service";

type AssignmentState = {
    assignments: AssignmentDto[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const AssignmentStore = signalStore(
    { providedIn: 'root' },
    withState<AssignmentState>({
        assignments: [],
        loading: false,
        saving: false,
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
                    const assignments = await firstValueFrom(service.getAll());
                    patchState(store, { assignments, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las asignaciones');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
            async create(data: CreateAssignmentCommand): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Asignación creada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear la asignación');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },
        }),
    ),
);