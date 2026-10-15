import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import {
    CreateNoteRequest,
    NoteDetail,
    NoteListItem,
    UpdateNoteSettingsRequest,
} from '../models/note.model';
import { NoteService } from '../services/note.service';

type NotesState = {
    myNotes: NoteListItem[];
    sharedNotes: NoteListItem[];
    details: Record<string, NoteDetail>;
    loadingMine: boolean;
    loadingShared: boolean;
    detailLoading: Record<string, boolean>;
    creating: boolean;
    saving: boolean;
    removing: boolean;
    error: string | null;
};

export const NotesStore = signalStore(
    { providedIn: 'root' },
    withState<NotesState>({
        myNotes: [],
        sharedNotes: [],
        details: {},
        loadingMine: false,
        loadingShared: false,
        detailLoading: {},
        creating: false,
        saving: false,
        removing: false,
        error: null,
    }),
    withComputed(({ myNotes, sharedNotes }) => ({
        totalCount: computed(() => myNotes().length + sharedNotes().length),
    })),
    withMethods((store, service = inject(NoteService), toast = inject(ToastService)) => ({
        async loadMine(): Promise<void> {
            patchState(store, { loadingMine: true, error: null });
            try {
                const myNotes = await firstValueFrom(service.getMine());
                patchState(store, { myNotes, loadingMine: false });
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudieron cargar tus notas');
                patchState(store, { loadingMine: false, error: message });
                toast.error(message);
            }
        },

        async loadShared(): Promise<void> {
            patchState(store, { loadingShared: true, error: null });
            try {
                const sharedNotes = await firstValueFrom(service.getShared());
                patchState(store, { sharedNotes, loadingShared: false });
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudieron cargar las notas compartidas');
                patchState(store, { loadingShared: false, error: message });
                toast.error(message);
            }
        },

        async loadAll(): Promise<void> {
            await Promise.all([this.loadMine(), this.loadShared()]);
        },

        async loadDetail(id: string, force = false): Promise<void> {
            if (!force && store.details()[id]) return;

            patchState(store, {
                detailLoading: { ...store.detailLoading(), [id]: true },
                error: null,
            });

            try {
                const detail = await firstValueFrom(service.getDetail(id));
                patchState(store, {
                    details: { ...store.details(), [id]: detail },
                    detailLoading: { ...store.detailLoading(), [id]: false },
                });
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo cargar la nota');
                patchState(store, {
                    detailLoading: { ...store.detailLoading(), [id]: false },
                    error: message,
                });
                toast.error(message);
            }
        },

        async create(data: CreateNoteRequest): Promise<string | null> {
            patchState(store, { creating: true, error: null });
            try {
                const id = await firstValueFrom(service.create(data));
                patchState(store, { creating: false });
                toast.success('Nota creada');
                await this.loadMine();
                return id || null;
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo crear la nota');
                patchState(store, { creating: false, error: message });
                toast.error(message);
                return null;
            }
        },

        async updateSettings(id: string, data: UpdateNoteSettingsRequest): Promise<boolean> {
            patchState(store, { saving: true, error: null });
            try {
                await firstValueFrom(service.updateSettings(id, data));
                patchState(store, { saving: false });
                toast.success('Nota actualizada');
                await Promise.all([this.loadDetail(id, true), this.loadMine(), this.loadShared()]);
                return true;
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo actualizar la nota');
                patchState(store, { saving: false, error: message });
                toast.error(message);
                return false;
            }
        },

        async addText(id: string, content: string): Promise<boolean> {
            patchState(store, { saving: true, error: null });
            try {
                await firstValueFrom(service.addText(id, { content }));
                patchState(store, { saving: false });
                await this.loadDetail(id, true);
                return true;
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo agregar el texto');
                patchState(store, { saving: false, error: message });
                toast.error(message);
                return false;
            }
        },

        async remove(id: string): Promise<boolean> {
            patchState(store, { removing: true, error: null });
            try {
                await firstValueFrom(service.remove(id));
                const { [id]: _removed, ...details } = store.details();
                patchState(store, { removing: false, details });
                toast.success('Nota eliminada');
                await Promise.all([this.loadMine(), this.loadShared()]);
                return true;
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo eliminar la nota');
                patchState(store, { removing: false, error: message });
                toast.error(message);
                return false;
            }
        },
    })),
);
