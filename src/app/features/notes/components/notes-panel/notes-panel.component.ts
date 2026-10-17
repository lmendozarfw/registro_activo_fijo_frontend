import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { Textarea } from 'primeng/textarea';
import { PIcon } from '@primeicons/angular/p-icon';
import { NOTE_CONTENT_MAX, noteTitle, noteTitleFromContent } from '../../models/note.model';
import { NotesBoardStore } from '../../stores/notes-board.store';
import { NotesStore } from '../../stores/note.store';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {form, FormField, maxLength, required} from '@angular/forms/signals';

type NotesTab = 'mine' | 'shared';
interface NoteDataForm {
    content: string;
    shared: boolean;
    canEdit: boolean;
}
@Component({
    selector: 'app-notes-panel',
    templateUrl: './notes-panel.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, Textarea, PIcon, ToggleButtonModule, FormField],
})
export class NotesPanelComponent implements OnInit {
    protected readonly board = inject(NotesBoardStore);
    protected readonly store = inject(NotesStore);

    protected readonly contentMax = NOTE_CONTENT_MAX;

    protected readonly tab = signal<NotesTab>('mine');
    protected readonly composerOpen = signal(false);

    noteModel = signal<NoteDataForm>({
        content: '',
        shared: false,
        canEdit: false
    });
    noteForm = form(this.noteModel, (schemaPath) => {
        required(schemaPath.content, {message: 'El contenido es requerido'});
        maxLength(schemaPath.content, NOTE_CONTENT_MAX, {message: `Debe tener máximo ${NOTE_CONTENT_MAX} caracteres`})
    });

    protected readonly currentNotes = computed(() =>
        this.tab() === 'mine' ? this.store.myNotes() : this.store.sharedNotes(),
    );
    protected readonly currentLoading = computed(() =>
        this.tab() === 'mine' ? this.store.loadingMine() : this.store.loadingShared(),
    );
    protected readonly canCreate = computed(
        () =>
            this.noteModel().content.trim().length > 0 &&
            this.noteModel().content.length <= this.contentMax &&
            !this.store.creating(),
    );

    ngOnInit(): void {
        void this.store.loadAll();
    }

    protected close(): void {
        this.board.setPanelOpen(false);
    }

    protected openNote(id: string): void {
        this.board.openNote(id);
    }

    protected title(note: { title: string | null }): string {
        return noteTitle(note);
    }

    protected cancelComposer(): void {
        this.composerOpen.set(false);
        this.noteModel.set({ content: '', shared: false, canEdit: false });
    }

    protected async create(): Promise<void> {
        if (!this.canCreate()) return;
        const { content, shared, canEdit } = this.noteModel();
        const trimmedContent = content.trim();
        const id = await this.store.create({
            title: noteTitleFromContent(trimmedContent),
            isShared: shared,
            canEdit: shared && canEdit,
            content: trimmedContent,
        });
        if (!id) return;

        this.cancelComposer();
        this.tab.set('mine');
        this.board.openNote(id);
    }
}
