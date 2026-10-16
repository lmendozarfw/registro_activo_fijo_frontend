import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Search, Times } from '@primeicons/angular';

@Component({
    selector: 'app-search-input',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, Search, Times],
    template: `
        <div class="relative w-full">
            <svg data-p-icon="search" [size]="16"
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></svg>
            <input type="text" [formControl]="control" [placeholder]="placeholder()" [attr.aria-label]="placeholder()"
                class="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            @if (value()) {
            <button type="button" aria-label="Limpiar búsqueda"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                (click)="clear()">
                <svg data-p-icon="times" [size]="14"></svg>
            </button>
            }
        </div>
    `,
})
export class SearchInputComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    readonly placeholder = input('Buscar...');
    readonly debounceMs = input(400);
    readonly searched = output<string>();

    readonly control = new FormControl('', { nonNullable: true });
    readonly value = toSignal(this.control.valueChanges, { initialValue: '' });

    ngOnInit(): void {
        this.control.valueChanges
            .pipe(debounceTime(this.debounceMs()), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => this.searched.emit(value.trim()));
    }

    clear(): void {
        this.control.setValue('');
        this.searched.emit('');
    }
}
