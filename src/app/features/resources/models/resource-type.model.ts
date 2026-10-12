export enum ResourceTypeEnum {
    MOBILE = 'MOBILE',
    LAPTOP = 'LAPTOP',
    PC = 'PC',
    MONITOR = 'MONITOR',
    MOUSE = 'MOUSE',
    KEYBOARD = 'KEYBOARD',
    CABLE = 'CABLE',
    CAMERA = 'CAMERA',
    OTHER = 'OTHER',
}

export const RESOURCE_TYPE_LABELS: Record<ResourceTypeEnum, string> = {
    MOBILE: 'Celular',
    LAPTOP: 'Laptop',
    PC: 'PC de escritorio',
    MONITOR: 'Monitor',
    MOUSE: 'Mouse',
    KEYBOARD: 'Teclado',
    CABLE: 'Cable',
    CAMERA: 'Cámara',
    OTHER: 'Otro',
};

export const RESOURCE_TYPE_OPTIONS = (Object.keys(RESOURCE_TYPE_LABELS) as ResourceTypeEnum[]).map((value) => ({
    value,
    label: RESOURCE_TYPE_LABELS[value],
}));