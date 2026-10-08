import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Job, JobRequest } from "../models/job.model";
import { JobService } from "../services/job.service";

type JobState = {
    jobs: Job[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const JobStore = signalStore(
    { providedIn: 'root' },
    withState<JobState>({
        jobs: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(JobService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const jobs = await firstValueFrom(service.getAll());
                    patchState(store, { jobs, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los puestos de trabajo');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async create(data: JobRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Puesto de trabajo creado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear el puesto de trabajo');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async update(id: string, data: JobRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Puesto de trabajo actualizado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar el puesto de trabajo');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async remove(id: string): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.remove(id));
                    patchState(store, { saving: false });
                    toast.success('Puesto de trabajo eliminado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar el puesto de trabajo');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },
        }),
    ),
);
