import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PIcon } from "@primeicons/angular/p-icon";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { PageHeaderService } from "../../../core/services/page-header.service";
import { ToastService } from "../../../core/services/toast.service";
import { DOCUMENT_STATUS_LABELS, DocumentStatusEnum } from "../models/assignment-letter.model";
import { AssignmentLetterStore } from "../stores/assignment-letter.store";

@Component({
  selector: 'app-assignment-letter-page',
  templateUrl: './assignment-letter.page.html',
  styles: [],
  imports: [ButtonModule, TagModule, TooltipModule, PIcon],
})
export class AssignmentLetterPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pageHeader = inject(PageHeaderService);
  private readonly toast = inject(ToastService);
  protected readonly store = inject(AssignmentLetterStore);

  protected readonly assignmentId = signal<string>('');
  protected readonly employeeName = signal<string>('');
  protected readonly assetCode = signal<string>('');
  protected readonly resourceName = signal<string>('');
  protected readonly brandName = signal<string>('');
  protected readonly modelName = signal<string>('');
  protected readonly assignmentDate = signal<string>('');

  protected readonly hasLetter = computed(() => this.store.letter() !== null);
  protected readonly statusLabel = computed(() => {
    const letter = this.store.letter();
    if (!letter) return '—';
    return DOCUMENT_STATUS_LABELS[letter.status as DocumentStatusEnum] || String(letter.status);
  });
  protected readonly statusSeverity = computed<'success' | 'warn'>(() =>
    this.store.letter()?.status === DocumentStatusEnum.SIGNED ? 'success' : 'warn',
  );

  ngOnInit(): void {
    this.pageHeader.setTitle('Carta de asignación');
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.assignmentId.set(id);

    const params = this.route.snapshot.queryParamMap;
    this.employeeName.set(params.get('employeeName') ?? '');
    this.assetCode.set(params.get('assetCode') ?? '');
    this.resourceName.set(params.get('resourceName') ?? '');
    this.brandName.set(params.get('brandName') ?? '');
    this.modelName.set(params.get('modelName') ?? '');
    this.assignmentDate.set(params.get('assignmentDate') ?? '');

    this.store.clear();
    if (id) {
      void this.store.loadByAssignment(id);
    }
  }

  protected download(): void {
    if (!this.hasLetter()) return;
    void this.store.download(this.assignmentId());
  }

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.toast.warning('Archivo no válido', 'La carta firmada debe ser un archivo PDF.');
      input.value = '';
      return;
    }

    await this.store.upload(this.assignmentId(), file);
    input.value = '';
  }

  protected goBack(): void {
    this.router.navigate(['/app/assignments']);
  }

  protected formatDate(value?: string | null): string {
    if (!value) return '—';
    const date = new Date(value);
    return isNaN(date.getTime())
      ? '—'
      : date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }
}
