import { AdminStatus } from '../models/enums/admin-status.enum';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocAdminState } from '../models/interfaces/poc-admin-state.interface';
import { IPocAdmin } from '../models/interfaces/poc-admin.interface';

export const ADMINS_MOCK: IListResult<IPocAdmin> = {
    total: 20,
    records: [
        { id: '1', firstName: 'Admin1', lastName: 'Surname1', pocName: 'POC1', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '2', firstName: 'Admin2', lastName: 'Surname2', pocName: 'POC2', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '3', firstName: 'Admin3', lastName: 'Surname3', pocName: 'POC3', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.completed },
        { id: '4', firstName: 'Admin4', lastName: 'Surname4', pocName: 'POC4', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '5', firstName: 'Admin5', lastName: 'Surname5', pocName: 'POC5', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '6', firstName: 'Admin6', lastName: 'Surname6', pocName: 'POC6', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.completed },
        { id: '7', firstName: 'Admin7', lastName: 'Surname7', pocName: 'POC7', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '8', firstName: 'Admin8', lastName: 'Surname8', pocName: 'POC8', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.processing },
        { id: '9', firstName: 'Admin9', lastName: 'Surname9', pocName: 'POC9', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '10', firstName: 'Admin10', lastName: 'Surname10', pocName: 'POC10', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '11', firstName: 'Admin11', lastName: 'Surname11', pocName: 'POC11', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '12', firstName: 'Admin12', lastName: 'Surname12', pocName: 'POC12', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '13', firstName: 'Admin13', lastName: 'Surname13', pocName: 'POC13', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '14', firstName: 'Admin14', lastName: 'Surname14', pocName: 'POC14', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.processing },
        { id: '15', firstName: 'Admin15', lastName: 'Surname15', pocName: 'POC15', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '16', firstName: 'Admin16', lastName: 'Surname16', pocName: 'POC16', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '17', firstName: 'Admin17', lastName: 'Surname17', pocName: 'POC17', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.completed },
        { id: '18', firstName: 'Admin18', lastName: 'Surname18', pocName: 'POC18', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '19', firstName: 'Admin19', lastName: 'Surname19', pocName: 'POC19', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
        { id: '20', firstName: 'Admin20', lastName: 'Surname20', pocName: 'POC20', email: 'admin1@ubirch.com', phone: '123432402', dateOfBirth: new Date(), state: AdminStatus.pending },
    ]
};

export const ADMIN_STATE_MOCK: IPocAdminState = {
    webIdentRequired: true,
    webIdentPending: false,
    webIdentCompleted: false,
    userCreated: false,
    userInactivated: false,
    userActivated: false,
    errorMessage: 'User needs to be Web Identified'
}