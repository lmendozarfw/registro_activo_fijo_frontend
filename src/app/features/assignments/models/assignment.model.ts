import { ResourceTypeEnum } from "../../resources/models/resource-type.model";

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

export enum RenewDeviceOption {
    NewDevice = 'NewDevice',
    ExistingDevice = 'ExistingDevice',
}

export interface NewMobileDeviceDto {
    assetCode: string;
    name: string;
    serialNumber?: string | null;
    modelId: string;
    price: number;
    observations?: string | null;
    imei: string;
    imei2?: string | null;
}

export interface RenewMobileAssignmentCommand {
    assignmentId: string;
    option: RenewDeviceOption;
    newDevice?: NewMobileDeviceDto | null;
    existingMobileResourceId?: string | null;
    actorUserId: string;
    renewalDate?: string | null;
    observation?: string | null;
}

export interface AssignmentHistoryGroupDto {
    resourceType: ResourceTypeEnum;
    resources: ResourceAssignmentHistoryDto[];
}

export interface ResourceAssignmentHistoryDto {
    resourceId: string;
    assetCode: string;
    resourceName: string;
    type: ResourceTypeEnum;
    brandName: string;
    modelName: string;
    serialNumber?: string | null;
    price: number;
    status: string;
    imei?: string | null;
    imei2?: string | null;
    phoneNumber?: string;
    assignments: AssignmentHistoryEntryDto[];
}

export interface AssignmentHistoryEntryDto {
    assignmentId: string;
    employeeId: string;
    employeeNumber: string;
    employeeName: string;
    departmentName?: string | null;
    jobName?: string | null;
    assignmentDate: string;
    renewalDate?: string | null;
    returnDate?: string | null;
    isActive: boolean;
}
