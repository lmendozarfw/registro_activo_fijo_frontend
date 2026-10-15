import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotesBoardStore } from '../../stores/notes-board.store';
import { NotesPanelComponent } from '../notes-panel/notes-panel.component';
import { StickyNoteComponent } from '../sticky-note/sticky-note.component';

@Component({
    selector: 'app-notes-board',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NotesPanelComponent, StickyNoteComponent],
    template: `
        <app-notes-panel />

        <div class="pointer-events-none fixed inset-0 z-[100]">
            @for (id of board.openIds(); track id) {
                <app-sticky-note [noteId]="id" />
            }
        </div>
    `,
})
export class NotesBoardComponent {
    protected readonly board = inject(NotesBoardStore);
}
