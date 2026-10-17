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
    active?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface ResourceItemDto {
    id: string;
    assetCode: string;
    name: string;
    serialNumber?: string | null;
    type: ResourceTypeEnum;
    price: number;
    status: StatusResourceEnum;
    metadata: Record<string, string | null>;
}

export interface ResourceGroupItemDto {
    type: ResourceTypeEnum;
    name: string;
    resourceItems: ResourceItemDto[];
}

export interface CreateResourceCommand {
    assetCode?: string | null;
    serialNumber?: string | null;
    modelId: string;
    type: ResourceTypeEnum;
    price: number;
    observations?: string | null;
    status?: StatusResourceEnum | null;
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
    modelId?: string;
    serialNumber?: string | null;
    price?: number;
    observations?: string | null;
    lineId?: string | null;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface CreateMobileResourceCommand {
    assetCode: string;
    serialNumber?: string | null;
    modelId: string;
    type: ResourceTypeEnum;
    price: number;
    observations?: string | null;
    imei: string;
    imei2?: string | null;
    lineId?: string | null;
}

export interface UpdateMobileResourceCommand {
    assetCode: string;
    serialNumber?: string | null;
    modelId: string;
    price: number;
    observations?: string | null;
    imei: string;
    imei2?: string | null;
    lineId?: string | null;
}