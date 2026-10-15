import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { NOTE_STICKY_WIDTH, NoteBoardItem } from '../models/note.model';

type BoardState = {
    items: NoteBoardItem[];
    panelOpen: boolean;
    topZ: number;
};

const STICKY_MIN_VISIBLE = 48;

function viewportWidth(): number {
    return typeof window === 'undefined' ? 1280 : window.innerWidth;
}

function viewportHeight(): number {
    return typeof window === 'undefined' ? 800 : window.innerHeight;
}

function clamp(value: number, min: number, max: number): number {
    if (max < min) return min;
    return Math.min(Math.max(value, min), max);
}

export const NotesBoardStore = signalStore(
    { providedIn: 'root' },
    withState<BoardState>({ items: [], panelOpen: false, topZ: 100 }),
    withComputed(({ items }) => ({
        openCount: computed(() => items().length),
        openIds: computed(() => items().map((item) => item.id)),
    })),
    withMethods((store) => ({
        itemById(id: string): NoteBoardItem | undefined {
            return store.items().find((item) => item.id === id);
        },

        isOpen(id: string): boolean {
            return store.items().some((item) => item.id === id);
        },

        setPanelOpen(open: boolean): void {
            patchState(store, { panelOpen: open });
        },

        togglePanel(): void {
            patchState(store, { panelOpen: !store.panelOpen() });
        },

        openNote(id: string): void {
            const existing = store.items().find((item) => item.id === id);
            if (existing) {
                this.bringToFront(id);
                patchState(store, { panelOpen: false });
                return;
            }

            const width = viewportWidth();
            const height = viewportHeight();
            const cascade = store.items().length % 6;
            const x = clamp(width - NOTE_STICKY_WIDTH - 24 - cascade * 28, 8, width - NOTE_STICKY_WIDTH - 8);
            const y = clamp(64 + cascade * 30, 8, height - 160);
            const zIndex = store.topZ() + 1;

            patchState(store, {
                items: [...store.items(), { id, x, y, zIndex, collapsed: false }],
                topZ: zIndex,
                panelOpen: false,
            });
        },

        closeNote(id: string): void {
            patchState(store, { items: store.items().filter((item) => item.id !== id) });
        },

        closeAll(): void {
            patchState(store, { items: [] });
        },

        toggleCollapse(id: string): void {
            patchState(store, {
                items: store.items().map((item) =>
                    item.id === id ? { ...item, collapsed: !item.collapsed } : item,
                ),
            });
        },

        bringToFront(id: string): void {
            const item = store.items().find((entry) => entry.id === id);
            if (!item) return;
            const zIndex = store.topZ() + 1;
            patchState(store, {
                topZ: zIndex,
                items: store.items().map((entry) => (entry.id === id ? { ...entry, zIndex } : entry)),
            });
        },

        setPosition(id: string, x: number, y: number): void {
            const maxX = viewportWidth() - STICKY_MIN_VISIBLE;
            const maxY = viewportHeight() - STICKY_MIN_VISIBLE;
            const nextX = clamp(x, -(NOTE_STICKY_WIDTH - STICKY_MIN_VISIBLE), maxX);
            const nextY = clamp(y, 0, maxY);

            patchState(store, {
                items: store.items().map((item) => (item.id === id ? { ...item, x: nextX, y: nextY } : item)),
            });
        },
    })),
);
