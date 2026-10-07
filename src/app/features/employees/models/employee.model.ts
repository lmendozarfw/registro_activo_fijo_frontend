export interface Employee {
    id: string;
    employeeNumber: string;
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    jobId: string;
    departmentId: string;
    email?: string | null;
    phoneNumber?: string | null;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface EmployeeRequest {
    employeeNumber: string;
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    jobId: string;
    departmentId: string;
    email?: string | null;
    phoneNumber?: string | null;
}
