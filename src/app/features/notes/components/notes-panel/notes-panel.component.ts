import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { PIcon } from '@primeicons/angular/p-icon';
import { NOTE_CONTENT_MAX, NOTE_TITLE_MAX, noteTitle } from '../../models/note.model';
import { NotesBoardStore } from '../../stores/notes-board.store';
import { NotesStore } from '../../stores/note.store';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {form, FormField, maxLength, required} from '@angular/forms/signals';

type NotesTab = 'mine' | 'shared';
interface NoteDataForm {
    title: string;
    content: string;
    shared: boolean;
    canEdit: boolean;
}
@Component({
    selector: 'app-notes-panel',
    templateUrl: './notes-panel.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, InputText, Textarea, PIcon, ToggleButtonModule, FormField],
})
export class NotesPanelComponent implements OnInit {
    protected readonly board = inject(NotesBoardStore);
    protected readonly store = inject(NotesStore);

    protected readonly contentMax = NOTE_CONTENT_MAX;
    protected readonly titleMax = NOTE_TITLE_MAX;

    protected readonly tab = signal<NotesTab>('mine');
    protected readonly composerOpen = signal(false);

    noteModel = signal<NoteDataForm>({
        title: '',
        content: '',
        shared: false,
        canEdit: false
    });
    noteForm = form(this.noteModel, (schemaPath) => {
        required(schemaPath.title, {message: 'Título es requerido'});
        required(schemaPath.content, {message: 'El contenido es requerido'});
        maxLength(schemaPath.title, NOTE_TITLE_MAX, {message: `Debe tener máximo ${NOTE_TITLE_MAX} caracteres`});
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
            this.noteModel().title.length <= this.titleMax &&
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
        this.noteModel.set({ title: '', content: '', shared: false, canEdit: false });
    }

    protected async create(): Promise<void> {
        if (!this.canCreate()) return;
        const { title: rawTitle, content, shared, canEdit } = this.noteModel();
        const title = rawTitle.trim();
        const id = await this.store.create({
            title: title.length > 0 ? title : null,
            isShared: shared,
            canEdit: shared && canEdit,
            content: content.trim(),
        });
        if (!id) return;

        this.cancelComposer();
        this.tab.set('mine');
        this.board.openNote(id);
    }
}
