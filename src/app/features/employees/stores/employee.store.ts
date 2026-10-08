import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Employee, EmployeeRequest } from "../models/employee.model";
import { EmployeeService } from "../services/employee.service";

type EmployeeState = {
    employees: Employee[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const EmployeeStore = signalStore(
    { providedIn: 'root' },
    withState<EmployeeState>({
        employees: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(EmployeeService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const employees = await firstValueFrom(service.getAll());
                    patchState(store, { employees, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los empleados');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async create(data: EmployeeRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Empleado creado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear el empleado');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async update(id: string, data: EmployeeRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Empleado actualizado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar el empleado');
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
                    toast.success('Empleado eliminado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar el empleado');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },
        }),
    ),
);
