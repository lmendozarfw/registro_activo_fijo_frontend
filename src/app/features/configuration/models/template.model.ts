import { ITimestamps } from "../../../core/interfaces/timestamps.interface";

export interface ITemplate extends ITimestamps {
    id: string;
    name: string;
    description?: string;
    active: boolean;
}