export interface Job {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface JobRequest {
    name: string;
}
