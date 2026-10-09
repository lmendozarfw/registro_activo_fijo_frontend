import { ResourceTypeEnum } from "./resource-type.model";

export interface Brand {
    id: string;
    name: string;
    type: ResourceTypeEnum;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface BrandRequest {
    name: string;
    type: ResourceTypeEnum;
}