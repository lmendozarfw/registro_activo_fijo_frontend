import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/x-ms-bmp',
]);

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@Component({
  selector: 'app-weekly-menu-image-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, PIcon],
  template: `
    <section class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-semibold text-neutral-800">Imagen del menú</h3>
          <p class="text-xs text-neutral-500">
            JPG, PNG, GIF, WEBP o BMP. Tamaño máximo: 10 MB.
          </p>
        </div>

        <input
          #fileInput
          type="file"
          class="hidden"
          accept=".jpg,.jpeg,.png,.gif,.webp,.bmp"
          (change)="onFileSelected($event)"
        />
        <button
          pButton
          type="button"
          severity="secondary"
          [disabled]="disabled()"
          (click)="fileInput.click()"
        >
          <span class="flex items-center gap-2">
            <svg [pIcon]="'image'" [size]="16"></svg>
            {{ displayUrl() ? 'Cambiar imagen' : 'Seleccionar imagen' }}
          </span>
        </button>
      </div>

      @if (fileError()) {
        <p class="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {{ fileError() }}
        </p>
      }

      <div
        class="flex min-h-48 items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3"
      >
        @if (displayUrl(); as url) {
          <img
            [src]="url"
            [alt]="displayName() || 'Menú semanal'"
            class="max-h-80 w-auto rounded-md object-contain"
          />
        } @else {
          <div class="flex flex-col items-center gap-2 text-neutral-400">
            <svg [pIcon]="'image'" [size]="32"></svg>
            <p class="text-sm">Aún no se ha seleccionado una imagen.</p>
          </div>
        }
      </div>

      @if (displayName(); as name) {
        <p class="truncate text-xs text-neutral-500" [title]="name">{{ name }}</p>
      }
    </section>
  `,
})
export class WeeklyMenuImagePickerComponent {
  readonly currentUrl = input<string | null>(null);
  readonly currentFileName = input<string | null>(null);
  readonly disabled = input(false);

  readonly fileSelected = output<File>();

  protected readonly previewUrl = signal<string | null>(null);
  protected readonly selectedFileName = signal<string | null>(null);
  protected readonly fileError = signal<string | null>(null);

  protected readonly displayUrl = computed(
    () => this.previewUrl() ?? this.currentUrl(),
  );
  protected readonly displayName = computed(
    () => this.selectedFileName() ?? this.currentFileName(),
  );

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => this.revokePreview());
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
    const validType = ALLOWED_TYPES.has(file.type);
    const validExtension = ALLOWED_EXTENSIONS.includes(extension);

    if (!validType && !validExtension) {
      this.fileError.set('El archivo debe ser JPG, PNG, GIF, WEBP o BMP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.fileError.set('La imagen supera el límite de 10 MB.');
      return;
    }

    this.revokePreview();
    this.previewUrl.set(URL.createObjectURL(file));
    this.selectedFileName.set(file.name);
    this.fileError.set(null);
    this.fileSelected.emit(file);
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
  }
}
