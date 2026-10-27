import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { provideEchartsCore } from 'ngx-echarts';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import { AuthStore } from './features/auth/stores/auth.store';

const AppTheme = {
  ...Aura,
  semantic: {
    ...Aura.semantic,
    primary: {
      ...Aura.semantic?.primary,
      50: 'var(--rl-brand-50)',
      100: 'var(--rl-brand-100)',
      200: 'var(--rl-brand-200)',
      300: 'var(--rl-brand-300)',
      400: 'var(--rl-brand-400)',
      500: 'var(--rl-brand-500)',
      600: 'var(--rl-brand-600)',
      700: 'var(--rl-brand-700)',
      800: 'var(--rl-brand-800)',
      900: 'var(--rl-brand-900)',
      950: 'var(--rl-brand-950)',
    },
    surface: {
      0: 'var(--rl-white)',
      50: 'var(--rl-neutral-50)',
      100: 'var(--rl-neutral-100)',
      200: 'var(--rl-neutral-200)',
      300: 'var(--rl-neutral-300)',
      400: 'var(--rl-neutral-400)',
      500: 'var(--rl-neutral-500)',
      600: 'var(--rl-neutral-600)',
      700: 'var(--rl-neutral-700)',
      800: 'var(--rl-neutral-800)',
      900: 'var(--rl-neutral-900)',
      950: 'var(--rl-neutral-950)',
    },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => inject(AuthStore).restoreSession()),
    provideEchartsCore({ echarts: () => import('echarts') }),
    providePrimeNG({
      theme: {
        preset: AppTheme,
        options: {
          darkModeSelector: 'none',
        },
      },
      license:
        'eyJpZCI6IjhjY2MwMWZjLTAxMzgtNGYxZC1iMDlkLTQ2MGYyN2Q0ZTk0NSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODI4NTMzODQsImV4cCI6MTgxNDM4OTM4NH0.5X1GwjVS-s0_fDC5XCzABHltbeIeRXqYFiQyrIuL6CK2mdQe8bA_c6CF6xQtxxwFzjztmAW_RlHBw-8IRxf7CA',
    }),
    MessageService,
  ],
};
