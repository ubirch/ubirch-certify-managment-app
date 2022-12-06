import { AdminStatus } from '../models/enums/admin-status.enum';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocAdminState } from '../models/interfaces/poc-admin-state.interface';
import { IPocAdmin } from '../models/interfaces/poc-admin.interface';

const creationDate = new Date('2021-12-15T07:32:03.640Z');
export const ADMINS_MOCK: IListResult<IPocAdmin> = {
    total: 10,
    records: [
        {
            id: '1',
            firstName: 'Admin1',
            lastName: 'Surname1',
            pocName: 'POC1',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.pending,
            webIdentInitiateId: '11375b09-6699-4f09-b1b2-dc8e455e0c33',
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        },
        {
            id: '2',
            firstName: 'Admin2',
            lastName: 'Surname2',
            pocName: 'POC2',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.pending,
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        },
        {
            id: '3',
            firstName: 'Admin3',
            lastName: 'Surname3',
            pocName: 'POC3',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.completed,
            isMainAdmin: true,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        },
        {
            id: '4',
            firstName: 'Admin4',
            lastName: 'Surname4',
            pocName: 'POC4',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.pending,
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false

        },
        {
            id: '5',
            firstName: 'Admin5',
            lastName: 'Surname5',
            pocName: 'POC5',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.pending,
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        },
        {
            id: '6',
            firstName: 'Admin6',
            lastName: 'Surname6',
            pocName: 'POC6',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.completed,
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        },
        {
            id: '7',
            firstName: 'Admin7',
            lastName: 'Surname7',
            pocName: 'POC7',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.pending,
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        },
        {
            id: '8',
            firstName: 'Admin8',
            lastName: 'Surname8',
            pocName: 'POC8',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.processing,
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        },
        {
            id: '9',
            firstName: 'Admin9',
            lastName: 'Surname9',
            pocName: 'POC9',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.pending,
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        },
        {
            id: '10',
            firstName: 'Admin10',
            lastName: 'Surname10',
            pocName: 'POC10',
            email: 'admin1@ubirch.com',
            phone: '123432402',
            dateOfBirth: { year: 1984, month: 1, day: 1 },
            state: AdminStatus.pending,
            isMainAdmin: false,
            active: false,
            createdAt: creationDate,
            webIdentRequired: false
        }
    ],
};

export const ADMIN_STATE_MOCK: IPocAdminState = {
    webIdentRequired: true,
    webIdentInitiated: false,
    webIdentSuccess: false,
    certifyUserCreated: true,
    invitedToTeamDrive: false,
    keycloakEmailSent: true,
    pocAdminGroupAssigned: true,
    errorMessage: 'User needs to be Web Identified'
};
