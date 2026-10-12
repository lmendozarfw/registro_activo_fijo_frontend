import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { ResourceDto, CreateResourceCommand, MobileResourceDto, CreateMobileResourceCommand } from "../models/resource.model";
import { ResourceService } from "../services/resource.service";
import { MobileResourceService } from "../services/mobile-resource.service";

type ResourceState = {
    resources: ResourceDto[];
    mobileResources: MobileResourceDto[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const ResourceStore = signalStore(
    { providedIn: 'root' },
    withState<ResourceState>({
        resources: [],
        mobileResources: [],
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
        ) => ({
            async loadAll(): Promise<void> {
                patchState(store, { loading: true, error: null });
                try {
                    const resources = await firstValueFrom(resourceService.getAll());
                    patchState(store, { resources, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los recursos');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
            async loadMobile(): Promise<void> {
                patchState(store, { loading: true, error: null });
                try {
                    const mobileResources = await firstValueFrom(mobileResourceService.getAll());
                    patchState(store, { mobileResources, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los celulares');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
            async create(data: CreateResourceCommand): Promise<boolean> {
                patchState(store, { saving: true, error: null });
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
                }
            },
            async createMobile(data: CreateMobileResourceCommand): Promise<boolean> {
                patchState(store, { saving: true, error: null });
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
                }
            },
        }),
    ),
);