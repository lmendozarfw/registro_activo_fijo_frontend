import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-particles-canvas',
  standalone: true,
  template: `<canvas #canvas class="absolute inset-0 w-full h-full"></canvas>`,
})
export class ParticlesCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() variant: 'hero' | 'dining' | 'news' | 'about' = 'hero';
  @Input() density = 80;

  private ctx!: CanvasRenderingContext2D;
  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alpha: number;
    life: number;
    maxLife: number;
  }> = [];
  private rafId: number | null = null;
  private mouse = { x: 0, y: 0, active: false };
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.setup();
    this.bindEvents();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  private setup(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.initParticles(rect.width, rect.height);
  }

  private initParticles(w: number, h: number): void {
    this.particles = [];
    const count = Math.min(this.density, Math.floor((w * h) / 20000));
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(w, h));
    }
  }

  private createParticle(w: number, h: number) {
    const maxLife = 200 + Math.random() * 400;
    const variant = this.variant;
    const speed = variant === 'hero' ? 0.35 : variant === 'dining' ? 0.28 : 0.24;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: variant === 'hero' ? 1.6 + Math.random() * 2.2 : 1.0 + Math.random() * 1.6,
      alpha: 0.5 + Math.random() * 0.5,
      life: Math.random() * maxLife,
      maxLife,
    };
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    this.resizeObserver = new ResizeObserver(() => this.setup());
    this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement!);
  }

  private onResize = (): void => {
    this.setup();
  };

  private onMouseMove = (e: MouseEvent): void => {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    this.mouse.active = true;
  };

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.life++;
      if (p.life > p.maxLife) {
        this.particles[i] = this.createParticle(rect.width, rect.height);
        continue;
      }

      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          p.vx += (dx / dist) * 0.004;
          p.vy += (dy / dist) * 0.004;
        }
      }

      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = rect.width;
      if (p.x > rect.width) p.x = 0;
      if (p.y < 0) p.y = rect.height;
      if (p.y > rect.height) p.y = 0;

      const fade = Math.sin((p.life / p.maxLife) * Math.PI);
      this.ctx.globalAlpha = p.alpha * fade;
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      if (this.variant === 'hero') {
        gradient.addColorStop(0, 'rgba(243, 58, 32, 0.9)');
        gradient.addColorStop(1, 'rgba(243, 58, 32, 0)');
      } else if (this.variant === 'dining') {
        gradient.addColorStop(0, 'rgba(243, 58, 32, 0.7)');
        gradient.addColorStop(1, 'rgba(243, 58, 32, 0)');
      } else if (this.variant === 'news') {
        gradient.addColorStop(0, 'rgba(160, 0, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(160, 0, 0, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(243, 58, 32, 0.5)');
        gradient.addColorStop(1, 'rgba(243, 58, 32, 0)');
      }
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    this.drawConnections(rect.width, rect.height);
    this.rafId = requestAnimationFrame(this.animate);
  }

  private drawConnections(w: number, h: number): void {
    const maxDist = this.variant === 'hero' ? 180 : 130;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          this.ctx.globalAlpha = (1 - dist / maxDist) * 0.22;
          this.ctx.strokeStyle = this.variant === 'hero' ? 'rgba(243, 58, 32, 0.7)' : 'rgba(243, 58, 32, 0.5)';
          this.ctx.lineWidth = 1.0;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }
}
