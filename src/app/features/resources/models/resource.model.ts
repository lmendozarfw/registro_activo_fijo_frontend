import { ResourceTypeEnum } from "./resource-type.model";
import { StatusResourceEnum } from "./status-resource.model";

export interface ResourceDto {
    id: string;
    assetCode: string;
    name: string;
    serialNumber?: string | null;
    modelId: string;
    modelName: string;
    brandName: string;
    type: ResourceTypeEnum;
    price: number;
    observations?: string | null;
    status: StatusResourceEnum;
    createdAt?: string;
}

export interface CreateResourceCommand {
    assetCode: string;
    name: string;
    serialNumber?: string | null;
    modelId: string;
    type: ResourceTypeEnum;
    price: number;
    observations?: string | null;
    status: StatusResourceEnum;
}

export interface MobileResourceDto {
    id: string;
    resourceId: string;
    assetCode: string;
    name: string;
    brandName: string;
    modelName: string;
    imei: string;
    imei2?: string | null;
    status: StatusResourceEnum;
    activeLinePhoneNumber?: string | null;
    activeLineOperator?: string | null;
    createdAt?: string;
}

export interface CreateMobileResourceCommand {
    assetCode: string;
    name: string;
    serialNumber?: string | null;
    modelId: string;
    type: ResourceTypeEnum;
    price: number;
    observations?: string | null;
    imei: string;
    imei2?: string | null;
    lineId?: string | null;
}