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

export const STATUS_RESOURCE_OPTIONS = (Object.keys(STATUS_RESOURCE_LABELS) as StatusResourceEnum[]).map((value) => ({
    value,
    label: STATUS_RESOURCE_LABELS[value],
}));