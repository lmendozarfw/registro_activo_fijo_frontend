import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { LoaderService } from "../../../core/services/loader.service";
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
            loader = inject(LoaderService)
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const brands = await firstValueFrom(service.getAll());
                    patchState(store, { brands, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las marcas');
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
                    const brands = await firstValueFrom(service.getActive());
                    patchState(store, { brands, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las marcas activas');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                   loader.hide();
                }
            },
            async create(data: BrandRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
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
                } finally {
                    loader.hide();
                }
            },

            async update(id: string, data: BrandRequest): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    const updatedBrand = await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Marca actualizada');
                    var oldBrandIndex = store.brands().findIndex(b => b.id === id);
                    if (oldBrandIndex !== -1) {
                        console.log('Se va a reemplzar en ', oldBrandIndex);
                        const brands = store.brands();
                        brands[oldBrandIndex] = updatedBrand;
                        patchState(store, {brands});
                    } else {
                        console.log('Se pediran todos los datos');
                        await this.load();
                    }
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar la marca');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
                 finally {
                    loader.hide();
                }
            },

            async remove(id: string): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    await firstValueFrom(service.softRemove(id));
                    patchState(store, { saving: false });
                    toast.success('Marca eliminada');
                    await this.loadActive();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar la marca');
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