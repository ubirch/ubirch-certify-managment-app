import { EmployeeStatus } from '../enums/employee-status.eunm';
import { IPerson } from './person.interface';

export interface IPocEmployee extends IPerson {
    id: string;
    active: boolean;
    status: EmployeeStatus;
    createdAt: Date;
}
