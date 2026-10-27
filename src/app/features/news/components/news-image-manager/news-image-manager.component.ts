import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { NewsImageDto } from '../../models/news.model';

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

export interface NewsImageUploadRequest {
  file: File;
  isCover: boolean;
}

@Component({
  selector: 'app-news-image-manager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TooltipModule, PIcon],
  template: `
    <section class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-semibold text-neutral-800">Imágenes</h3>
          <p class="text-xs text-neutral-500">
            JPG, PNG, GIF, WEBP o BMP. Tamaño máximo por archivo: 10 MB.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <label class="flex cursor-pointer items-center gap-2 text-xs text-neutral-600">
            <input
              type="checkbox"
              class="size-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
              [checked]="isCover()"
              [disabled]="uploading()"
              (change)="onCoverChange($event)"
            />
            Usar como portada
          </label>

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
            [loading]="uploading()"
            [disabled]="uploading()"
            (click)="fileInput.click()"
          >
            <span class="flex items-center gap-2">
              <svg [pIcon]="'image'" [size]="16"></svg>
              Subir imagen
            </span>
          </button>
        </div>
      </div>

      @if (fileError()) {
        <p class="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {{ fileError() }}
        </p>
      }

      @if (images().length > 0) {
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          @for (image of images(); track image.id) {
            <article
              class="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white"
            >
              <div class="relative aspect-video bg-neutral-100">
                @if (image.url) {
                  <img
                    [src]="image.url"
                    [alt]="image.originalFileName"
                    class="h-full w-full object-cover"
                  />
                } @else {
                  <div class="flex h-full items-center justify-center text-neutral-400">
                    <svg [pIcon]="'image'" [size]="28"></svg>
                  </div>
                }

                @if (image.isCover) {
                  <span
                    class="absolute left-2 top-2 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                  >
                    Portada
                  </span>
                }
              </div>

              <div class="flex items-center gap-1 px-3 py-2">
                <p class="min-w-0 flex-1 truncate text-xs text-neutral-600" [title]="image.originalFileName">
                  {{ image.originalFileName }}
                </p>

                @if (!image.isCover) {
                  <button
                    pButton
                    type="button"
                    severity="secondary"
                    text
                    size="small"
                    pTooltip="Usar como portada"
                    aria-label="Usar como portada"
                    [disabled]="uploading() || removing()"
                    (click)="coverRequested.emit(image)"
                  >
                    <svg [pIcon]="'star'" [size]="14"></svg>
                  </button>
                }

                <button
                  pButton
                  type="button"
                  severity="danger"
                  text
                  size="small"
                  pTooltip="Eliminar imagen"
                  aria-label="Eliminar imagen"
                  [disabled]="uploading() || removing()"
                  (click)="removeRequested.emit(image)"
                >
                  <svg [pIcon]="'trash'" [size]="14"></svg>
                </button>
              </div>
            </article>
          }
        </div>
      } @else {
        <div
          class="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center"
        >
          <svg [pIcon]="'image'" [size]="28" class="text-neutral-400"></svg>
          <p class="mt-2 text-sm text-neutral-500">Esta noticia todavía no tiene imágenes.</p>
        </div>
      }
    </section>
  `,
})
export class NewsImageManagerComponent {
  readonly images = input<NewsImageDto[]>([]);
  readonly uploading = input(false);
  readonly removing = input(false);

  readonly uploadRequested = output<NewsImageUploadRequest>();
  readonly coverRequested = output<NewsImageDto>();
  readonly removeRequested = output<NewsImageDto>();

  protected readonly isCover = signal(true);
  protected readonly fileError = signal<string | null>(null);

  protected onCoverChange(event: Event): void {
    this.isCover.set((event.target as HTMLInputElement).checked);
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

    this.fileError.set(null);
    this.uploadRequested.emit({ file, isCover: this.isCover() });
  }
}
