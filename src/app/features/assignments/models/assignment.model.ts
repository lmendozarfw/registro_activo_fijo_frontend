export interface AssignmentDto {
    id: string;
    resourceId: string;
    assetCode: string;
    resourceName: string;
    type: string;
    brandName: string;
    modelName: string;
    employeeId: string;
    employeeName: string;
    assignmentDate: string;
    renewalDate?: string | null;
    returnDate?: string | null;
    isActive: boolean;
}

export interface AssignmentObservationDto {
    id: string;
    assignmentId: string;
    type: string;
    message: string;
    createdAt: string;
}

export interface CreateAssignmentCommand {
    resourceId: string;
    employeeId: string;
    assignmentDate: string;
    renewalDate?: string | null;
    observation?: string | null;
    actorUserId?: string | null;
}

export interface ReturnAssignmentCommand {
    assignmentId: string;
    returnDate: string;
    observation?: string | null;
    actorUserId?: string | null;
}
