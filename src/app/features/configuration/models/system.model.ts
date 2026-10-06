import { ITimestamps } from "../../../core/interfaces/timestamps.interface";

export interface System extends ITimestamps {
    id: string;
    code: string;
    name: string;
    description?: string;
}