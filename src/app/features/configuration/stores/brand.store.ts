import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { Brand, BrandRequest } from "../models/brand.model";
import { BrandService } from "../services/brand.service";

type BrandState = {
    brands: Brand[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const BrandStore = signalStore(
    { providedIn: 'root' },
    withState<BrandState>({
        brands: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(BrandService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });

                try {
                    const brands = await firstValueFrom(service.getAll());
                    patchState(store, { brands, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las marcas');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },

            async create(data: BrandRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Marca creada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear la marca');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },

            async update(id: string, data: BrandRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });

                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Marca actualizada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar la marca');
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
                    toast.success('Marca eliminada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar la marca');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },
        }),
    ),
);