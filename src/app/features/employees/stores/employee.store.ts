import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Employee, EmployeeItem, EmployeeRequest, EmployeeUpdateRequest } from "../models/employee.model";
import { EmployeeService } from "../services/employee.service";
import { LoaderService } from "../../../core/services/loader.service";

type EmployeeState = {
    employees: Employee[];
    employeesItem: EmployeeItem[],
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const EmployeeStore = signalStore(
    { providedIn: 'root' },
    withState<EmployeeState>({
        employees: [],
        employeesItem: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(EmployeeService),
            toast = inject(ToastService),
            loader = inject(LoaderService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const employees = await firstValueFrom(service.getAll());
                    patchState(store, { employees, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los empleados');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },

            async loadActive(search?: string): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const employees = await firstValueFrom(service.getActive(search));
                    patchState(store, { employees, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los empleados activos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },

            async loadAvailablToAssignments(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const employees = await firstValueFrom(service.getAvailableToAssignments());
                    patchState(store, { employeesItem: employees, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los empleados');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },

            async create(data: EmployeeRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
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
                } finally {
                    loader.hide();
                }
            },

            async update(id: string, data: EmployeeUpdateRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    const updatedEmployee = await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Empleado actualizado');
                    const employees = store.employees().map(e => (e.id === id ? { ...e, ...updatedEmployee } : e));
                    patchState(store, { employees });
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar el empleado');
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
                    toast.success('Empleado eliminado');
                    await this.loadActive();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar el empleado');
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
