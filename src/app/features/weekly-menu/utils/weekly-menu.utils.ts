import { WeeklyMenuDto, WeeklyMenuStatus } from '../models/weekly-menu.model';

const DATE_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function toDateOnly(date: Date | null | undefined): string | null {
  if (!date || Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function fromDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

  return Number.isNaN(date.getTime()) ? null : date;
}

export function todayDateOnly(): string {
  return toDateOnly(new Date()) ?? '';
}

export function isValidDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): boolean {
  return !!startDate && !!endDate && startDate <= endDate;
}

export function rangesOverlap(
  firstStart: string,
  firstEnd: string,
  secondStart: string,
  secondEnd: string,
): boolean {
  return firstStart <= secondEnd && secondStart <= firstEnd;
}

export function hasOverlappingWeeklyMenu(
  menus: WeeklyMenuDto[],
  startDate: string,
  endDate: string,
  excludeId?: string,
): boolean {
  return menus.some(
    (menu) =>
      menu.id !== excludeId &&
      rangesOverlap(startDate, endDate, menu.startDate, menu.endDate),
  );
}

export function resolveWeeklyMenuStatus(
  menu: WeeklyMenuDto,
  today = todayDateOnly(),
): WeeklyMenuStatus {
  if (today < menu.startDate) return 'Upcoming';
  if (today > menu.endDate) return 'Expired';
  return 'Active';
}

export function formatWeeklyMenuPeriod(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): string {
  const start = fromDateOnly(startDate);
  const end = fromDateOnly(endDate);

  if (!start || !end) return '—';

  return `Del ${DATE_FORMATTER.format(start)} al ${DATE_FORMATTER.format(end)}`;
}
