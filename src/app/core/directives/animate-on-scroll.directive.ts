import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true,
})
export class AnimateOnScrollDirective
  implements AfterViewInit, OnDestroy {

  @Input('appAnimateOnScroll')
  animation = 'fadeInUp';

  @Input()
  animationDelay = 0;

  private element = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const element = this.element.nativeElement;

    this.renderer.addClass(element, 'animate__animated');
    this.renderer.setStyle(
      element,
      'visibility',
      'hidden'
    );

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.renderer.setStyle(element, 'visibility', 'visible');
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          this.renderer.setStyle(element, 'visibility', 'visible');

          this.renderer.setStyle(
            element,
            'animationDelay',
            `${this.animationDelay}ms`
          );

          this.renderer.addClass(
            element,
            `animate__${this.animation}`
          );

          this.observer?.unobserve(element);
        }
      },
      {
        threshold: 0.15,
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}