import { Component, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonDirective } from 'primeng/button';
import { InputPassword } from 'primeng/inputpassword';
import { InputText } from 'primeng/inputtext';
import { FormLabelComponent } from '../../../shared/components/form-label/form-label.component';
import { QrScannerComponent } from '../../../shared/components/qr-scanner/qr-scanner.component';
import { SOLUTIONS, SolutionConfig } from '../../../core/config/solutions.config';
import { PermissionsService } from '../../../core/services/permissions.service';
import { ToastService } from '../../../core/services/toast.service';
import { safeReturnUrl } from '../../../core/utils/navigation.utils';
import { AuthStore } from '../../auth/stores/auth.store';

interface NewsPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing.page.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    PIcon,
    ButtonDirective,
    InputText,
    InputPassword,
    FormLabelComponent,
    QrScannerComponent,
  ],
})
export class LandingPage {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly permissions = inject(PermissionsService);
  private readonly toast = inject(ToastService);
  private readonly qrScanner = viewChild(QrScannerComponent);

  readonly menuOpen = signal(false);
  readonly loginMode = signal<'manual' | 'qr'>('manual');
  readonly passwordMask = signal(true);
  readonly badgeUser = signal<string | null>(null);
  private readonly returnUrl = signal<string | null>(
    safeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl')),
  );

  readonly loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  readonly year = new Date().getFullYear();

  readonly solutions: SolutionConfig[] = SOLUTIONS;

  readonly news: NewsPost[] = [
    {
      title: 'Reforzamos nuestra cultura de seguridad y bienestar',
      excerpt:
        'Concluimos una nueva jornada de capacitación enfocada en prevención de riesgos, ergonomía y uso correcto del equipo de protección personal. La seguridad es una responsabilidad compartida.',
      category: 'Seguridad',
      date: '15 de octubre de 2026',
      image: 'assets/images/news-1.svg',
      alt: 'Ilustración de un escudo con una marca de verificación',
    },
    {
      title: 'Reconocimiento a la excelencia en cada proceso',
      excerpt:
        'Reconocimos al equipo de producción por su compromiso con la calidad y la mejora continua.',
      category: 'Calidad',
      date: '08 de octubre de 2026',
      image: 'assets/images/news-2.svg',
      alt: 'Ilustración de un trofeo sobre fondo cálido',
    },
    {
      title: 'Innovación que fortalece nuestros procesos',
      excerpt:
        'Nuevas herramientas y mejoras operativas nos ayudan a ser una planta más eficiente y humana.',
      category: 'Innovación',
      date: '01 de octubre de 2026',
      image: 'assets/images/news-3.svg',
      alt: 'Ilustración de un engranaje con destellos sobre fondo azul',
    },
  ];

  get userError(): string | null {
    const control = this.loginForm.get('user');
    if (!control || (!control.touched && !control.dirty) || !control.errors) return null;
    if (control.errors['required']) return 'El usuario es obligatorio';
    return null;
  }

  get passwordError(): string | null {
    const control = this.loginForm.get('password');
    if (!control || (!control.touched && !control.dirty) || !control.errors) return null;
    if (control.errors['required']) return 'La contraseña es obligatoria';
    return null;
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  setLoginMode(mode: 'manual' | 'qr'): void {
    this.badgeUser.set(null);
    this.loginMode.set(mode);
  }

  togglePasswordMask(): void {
    this.passwordMask.update((mask) => !mask);
  }

  openSolution(event: Event, solution: SolutionConfig): void {
    if (solution.external) return;
    event.preventDefault();

    if (!this.authStore.isAuthenticated()) {
      this.returnUrl.set(solution.route);
      this.toast.info(
        'Inicia sesión',
        `Accede con tus credenciales para entrar a ${solution.name}.`,
      );
      document.getElementById('acceso')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!this.permissions.hasPermission(solution.permission)) {
      void this.router.navigate(['/sin-acceso'], {
        queryParams: {
          solution: solution.code,
          permission: solution.permission,
          returnUrl: solution.route,
        },
      });
      return;
    }

    void this.router.navigateByUrl(solution.route);
  }

  onBadgeScanned(decodedText: string): void {
    if (this.authStore.loading()) return;
    const credentials = parseBadgeQr(decodedText);
    if (!credentials) {
      this.toast.warning('El QR escaneado no contiene credenciales válidas');
      this.qrScanner()?.resume();
      return;
    }
    this.badgeUser.set(credentials.username);
    void this.doLogin(credentials.username, credentials.password);
  }

  async onSubmit(): Promise<void> {
    if (this.authStore.loading()) return;
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { user: username, password } = this.loginForm.value;
    await this.doLogin(username!, password!);
  }

  private resumeScanner(): void {
    this.qrScanner()?.resume();
  }

  private async doLogin(username: string, password: string): Promise<void> {
    await this.authStore.login(username, password);
    if (this.authStore.error()) {
      this.toast.error(this.authStore.error()!);
      this.badgeUser.set(null);
      this.resumeScanner();
      return;
    }
    await this.router.navigateByUrl(this.returnUrl() ?? '/hub');
  }
}

function parseBadgeQr(raw: string): { username: string; password: string } | null {
  const user = String(raw ?? '').trim();
  return user ? { username: user, password: user } : null;
}
