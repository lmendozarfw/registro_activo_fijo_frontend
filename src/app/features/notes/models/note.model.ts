export const NOTE_CONTENT_MAX = 4000;
export const NOTE_TITLE_MAX = 100;
export const NOTE_STICKY_WIDTH = 300;

export interface NoteListItem {
    id: string;
    title: string | null;
    isShared: boolean;
    canEdit: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string | null;
    ownerUsername: string;
}

export interface NoteText {
    id: string;
    authorUserId: string;
    authorUsername: string;
    content: string;
    createdAt: string;
    orderIndex: number;
}

export interface NoteDetail {
    id: string;
    ownerUserId: string;
    title: string | null;
    isShared: boolean;
    canEdit: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string | null;
    ownerUsername: string;
    texts: NoteText[];
}

export interface CreateNoteRequest {
    title: string | null;
    isShared: boolean;
    canEdit: boolean;
    content: string;
}

export interface UpdateNoteSettingsRequest {
    title: string | null;
    isShared: boolean;
    canEdit: boolean;
    isArchived: boolean;
}

export interface AddNoteTextRequest {
    content: string;
}

export interface NoteBoardItem {
    id: string;
    x: number;
    y: number;
    zIndex: number;
    collapsed: boolean;
}

export function noteTitle(note: Pick<NoteListItem, 'title'> | Pick<NoteDetail, 'title'>): string {
    const title = note.title?.trim();
    return title && title.length > 0 ? title : 'Sin título';
}
