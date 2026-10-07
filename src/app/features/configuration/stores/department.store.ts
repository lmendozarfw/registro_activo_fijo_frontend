import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { Department, DepartmentRequest } from "../models/department.model";
import { DepartmentService } from "../services/department.service";

type DepartmentState = {
    departments: Department[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

function resolveErrorMessage(error: unknown): string {
    const payload = (error as { error?: { mensaje?: string; message?: string } })?.error;
    return payload?.mensaje || payload?.message || 'Ocurrió un error inesperado';
}

export const DepartmentStore = signalStore(
    { providedIn: 'root' },
    withState<DepartmentState>({
        departments: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(DepartmentService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const departments = await firstValueFrom(service.getAll());
                    patchState(store, { departments, loading: false });
                } catch (error) {
                    patchState(store, { loading: false, error: resolveErrorMessage(error) });
                    toast.error('No se pudieron cargar los departamentos');
                }
            },

            async create(data: DepartmentRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Departamento creado');
                    await this.load();
                    return true;
                } catch (error) {
                    patchState(store, { saving: false, error: resolveErrorMessage(error) });
                    toast.error('No se pudo crear el departamento');
                    return false;
                }
            },

            async update(id: string, data: DepartmentRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Departamento actualizado');
                    await this.load();
                    return true;
                } catch (error) {
                    patchState(store, { saving: false, error: resolveErrorMessage(error) });
                    toast.error('No se pudo actualizar el departamento');
                    return false;
                }
            },

            async remove(id: string): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.remove(id));
                    patchState(store, { saving: false });
                    toast.success('Departamento eliminado');
                    await this.load();
                    return true;
                } catch (error) {
                    patchState(store, { saving: false, error: resolveErrorMessage(error) });
                    toast.error('No se pudo eliminar el departamento');
                    return false;
                }
            },
        }),
    ),
);
