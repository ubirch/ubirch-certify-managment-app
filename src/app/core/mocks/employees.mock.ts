import { EmployeeStatus } from '../models/enums/employee-status.eunm';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocEmployeeState } from '../models/interfaces/poc-employee-state.interface';
import { IPocEmployee } from '../models/interfaces/poc-employee.interface';

export const EMPLOYEES_MOCK: IListResult<IPocEmployee> = {
    total: 20,
    records: [
        { id: '1', active: true, firstName: 'Employee1', lastName: 'Surname1', email: 'employee1@ubirch.com', status: EmployeeStatus.completed, createdAt: new Date(), },
        { id: '2', active: true, firstName: 'Employee2', lastName: 'Surname2', email: 'employee2@ubirch.com', status: EmployeeStatus.completed, createdAt: new Date(), },
        { id: '3', active: true, firstName: 'Employee3', lastName: 'Surname3', email: 'employee3@ubirch.com', status: EmployeeStatus.completed, createdAt: new Date(), },
        { id: '4', active: true, firstName: 'Employee4', lastName: 'Surname4', email: 'employee4@ubirch.com', status: EmployeeStatus.processing, createdAt: new Date(), },
        { id: '5', active: true, firstName: 'Employee5', lastName: 'Surname5', email: 'employee5@ubirch.com', status: EmployeeStatus.completed, createdAt: new Date(), },
        { id: '6', active: true, firstName: 'Employee6', lastName: 'Surname6', email: 'employee6@ubirch.com', status: EmployeeStatus.completed, createdAt: new Date(), },
        { id: '7', active: true, firstName: 'Employee7', lastName: 'Surname7', email: 'employee7@ubirch.com', status: EmployeeStatus.pending, createdAt: new Date(), },
        { id: '8', active: true, firstName: 'Employee8', lastName: 'Surname8', email: 'employee8@ubirch.com', status: EmployeeStatus.pending, createdAt: new Date(), },
        { id: '9', active: true, firstName: 'Employee9', lastName: 'Surname9', email: 'employee9@ubirch.com', status: EmployeeStatus.completed, createdAt: new Date(), },
        { id: '10', active: true, firstName: 'Employee10', lastName: 'Surname10', email: 'employee10@ubirch.com', status: EmployeeStatus.completed, createdAt: new Date(), },
    ]
};

export const EMPLOYEE_STATE_MOCK: IPocEmployeeState = {
    userActivated: true,
    userCreated: true,
    userInactivated: false,
    userRegistration: false,
    errorMessage: 'User needs to be Web Identified'
}
