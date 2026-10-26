import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';
import { NewsImageDto } from '../../models/news.model';
import { NewsDatePipe } from '../../pipes/news-date.pipe';
import { PublicNewsStore } from '../../stores/public-news.store';

@Component({
  selector: 'app-public-news-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-news-detail.page.html',
  imports: [RouterLink, PIcon, ButtonModule, PublicHeaderComponent, NewsDatePipe],
})
export class PublicNewsDetailPage implements OnInit {
  protected readonly store = inject(PublicNewsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  protected readonly year = new Date().getFullYear();
  private readonly newsId = this.route.snapshot.paramMap.get('id');

  protected readonly coverImage = computed<NewsImageDto | null>(() => {
    const images = this.store.detail()?.images ?? [];
    return images.find((image) => image.isCover) ?? images[0] ?? null;
  });

  protected readonly galleryImages = computed(() => {
    const detail = this.store.detail();
    const cover = this.coverImage();
    if (!detail) return [];

    return detail.images.filter(
      (image) => image.id !== cover?.id && !!image.url,
    );
  });

  constructor() {
    effect(() => {
      const detail = this.store.detail();
      this.title.setTitle(
        detail ? `${detail.title} | Raudal Footwear` : 'Noticias | Raudal Footwear',
      );
    });
  }

  ngOnInit(): void {
    if (!this.newsId) {
      void this.router.navigate(['/noticias']);
      return;
    }

    void this.store.loadDetail(this.newsId);
  }

  protected retry(): void {
    if (!this.newsId) return;
    void this.store.loadDetail(this.newsId);
  }

  protected back(): void {
    void this.router.navigate(['/noticias']);
  }
}
