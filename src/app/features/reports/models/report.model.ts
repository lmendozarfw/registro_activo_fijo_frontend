import { ResourceTypeEnum } from '../../resources/models/resource-type.model';
import { StatusResourceEnum } from '../../resources/models/status-resource.model';

export interface ResourceReportItemDto {
    id: string;
    assetCode: string;
    name: string;
    serialNumber?: string | null;
    modelId: string;
    modelName: string;
    brandName: string;
    type: ResourceTypeEnum;
    price: number;
    status: StatusResourceEnum;
    active: boolean;
    observations?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    mobileResourceId?: string | null;
    imei?: string | null;
    imei2?: string | null;
    lineId?: string | null;
    phoneNumber?: string | null;
    operator?: string | null;
    plan?: string | null;
    lineAssignedAt?: string | null;
}

export interface ReportExcelFileDto {
    content: Uint8Array | number[];
    fileName: string;
    contentType: string;
}
