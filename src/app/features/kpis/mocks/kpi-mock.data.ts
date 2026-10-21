import { AssignmentDto } from "../../assignments/models/assignment.model";
import { Credential } from "../../credentials/models/credential.model";
import { Employee } from "../../employees/models/employee.model";
import { LineDto, StatusLineEnum } from "../../resources/models/line.model";
import { ResourceDto } from "../../resources/models/resource.model";
import { ResourceTypeEnum } from "../../resources/models/resource-type.model";
import { StatusResourceEnum } from "../../resources/models/status-resource.model";

/**
 * Cambia este valor a false para volver a consumir la API real
 * en la pantalla de Indicadores.
 */
export const USE_KPI_MOCKS = true;

export interface KpiMockData {
    resources: ResourceDto[];
    assignments: AssignmentDto[];
    employees: Employee[];
    credentials: Credential[];
    lines: LineDto[];
}

const EMPLOYEES: Employee[] = [
    { id: 'E-01', employeeNumber: 'EMP-0001', firstName: 'Ana', paternalSurname: 'Gómez', maternalSurname: 'Pérez', jobTitle: 'Analista de Sistemas', departmentName: 'Sistemas', email: 'ana.gomez@empresa.com', phoneNumber: '477 100 0001', createdAt: '2021-03-15T09:00:00Z' },
    { id: 'E-02', employeeNumber: 'EMP-0002', firstName: 'Luis', paternalSurname: 'Ramírez', maternalSurname: 'Soto', jobTitle: 'Desarrollador Senior', departmentName: 'Sistemas', email: 'luis.ramirez@empresa.com', phoneNumber: '477 100 0002', createdAt: '2020-08-02T09:00:00Z' },
    { id: 'E-03', employeeNumber: 'EMP-0003', firstName: 'María', paternalSurname: 'Fernández', maternalSurname: 'Ruiz', jobTitle: 'Gerente de RH', departmentName: 'Recursos Humanos', email: 'maria.fernandez@empresa.com', phoneNumber: '477 100 0003', createdAt: '2019-01-20T09:00:00Z' },
    { id: 'E-04', employeeNumber: 'EMP-0004', firstName: 'Carlos', paternalSurname: 'Mendoza', maternalSurname: 'Díaz', jobTitle: 'Contador', departmentName: 'Finanzas', email: 'carlos.mendoza@empresa.com', phoneNumber: '477 100 0004', createdAt: '2021-11-05T09:00:00Z' },
    { id: 'E-05', employeeNumber: 'EMP-0005', firstName: 'Sofía', paternalSurname: 'Torres', maternalSurname: 'León', jobTitle: 'Analista Financiero', departmentName: 'Finanzas', email: 'sofia.torres@empresa.com', phoneNumber: '477 100 0005', createdAt: '2022-02-14T09:00:00Z' },
    { id: 'E-06', employeeNumber: 'EMP-0006', firstName: 'Jorge', paternalSurname: 'Castillo', maternalSurname: 'Ríos', jobTitle: 'Ejecutivo de Ventas', departmentName: 'Ventas', email: 'jorge.castillo@empresa.com', phoneNumber: '477 100 0006', createdAt: '2020-05-30T09:00:00Z' },
    { id: 'E-07', employeeNumber: 'EMP-0007', firstName: 'Paola', paternalSurname: 'Vargas', maternalSurname: 'Núñez', jobTitle: 'Gerente de Ventas', departmentName: 'Ventas', email: 'paola.vargas@empresa.com', phoneNumber: '477 100 0007', createdAt: '2018-09-12T09:00:00Z' },
    { id: 'E-08', employeeNumber: 'EMP-0008', firstName: 'Diego', paternalSurname: 'Herrera', maternalSurname: 'Luna', jobTitle: 'Técnico de Soporte', departmentName: 'Operaciones', email: 'diego.herrera@empresa.com', phoneNumber: '477 100 0008', createdAt: '2022-06-01T09:00:00Z' },
    { id: 'E-09', employeeNumber: 'EMP-0009', firstName: 'Laura', paternalSurname: 'Jiménez', maternalSurname: 'Ortiz', jobTitle: 'Coordinadora de Marketing', departmentName: 'Marketing', email: 'laura.jimenez@empresa.com', phoneNumber: '477 100 0009', createdAt: '2021-07-19T09:00:00Z' },
    { id: 'E-10', employeeNumber: 'EMP-0010', firstName: 'Roberto', paternalSurname: 'Salazar', maternalSurname: 'Peña', jobTitle: 'Director de Operaciones', departmentName: 'Dirección', email: 'roberto.salazar@empresa.com', phoneNumber: '477 100 0010', createdAt: '2017-04-03T09:00:00Z' },
    { id: 'E-11', employeeNumber: 'EMP-0011', firstName: 'Elena', paternalSurname: 'Morales', maternalSurname: 'Cruz', jobTitle: 'Diseñadora', departmentName: 'Marketing', email: 'elena.morales@empresa.com', phoneNumber: '477 100 0011', createdAt: '2022-10-25T09:00:00Z' },
    { id: 'E-12', employeeNumber: 'EMP-0012', firstName: 'Andrés', paternalSurname: 'Peña', maternalSurname: 'Guzmán', jobTitle: 'Almacenero', departmentName: 'Operaciones', email: 'andres.pena@empresa.com', phoneNumber: '477 100 0012', createdAt: '2023-01-16T09:00:00Z' },
    { id: 'E-13', employeeNumber: 'EMP-0013', firstName: 'Valeria', paternalSurname: 'Rojas', maternalSurname: 'Medina', jobTitle: 'Asistente Contable', departmentName: 'Finanzas', email: 'valeria.rojas@empresa.com', phoneNumber: '477 100 0013', createdAt: '2023-03-08T09:00:00Z' },
    { id: 'E-14', employeeNumber: 'EMP-0014', firstName: 'Fernando', paternalSurname: 'Lozano', maternalSurname: 'Vega', jobTitle: 'Gerente de Sistemas', departmentName: 'Sistemas', email: 'fernando.lozano@empresa.com', phoneNumber: '477 100 0014', createdAt: '2019-11-22T09:00:00Z' },
];

const RESOURCES: ResourceDto[] = [
    { id: 'R-001', assetCode: 'AF-2024-001', name: 'iPhone 13', serialNumber: 'SN-IP13-001', modelId: 'MOD-01', modelName: 'iPhone 13', brandName: 'Apple', type: ResourceTypeEnum.MOBILE, price: 18999, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-01-10T09:00:00Z' },
    { id: 'R-002', assetCode: 'AF-2024-002', name: 'MacBook Air M2', serialNumber: 'SN-MBA-002', modelId: 'MOD-02', modelName: 'MacBook Air M2', brandName: 'Apple', type: ResourceTypeEnum.LAPTOP, price: 32999, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-01-12T09:00:00Z' },
    { id: 'R-003', assetCode: 'AF-2024-003', name: 'Latitude 5440', serialNumber: 'SN-DL5440-003', modelId: 'MOD-03', modelName: 'Latitude 5440', brandName: 'Dell', type: ResourceTypeEnum.LAPTOP, price: 24500, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-02-01T09:00:00Z' },
    { id: 'R-004', assetCode: 'AF-2024-004', name: 'OptiPlex 7010', serialNumber: 'SN-OP7010-004', modelId: 'MOD-04', modelName: 'OptiPlex 7010', brandName: 'Dell', type: ResourceTypeEnum.PC, price: 15999, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-02-05T09:00:00Z' },
    { id: 'R-005', assetCode: 'AF-2024-005', name: 'Monitor P2422H', serialNumber: 'SN-P2422-005', modelId: 'MOD-05', modelName: 'P2422H', brandName: 'Dell', type: ResourceTypeEnum.MONITOR, price: 5200, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-02-20T09:00:00Z' },
    { id: 'R-006', assetCode: 'AF-2024-006', name: 'ProDesk 400 G9', serialNumber: 'SN-PD400-006', modelId: 'MOD-06', modelName: 'ProDesk 400 G9', brandName: 'HP', type: ResourceTypeEnum.PC, price: 14999, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-03-01T09:00:00Z' },
    { id: 'R-007', assetCode: 'AF-2024-007', name: 'ThinkPad E14', serialNumber: 'SN-TPE14-007', modelId: 'MOD-07', modelName: 'ThinkPad E14', brandName: 'Lenovo', type: ResourceTypeEnum.LAPTOP, price: 21999, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-03-09T09:00:00Z' },
    { id: 'R-008', assetCode: 'AF-2024-008', name: 'Galaxy A54', serialNumber: 'SN-A54-008', modelId: 'MOD-08', modelName: 'Galaxy A54', brandName: 'Samsung', type: ResourceTypeEnum.MOBILE, price: 9499, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-03-15T09:00:00Z' },
    { id: 'R-009', assetCode: 'AF-2024-009', name: 'EliteBook 840', serialNumber: 'SN-EB840-009', modelId: 'MOD-09', modelName: 'EliteBook 840', brandName: 'HP', type: ResourceTypeEnum.LAPTOP, price: 28999, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-04-02T09:00:00Z' },
    { id: 'R-010', assetCode: 'AF-2024-010', name: 'ThinkCentre M70q', serialNumber: 'SN-TCM70-010', modelId: 'MOD-10', modelName: 'ThinkCentre M70q', brandName: 'Lenovo', type: ResourceTypeEnum.PC, price: 13999, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-04-11T09:00:00Z' },
    { id: 'R-011', assetCode: 'AF-2024-011', name: 'Monitor LS24C310', serialNumber: 'SN-LS24-011', modelId: 'MOD-11', modelName: 'LS24C310', brandName: 'Samsung', type: ResourceTypeEnum.MONITOR, price: 4300, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-04-18T09:00:00Z' },
    { id: 'R-012', assetCode: 'AF-2024-012', name: 'MacBook Pro 14', serialNumber: 'SN-MBP14-012', modelId: 'MOD-12', modelName: 'MacBook Pro 14', brandName: 'Apple', type: ResourceTypeEnum.LAPTOP, price: 44999, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-05-01T09:00:00Z' },
    { id: 'R-013', assetCode: 'AF-2024-013', name: 'Redmi Note 13', serialNumber: 'SN-RN13-013', modelId: 'MOD-13', modelName: 'Redmi Note 13', brandName: 'Xiaomi', type: ResourceTypeEnum.MOBILE, price: 6499, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-05-06T09:00:00Z' },
    { id: 'R-014', assetCode: 'AF-2024-014', name: 'Alpha a6100', serialNumber: 'SN-A6100-014', modelId: 'MOD-14', modelName: 'Alpha a6100', brandName: 'Sony', type: ResourceTypeEnum.CAMERA, price: 14500, status: StatusResourceEnum.ASSIGNED, createdAt: '2024-05-20T09:00:00Z' },
    { id: 'R-015', assetCode: 'AF-2024-015', name: 'Vostro 3520', serialNumber: 'SN-V3520-015', modelId: 'MOD-15', modelName: 'Vostro 3520', brandName: 'Dell', type: ResourceTypeEnum.LAPTOP, price: 17999, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-06-01T09:00:00Z' },
    { id: 'R-016', assetCode: 'AF-2024-016', name: 'EliteDesk 800 G6', serialNumber: 'SN-ED800-016', modelId: 'MOD-16', modelName: 'EliteDesk 800 G6', brandName: 'HP', type: ResourceTypeEnum.PC, price: 16999, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-06-10T09:00:00Z' },
    { id: 'R-017', assetCode: 'AF-2024-017', name: 'iPhone 12', serialNumber: 'SN-IP12-017', modelId: 'MOD-17', modelName: 'iPhone 12', brandName: 'Apple', type: ResourceTypeEnum.MOBILE, price: 15999, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-06-18T09:00:00Z' },
    { id: 'R-018', assetCode: 'AF-2024-018', name: 'IdeaPad 3', serialNumber: 'SN-IP3-018', modelId: 'MOD-18', modelName: 'IdeaPad 3', brandName: 'Lenovo', type: ResourceTypeEnum.LAPTOP, price: 13499, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-07-01T09:00:00Z' },
    { id: 'R-019', assetCode: 'AF-2024-019', name: 'Monitor 24MP400', serialNumber: 'SN-24MP-019', modelId: 'MOD-19', modelName: '24MP400', brandName: 'LG', type: ResourceTypeEnum.MONITOR, price: 3900, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-07-12T09:00:00Z' },
    { id: 'R-020', assetCode: 'AF-2024-020', name: 'Precision 3660', serialNumber: 'SN-PR3660-020', modelId: 'MOD-20', modelName: 'Precision 3660', brandName: 'Dell', type: ResourceTypeEnum.PC, price: 25999, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-07-22T09:00:00Z' },
    { id: 'R-021', assetCode: 'AF-2024-021', name: 'Galaxy S22', serialNumber: 'SN-S22-021', modelId: 'MOD-21', modelName: 'Galaxy S22', brandName: 'Samsung', type: ResourceTypeEnum.MOBILE, price: 17999, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-08-01T09:00:00Z' },
    { id: 'R-022', assetCode: 'AF-2024-022', name: 'Pavilion 15', serialNumber: 'SN-PAV15-022', modelId: 'MOD-22', modelName: 'Pavilion 15', brandName: 'HP', type: ResourceTypeEnum.LAPTOP, price: 15499, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-08-14T09:00:00Z' },
    { id: 'R-023', assetCode: 'AF-2024-023', name: 'Brio 4K', serialNumber: 'SN-BRIO-023', modelId: 'MOD-23', modelName: 'Brio 4K', brandName: 'Logitech', type: ResourceTypeEnum.CAMERA, price: 6900, status: StatusResourceEnum.AVAILABLE, createdAt: '2024-08-25T09:00:00Z' },
    { id: 'R-024', assetCode: 'AF-2024-024', name: 'Poco X5', serialNumber: 'SN-PX5-024', modelId: 'MOD-24', modelName: 'Poco X5', brandName: 'Xiaomi', type: ResourceTypeEnum.MOBILE, price: 5999, status: StatusResourceEnum.MAINTENANCE, createdAt: '2024-09-03T09:00:00Z' },
    { id: 'R-025', assetCode: 'AF-2024-025', name: 'XPS 13', serialNumber: 'SN-XPS13-025', modelId: 'MOD-25', modelName: 'XPS 13', brandName: 'Dell', type: ResourceTypeEnum.LAPTOP, price: 38999, status: StatusResourceEnum.MAINTENANCE, createdAt: '2024-09-15T09:00:00Z' },
    { id: 'R-026', assetCode: 'AF-2024-026', name: 'ThinkStation P360', serialNumber: 'SN-TSP360-026', modelId: 'MOD-26', modelName: 'ThinkStation P360', brandName: 'Lenovo', type: ResourceTypeEnum.PC, price: 42999, status: StatusResourceEnum.LOST, createdAt: '2024-09-28T09:00:00Z' },
    { id: 'R-030', assetCode: 'AF-2024-030', name: 'UltraSharp U2723QE', serialNumber: 'SN-U2723-030', modelId: 'MOD-30', modelName: 'U2723QE', brandName: 'Dell', type: ResourceTypeEnum.MONITOR, price: 12500, status: StatusResourceEnum.MAINTENANCE, createdAt: '2024-11-20T09:00:00Z' },
];

function assignment(
    id: string,
    resourceId: string,
    employeeId: string,
    assignmentDate: string,
    returnDate: string | null,
    isActive: boolean,
): AssignmentDto {
    const resource = RESOURCES.find((item) => item.id === resourceId)!;
    const employee = EMPLOYEES.find((item) => item.id === employeeId)!;
    const fullName = `${employee.firstName} ${employee.paternalSurname} ${employee.maternalSurname}`;
    return {
        id,
        resourceId,
        assetCode: resource.assetCode,
        resourceName: resource.name,
        type: resource.type,
        brandName: resource.brandName,
        modelName: resource.modelName,
        employeeId,
        employeeName: fullName,
        assignmentDate,
        renewalDate: null,
        returnDate,
        isActive,
    };
}

const ASSIGNMENTS: AssignmentDto[] = [
    assignment('A-001', 'R-001', 'E-01', '2026-09-02T09:00:00Z', null, true),
    assignment('A-002', 'R-002', 'E-01', '2026-06-15T09:00:00Z', null, true),
    assignment('A-003', 'R-003', 'E-02', '2026-08-20T09:00:00Z', null, true),
    assignment('A-004', 'R-004', 'E-03', '2026-07-11T09:00:00Z', null, true),
    assignment('A-005', 'R-005', 'E-03', '2026-10-01T09:00:00Z', null, true),
    assignment('A-006', 'R-006', 'E-04', '2026-05-25T09:00:00Z', null, true),
    assignment('A-007', 'R-007', 'E-05', '2026-09-18T09:00:00Z', null, true),
    assignment('A-008', 'R-008', 'E-06', '2026-08-05T09:00:00Z', null, true),
    assignment('A-009', 'R-009', 'E-07', '2026-06-30T09:00:00Z', null, true),
    assignment('A-010', 'R-010', 'E-08', '2026-07-22T09:00:00Z', null, true),
    assignment('A-011', 'R-011', 'E-08', '2026-10-06T09:00:00Z', null, true),
    assignment('A-012', 'R-012', 'E-09', '2026-09-29T09:00:00Z', null, true),
    assignment('A-013', 'R-013', 'E-10', '2026-05-14T09:00:00Z', null, true),
    assignment('A-014', 'R-014', 'E-11', '2026-08-12T09:00:00Z', null, true),
    assignment('A-015', 'R-015', 'E-12', '2026-05-06T09:00:00Z', '2026-07-01T09:00:00Z', false),
    assignment('A-016', 'R-016', 'E-13', '2026-05-20T09:00:00Z', '2026-08-02T09:00:00Z', false),
    assignment('A-017', 'R-017', 'E-14', '2026-06-03T09:00:00Z', '2026-08-15T09:00:00Z', false),
    assignment('A-018', 'R-018', 'E-02', '2026-07-02T09:00:00Z', '2026-09-05T09:00:00Z', false),
    assignment('A-019', 'R-019', 'E-11', '2026-07-12T09:00:00Z', '2026-09-20T09:00:00Z', false),
    assignment('A-020', 'R-020', 'E-04', '2026-07-19T09:00:00Z', '2026-09-28T09:00:00Z', false),
    assignment('A-021', 'R-021', 'E-06', '2026-08-01T09:00:00Z', '2026-10-02T09:00:00Z', false),
    assignment('A-022', 'R-022', 'E-01', '2026-09-02T09:00:00Z', '2026-10-05T09:00:00Z', false),
    assignment('A-023', 'R-023', 'E-09', '2026-09-09T09:00:00Z', '2026-10-08T09:00:00Z', false),
    assignment('A-024', 'R-024', 'E-10', '2026-09-15T09:00:00Z', '2026-10-10T09:00:00Z', false),
    assignment('A-025', 'R-025', 'E-07', '2026-09-24T09:00:00Z', '2026-10-12T09:00:00Z', false),
    assignment('A-026', 'R-026', 'E-08', '2026-10-05T09:00:00Z', '2026-10-13T09:00:00Z', false),
    assignment('A-027', 'R-027', 'E-05', '2026-10-09T09:00:00Z', '2026-10-13T09:00:00Z', false),
    assignment('A-028', 'R-028', 'E-03', '2026-06-10T09:00:00Z', '2026-08-20T09:00:00Z', false),
    assignment('A-029', 'R-029', 'E-12', '2026-06-18T09:00:00Z', '2026-08-25T09:00:00Z', false),
    assignment('A-030', 'R-030', 'E-13', '2026-07-24T09:00:00Z', '2026-09-15T09:00:00Z', false),
];

const CREDENTIALS: Credential[] = [
    { id: 'C-01', employeeSystemId: 'C-01', employeeId: 'E-01', systemId: 'SYS-01', employeeFullName: 'Ana Gómez Pérez', systemName: 'SAP', canView: true, createdAt: '2024-02-01T09:00:00Z' },
    { id: 'C-02', employeeSystemId: 'C-02', employeeId: 'E-01', systemId: 'SYS-02', employeeFullName: 'Ana Gómez Pérez', systemName: 'Jira', canView: false, createdAt: '2024-02-05T09:00:00Z' },
    { id: 'C-03', employeeSystemId: 'C-03', employeeId: 'E-02', systemId: 'SYS-03', employeeFullName: 'Luis Ramírez Soto', systemName: 'GitHub', canView: false, createdAt: '2024-03-01T09:00:00Z' },
    { id: 'C-04', employeeSystemId: 'C-04', employeeId: 'E-02', systemId: 'SYS-02', employeeFullName: 'Luis Ramírez Soto', systemName: 'Jira', canView: true, createdAt: '2024-03-02T09:00:00Z' },
    { id: 'C-05', employeeSystemId: 'C-05', employeeId: 'E-03', systemId: 'SYS-04', employeeFullName: 'María Fernández Ruiz', systemName: 'Portal RRHH', canView: false, createdAt: '2024-03-10T09:00:00Z' },
    { id: 'C-06', employeeSystemId: 'C-06', employeeId: 'E-03', systemId: 'SYS-05', employeeFullName: 'María Fernández Ruiz', systemName: 'Office 365', canView: true, createdAt: '2024-03-12T09:00:00Z' },
    { id: 'C-07', employeeSystemId: 'C-07', employeeId: 'E-04', systemId: 'SYS-01', employeeFullName: 'Carlos Mendoza Díaz', systemName: 'SAP', canView: true, createdAt: '2024-04-01T09:00:00Z' },
    { id: 'C-08', employeeSystemId: 'C-08', employeeId: 'E-04', systemId: 'SYS-06', employeeFullName: 'Carlos Mendoza Díaz', systemName: 'Facturación', canView: false, createdAt: '2024-04-05T09:00:00Z' },
    { id: 'C-09', employeeSystemId: 'C-09', employeeId: 'E-05', systemId: 'SYS-06', employeeFullName: 'Sofía Torres León', systemName: 'Facturación', canView: true, createdAt: '2024-04-15T09:00:00Z' },
    { id: 'C-10', employeeSystemId: 'C-10', employeeId: 'E-06', systemId: 'SYS-07', employeeFullName: 'Jorge Castillo Ríos', systemName: 'CRM', canView: true, createdAt: '2024-05-01T09:00:00Z' },
    { id: 'C-11', employeeSystemId: 'C-11', employeeId: 'E-06', systemId: 'SYS-05', employeeFullName: 'Jorge Castillo Ríos', systemName: 'Office 365', canView: true, createdAt: '2024-05-02T09:00:00Z' },
    { id: 'C-12', employeeSystemId: 'C-12', employeeId: 'E-07', systemId: 'SYS-07', employeeFullName: 'Paola Vargas Núñez', systemName: 'CRM', canView: true, createdAt: '2024-05-10T09:00:00Z' },
    { id: 'C-13', employeeSystemId: 'C-13', employeeId: 'E-08', systemId: 'SYS-08', employeeFullName: 'Diego Herrera Luna', systemName: 'VPN', canView: false, createdAt: '2024-06-01T09:00:00Z' },
    { id: 'C-14', employeeSystemId: 'C-14', employeeId: 'E-08', systemId: 'SYS-02', employeeFullName: 'Diego Herrera Luna', systemName: 'Jira', canView: true, createdAt: '2024-06-03T09:00:00Z' },
    { id: 'C-15', employeeSystemId: 'C-15', employeeId: 'E-09', systemId: 'SYS-09', employeeFullName: 'Laura Jiménez Ortiz', systemName: 'Zoom', canView: true, createdAt: '2024-06-15T09:00:00Z' },
    { id: 'C-16', employeeSystemId: 'C-16', employeeId: 'E-09', systemId: 'SYS-05', employeeFullName: 'Laura Jiménez Ortiz', systemName: 'Office 365', canView: true, createdAt: '2024-06-16T09:00:00Z' },
    { id: 'C-17', employeeSystemId: 'C-17', employeeId: 'E-10', systemId: 'SYS-01', employeeFullName: 'Roberto Salazar Peña', systemName: 'SAP', canView: true, createdAt: '2024-07-01T09:00:00Z' },
    { id: 'C-18', employeeSystemId: 'C-18', employeeId: 'E-11', systemId: 'SYS-09', employeeFullName: 'Elena Morales Cruz', systemName: 'Zoom', canView: true, createdAt: '2024-07-10T09:00:00Z' },
    { id: 'C-19', employeeSystemId: 'C-19', employeeId: 'E-12', systemId: 'SYS-04', employeeFullName: 'Andrés Peña Guzmán', systemName: 'Portal RRHH', canView: false, createdAt: '2024-08-01T09:00:00Z' },
    { id: 'C-20', employeeSystemId: 'C-20', employeeId: 'E-13', systemId: 'SYS-06', employeeFullName: 'Valeria Rojas Medina', systemName: 'Facturación', canView: true, createdAt: '2024-08-12T09:00:00Z' },
    { id: 'C-21', employeeSystemId: 'C-21', employeeId: 'E-14', systemId: 'SYS-08', employeeFullName: 'Fernando Lozano Vega', systemName: 'VPN', canView: false, createdAt: '2024-09-01T09:00:00Z' },
    { id: 'C-22', employeeSystemId: 'C-22', employeeId: 'E-14', systemId: 'SYS-01', employeeFullName: 'Fernando Lozano Vega', systemName: 'SAP', canView: false, createdAt: '2024-09-02T09:00:00Z' },
];

const LINES: LineDto[] = [
    { id: 'L-01', phoneNumber: '477 146 4981', operator: 'Telcel', plan: 'Plan Negocio 8GB', activationDate: '2024-01-15T09:00:00Z', status: StatusLineEnum.ACTIVE },
    { id: 'L-02', phoneNumber: '477 146 4982', operator: 'Telcel', plan: 'Plan Negocio 8GB', activationDate: '2024-02-01T09:00:00Z', status: StatusLineEnum.ACTIVE },
    { id: 'L-03', phoneNumber: '477 146 4983', operator: 'AT&T', plan: 'Plus 10GB', activationDate: '2024-03-01T09:00:00Z', status: StatusLineEnum.ACTIVE },
    { id: 'L-04', phoneNumber: '477 146 4984', operator: 'AT&T', plan: 'Plus 10GB', activationDate: '2024-03-15T09:00:00Z', status: StatusLineEnum.SUSPENDED },
    { id: 'L-05', phoneNumber: '477 146 4985', operator: 'Movistar', plan: 'Empresa Ilimitado', activationDate: '2024-04-01T09:00:00Z', status: StatusLineEnum.ACTIVE },
    { id: 'L-06', phoneNumber: '477 146 4986', operator: 'Telcel', plan: 'Plan Negocio 8GB', activationDate: '2024-05-01T09:00:00Z', status: StatusLineEnum.ACTIVE },
    { id: 'L-07', phoneNumber: '477 146 4987', operator: 'Movistar', plan: 'Empresa Ilimitado', activationDate: '2024-06-01T09:00:00Z', status: StatusLineEnum.CANCELLED, cancellationDate: '2025-06-01T09:00:00Z' },
    { id: 'L-08', phoneNumber: '477 146 4988', operator: 'AT&T', plan: 'Plus 10GB', activationDate: '2024-07-01T09:00:00Z', status: StatusLineEnum.ACTIVE },
    { id: 'L-09', phoneNumber: '477 146 4989', operator: 'Telcel', plan: 'Plan Negocio 8GB', activationDate: '2024-08-01T09:00:00Z', status: StatusLineEnum.ACTIVE },
    { id: 'L-10', phoneNumber: '477 146 4990', operator: 'Movistar', plan: 'Empresa Ilimitado', activationDate: '2024-09-01T09:00:00Z', status: StatusLineEnum.SUSPENDED },
    { id: 'L-11', phoneNumber: '477 146 4991', operator: 'AT&T', plan: 'Plus 10GB', activationDate: '2024-10-01T09:00:00Z', status: StatusLineEnum.ACTIVE },
    { id: 'L-12', phoneNumber: '477 146 4992', operator: 'Telcel', plan: 'Plan Negocio 8GB', activationDate: '2024-11-01T09:00:00Z', status: StatusLineEnum.ACTIVE },
];

export function loadKpiMockData(): Promise<KpiMockData> {
    const data: KpiMockData = {
        resources: RESOURCES,
        assignments: ASSIGNMENTS,
        employees: EMPLOYEES,
        credentials: CREDENTIALS,
        lines: LINES,
    };
    return new Promise((resolve) => setTimeout(() => resolve(data), 600));
}
