import { ResourceTypeEnum } from "./resource-type.model";

export interface Model {
    id: string;
    brandId: string;
    brandName: string;
    name: string;
    type: ResourceTypeEnum;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface ModelRequest {
    brandId: string;
    name: string;
    type: ResourceTypeEnum;
}