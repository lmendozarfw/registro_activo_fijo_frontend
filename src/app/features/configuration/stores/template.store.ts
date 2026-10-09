import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { PermissionsGroupByModuleDto } from "../models/permission.model";
import { ITemplate, TemplateRequest } from "../models/template.model";
import { PermissionService } from "../services/permission.service";
import { TemplateService } from "../services/template.service";

type TemplateState = {
    templates: ITemplate[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    permissionGroups: PermissionsGroupByModuleDto[];
    permissionsLoading: boolean;
};

export const TemplateStore = signalStore(
    { providedIn: 'root' },
    withState<TemplateState>({
        templates: [],
        loading: false,
        saving: false,
        error: null,
        permissionGroups: [],
        permissionsLoading: false,
    }),
    withMethods(
        (
            store,
            service = inject(TemplateService),
            permissionService = inject(PermissionService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const templates = await firstValueFrom(service.getAll());
                    patchState(store, { templates, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las plantillas');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async loadPermissionGroups(): Promise<void> {
                if (store.permissionsLoading() || store.permissionGroups().length > 0) return;

                patchState(store, { permissionsLoading: true });

                try {
                    const permissionGroups = await firstValueFrom(permissionService.getGroupByModules());
                    patchState(store, { permissionGroups, permissionsLoading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los permisos');
                    patchState(store, { permissionsLoading: false });
                    toast.error(message);
                }
            },

            async create(data: TemplateRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Plantilla creada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear la plantilla');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async update(id: string, data: TemplateRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Plantilla actualizada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar la plantilla');
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
                    toast.success('Plantilla eliminada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar la plantilla');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },
        }),
    ),
);
