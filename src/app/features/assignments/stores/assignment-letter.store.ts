import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { LoaderService } from "../../../core/services/loader.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { resolveFileNameFromContentDisposition, saveBlob } from "../../../core/utils/file.utils";
import { AssignmentLetterDto } from "../models/assignment-letter.model";
import { AssignmentService } from "../services/assignment.service";

type AssignmentLetterState = {
    letter: AssignmentLetterDto | null;
    loading: boolean;
    saving: boolean;
    loaded: boolean;
    error: string | null;
};

export const AssignmentLetterStore = signalStore(
    { providedIn: 'root' },
    withState<AssignmentLetterState>({
        letter: null,
        loading: false,
        saving: false,
        loaded: false,
        error: null,
    }),
    withMethods(
        (
            store,
            service = inject(AssignmentService),
            toast = inject(ToastService),
            loader = inject(LoaderService),
        ) => ({
            clear(): void {
                patchState(store, { letter: null, loading: false, saving: false, loaded: false, error: null });
            },
            async loadByAssignment(assignmentId: string): Promise<void> {
                patchState(store, { loading: true, error: null });
                try {
                    const letter = await firstValueFrom(service.getLetter(assignmentId));
                    patchState(store, { letter, loading: false, loaded: true });
                } catch (error) {
                    patchState(store, { letter: null, loading: false, loaded: true, error: resolveErrorMessage(error, 'La carta de asignación no está disponible') });
                }
            },
            async download(assignmentId: string): Promise<void> {
                loader.show();
                try {
                    const response = await firstValueFrom(service.downloadLetter(assignmentId));
                    const fileName =
                        resolveFileNameFromContentDisposition(response.headers.get('content-disposition')) ??
                        store.letter()?.fileName ??
                        'carta-asignacion.pdf';
                    saveBlob(response.body ?? new Blob(), fileName);
                } catch (error) {
                    toast.error(resolveErrorMessage(error, 'No se pudo descargar la carta de asignación'));
                } finally {
                    loader.hide();
                }
            },
            async upload(assignmentId: string, file: File): Promise<boolean> {
                patchState(store, { saving: true, error: null });
                loader.show();
                try {
                    await firstValueFrom(service.uploadSignedLetter(assignmentId, file));
                    patchState(store, { saving: false });
                    toast.success('Carta firmada cargada');
                    await this.loadByAssignment(assignmentId);
                    return true;
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudo cargar la carta firmada');
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
