import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonDirective } from 'primeng/button';
import { AnimateOnScrollDirective } from '../../../../core/directives/animate-on-scroll.directive';
import { ParticlesCanvasComponent } from '../../../../shared/components/particles/particles-canvas.component';
import { PublicSharePointAccessStore } from '../../stores/sharepoint-access.store';
import { SharePointAccessCardComponent } from '../sharepoint-access-card/sharepoint-access-card.component';

@Component({
  selector: 'app-sharepoint-access-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sharepoint-access-section.component.html',
  imports: [
    PIcon,
    ButtonDirective,
    AnimateOnScrollDirective,
    ParticlesCanvasComponent,
    SharePointAccessCardComponent,
  ],
})
export class SharePointAccessSectionComponent implements OnInit {
  protected readonly store = inject(PublicSharePointAccessStore);

  ngOnInit(): void {
    void this.store.load();
  }

  protected retry(): void {
    void this.store.load();
  }
}
