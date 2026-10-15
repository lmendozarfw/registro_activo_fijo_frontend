import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly count = signal(0);
  private readonly loadingSignal = signal(false);

  readonly loading = this.loadingSignal.asReadonly();

  show(): void {
    this.count.update((value) => value + 1);
    this.loadingSignal.set(true);
  }

  hide(): void {
    this.count.update((value) => Math.max(0, value - 1));
    if (this.count() === 0) {
      this.loadingSignal.set(false);
    }
  }

  reset(): void {
    this.count.set(0);
    this.loadingSignal.set(false);
  }
}
