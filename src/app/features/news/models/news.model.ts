export type NewsStatus = 'Draft' | 'Scheduled' | 'Published' | 'Archived';

export type NewsStatusFilter = NewsStatus | 'All';

export type EditableNewsStatus = Exclude<NewsStatus, 'Archived'>;

export interface NewsImageDto {
  id: string;
  originalFileName: string;
  fileName: string;
  contentType: string | null;
  sortOrder: number;
  isCover: boolean;
  url: string | null;
}

export interface NewsListDto {
  id: string;
  title: string;
  status: NewsStatus;
  publishedAt: string | null;
  scheduledPublishAt: string | null;
  createdAt: string;
  coverImage: NewsImageDto | null;
  url?: string;
}

export interface NewsDetailDto {
  id: string;
  createdByUserId: string;
  title: string;
  content: string;
  status: NewsStatus;
  publishedAt: string | null;
  scheduledPublishAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  images: NewsImageDto[];
}

export interface NewsListQuery {
  status?: NewsStatus;
  search?: string;
  skip: number;
  take: number;
}

export interface SaveNewsRequest {
  title: string;
  content: string;
  status: EditableNewsStatus;
  scheduledPublishAt: string | null;
}

export interface ScheduleNewsRequest {
  scheduledPublishAt: string;
}
