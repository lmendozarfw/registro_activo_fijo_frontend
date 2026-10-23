import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonDirective } from 'primeng/button';
import { SOLUTIONS, SolutionConfig } from '../../../core/config/solutions.config';
import { AuthStore } from '../../auth/stores/auth.store';

const HUB_PERMISSIONS: Record<string, string> = {
  visitantes: 'registro_visitantes.acceso',
  salas: 'reserva_sala_juntas.acceso',
  permisos: 'solicitud_permisos.acceso',
  'activo-fijo': 'activo_fijo.acceso',
  'mesa-ayuda': 'mesa_ayuda.acceso',
};

@Component({
  selector: 'app-hub-page',
  templateUrl: './hub.page.html',
  imports: [RouterLink, PIcon, ButtonDirective],
})
export class HubPage {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly firstName = computed(
    () => this.authStore.user()?.fullName.trim().split(/\s+/)[0] ?? '',
  );

  protected readonly accessibleSolutions = computed<SolutionConfig[]>(() =>
    SOLUTIONS.filter((solution) => {
      const permission = HUB_PERMISSIONS[solution.code];
      return !!permission && this.authStore.hasPermission(permission);
    }),
  );

  openSolution(event: Event, solution: SolutionConfig): void {
    if (solution.external) return;
    event.preventDefault();
    void this.router.navigateByUrl(solution.route);
  }

  async logout(): Promise<void> {
    this.authStore.logout();
    await this.router.navigateByUrl('/');
  }
}
