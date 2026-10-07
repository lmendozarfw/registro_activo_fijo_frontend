export interface Job {
    id: string;
    name: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface JobRequest {
    name: string;
}
