import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      [visible]="visible()"
      (visibleChange)="visibleChange.emit($event)"
      [header]="header()"
      [style]="{ width: width() }"
      [modal]="true"
      [draggable]="true"
      [closeOnEscape]="true"
    >
      <div class="flex flex-col gap-4">
        <ng-content />
      </div>
      <ng-template #footer>
        <ng-content select="[dialog-footer]" />
      </ng-template>
    </p-dialog>
  `,
  imports: [DialogModule],
})
export class FormDialogComponent {
  readonly visible = input(false);
  readonly visibleChange = output<boolean>();
  readonly header = input('Formulario');
  readonly width = input('24rem');
}
