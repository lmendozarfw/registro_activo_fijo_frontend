export type WeeklyMenuStatus = 'Upcoming' | 'Active' | 'Expired';

export interface WeeklyMenuImageDto {
  id: string;
  originalFileName: string;
  fileName: string;
  contentType: string | null;
  url: string | null;
}

export interface WeeklyMenuDto {
  id: string;
  startDate: string;
  endDate: string;
  title: string | null;
  image: WeeklyMenuImageDto | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface WeeklyMenuListQuery {
  search?: string;
  skip: number;
  take: number;
}

export interface SaveWeeklyMenuRequest {
  startDate: string;
  endDate: string;
  title: string | null;
}

export interface CreateWeeklyMenuRequest extends SaveWeeklyMenuRequest {
  file: File;
}

export interface UpdateWeeklyMenuRequest extends SaveWeeklyMenuRequest {
  file?: File | null;
}
