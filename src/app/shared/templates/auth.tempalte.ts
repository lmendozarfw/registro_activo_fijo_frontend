import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckCircle, Qrcode, ChartBar } from '@primeicons/angular';

@Component({
  selector: 'auth-template',
  imports: [RouterOutlet, CheckCircle, Qrcode, ChartBar],
  styles: [],
  template: `
    <div class="auth-layout min-h-screen flex bg-white">
      <!-- Panel izquierdo: Branding -->
      <div
        class="auth-brand hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center
                bg-neutral-950 text-white p-12"
      >
        <div class="absolute -left-40 top-10 size-80 rounded-full bg-brand-600/25 blur-[120px]"></div>
        <div class="absolute -right-32 bottom-[-10rem] size-96 rounded-full bg-rose-700/18 blur-[140px]"></div>
        <div
          class="absolute inset-0 opacity-[0.08]"
          style="
            background-image:
              linear-gradient(rgba(243, 58, 32, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(243, 58, 32, 0.25) 1px, transparent 1px);
            background-size: 72px 72px;
          "
        ></div>

        <div class="relative z-10 max-w-md">
          <div class="flex justify-center mb-8">
            <div class="rounded-xl bg-white p-3 shadow-2xl shadow-black/40">
              <img src="assets/images/raudal-logo.png" alt="Raudal Footwear" class="h-12 w-auto" />
            </div>
          </div>

          <h1 class="text-3xl font-bold text-center leading-tight text-white">
            Plataforma Integral Raudal
          </h1>
          <p class="text-center text-neutral-300 mt-3 mb-10">
            Un solo acceso para gestionar, informar y conectar a todo el equipo.
          </p>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span
                class="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/30 to-rose-600/30 text-brand-300 ring-1 ring-brand-500/40 shrink-0"
              >
                <svg data-p-icon="check-circle" [size]="20"></svg>
              </span>
              <p class="m-0 text-sm text-neutral-200">Acceso centralizado y seguro</p>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/30 to-rose-600/30 text-brand-300 ring-1 ring-brand-500/40 shrink-0"
              >
                <svg data-p-icon="qrcode" [size]="20"></svg>
              </span>
              <p class="m-0 text-sm text-neutral-200">Ingreso con gafete QR o credenciales</p>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/30 to-rose-600/30 text-brand-300 ring-1 ring-brand-500/40 shrink-0"
              >
                <svg data-p-icon="chart-bar" [size]="20"></svg>
              </span>
              <p class="m-0 text-sm text-neutral-200">Información y herramientas al alcance</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho: Contenido -->
      <div class="auth-form w-full lg:w-1/2 flex items-center justify-center p-6">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AuthTemplate {}
