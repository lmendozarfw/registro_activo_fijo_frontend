export enum DocumentStatusEnum {
    UNSIGNED = 0,
    SIGNED = 1,
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatusEnum, string> = {
    [DocumentStatusEnum.UNSIGNED]: 'No firmada',
    [DocumentStatusEnum.SIGNED]: 'Firmada',
};

export interface AssignmentLetterDto {
    id: string;
    assignmentId: string;
    fileName: string;
    filePath: string;
    status: DocumentStatusEnum | number;
    generatedAt: string;
    signedAt?: string | null;
}
