import { AdminStatus } from '../enums/admin-status.enum';

export interface IPocAdmin {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    pocName: string;
    state: AdminStatus;
}
