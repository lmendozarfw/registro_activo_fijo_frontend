import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Inbox, NoteSticky, Plus, Spinner, Times, User } from '@primeicons/angular';
import { NOTE_CONTENT_MAX, NOTE_TITLE_MAX, noteTitle } from '../../models/note.model';
import { NotesBoardStore } from '../../stores/notes-board.store';
import { NotesStore } from '../../stores/note.store';

type NotesTab = 'mine' | 'shared';

@Component({
    selector: 'app-notes-panel',
    templateUrl: './notes-panel.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, InputText, Textarea, NoteSticky, Plus, Times, Spinner, Inbox, User],
})
export class NotesPanelComponent implements OnInit {
    protected readonly board = inject(NotesBoardStore);
    protected readonly store = inject(NotesStore);

    protected readonly contentMax = NOTE_CONTENT_MAX;
    protected readonly titleMax = NOTE_TITLE_MAX;

    protected readonly tab = signal<NotesTab>('mine');
    protected readonly composerOpen = signal(false);
    protected readonly draftTitle = signal('');
    protected readonly draftContent = signal('');
    protected readonly draftShared = signal(false);
    protected readonly draftCanEdit = signal(false);

    protected readonly currentNotes = computed(() =>
        this.tab() === 'mine' ? this.store.myNotes() : this.store.sharedNotes(),
    );
    protected readonly currentLoading = computed(() =>
        this.tab() === 'mine' ? this.store.loadingMine() : this.store.loadingShared(),
    );
    protected readonly canCreate = computed(
        () =>
            this.draftContent().trim().length > 0 &&
            this.draftContent().length <= this.contentMax &&
            this.draftTitle().length <= this.titleMax &&
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

    protected toggleShared(): void {
        const next = !this.draftShared();
        this.draftShared.set(next);
        if (!next) this.draftCanEdit.set(false);
    }

    protected onDraftTitle(event: Event): void {
        this.draftTitle.set((event.target as HTMLInputElement).value);
    }

    protected onDraftContent(event: Event): void {
        this.draftContent.set((event.target as HTMLTextAreaElement).value);
    }

    protected cancelComposer(): void {
        this.composerOpen.set(false);
        this.draftTitle.set('');
        this.draftContent.set('');
        this.draftShared.set(false);
        this.draftCanEdit.set(false);
    }

    protected async create(): Promise<void> {
        if (!this.canCreate()) return;
        const title = this.draftTitle().trim();
        const id = await this.store.create({
            title: title.length > 0 ? title : null,
            isShared: this.draftShared(),
            canEdit: this.draftShared() && this.draftCanEdit(),
            content: this.draftContent().trim(),
        });
        if (!id) return;

        this.cancelComposer();
        this.tab.set('mine');
        this.board.openNote(id);
    }
}
