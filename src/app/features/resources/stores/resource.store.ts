import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { ResourceDto, ResourceGroupItemDto, CreateResourceCommand, MobileResourceDto, CreateMobileResourceCommand } from "../models/resource.model";
import { ResourceService } from "../services/resource.service";
import { MobileResourceService } from "../services/mobile-resource.service";
import { LoaderService } from "../../../core/services/loader.service";

type ResourceState = {
    resources: ResourceDto[];
    availableResourceGroups: ResourceGroupItemDto[];
    mobileResources: MobileResourceDto[];
    unassignedMobileResources: MobileResourceDto[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const ResourceStore = signalStore(
    { providedIn: 'root' },
    withState<ResourceState>({
        resources: [],
        availableResourceGroups: [],
        mobileResources: [],
        unassignedMobileResources: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            resourceService = inject(ResourceService),
            mobileResourceService = inject(MobileResourceService),
            toast = inject(ToastService),
            loader = inject(LoaderService)
        ) => ({
            async loadAll(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const resources = await firstValueFrom(resourceService.getAll());
                    patchState(store, { resources, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los recursos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },
            async loadAvailableToAssign(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const resources = await firstValueFrom(resourceService.getAvailableToAssign());
                    patchState(store, { availableResourceGroups: resources, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los recursos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },
            async loadMobile(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const mobileResources = await firstValueFrom(mobileResourceService.getAll());
                    patchState(store, { mobileResources, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los celulares');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },
            async loadUnassignedMobile(): Promise<void> {
                patchState(store, { error: null });
                loader.show();
                try {
                    const unassignedMobileResources = await firstValueFrom(mobileResourceService.getUnassigned());
                    patchState(store, { unassignedMobileResources });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los celulares disponibles');
                    patchState(store, { error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },
            async create(data: CreateResourceCommand): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    await firstValueFrom(resourceService.create(data));
                    patchState(store, { saving: false });
                    toast.success('Recurso creado');
                    await this.loadAll();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear el recurso');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                } finally {
                    loader.hide();
                }
            },
            async createMobile(data: CreateMobileResourceCommand): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    await firstValueFrom(mobileResourceService.create(data));
                    patchState(store, { saving: false });
                    toast.success('Celular registrado');
                    await this.loadMobile();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo registrar el celular');
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