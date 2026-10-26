import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonModule } from 'primeng/button';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';
import { PublicNewsCardComponent } from '../../components/public-news-card/public-news-card.component';
import { PublicNewsStore } from '../../stores/public-news.store';

@Component({
  selector: 'app-public-news-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-news-list.page.html',
  imports: [
    RouterLink,
    PIcon,
    ButtonModule,
    PublicHeaderComponent,
    PublicNewsCardComponent,
  ],
})
export class PublicNewsListPage implements OnInit {
  protected readonly store = inject(PublicNewsStore);
  private readonly title = inject(Title);

  protected readonly year = new Date().getFullYear();

  ngOnInit(): void {
    this.title.setTitle('Noticias | Raudal Footwear');
    void this.store.loadList(true);
  }

  protected retry(): void {
    void this.store.refreshList();
  }

  protected loadMore(): void {
    void this.store.loadMore();
  }
}
