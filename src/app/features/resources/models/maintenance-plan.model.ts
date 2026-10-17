export enum MaintenanceTypeEnum {
    PREVENTIVE = 'PREVENTIVE',
    CORRECTIVE = 'CORRECTIVE',
    PREDICTIVE = 'PREDICTIVE',
    INSPECTION = 'INSPECTION',
    CALIBRATION = 'CALIBRATION',
    OTHER = 'OTHER',
}

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceTypeEnum, string> = {
    PREVENTIVE: 'Preventivo',
    CORRECTIVE: 'Correctivo',
    PREDICTIVE: 'Predictivo',
    INSPECTION: 'Inspección',
    CALIBRATION: 'Calibración',
    OTHER: 'Otro',
};

export const MAINTENANCE_TYPE_OPTIONS = (Object.keys(MAINTENANCE_TYPE_LABELS) as MaintenanceTypeEnum[]).map((value) => ({
    value,
    label: MAINTENANCE_TYPE_LABELS[value],
}));

export enum FrequencyUnitEnum {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    YEAR = 'YEAR',
}

export const FREQUENCY_UNIT_LABELS: Record<FrequencyUnitEnum, string> = {
    DAY: 'Día(s)',
    WEEK: 'Semana(s)',
    MONTH: 'Mes(es)',
    YEAR: 'Año(s)',
};

export const FREQUENCY_UNIT_OPTIONS = (Object.keys(FREQUENCY_UNIT_LABELS) as FrequencyUnitEnum[]).map((value) => ({
    value,
    label: FREQUENCY_UNIT_LABELS[value],
}));

export enum MaintenanceOrderStatusEnum {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export const MAINTENANCE_ORDER_STATUS_LABELS: Record<MaintenanceOrderStatusEnum, string> = {
    PENDING: 'Pendiente',
    ASSIGNED: 'Asignado',
    IN_PROGRESS: 'En proceso',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
};

export const MAINTENANCE_ORDER_STATUS_OPTIONS = (
    Object.keys(MAINTENANCE_ORDER_STATUS_LABELS) as MaintenanceOrderStatusEnum[]
).map((value) => ({
    value,
    label: MAINTENANCE_ORDER_STATUS_LABELS[value],
}));

export interface MaintenancePlan {
    id: string;
    resourceId: string;
    name: string;
    description?: string | null;
    maintenanceType: MaintenanceTypeEnum;
    frequencyValue: number;
    frequencyUnit: FrequencyUnitEnum;
    startDate: string;
    nextMaintenanceDate?: string | null;
    active: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface CreateMaintenancePlanCommand {
    resourceId: string;
    name: string;
    description?: string | null;
    maintenanceType: MaintenanceTypeEnum;
    frequencyValue: number;
    frequencyUnit: FrequencyUnitEnum;
    startDate: string;
    nextMaintenanceDate?: string | null;
    active?: boolean;
}

export interface MaintenanceOrder {
    id: string;
    resourceId: string;
    maintenancePlanId?: string | null;
    maintenanceType: MaintenanceTypeEnum;
    reason: string;
    startDate?: string | null;
    endDate?: string | null;
    responsibleEmployeeId?: string | null;
    responsibleEmployeeFullName?: string | null;
    status: MaintenanceOrderStatusEnum;
    observations?: string | null;
    maintenanceCost: number;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface CreateMaintenanceOrderCommand {
    resourceId: string;
    maintenancePlanId?: string | null;
    maintenanceType: MaintenanceTypeEnum;
    reason: string;
    startDate?: string | null;
    endDate?: string | null;
    responsibleEmployeeId?: string | null;
    status?: MaintenanceOrderStatusEnum;
    observations?: string | null;
    maintenanceCost?: number;
}
