import { AdminStatus } from '../enums/admin-status.enum';
import { IBirthDate } from './birth-date.interface';

export interface IPocAdmin {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: IBirthDate;
    email: string;
    phone: string;
    pocName: string;
    state: AdminStatus;
    active: boolean;
    webIdentInitiateId?: string;
    webIdentSuccessId?: string;
}

