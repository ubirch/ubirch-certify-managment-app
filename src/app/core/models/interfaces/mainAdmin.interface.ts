import {EmployeeStatus} from "../enums/employee-status.eunm";

export interface IMainAdmin {
    active: boolean;
    certExpirationDate: Date;
    createdAt: Date;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    phoneNumber: string;
    status: EmployeeStatus;
}
