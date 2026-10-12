import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { LineDto, CreateLineCommand } from "../models/line.model";
import { LineService } from "../models/line.service";

type LineState = {
    lines: LineDto[];
    loading: boolean;
    saving: boolean;
    error: string | null;
};

export const LineStore = signalStore(
    { providedIn: 'root' },
    withState<LineState>({
        lines: [],
        loading: false,
        saving: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(LineService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                try {
                    const lines = await firstValueFrom(service.getAll());
                    patchState(store, { lines, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar las líneas');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
            async create(data: CreateLineCommand): Promise<LineDto | null> {
                patchState(store, { saving: true, error: null });
                try {
                    const line = await firstValueFrom(service.create(data));
                    patchState(store, { saving: false });
                    toast.success('Línea creada');
                    await this.load();
                    return line;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo crear la línea');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return null;
                }
            },
            async update(id: string, data: CreateLineCommand): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                try {
                    await firstValueFrom(service.update(id, data));
                    patchState(store, { saving: false });
                    toast.success('Línea actualizada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo actualizar la línea');
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
                    toast.success('Línea eliminada');
                    await this.load();
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo eliminar la línea');
                    patchState(store, { saving: false, error: message });
                    toast.error(message);
                    return false;
                }
            },
        }),
    ),
);