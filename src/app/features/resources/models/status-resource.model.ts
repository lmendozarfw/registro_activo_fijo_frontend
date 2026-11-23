import { TagSeverity } from "primeng/tag";

export enum StatusResourceEnum {
    AVAILABLE = 'AVAILABLE',
    ASSIGNED = 'ASSIGNED',
    MAINTENANCE = 'MAINTENANCE',
    LOST = 'LOST',
}

export const STATUS_RESOURCE_LABELS: Record<StatusResourceEnum, string> = {
    AVAILABLE: 'Disponible',
    ASSIGNED: 'Asignado',
    MAINTENANCE: 'En mantenimiento',
    LOST: 'Perdido',
};
//'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
export const STATUS_RESOURCE_SEVERITY: Record<StatusResourceEnum, TagSeverity> = {
    AVAILABLE: 'success',
    ASSIGNED: 'info',
    MAINTENANCE: 'warn',
    LOST: 'danger',
};

export const STATUS_RESOURCE_OPTIONS = (Object.keys(STATUS_RESOURCE_LABELS) as StatusResourceEnum[]).map((value) => ({
    value,
    label: STATUS_RESOURCE_LABELS[value],
}));