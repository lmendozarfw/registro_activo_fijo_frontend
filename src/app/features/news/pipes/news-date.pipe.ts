import { Pipe, PipeTransform } from '@angular/core';

export type NewsDateMode = 'date' | 'datetime';
export type NewsDateZone = 'local' | 'utc';

const LOCAL_DATE = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const LOCAL_DATE_TIME = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const UTC_DATE = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const UTC_DATE_TIME = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'UTC',
});

@Pipe({ name: 'newsDate' })
export class NewsDatePipe implements PipeTransform {
  transform(
    value: string | Date | null | undefined,
    mode: NewsDateMode = 'date',
    zone: NewsDateZone = 'local',
  ): string {
    if (!value) return '—';

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    const formatter =
      zone === 'utc'
        ? mode === 'datetime'
          ? UTC_DATE_TIME
          : UTC_DATE
        : mode === 'datetime'
          ? LOCAL_DATE_TIME
          : LOCAL_DATE;

    return formatter.format(date);
  }
}
