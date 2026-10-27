export type VisitStatus = 'SCHEDULED' | 'STARTED' | 'FINISHED' | 'CANCELLED';

export type VisitStatusFilter = VisitStatus | 'All';

export type VisitorAccessStatus = 'PERMIT' | 'DENIED' | 'PENDING';

export type VisitorDocumentType = 'NSS' | 'INE';

export interface VisitListQuery {
  status?: VisitStatus;
  search?: string;
  businessUnitId?: string;
  departmentId?: string;
  from?: string;
  to?: string;
  skip: number;
  take: number;
}

export interface VisitListItem {
  id: string;
  companyName: string;
  reason: string;
  status: string;
  businessUnitId: string;
  businessUnitName: string;
  departmentId: string;
  departmentName: string;
  employeeId: string | null;
  employeeFullName: string | null;
  highRiskActivity: boolean;
  isWalkIn: boolean;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  cancelledAt: string | null;
  visitorCount: number;
  visitorsPending: number;
  visitorsAllowed: number;
  visitorsDenied: number;
  createdAt: string;
  updatedAt: string | null;
  visitorNames: string[];
}

export interface VisitDetailDto {
  id: string;
  companyName: string;
  reason: string;
  observations: string | null;
  status: string;
  businessUnitId: string;
  businessUnitName: string;
  departmentId: string;
  departmentName: string;
  employeeId: string | null;
  employeeFullName: string | null;
  highRiskActivity: boolean;
  isWalkIn: boolean;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  cancelledAt: string | null;
  createdByUserId: string;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string | null;
  visitors: VisitVisitorDto[];
}

export interface VisitVisitorDto {
  id: string;
  fullName: string;
  accessStatus: string;
  createdAt: string;
  updatedAt: string | null;
  documents: VisitorDocumentDto[];
  equipments: VisitorEquipmentDto[];
}

export interface VisitorDocumentDto {
  id: string;
  documentType: string;
  originalName: string;
  fileName: string;
  contentType: string | null;
  uploadedByUserId: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface VisitorEquipmentDto {
  id: string;
  name: string;
  type: string | null;
  brandName: string | null;
  modelName: string | null;
  serialNumber: string | null;
  observations: string | null;
  createdAt: string;
}

export interface VisitVisitorInput {
  fullName: string;
}

export interface CreateVisitRequest {
  companyName: string;
  reason: string;
  observations: string | null;
  businessUnitId: string;
  departmentId: string;
  employeeId: string | null;
  highRiskActivity: boolean;
  isWalkIn: boolean;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  visitors: VisitVisitorInput[];
}

export type UpdateVisitRequest = Omit<CreateVisitRequest, 'isWalkIn' | 'visitors'>;

export interface VisitorEquipmentRequest {
  name: string;
  type: string | null;
  brandName: string | null;
  modelName: string | null;
  serialNumber: string | null;
  observations: string | null;
}
