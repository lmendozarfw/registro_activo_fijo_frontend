import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Department, DepartmentRequest } from "../models/department.model";
import { DepartmentService } from "../services/department.service";
import { LoaderService } from "../../../core/services/loader.service";

type DepartmentState = {
    departments: Department[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

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
            loader = inject(LoaderService)
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const departments = await firstValueFrom(service.getAll());
                    patchState(store, { departments, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los departamentos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },

            async loadActive(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const departments = await firstValueFrom(service.getActive());
                    patchState(store, { departments, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los departamentos activos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },

            async create(data: DepartmentRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Departamento creado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear el departamento');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                } finally {
                    loader.hide();
                }
            },

            async update(id: string, data: DepartmentRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    const updatedDepartment = await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Departamento actualizado');
                    const departments = store.departments().map(d => (d.id === id ? { ...d, ...updatedDepartment } : d));
                    patchState(store, { departments });
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar el departamento');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                } finally {
                    loader.hide();
                }
            },

            async remove(id: string): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    await firstValueFrom(service.softRemove(id));
                    patchState(store, { saving: false });
                    toast.success('Departamento eliminado');
                    await this.loadActive();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar el departamento');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                } finally {
                    loader.hide();
                }
            },
        }),
    ),
);
