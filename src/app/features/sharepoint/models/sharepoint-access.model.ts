export interface SharePointAccessResponse {
  id?: string | number;
  name?: string;
  description?: string | null;
  url?: string;
}

export interface SharePointAccess {
  id: string;
  name: string;
  description: string | null;
  url: string;
}

export interface SharePointAccessRecord extends SharePointAccess {
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaveSharePointAccessRequest {
  name: string;
  description: string | null;
  url: string;
  active: boolean;
}

export interface UpdateSharePointAccessStatusRequest {
  active: boolean;
}

export type SharePointAccessStatusFilter = 'all' | 'active' | 'inactive';
