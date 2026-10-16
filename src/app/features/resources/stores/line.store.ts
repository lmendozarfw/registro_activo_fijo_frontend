import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { LineDto, CreateLineCommand, UpdateLineCommand, LineItemDto } from "../models/line.model";
import { LineService } from "../models/line.service";
import { LoaderService } from "../../../core/services/loader.service";

type LineState = {
    lines: LineDto[];
    available: LineItemDto[]; 
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const LineStore = signalStore(
    { providedIn: 'root' },
    withState<LineState>({
        lines: [],
        available: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(LineService),
            toast = inject(ToastService),
            loader = inject(LoaderService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const lines = await firstValueFrom(service.getAll());
                    patchState(store, { lines, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las líneas');
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
                    const lines = await firstValueFrom(service.getActive());
                    patchState(store, { lines, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las líneas activas');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },
            async loadAvailable(): Promise<void> {
                patchState(store, { loading: true, error: null });
                loader.show();
                try {
                    const lines = await firstValueFrom(service.getAvailable());
                    patchState(store, { available: lines, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las líneas disponibles');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                } finally {
                    loader.hide();
                }
            },
            async create(data: CreateLineCommand): Promise<LineDto | null> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    const line = await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Línea creada');
                    await this.loadActive();
                    return line;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear la línea');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return null;
                } finally {
                    loader.hide();
                }
            },
            async update(id: string, data: UpdateLineCommand): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    const updatedLine = await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Línea actualizada');
                    const index = store.lines().findIndex(line => line.id === id);
                    if (index !== -1) {
                        const lines = [...store.lines()];
                        lines[index] = updatedLine;
                        patchState(store, { lines });
                    } else {
                        await this.loadActive();
                    }
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar la línea');
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
                    await firstValueFrom(service.remove(id));
                    patchState(store, { saving: false });
                    toast.success('Línea eliminada');
                    await this.loadActive();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar la línea');
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