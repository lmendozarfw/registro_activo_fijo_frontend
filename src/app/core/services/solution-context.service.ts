import { Injectable, signal } from '@angular/core';
import { SolutionConfig } from '../config/solutions.config';

@Injectable()
export class SolutionContextService {
  readonly solution = signal<SolutionConfig | null>(null);
}
