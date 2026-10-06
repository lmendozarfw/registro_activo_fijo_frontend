import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PageHeaderService {
  private readonly titleSignal = signal<string>('');

  readonly title = this.titleSignal.asReadonly();

  setTitle(title: string): void {
    this.titleSignal.set(title);
  }

  clear(): void {
    this.titleSignal.set('');
  }
}
