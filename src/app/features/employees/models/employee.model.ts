export interface Employee {
    id: string;
    employeeNumber: string;
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    jobTitle: string;
    departmentName: string;
    email?: string | null;
    phoneNumber?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface EmployeeItem {
    id: string;
    fullName: string;
    employeeNumber: string;
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
