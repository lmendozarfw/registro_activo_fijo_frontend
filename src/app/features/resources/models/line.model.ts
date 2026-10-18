export enum StatusLineEnum {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    SUSPENDED = 'SUSPENDED',
    UNKNOWN = 'UNKNOWN',
}

export const STATUS_LINE_LABELS: Record<string, string> = {
    [StatusLineEnum.ACTIVE]: 'Activa',
    [StatusLineEnum.CANCELLED]: 'Cancelada',
    [StatusLineEnum.SUSPENDED]: 'Suspendida',
    [StatusLineEnum.UNKNOWN]: 'Desconocido',
};

export interface LineDto {
    id: string;
    phoneNumber: string;
    operator: string;
    plan?: string | null;
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
    activationDate: string;
    observations?: string | null;
}

export interface UpdateLineCommand {
    phoneNumber: string;
    operator: string;
    plan?: string | null;
    activationDate: string;
    observations?: string | null;
}