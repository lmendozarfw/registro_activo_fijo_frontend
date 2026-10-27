import {
  VisitStatus,
  VisitStatusFilter,
  VisitorAccessStatus,
  VisitorDocumentType,
} from '../models/visit.model';

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const DATE_FORMATTER = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
});

const STATUS_LABELS: Record<VisitStatus, string> = {
  SCHEDULED: 'Programada',
  STARTED: 'En curso',
  FINISHED: 'Finalizada',
  CANCELLED: 'Cancelada',
};

const ACCESS_LABELS: Record<VisitorAccessStatus, string> = {
  PERMIT: 'Permitido',
  DENIED: 'Denegado',
  PENDING: 'Pendiente',
};

const DOCUMENT_LABELS: Record<VisitorDocumentType, string> = {
  NSS: 'NSS',
  INE: 'INE',
};

export function visitStatusLabel(status: string): string {
  return STATUS_LABELS[status as VisitStatus] ?? status;
}

export function visitStatusFilterLabel(status: VisitStatusFilter): string {
  return status === 'All' ? 'Todas' : visitStatusLabel(status);
}

export function visitorAccessStatusLabel(status: string): string {
  return ACCESS_LABELS[status as VisitorAccessStatus] ?? status;
}

export function visitorDocumentTypeLabel(type: string): string {
  return DOCUMENT_LABELS[type as VisitorDocumentType] ?? type;
}

export function visitStatusSeverity(
  status: string,
): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  switch (status) {
    case 'STARTED':
      return 'info';
    case 'FINISHED':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    case 'SCHEDULED':
      return 'warn';
    default:
      return 'secondary';
  }
}

export function visitorAccessSeverity(
  status: string,
): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  switch (status) {
    case 'PERMIT':
      return 'success';
    case 'DENIED':
      return 'danger';
    case 'PENDING':
      return 'warn';
    default:
      return 'secondary';
  }
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return DATE_TIME_FORMATTER.format(date);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return DATE_FORMATTER.format(date);
}

export function formatVisitSchedule(visit: {
  isWalkIn: boolean;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  startedAt: string | null;
  createdAt: string;
}): string {
  if (visit.isWalkIn) {
    return `Ingreso: ${formatDateTime(visit.startedAt ?? visit.createdAt)}`;
  }

  if (!visit.scheduledStartAt) return 'Sin programar';

  const start = formatDateTime(visit.scheduledStartAt);
  return visit.scheduledEndAt ? `${start} — ${formatDateTime(visit.scheduledEndAt)}` : start;
}

export function toUtcIso(value: Date | null | undefined): string | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

export function fromUtcIso(value: string | null | undefined): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toUtcStartOfDay(value: Date): string {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

export function toUtcEndOfDay(value: Date): string {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}
