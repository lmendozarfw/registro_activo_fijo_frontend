import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    effect,
    inject,
    input,
    signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { PIcon } from '@primeicons/angular/p-icon';
import { AuthStore } from '../../../auth/stores/auth.store';
import { NOTE_CONTENT_MAX, NOTE_TITLE_MAX, noteTitle } from '../../models/note.model';
import { NotesBoardStore } from '../../stores/notes-board.store';
import { NotesStore } from '../../stores/note.store';

@Component({
    selector: 'app-sticky-note',
    templateUrl: './sticky-note.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, InputText, Textarea, TooltipModule, PIcon],
})
export class StickyNoteComponent implements OnInit {
    readonly noteId = input.required<string>();

    protected readonly store = inject(NotesStore);
    protected readonly board = inject(NotesBoardStore);
    private readonly auth = inject(AuthStore);

    protected readonly contentMax = NOTE_CONTENT_MAX;
    protected readonly titleMax = NOTE_TITLE_MAX;

    protected readonly x = signal(0);
    protected readonly y = signal(0);
    protected readonly dragging = signal(false);

    protected readonly draft = signal('');
    protected readonly settingsOpen = signal(false);
    protected readonly settingsTitle = signal('');
    protected readonly settingsShared = signal(false);
    protected readonly settingsCanEdit = signal(false);
    protected readonly settingsArchived = signal(false);
    protected readonly confirmDelete = signal(false);

    protected readonly item = computed(() => this.board.itemById(this.noteId()));
    protected readonly detail = computed(() => this.store.details()[this.noteId()]);
    protected readonly loading = computed(() => this.store.detailLoading()[this.noteId()] ?? false);
    protected readonly collapsed = computed(() => this.item()?.collapsed ?? false);
    protected readonly zIndex = computed(() => this.item()?.zIndex ?? 1);
    protected readonly title = computed(() => {
        const detail = this.detail();
        return detail ? noteTitle(detail) : 'Nota';
    });
    protected readonly isOwner = computed(
        () => !!this.detail() && this.detail()?.ownerUserId === this.auth.user()?.id,
    );
    protected readonly canAddText = computed(() => {
        const detail = this.detail();
        if (!detail || detail.isArchived) return false;
        return this.isOwner() || (detail.isShared && detail.canEdit);
    });
    protected readonly isReadOnly = computed(() => !this.canAddText() && !this.detail()?.isArchived);
    protected readonly texts = computed(() => this.detail()?.texts ?? []);
    protected readonly canSubmitText = computed(
        () => this.draft().trim().length > 0 && this.draft().length <= this.contentMax && !this.store.saving(),
    );

    private dragStart = { x: 0, y: 0, pointerX: 0, pointerY: 0 };

    constructor() {
        effect(() => {
            const item = this.item();
            if (!item) return;
            this.x.set(item.x);
            this.y.set(item.y);
        });
    }

    ngOnInit(): void {
        void this.store.loadDetail(this.noteId());
    }

    protected onHeaderPointerDown(event: PointerEvent): void {
        if (event.button !== 0) return;
        if ((event.target as HTMLElement).closest('button, input, textarea')) return;

        const handle = event.currentTarget as HTMLElement;
        handle.setPointerCapture?.(event.pointerId);

        this.dragging.set(true);
        this.board.bringToFront(this.noteId());
        this.dragStart = {
            x: this.x(),
            y: this.y(),
            pointerX: event.clientX,
            pointerY: event.clientY,
        };
        event.preventDefault();
    }

    protected onHeaderPointerMove(event: PointerEvent): void {
        if (!this.dragging()) return;
        this.x.set(this.dragStart.x + (event.clientX - this.dragStart.pointerX));
        this.y.set(this.dragStart.y + (event.clientY - this.dragStart.pointerY));
    }

    protected onHeaderPointerUp(event: PointerEvent): void {
        if (!this.dragging()) return;
        (event.currentTarget as HTMLElement).releasePointerCapture?.(event.pointerId);
        this.dragging.set(false);
        this.board.setPosition(this.noteId(), this.x(), this.y());
    }

    protected toggleCollapse(): void {
        this.board.toggleCollapse(this.noteId());
    }

    protected close(): void {
        this.board.closeNote(this.noteId());
    }

    protected onDraftInput(event: Event): void {
        this.draft.set((event.target as HTMLTextAreaElement).value);
    }

    protected async submitText(): Promise<void> {
        if (!this.canSubmitText()) return;
        const ok = await this.store.addText(this.noteId(), this.draft().trim());
        if (ok) this.draft.set('');
    }

    protected openSettings(): void {
        const detail = this.detail();
        if (!detail) return;
        this.settingsTitle.set(detail.title ?? '');
        this.settingsShared.set(detail.isShared);
        this.settingsCanEdit.set(detail.canEdit);
        this.settingsArchived.set(detail.isArchived);
        this.settingsOpen.set(true);
    }

    protected closeSettings(): void {
        this.settingsOpen.set(false);
    }

    protected onSettingsTitle(event: Event): void {
        this.settingsTitle.set((event.target as HTMLInputElement).value);
    }

    protected async saveSettings(): Promise<void> {
        const title = this.settingsTitle().trim();
        const ok = await this.store.updateSettings(this.noteId(), {
            title: title.length > 0 ? title : null,
            isShared: this.settingsShared(),
            canEdit: this.settingsCanEdit(),
            isArchived: this.settingsArchived(),
        });
        if (ok) this.settingsOpen.set(false);
    }

    protected async confirmRemove(): Promise<void> {
        const ok = await this.store.remove(this.noteId());
        this.confirmDelete.set(false);
        if (ok) this.board.closeNote(this.noteId());
    }

    protected formatDate(iso: string): string {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
    }
}
