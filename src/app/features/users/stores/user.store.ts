import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Employee, EmployeeItem } from "../../employees/models/employee.model";
import { EmployeeService } from "../../employees/services/employee.service";
import { ITemplate } from "../../configuration/models/template.model";
import { PermissionsGroupByModuleDto } from "../../configuration/models/permission.model";
import { CreateUserRequest, UpdateUserRequest, User } from "../models/user.model";
import { PermissionService } from "../../configuration/services/permission.service";
import { TemplateService } from "../../configuration/services/template.service";
import { UserService } from "../services/user.service";

type UserState = {
    users: User[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    availableEmployees: EmployeeItem[];
    templates: ITemplate[];
    permissionGroups: PermissionsGroupByModuleDto[];
    optionsLoading: boolean;
};

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState<UserState>({
        users: [],
        loading: false,
        saving: false,
        error: null,
        availableEmployees: [],
        templates: [],
        permissionGroups: [],
        optionsLoading: false,
    }),
    withMethods(
        (
            store,
            service = inject(UserService),
            employeeService = inject(EmployeeService),
            templateService = inject(TemplateService),
            permissionService = inject(PermissionService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const users = await firstValueFrom(service.getAll());
                    patchState(store, { users, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los usuarios');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async create(data: CreateUserRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Usuario creado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear el usuario');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async update(id: string, data: UpdateUserRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Usuario actualizado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar el usuario');
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
                    toast.success('Usuario eliminado');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar el usuario');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async loadFormOptions(): Promise<void> {
                if (store.optionsLoading()) return;

                patchState(store, { optionsLoading: true });

                try {
                    const [availableEmployees, templates, permissionGroups] = await Promise.all([
                        firstValueFrom(employeeService.getAvailable()),
                        firstValueFrom(templateService.getAll()),
                        firstValueFrom(permissionService.getGroupByModules()),
                    ]);

                    patchState(store, { availableEmployees, templates, permissionGroups, optionsLoading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las opciones del formulario');
                    patchState(store, { optionsLoading: false });
                    toast.error(message);
                }
            },

            async getTemplatePermissionIds(templateId: string): Promise<string[]> {
                try {
                    const permissions = await firstValueFrom(templateService.getPermissions(templateId));
                    return permissions.map((permission) => permission.id);
                } catch (error) {
                    toast.error(resolveErrorMessage(error, 'No se pudieron cargar los permisos de la plantilla'));
                    return [];
                }
            },
        }),
    ),
);
