export enum StatusLineEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ASSIGNED = 'ASSIGNED',
}

export const STATUS_LINE_LABELS: Record<string, string> = {
    [StatusLineEnum.ACTIVE]: 'Activa',
    [StatusLineEnum.INACTIVE]: 'Inactiva',
    [StatusLineEnum.ASSIGNED]: 'Asignada',
};

export interface LineDto {
    id: string;
    phoneNumber: string;
    operator: string;
    plan?: string | null;
    planPrice?: number | null;
    activationDate?: string;
    cancellationDate?: string | null;
    observations?: string | null;
    status?: string | StatusLineEnum;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface LineItemDto {
    id: string;
    phoneNumber: string;
    operator: string;
}

export interface CreateLineCommand {
    phoneNumber: string;
    operator: string;
    plan?: string | null;
    planPrice?: number | null;
    activationDate: string;
    observations?: string | null;
}

export interface UpdateLineCommand {
    phoneNumber: string;
    operator: string;
    plan?: string | null;
    planPrice?: number | null;
    activationDate: string;
    observations?: string | null;
}