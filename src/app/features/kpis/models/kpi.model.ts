export interface DashboardDto {
    kpis: DashboardKpisDto;
    charts: DashboardChartsDto;
}

export interface DashboardKpisDto {
    registeredAssets: RegisteredAssetsKpiDto;
    assignments: AssignmentsKpiDto;
    inventoryValue: InventoryValueKpiDto;
    assignmentRate: AssignmentRateKpiDto;
    credentials: CredentialsKpiDto;
    employeesWithAssets: EmployeesWithAssetsKpiDto;
    activeLines: ActiveLinesKpiDto;
    mobilePhones: MobilePhonesKpiDto;
}

export interface RegisteredAssetsKpiDto {
    total: number;
    available: number;
}

export interface AssignmentsKpiDto {
    active: number;
    historical: number;
}

export interface InventoryValueKpiDto {
    total: number;
    average: number;
}

export interface AssignmentRateKpiDto {
    assigned: number;
    totalAssets: number;
    percentage: number;
}

export interface CredentialsKpiDto {
    totalCredentials: number;
    totalSystems: number;
}

export interface EmployeesWithAssetsKpiDto {
    employeesWithAssets: number;
    totalEmployees: number;
    coveragePercentage: number;
}

export interface ActiveLinesKpiDto {
    total: number;
}

export interface MobilePhonesKpiDto {
    total: number;
    withActiveLine: number;
    coveragePercentage: number;
}

export interface DashboardChartsDto {
    resourcesByType: ChartPointDto[];
    resourcesByStatus: ChartPointDto[];
}

export interface ChartPointDto {
    label: string;
    value: number;
}
